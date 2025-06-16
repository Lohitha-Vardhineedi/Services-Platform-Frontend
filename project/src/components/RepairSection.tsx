import React from 'react';
import { repairServices } from '../data/repairServicesData';

function RepairSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Repairs & Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {repairServices.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img src={service.image} alt={service.name} className="w-full h-32 object-cover rounded mb-3" />
            <h3 className="font-semibold text-lg text-gray-800 text-center">{service.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepairSection; 