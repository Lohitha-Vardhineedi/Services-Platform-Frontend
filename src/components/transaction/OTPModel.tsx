import React, { useRef, useState } from 'react';
import { Key } from 'lucide-react'; // Make sure lucide-react is installed

interface OTPModelProps {
    setCurrentStep: (step: string) => void;
    setActiveTab: (tab: string) => void;
    setShowSuccess: (value: boolean) => void;
}


const OTPInput: React.FC<OTPModelProps> = ({ setCurrentStep, setActiveTab, setShowSuccess, }) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6-digit OTP
    // State to control the modal visibility
    const [showModal, setShowModal] = useState(false);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

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
  if (fullOtp.length === 6) {
    console.log('OTP submitted:', fullOtp);

    // 1. Show success modal
    setShowSuccess(true);
    setCurrentStep('success'); // Set current step to success

    // 2. Hide success modal after 5 sec and go to bookings/upcoming
    setTimeout(() => {
      setShowSuccess(false); // hide modal
      setActiveTab('upcoming'); // navigate to Upcoming tab
      setCurrentStep('bookings'); // go back to bookings step
    }, 3000);
  }

  setOtp(['', '', '', '', '', '']); // Clear OTP fields
};


    return (
        <>
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
                            className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>

                <button
                    className="py-2 px-4 bg-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-colors"
                    onClick={handleOTPSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    );
};

export default OTPInput;


