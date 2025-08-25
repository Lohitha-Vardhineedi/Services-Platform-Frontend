import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Breadcrumb currentPage="PRNV Services Refund Policy" /> */}
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          PRNV Services Refund Policy
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6 text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <p className="text-lg font-semibold text-yellow-800 flex items-start">
                <span className="text-2xl mr-2">⚠️</span>
                PRNV Services does NOT refund the subscription amount under any circumstances.
              </p>
            </div>
            
            <div className="mt-8">
              <p className="text-base leading-relaxed">
                If PRNV Services cannot provide the promised leads in a certain time, we will extend the subscription renewal period. In any case, there will be no refund of the subscription amount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;