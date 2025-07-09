import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface SavingsProps {
  setCurrentStep: (step: string) => void;
}

const Savings: React.FC<SavingsProps> = ({ setCurrentStep }) => {
    const role = localStorage.getItem('role') as 'user' | 'technician' | null; 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentStep('bookings')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4">Your Savings Box</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="text-2xl">💰</div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
        </div>
        <div className="max-w-md mx-auto space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Base Amount</span>
            <span className="text-gray-900 font-medium">₹200</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-green-600">Discount Applied</span>
            <span className="text-green-600 font-medium">-₹0</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">GST (18%)</span>
            <span className="text-gray-900 font-medium">₹36</span>
          </div>
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
            <span className="text-gray-900 text-xl font-semibold">Total Amount</span>
            <span className="text-purple-600 text-xl font-bold">₹236</span>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <button
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
            onClick={() => setCurrentStep(role === 'user' ? 'congratulations' : 'bookings')}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Savings;