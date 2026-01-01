import React from 'react';
import { RestaurantResult } from '../types';

interface RestaurantDetailProps {
  restaurant: RestaurantResult;
  onClose: () => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onClose }) => {
  const handleNavigate = () => {
    if (restaurant.mapData?.uri) {
      window.open(restaurant.mapData.uri, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-paper-cream w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Header */}
        <div className="bg-gourmet-dark text-white p-6 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-serif font-bold pr-8 leading-tight">{restaurant.name}</h2>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
             <div className="flex items-center gap-1 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">{restaurant.rating} 顆星</span>
             </div>
             <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{restaurant.budget}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          <div>
            <h3 className="text-gourmet-dark font-serif font-bold text-lg mb-1">{restaurant.name}</h3>
            <div className="text-sm text-gourmet-gray font-medium">
                <span className="font-bold text-gourmet-dark">評分:</span> {restaurant.rating} 顆星 &nbsp;
                <span className="font-bold text-gourmet-dark">預算:</span> {restaurant.budget}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gourmet-dark mb-2">特色 (Features):</h4>
            <div className="flex flex-wrap gap-2">
              {restaurant.features?.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-gourmet-red/10 text-gourmet-red text-xs font-bold rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-sm prose-stone leading-relaxed">
             <h4 className="font-bold text-gourmet-dark mb-2 not-prose">詳細介紹 (Details):</h4>
             <p className="text-gray-600 whitespace-pre-wrap text-justify">
               {restaurant.description}
             </p>
             <p className="text-gray-600 mt-4">
               {restaurant.name} 擁有 {restaurant.rating} 顆星的高評價，顯示它在當地非常受歡迎。這裡的氛圍非常適合{restaurant.features?.join('、')}，讓您能享受美好的用餐時光。
             </p>
          </div>

          {/* Extra Space at bottom to ensure map card doesn't cover text */}
          <div className="h-24"></div>
        </div>

        {/* Map Card Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-paper-cream via-paper-cream to-transparent">
           <div className="bg-white rounded-xl shadow-lg p-4 border border-paper-border">
              <div className="flex items-start gap-3 mb-4">
                 <div className="text-gourmet-gray mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                 </div>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   查看 Google Maps 以獲取更多即時資訊、導航與真實評論。
                 </p>
              </div>
              <button 
                onClick={handleNavigate}
                className="w-full bg-gourmet-dark hover:bg-black text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                在 Google Maps 上查看與導航
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};
