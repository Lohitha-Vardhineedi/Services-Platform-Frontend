import React, { useRef, useState } from 'react';
import { Key } from 'lucide-react';

interface OTPModalProps {
  setCurrentStep: (step: string) => void;
  setActiveTab: (tab: string) => void;
  setShowSuccess: (value: boolean) => void;
  bookingOtp?: string;
  bookingId: string;
  onOtpSubmit: (otp: string) => void;
}


const OTPInput: React.FC<OTPModalProps> = ({
  setCurrentStep,
  setActiveTab,
  setShowSuccess,
  bookingOtp,
  bookingId,
  onOtpSubmit,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  
  const handleOTPSubmit = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter a 6-digit OTP');
    return;
  }

  onOtpSubmit(fullOtp);
  setOtp(['', '', '', '', '', '']);

  // Optional UX delay for success modal
  setTimeout(() => {
    setShowSuccess(false);
    setActiveTab('upcoming');
    setCurrentStep('upcoming-details');
  }, 4000);
};

return (
    <div className="flex gap-2 flex-wrap items-center space-x-4 md:col-span-2 sm:col-span-1 mt-4">
      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Key className="w-6 h-6 text-yellow-600" />
      </div>
      <span className="text-gray-600 font-medium">Enter OTP:</span>
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputsRef.current[index] = el)}
            className={`w-12 h-12 text-center border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label={`OTP digit ${index + 1}`}
            />
        ))}
      </div>
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-colors"
        onClick={handleOTPSubmit}
        >
        Submit
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default OTPInput;
// const handleOTPSubmit = () => {
//   const fullOtp = otp.join('');
//   if (fullOtp.length !== 6) {
//     setError('Please enter a 6-digit OTP');
//     return;
//   }

//   if (bookingOtp && fullOtp !== bookingOtp) {
//     setError('Invalid OTP. Please try again.');
//     return;
//   }

//   console.log('OTP submitted:', fullOtp);
//   localStorage.setItem(`otp_${bookingId}`, 'submitted');
//   setOtpSubmitted(true);
//   setShowSuccess(true);
//   setCurrentStep('success');
//   setOtp(['', '', '', '', '', '']);

//   setTimeout(() => {
//     setShowSuccess(false);
//     setActiveTab('upcoming');
//     setCurrentStep('upcoming-details');
//   }, 3000);
// };

// import React, { useRef, useState } from 'react';
// import { Key } from 'lucide-react';

// interface OTPModalProps {
//     setCurrentStep: (step: string) => void;
//     setActiveTab: (tab: string) => void;
//     setShowSuccess: (value: boolean) => void;
//     setOtpSubmitted: (value: boolean) => void; // Added prop
//     bookingOtp?: string; // Optional prop to validate OTP against booking
// }

// const OTPInput: React.FC<OTPModalProps> = ({
//     setCurrentStep,
//     setActiveTab,
//     setShowSuccess,
//     setOtpSubmitted,
//     bookingOtp,
// }) => {
//     const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
//     const [error, setError] = useState<string>(''); // Added for error handling
//     const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//     const handleChange = (index: number, value: string) => {
//         if (!/^\d?$/.test(value)) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);
//         setError(''); // Clear error on input change

//         if (value && index < otp.length - 1) {
//             inputsRef.current[index + 1]?.focus();
//         }
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputsRef.current[index - 1]?.focus();
//         }
//     };

//     const handleOTPSubmit = () => {
//         const fullOtp = otp.join('');
//         if (fullOtp.length !== 6) {
//             setError('Please enter a 6-digit OTP');
//             return;
//         }

//         if (bookingOtp && fullOtp !== bookingOtp) {
//             setError('Invalid OTP. Please try again.');
//             return;
//         }

//         console.log('OTP submitted:', fullOtp);
//         localStorage.setItem(`otp_${booking.id}`, 'submitted'); // Use booking-specific key

//         setOtpSubmitted(true);
//         setShowSuccess(true);
//         setCurrentStep('success');
//         setOtp(['', '', '', '', '', '']);

//         setTimeout(() => {
//             setShowSuccess(false);
//             setActiveTab('completed');
//             setCurrentStep('completed-details');
//         }, 3000);
//     };

//     return (
//         <div className="flex gap-2 flex-wrap items-center space-x-4 md:col-span-2 sm:col-span-1 mt-4">
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <Key className="w-6 h-6 text-yellow-600" />
//             </div>
//             <span className="text-gray-600 font-medium">Enter OTP:</span>
//             <div className="flex gap-2">
//                 {otp.map((digit, index) => (
//                     <input
//                         key={index}
//                         type="text"
//                         maxLength={1}
//                         value={digit}
//                         onChange={(e) => handleChange(index, e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(index, e)}
//                         ref={(el) => (inputsRef.current[index] = el)}
//                         className={`w-12 h-12 text-center border ${error ? 'border-red-500' : 'border-gray-300'
//                             } rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                         aria-label={`OTP digit ${index + 1}`}
//                     />
//                 ))}
//             </div>
//             <button
//                 className="py-2 px-4 bg-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-colors"
//                 onClick={handleOTPSubmit}
//             >
//                 Submit
//             </button>
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         </div>
//     );
// };

// export default OTPInput;