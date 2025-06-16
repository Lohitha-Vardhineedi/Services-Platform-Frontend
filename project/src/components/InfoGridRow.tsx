import React from 'react';
import BillsSection from './BillsSection';
import TravelSection from './TravelSection';
import TrendingSection from './TrendingSection';
import PopularSearchesSection from './PopularSearchesSection';

function InfoGridRow() {
  return (
    <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <BillsSection />
      <TravelSection />
      <TrendingSection />
      <PopularSearchesSection />
    </div>
  );
}

export default InfoGridRow; 