import { GoogleGenAI } from "@google/genai";
import { SearchCriteria, RestaurantResult, GroundingChunk } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to parse the markdown response into structured data
// Note: Since we cannot use JSON schema with tools easily in the same robust way for this specific mixed-mode,
// we instruct the model to format text and we try to bind it to grounding chunks.
const parseResponse = (text: string, chunks: GroundingChunk[]): RestaurantResult[] => {
  const results: RestaurantResult[] = [];
  
  // We expect the model to output sections. We will split by a delimiter we request.
  // However, for robustness, we will also map grounding chunks directly if parsing fails or to augment data.
  
  const mapChunks = chunks.filter(c => c.maps).map(c => c.maps!);

  // Simple parsing strategy:
  // 1. If we have map chunks, create a result for each map chunk.
  // 2. Try to extract details from text for that map chunk if possible.
  
  mapChunks.forEach((mapData, index) => {
    // Heuristic: Look for the restaurant name in the text to find the description surrounding it.
    // Or simply return the structured map data and use the whole text as a general guide if granular parsing is too brittle.
    
    // Let's try to find a block in the text that matches this place.
    // Assumes the model follows the requested format "### Name".
    const nameRegex = new RegExp(`###\\s*.*?${escapeRegExp(mapData.title)}.*?\\n([\\s\\S]*?)(?=###|$)`, 'i');
    const match = text.match(nameRegex);
    
    let description = "No detailed description available.";
    let rating = "4.5"; // Default fallback
    let budget = "N/A";
    let features: string[] = ["Nice Ambience", "Delicious"];

    if (match) {
      const content = match[1];
      
      // Extract fields from the text block
      const ratingMatch = content.match(/\*\*Rating\*\*:\s*([\d\.]+)/i);
      const budgetMatch = content.match(/\*\*Budget\*\*:\s*(.+?)\n/i);
      const featuresMatch = content.match(/\*\*Features\*\*:\s*(.+?)\n/i);
      const introMatch = content.match(/\*\*Intro\*\*:\s*([\s\S]+)/i);

      if (ratingMatch) rating = ratingMatch[1];
      if (budgetMatch) budget = budgetMatch[1];
      if (featuresMatch) features = featuresMatch[1].split(/,|、/).map(s => s.trim());
      if (introMatch) description = introMatch[1].trim();
      else description = content.trim();
    } else {
      // If strict regex fails, just use the whole text if it's short, or a generic snippet.
      // But better to rely on the prompt structure.
      // Fallback: Check if there are numbered lists corresponding to chunks.
    }

    results.push({
      id: mapData.placeId || `temp-${index}`,
      name: mapData.title,
      rating,
      budget,
      features,
      description,
      mapData: mapData
    });
  });

  return results;
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const searchRestaurants = async (criteria: SearchCriteria, userLocation?: {lat: number, lng: number}): Promise<RestaurantResult[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing");
  }

  let locationStr = "";
  let locationConfig = {};
  
  if (criteria.useLocation && userLocation) {
    locationStr = `near the user's current location (Lat: ${userLocation.lat}, Lng: ${userLocation.lng})`;
    locationConfig = {
        retrievalConfig: {
            latLng: {
                latitude: userLocation.lat,
                longitude: userLocation.lng
            }
        }
    };
  } else {
    locationStr = `in ${criteria.area}`;
  }

  const prompt = `
    I need to find the best 3-4 restaurants ${locationStr}.
    
    Criteria:
    - Cuisine: ${criteria.cuisine}
    - Purpose: ${criteria.purpose}
    - Budget: ${criteria.budget}
    ${criteria.openNow ? '- Must be Open Now' : ''}

    Please use Google Maps to find real places. 
    
    CRITICAL: You MUST format the output strictly as follows for EACH restaurant found so I can parse it:

    ### [Restaurant Name from Maps]
    **Rating**: [Number, e.g. 4.5]
    **Budget**: [Price range]
    **Features**: [3 keywords, comma separated]
    **Intro**: [A compelling paragraph describing the vibe, food, and why it fits the purpose. Approx 80-100 words.]

    Do not include any other conversational text before or after the list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: locationConfig,
        systemInstruction: "You are a helpful gourmet concierge for Tokyo. You speak Traditional Chinese (繁體中文) for the descriptions but keep technical labels in English if needed. Always provide specific, real places using Google Maps.",
        temperature: 0.7,
      }
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    console.log("Raw Text:", text);
    console.log("Chunks:", chunks);

    // If no chunks, it means no maps grounding happened (model hallucinated or API issue).
    if (chunks.length === 0) {
        // In a real app we might fallback to parsing just text, but we want Maps integration.
        // Let's return an empty list or error
        return [];
    }

    return parseResponse(text, chunks);

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};
