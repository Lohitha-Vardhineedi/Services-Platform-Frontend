import React from 'react';
import WeddingSection from './WeddingSection';
import BeautySection from './BeautySection';

function WeddingBeautyRow() {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <WeddingSection hideTitle />
      </div>
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
        <BeautySection hideTitle />
      </div>
    </div>
  );
}

export default WeddingBeautyRow; 