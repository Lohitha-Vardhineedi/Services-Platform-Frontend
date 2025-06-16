import React from 'react';
import { billServices } from '../data/billServicesData';

function BillsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Bills & Recharge</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {billServices.map((item, idx) => (
          <div key={idx} className={`bg-white rounded-xl shadow p-4 flex flex-col items-center ${item.color}`}>
            <span className="text-3xl mb-2">{item.icon}</span>
            <h3 className="font-semibold text-sm text-gray-800 text-center">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillsSection; 