import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Info } from 'lucide-react';
import { User, ReferralData } from './types';

interface ReferralFormProps {
  user: User;
  setReferralData: (data: ReferralData) => void;
  mockApi: { saveReferralData: (data: ReferralData) => Promise<void> };
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  transform?: (value: string) => string;
  tooltip?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  transform,
  tooltip,
}) => {
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {label} {required && <span className="text-red-600">*</span>}
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 text-center">
              {tooltip}
            </span>
          </div>
        )}
      </label>
      <input
        id={name}
        type="text"
        value={value}
        onChange={e => onChange(transform ? transform(e.target.value) : e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-sm mt-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

function ReferralForm({ user, setReferralData, mockApi }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debounced validation
  const debounce = useCallback((fn: () => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  }, []);

  const validateField = (name: string, value: string) => {
    const newErrors: { [key: string]: string } = { ...errors };
    switch (name) {
      case 'accountHolderName':
        if (!value) newErrors.accountHolderName = 'Account holder name is required';
        else delete newErrors.accountHolderName;
        break;
      case 'bankName':
        if (!value) newErrors.bankName = 'Bank name is required';
        else delete newErrors.bankName;
        break;
      case 'accountNumber':
        if (!value) newErrors.accountNumber = 'Account number is required';
        else delete newErrors.accountNumber;
        break;
      case 'ifscCode':
        if (!value.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = 'Enter a valid IFSC code (e.g., SBIN0001234)';
        else delete newErrors.ifscCode;
        break;
    }
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      bankDetails: { ...formData.bankDetails, [field]: value },
    });
    debounce(() => validateField(field, value), 300)();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.bankDetails.accountHolderName) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.bankDetails.bankName) newErrors.bankName = 'Bank name is required';
    if (!formData.bankDetails.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!formData.bankDetails.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = 'Enter a valid IFSC code';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    const referralCode = `PRNV${user.username.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
    const newReferralData: ReferralData = {
      id: Date.now().toString(),
      username: user.username,
      bankDetails: formData.bankDetails,
      referralCode,
      isActive: true,
      totalEarnings: 0,
      referralCount: { technicians: 0, franchises: 0 },
      createdAt: new Date().toISOString(),
    };

    try {
      await mockApi.saveReferralData(newReferralData);
      setReferralData(newReferralData);
      setSuccessMessage('Referral account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/referrals/dashboard');
      }, 2000);
    } catch (error) {
      setApiError('Failed to save referral data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <h3 className="text-3xl font-bold text-gray-900 mb-3">Referral Partner Registration</h3>
      <p className="text-gray-600 mb-8">Enter your bank details to start earning with the PRNV Referral Program.</p>

      {successMessage && (
        <div className="bg-green-100 p-4 rounded-lg text-green-700 mb-6 flex items-center gap-2 animate-slide-down">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {apiError && (
        <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6 flex items-center gap-2 animate-slide-down">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Bank Details for Payments
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={value => handleInputChange('accountHolderName', value)}
              placeholder="Enter account holder name"
              error={errors.accountHolderName}
              required
              tooltip="Name as registered with the bank"
            />
            <InputField
              label="Bank Name"
              name="bankName"
              value={formData.bankDetails.bankName}
              onChange={value => handleInputChange('bankName', value)}
              placeholder="Enter bank name"
              error={errors.bankName}
              required
              tooltip="Full name of the bank (e.g., State Bank of India)"
            />
            <InputField
              label="Account Number"
              name="accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={value => handleInputChange('accountNumber', value)}
              placeholder="Enter account number"
              error={errors.accountNumber}
              required
              tooltip="Your bank account number"
            />
            <InputField
              label="IFSC Code"
              name="ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={value => handleInputChange('ifscCode', value.toUpperCase())}
              placeholder="Enter IFSC code"
              error={errors.ifscCode}
              required
              tooltip="11-character code (e.g., SBIN0001234)"
            />
          </div>
        </div>
        <div className="flex gap-6 pt-6">
          <Link
            to="/referral"
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center transition-colors"
            aria-label="Back to referral home"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
            }`}
            aria-label="Submit referral form"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Create Referral Account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReferralForm;