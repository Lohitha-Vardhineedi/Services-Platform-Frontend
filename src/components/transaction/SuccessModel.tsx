import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  setCurrentStep: (step: string) => void;
  setActiveTab: (tab: string) => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ setCurrentStep, setActiveTab }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">OTP received</h2>
        <p className="text-gray-600 mb-8">
          Now you can do your work until user confirm the work is done. In case of any issues, you can
          contact the user directly.
        </p>
        <button
          className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
          onClick={() => {
            setCurrentStep('bookings');
            setActiveTab('upcoming');
          }}
        >
          Back to Order
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;