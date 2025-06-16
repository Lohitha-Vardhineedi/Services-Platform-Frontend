import React from 'react';
import BillsSection from '../BillsSection';
import TravelSection from '../TravelSection';

function BillsTravelRow() {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <BillsSection />
      </div>
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <TravelSection />
      </div>
    </div>
  );
}

export default BillsTravelRow; 