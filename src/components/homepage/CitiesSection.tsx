import React from 'react';
import { cities } from '../../data/citiesData';

function CitiesSection() {
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Explore Top Cities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {cities.map((city, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img src={city.image} alt={city.name} className="w-full h-20 object-cover rounded mb-2" />
            <h3 className="font-semibold text-sm text-gray-800 text-center">{city.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CitiesSection; 