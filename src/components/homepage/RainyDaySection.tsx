import React from 'react';
import { rainyDayServices } from '../../data/rainyDayServicesData';

function RainyDaySection() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Rainy Day Essentials</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {rainyDayServices.map((service, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center cursor-pointer p-4 flex flex-col items-center">
            <img src={service.image} alt={service.name} className="w-full h-28 object-cover rounded-md mb-3" />
            <h3 className="font-medium mb-2 text-gray-900">{service.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RainyDaySection; 