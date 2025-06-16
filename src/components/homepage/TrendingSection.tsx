import React from 'react';
import { trendingSearches } from '../../data/trendingSearchesData';

function TrendingSection() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Trending Searches</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {trendingSearches.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
            <h3 className="font-semibold text-sm text-gray-800 text-center">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingSection; 