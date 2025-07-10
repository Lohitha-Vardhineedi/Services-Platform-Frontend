
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  Wrench,
  Phone,
  MapPin,
  KeyRound,
} from "lucide-react";
import OTPInput from "./OTPModel";
import SuccessModal from "./SuccessModel";

interface Booking {
  id: string;
  name: string;
  service: string;
  contact: string;
  address: string;
  date: string;
  provider: string;
  rating: number;
  review: string;
  image: string;
  otp: string;
}

interface UpcomingDetailsProps {
  booking: Booking;
  setCurrentStep: (step: string) => void;
  role: "user" | "technician" | null;
  setActiveTab: (tab: string) => void;
}

const UpcomingDetails: React.FC<UpcomingDetailsProps> = ({
  booking,
  setCurrentStep,
  role,
  setActiveTab,
}) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [otpSubmitted, setOtpSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem(`otp_${booking.id}`) === "submitted") {
      setOtpSubmitted(true);
    }
  }, [booking.id]);

  const handleCancel = () => {
    setActiveTab("cancelled");
    setCurrentStep("bookings");
    localStorage.removeItem(`otp_${booking.id}`);
  };

  const handleCompleted = () => {
    setActiveTab("completed");
    setCurrentStep("completed-details");
    localStorage.removeItem(`otp_${booking.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
            setActiveTab("upcoming");
            setCurrentStep("upcoming-details");
          }}
        />
      )}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentStep("bookings")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Go back to bookings"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4">
            Booking Details
          </h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
            Upcoming
          </span>
          <span className="text-gray-400 text-sm">Date: {booking.date}</span>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
          <img
            src={booking.image}
            alt={`Image of ${booking.service} service`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-900 font-medium ml-2">
                {booking.name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Service:</span>
              <span className="text-gray-900 font-medium ml-2">
                {booking.service}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Contact:</span>
              <span className="text-gray-900 font-medium ml-2">
                {booking.contact}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-900 font-medium ml-2 text-sm">
                {booking.address}
              </span>
            </div>
          </div>
          {role === "user" && (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-600">OTP:</span>
                <span className="text-gray-900 font-medium ml-2 text-sm">
                  {booking.otp}
                </span>
              </div>
            </div>
          )}
          {role === "technician" && (
            <div className="md:col-span-2">
              {!otpSubmitted ? (
                <OTPInput
                  setCurrentStep={setCurrentStep}
                  setActiveTab={setActiveTab}
                  setShowSuccess={setShowSuccess}
                  setOtpSubmitted={setOtpSubmitted}
                  bookingOtp={booking.otp}
                  bookingId={booking.id}
                />
              ) : (
                <div className="flex justify-end space-x-4">
                  <button
                    className="py-2 px-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
                    onClick={handleCompleted}
                  >
                    Mark as Complete
                  </button>
                </div>
              )}
            </div>
          )}
          {role === "user" && (
            <div className="flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-50 text-red-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingDetails;


// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   User,
//   Wrench,
//   Phone,
//   MapPin,
//   KeyRound,
// } from "lucide-react";
// import OTPInput from "./OTPModel"; // Fixed import name
// import SuccessModal from "./SuccessModel"; // Fixed import name

// interface Booking {
//   id: string;
//   name: string;
//   service: string;
//   contact: string;
//   address: string;
//   date: string;
//   provider: string;
//   rating: number;
//   review: string;
//   image: string;
//   otp: string;
// }

// interface UpcomingDetailsProps {
//   booking: Booking;
//   setCurrentStep: (step: string) => void;
//   role: "user" | "technician" | null;
//   setActiveTab: (tab: string) => void;
// }

// const UpcomingDetails: React.FC<UpcomingDetailsProps> = ({
//   booking,
//   setCurrentStep,
//   role,
//   setActiveTab,
// }) => {
//   const [showSuccess, setShowSuccess] = useState<boolean>(false);
//   const [otpSubmitted, setOtpSubmitted] = useState<boolean>(false);

//   // Initialize otpSubmitted based on localStorage
//   useEffect(() => {
//     if (localStorage.getItem(`otp_${booking.id}`) === "submitted") {
//       setOtpSubmitted(true);
//     }
//   }, [booking.id]);

//   const handleCancel = () => {
//     setActiveTab("cancelled");
//     setCurrentStep("bookings");
//     // Optionally clear localStorage for this booking
//     localStorage.removeItem(`otp_${booking.id}`);
//   };

//   const handleCompleted = () => {
//     setActiveTab("completed");
//     setCurrentStep("completed-details");
//     // Optionally clear localStorage for this booking
//     localStorage.removeItem(`otp_${booking.id}`);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       {showSuccess && (
//         <SuccessModal
//           message="OTP verified successfully!"
//           onClose={() => {
//             setShowSuccess(false);
//             if (role === "technician") {
//               setActiveTab("completed");
//               setCurrentStep("completed-details");
//             } else {
//               setActiveTab("upcoming");
//               setCurrentStep("bookings");
//             }
//           }}
//         />
//       )}
//       <div className="border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => setCurrentStep("bookings")}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
//             aria-label="Go back to bookings"
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span>Back</span>
//           </button>
//           <h2 className="text-xl font-semibold text-gray-900 ml-4">
//             Booking Details
//           </h2>
//         </div>
//       </div>
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
//             Upcoming
//           </span>
//           <span className="text-gray-400 text-sm">Date: {booking.date}</span>
//         </div>
//         <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <img
//             src={booking.image}
//             alt={`Image of ${booking.service} service`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Name:</span>
//               <span className="text-gray-900 font-medium ml-2">
//                 {booking.name}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Wrench className="w-6 h-6 text-orange-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Service:</span>
//               <span className="text-gray-900 font-medium ml-2">
//                 {booking.service}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Phone className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Contact:</span>
//               <span className="text-gray-900 font-medium ml-2">
//                 {booking.contact}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <MapPin className="w-6 h-6 text-red-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Address:</span>
//               <span className="text-gray-900 font-medium ml-2 text-sm">
//                 {booking.address}
//               </span>
//             </div>
//           </div>
//           {role === "user" && (
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <KeyRound className="w-6 h-6 text-red-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <span className="text-gray-600">OTP:</span>
//                 <span className="text-gray-900 font-medium ml-2 text-sm">
//                   {booking.otp}
//                 </span>
//               </div>
//             </div>
//           )}
//           {role === "technician" && (
//             <div className="md:col-span-2">
//               {!otpSubmitted ? (
//                 <OTPInput
//                   setCurrentStep={setCurrentStep}
//                   setActiveTab={setActiveTab}
//                   setShowSuccess={setShowSuccess}
//                   setOtpSubmitted={setOtpSubmitted}
//                   bookingOtp={booking.otp}
//                 />
//               ) : (
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     className="py-2 px-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
//                     onClick={handleCompleted}
//                   >
//                     Mark as Complete
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           {role === "user" && (
//             <div className="flex justify-end space-x-4">
//               <button
//                 className="py-2 px-4 bg-gray-50 text-red-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition-colors"
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpcomingDetails;