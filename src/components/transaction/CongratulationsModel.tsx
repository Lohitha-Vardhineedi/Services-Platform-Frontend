import React from 'react';
import { Check } from 'lucide-react';

interface CongratulationsModalProps {
  setCurrentStep: (step: string) => void;
  role: 'user' | 'technician' | null;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ setCurrentStep, role }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h2>
        <p className="text-gray-600 mb-2">Work completed successfully</p>
        <div className="bg-blue-50 rounded-2xl p-4 mb-8">
          <p className="text-blue-800 font-medium">You have 1 week work guarantee</p>
        </div>
        <button
          className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
          onClick={() => setCurrentStep(role === 'user' ? 'final-rating' : 'bookings')}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CongratulationsModal;