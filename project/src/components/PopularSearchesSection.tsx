import React from 'react';
import { popularSearches } from '../data/popularSearchesData';

function PopularSearchesSection() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Popular Searches</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {popularSearches.map((item, idx) => (
          <div key={idx} className={`rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in ${item.color}`}
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
          >
            <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
            <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularSearchesSection; 