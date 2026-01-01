import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { RestaurantDetail } from './components/RestaurantDetail';
import { SearchCriteria, RestaurantResult } from './types';
import { searchRestaurants } from './services/gemini';
import { AREAS, CUISINES, PURPOSES, BUDGETS } from './constants';

const App: React.FC = () => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    area: AREAS[0],
    cuisine: CUISINES[0],
    purpose: PURPOSES[0],
    budget: BUDGETS[1],
    useLocation: false,
    openNow: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RestaurantResult[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      let userLocation;
      if (criteria.useLocation && "geolocation" in navigator) {
         try {
             const pos: GeolocationPosition = await new Promise((resolve, reject) => {
                 navigator.geolocation.getCurrentPosition(resolve, reject);
             });
             userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
         } catch (e) {
             console.warn("Location permission denied or error", e);
             // Fallback to area
         }
      }

      const data = await searchRestaurants(criteria, userLocation);
      setResults(data);
      if (data.length === 0) {
          setError("No results found from Google Maps. Try broadening your search.");
      }
    } catch (err) {
      setError("Something went wrong while contacting the gourmet guide. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setHasSearched(false);
    setResults([]);
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] font-sans text-gourmet-dark flex flex-col items-center justify-center relative">
      
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/washi.png')` }}>
      </div>

      <header className="fixed top-0 left-0 right-0 bg-paper-cream/90 backdrop-blur-md z-10 border-b border-paper-border shadow-sm py-4">
        <div className="max-w-2xl mx-auto px-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-gourmet-red rounded-full flex items-center justify-center text-white shadow-md shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V2.25zm12 0a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V2.25zM6.224 7.456a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06-1.06L10.94 13.25 6.224 8.516a.75.75 0 010-1.06zM15 13.25l4.716-4.716a.75.75 0 011.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z" clipRule="evenodd" /> 
              {/* Just a generic utensil icon replacement */}
              <path d="M11.25 1.5a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V1.5zm-7.5 0a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V1.5zm15 0a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V1.5zM3.375 6C2.339 6 1.5 6.84 1.5 7.875v7.5c0 2.484 2.016 4.5 4.5 4.5h12c2.484 0 4.5-2.016 4.5-4.5v-7.5C22.5 6.84 21.66 6 20.625 6H3.375z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">東京美食帖</h1>
            <p className="text-[10px] text-gourmet-gray tracking-widest uppercase">Tokyo Gourmet Guide</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md px-4 pt-24 pb-10 flex-1 flex flex-col">
        
        {!hasSearched ? (
          <div className="animate-fade-in">
            <SearchForm 
              criteria={criteria} 
              setCriteria={setCriteria} 
              onSearch={handleSearch} 
              isLoading={isLoading} 
            />
          </div>
        ) : (
          <div className="animate-slide-up flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold font-serif">為您推薦 (Recommended)</h2>
               <button onClick={resetSearch} className="text-sm text-gourmet-red font-bold hover:underline">
                 重新搜尋 (Reset)
               </button>
            </div>

            {isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-60">
                  <div className="w-12 h-12 border-4 border-gourmet-red border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gourmet-gray animate-pulse">Consulting the concierge...</p>
               </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                <p className="text-gourmet-red">{error}</p>
              </div>
            ) : (
               <div className="space-y-4">
                 {results.map((r) => (
                   <div 
                    key={r.id} 
                    onClick={() => setSelectedRestaurant(r)}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-paper-border group"
                   >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold font-serif group-hover:text-gourmet-red transition-colors">{r.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                           ★ {r.rating}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {r.features?.slice(0,3).map(f => (
                          <span key={f} className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                         <span>{r.budget}</span>
                         <span className="text-gourmet-red font-bold">View Details →</span>
                      </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}

      </main>

      {selectedRestaurant && (
        <RestaurantDetail 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)} 
        />
      )}

      <footer className="w-full py-6 text-center text-gourmet-gray text-[10px] uppercase tracking-widest">
         Powered by Gemini & Google Maps
      </footer>
    </div>
  );
};

export default App;
