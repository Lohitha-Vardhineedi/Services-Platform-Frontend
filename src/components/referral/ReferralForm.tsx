import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Info, User2, Phone } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  transform?: (value: string) => string;
  tooltip?: string;
  readOnly?: boolean;
}

interface User {
  id: string;
  username: string;
  role: 'user' | 'technician' | 'franchise' | 'staff';
  phoneNumber: string;
  areaName: string;
  buildingName: string;
  city: string;
  state: string;
  pincode: string;
  token: string;
}

interface ReferralData {
  id: string;
  username: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  referralCode: string;
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
  readOnly = false,
}) => {
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        {label} {required && <span className="text-red-600">*</span>}
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
            <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 text-center z-10 shadow-lg">
              {tooltip}
            </span>
          </div>
        )}
      </label>
      <input
        id={name}
        type="text"
        value={value}
        onChange={e => onChange && onChange(transform ? transform(e.target.value) : e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${
          readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-purple-500'
        } ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500'} shadow-sm`}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
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

function ReferralForm() {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('referralFormData');
    return savedData
      ? JSON.parse(savedData)
      : {
          bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' },
        };
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? JSON.parse(storedUser)
      : {
          id: 'user-1',
          username: 'john_doe',
          role: 'user',
          phoneNumber: '1234567890',
          areaName: 'Downtown',
          buildingName: 'Building A',
          city: 'Metropolis',
          state: 'NY',
          pincode: '123456',
          token: 'abc123',
        };
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoadingUser(false);
  }, []);

  // Persist form data to localStorage
  useEffect(() => {
    localStorage.setItem('referralFormData', JSON.stringify(formData));
  }, [formData]);

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
        if (!value.trim()) newErrors.accountHolderName = 'Account holder name is required';
        else if (!/^[a-zA-Z\s]+$/.test(value)) newErrors.accountHolderName = 'Only letters and spaces allowed';
        else delete newErrors.accountHolderName;
        break;
      case 'bankName':
        if (!value.trim()) newErrors.bankName = 'Bank name is required';
        else if (!/^[a-zA-Z\s]+$/.test(value)) newErrors.bankName = 'Only letters and spaces allowed';
        else delete newErrors.bankName;
        break;
      case 'accountNumber':
        if (!value) newErrors.accountNumber = 'Account number is required';
        else if (!/^\d{9,18}$/.test(value)) newErrors.accountNumber = 'Account number must be 9-18 digits';
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
    const transformedValue = field === 'ifscCode' ? value.toUpperCase() : field === 'accountNumber' ? value.replace(/\D/g, '') : value;
    setFormData({
      ...formData,
      bankDetails: { ...formData.bankDetails, [field]: transformedValue },
    });
    debounce(() => validateField(field, transformedValue), 300)();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.bankDetails.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.bankDetails.accountHolderName))
      newErrors.accountHolderName = 'Only letters and spaces allowed';
    if (!formData.bankDetails.bankName.trim()) newErrors.bankName = 'Bank name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.bankDetails.bankName)) newErrors.bankName = 'Only letters and spaces allowed';
    if (!formData.bankDetails.accountNumber) newErrors.accountNumber = 'Account number is required';
    else if (!/^\d{9,18}$/.test(formData.bankDetails.accountNumber))
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    if (!formData.bankDetails.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/))
      newErrors.ifscCode = 'Enter a valid IFSC code';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fakeApiCall = async (payload: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Fake API Submission Payload:', payload);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!user) {
      setApiError('User data is missing. Please try again.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    const referralCode = `PRNV${user.username.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
    const payload: ReferralData = {
      id: user.id,
      username: user.username,
      bankDetails: formData.bankDetails,
      referralCode,
    };

    try {
      await fakeApiCall(payload);
      localStorage.setItem('user', JSON.stringify(user)); // Persist user data
      localStorage.removeItem('referralFormData'); // Clear form data
      setSuccessMessage('Referral account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/referral');
      }, 2000);
    } catch (error) {
      setApiError('Failed to process referral data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
          <p>User data not found. Please log in again.</p>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Referral Partner Registration
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Enter your bank details to join the PRNV Referral Program and start earning rewards.
        </p>

        {successMessage && (
          <div className="bg-green-100 p-4 rounded-lg text-green-700 mb-6 flex items-center gap-2 animate-slide-down shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {apiError && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6 flex items-center gap-2 animate-slide-down shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <User2 className="w-6 h-6 text-blue-600" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="username"
                value={user.username || ''}
                placeholder="Enter your full name"
                readOnly
                tooltip="Your registered username (cannot be changed)"
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={user.phoneNumber || ''}
                placeholder="Enter your phone number"
                readOnly
                tooltip="Your registered phone number (cannot be changed)"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-purple-600" />
              Bank Details for Payments
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Enter bank name (e.g., State Bank of India)"
                error={errors.bankName}
                required
                tooltip="Full name of the bank"
              />
              <InputField
                label="Account Number"
                name="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={value => handleInputChange('accountNumber', value)}
                placeholder="Enter account number"
                error={errors.accountNumber}
                required
                tooltip="Your bank account number (9-18 digits)"
              />
              <InputField
                label="IFSC Code"
                name="ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={value => handleInputChange('ifscCode', value)}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                error={errors.ifscCode}
                required
                tooltip="11-character code starting with 4 letters, then 0, followed by 6 alphanumeric characters"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link
              to="/referral"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Back to referral home"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !user}
              className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-sm ${
                isSubmitting || !user
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-md'
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
    </div>
  );
}

export default ReferralForm;
// import React, { useState, useCallback, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { CreditCard, Info } from 'lucide-react';
// import { User, ReferralData } from './types';

// interface ReferralFormProps {
//   user: User;
//   setReferralData: (data: ReferralData) => void;
//   mockApi: { saveReferralData: (data: ReferralData) => Promise<void> };
// }

// interface InputFieldProps {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder: string;
//   error?: string;
//   required?: boolean;
//   transform?: (value: string) => string;
//   tooltip?: string;
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   error,
//   required = false,
//   transform,
//   tooltip,
// }) => {
//   return (
//     <div className="relative">
//       <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//         {label} {required && <span className="text-red-600">*</span>}
//         {tooltip && (
//           <div className="group relative">
//             <Info className="w-4 h-4 text-gray-400" />
//             <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 text-center">
//               {tooltip}
//             </span>
//           </div>
//         )}
//       </label>
//       <input
//         id={name}
//         type="text"
//         value={value}
//         onChange={e => onChange(transform ? transform(e.target.value) : e.target.value)}
//         className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
//           error ? 'border-red-500' : 'border-gray-300'
//         }`}
//         placeholder={placeholder}
//         required={required}
//         aria-invalid={!!error}
//         aria-describedby={error ? `${name}-error` : undefined}
//       />
//       {error && (
//         <p id={`${name}-error`} className="text-red-600 text-sm mt-1 animate-pulse">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };

// function ReferralForm({ user, setReferralData, mockApi }: ReferralFormProps) {
//   const [formData, setFormData] = useState({
//     bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' },
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Debounced validation
//   const debounce = useCallback((fn: () => void, delay: number) => {
//     let timeout: NodeJS.Timeout;
//     return () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(fn, delay);
//     };
//   }, []);

//   const validateField = (name: string, value: string) => {
//     const newErrors: { [key: string]: string } = { ...errors };
//     switch (name) {
//       case 'accountHolderName':
//         if (!value) newErrors.accountHolderName = 'Account holder name is required';
//         else delete newErrors.accountHolderName;
//         break;
//       case 'bankName':
//         if (!value) newErrors.bankName = 'Bank name is required';
//         else delete newErrors.bankName;
//         break;
//       case 'accountNumber':
//         if (!value) newErrors.accountNumber = 'Account number is required';
//         else delete newErrors.accountNumber;
//         break;
//       case 'ifscCode':
//         if (!value.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = 'Enter a valid IFSC code (e.g., SBIN0001234)';
//         else delete newErrors.ifscCode;
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       bankDetails: { ...formData.bankDetails, [field]: value },
//     });
//     debounce(() => validateField(field, value), 300)();
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!formData.bankDetails.accountHolderName) newErrors.accountHolderName = 'Account holder name is required';
//     if (!formData.bankDetails.bankName) newErrors.bankName = 'Bank name is required';
//     if (!formData.bankDetails.accountNumber) newErrors.accountNumber = 'Account number is required';
//     if (!formData.bankDetails.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = 'Enter a valid IFSC code';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setApiError(null);
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     const referralCode = `PRNV${user.username.slice(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
//     const newReferralData: ReferralData = {
//       id: Date.now().toString(),
//       username: user.username,
//       bankDetails: formData.bankDetails,
//       referralCode,
//       isActive: true,
//       totalEarnings: 0,
//       referralCount: { technicians: 0, franchises: 0 },
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       await mockApi.saveReferralData(newReferralData);
//       setReferralData(newReferralData);
//       setSuccessMessage('Referral account created successfully! Redirecting to dashboard...');
//       setTimeout(() => {
//         navigate('/referral');
//       }, 2000);
//     } catch (error) {
//       setApiError('Failed to save referral data. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 animate-fade-in">
//       <h3 className="text-3xl font-bold text-gray-900 mb-3">Referral Partner Registration</h3>
//       <p className="text-gray-600 mb-8">Enter your bank details to start earning with the PRNV Referral Program.</p>

//       {successMessage && (
//         <div className="bg-green-100 p-4 rounded-lg text-green-700 mb-6 flex items-center gap-2 animate-slide-down">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//           </svg>
//           {successMessage}
//         </div>
//       )}

//       {apiError && (
//         <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6 flex items-center gap-2 animate-slide-down">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//           {apiError}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8" noValidate>
//         <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl shadow-sm">
//           <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//             <CreditCard className="w-6 h-6 text-purple-600" />
//             Bank Details for Payments
//           </h4>
//           <div className="grid md:grid-cols-2 gap-6">
//             <InputField
//               label="Account Holder Name"
//               name="accountHolderName"
//               value={formData.bankDetails.accountHolderName}
//               onChange={value => handleInputChange('accountHolderName', value)}
//               placeholder="Enter account holder name"
//               error={errors.accountHolderName}
//               required
//               tooltip="Name as registered with the bank"
//             />
//             <InputField
//               label="Bank Name"
//               name="bankName"
//               value={formData.bankDetails.bankName}
//               onChange={value => handleInputChange('bankName', value)}
//               placeholder="Enter bank name"
//               error={errors.bankName}
//               required
//               tooltip="Full name of the bank (e.g., State Bank of India)"
//             />
//             <InputField
//               label="Account Number"
//               name="accountNumber"
//               value={formData.bankDetails.accountNumber}
//               onChange={value => handleInputChange('accountNumber', value)}
//               placeholder="Enter account number"
//               error={errors.accountNumber}
//               required
//               tooltip="Your bank account number"
//             />
//             <InputField
//               label="IFSC Code"
//               name="ifscCode"
//               value={formData.bankDetails.ifscCode}
//               onChange={value => handleInputChange('ifscCode', value.toUpperCase())}
//               placeholder="Enter IFSC code"
//               error={errors.ifscCode}
//               required
//               tooltip="11-character code (e.g., SBIN0001234)"
//             />
//           </div>
//         </div>
//         <div className="flex gap-6 pt-6">
//           <Link
//             to="/referral"
//             className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center transition-colors"
//             aria-label="Back to referral home"
//           >
//             Back
//           </Link>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all ${
//               isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
//             }`}
//             aria-label="Submit referral form"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Submitting...
//               </span>
//             ) : (
//               'Create Referral Account'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ReferralForm;