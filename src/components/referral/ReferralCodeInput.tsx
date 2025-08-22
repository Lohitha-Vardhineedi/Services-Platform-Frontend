import React, { useState } from 'react';
import { Gift, Check, X } from 'lucide-react';

interface ReferralCodeInputProps {
  onCodeApplied?: (code: string) => void;
  className?: string;
}

function ReferralCodeInput({ onCodeApplied, className = '' }: ReferralCodeInputProps) {
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
    referrerName?: string;
  } | null>(null);

  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setValidation(null);
      return;
    }

    setIsValidating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Check if referral code exists in localStorage
      const allKeys = Object.keys(localStorage);
      const referralKey = allKeys.find(key => {
        if (key.startsWith('referral_')) {
          const referralData = JSON.parse(localStorage.getItem(key) || '{}');
          return referralData.referralCode === code.toUpperCase();
        }
        return false;
      });

      if (referralKey) {
        const referralData = JSON.parse(localStorage.getItem(referralKey) || '{}');
        setValidation({
          isValid: true,
          message: `Valid referral code from ${referralData.username}`,
          referrerName: referralData.username
        });
        onCodeApplied?.(code.toUpperCase());
      } else {
        setValidation({
          isValid: false,
          message: 'Invalid referral code. Please check and try again.'
        });
      }
      
      setIsValidating(false);
    }, 1000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    
    if (code.length >= 3) {
      validateReferralCode(code);
    } else {
      setValidation(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={referralCode}
            onChange={handleCodeChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              validation?.isValid === true
                ? 'border-green-500 bg-green-50'
                : validation?.isValid === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter referral code"
            maxLength={12}
          />
          
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {!isValidating && validation && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validation.isValid ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {validation && (
        <div className={`text-sm p-2 rounded ${
          validation.isValid
            ? 'text-green-700 bg-green-100'
            : 'text-red-700 bg-red-100'
        }`}>
          {validation.message}
        </div>
      )}
    </div>
  );
}

export default ReferralCodeInput;