import React from 'react';
import RepairSection from '../RepairSection';
import DailyNeedsSection from '../DailyNeedsSection';

function RepairDailyRow() {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <RepairSection />
      </div>
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <DailyNeedsSection />
      </div>
    </div>
  );
}

export default RepairDailyRow; 