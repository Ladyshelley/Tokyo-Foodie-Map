export interface SearchCriteria {
  area: string;
  cuisine: string;
  purpose: string;
  budget: string;
  useLocation: boolean;
  openNow: boolean;
}

export interface GroundingChunk {
  maps?: {
    sourceId: string;
    title: string;
    uri: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        author: string;
      }[];
    }
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface RestaurantResult {
  id: string;
  name: string;
  rating?: string;
  budget?: string;
  features?: string[];
  description: string;
  mapData?: GroundingChunk['maps'];
}

export interface SearchState {
  isLoading: boolean;
  results: RestaurantResult[];
  rawText: string;
  error?: string;
}
