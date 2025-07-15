
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
import { bookingCancleByUser } from "../../api/apiMethods";

interface BookingData {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  quantity: number;
  bookingDate: string;
  servicePrice: number;
  gst: number;
  totalPrice: number;
  status: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Technician {
  _id: string;
  userId: string;
  username: string;
  role: string;
  phoneNumber: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Service {
  _id: string;
  technicianId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UpcomingDetailsProps {
  booking: {
    booking: BookingData;
    technician: Technician;
    service: Service;
  };
  setCurrentStep: (step: string) => void;
  role: "user" | "technician" | null;
  setActiveTab: (tab: string) => void;
  onBookingCancelled?: () => void; // Add this
}

const UpcomingDetails: React.FC<UpcomingDetailsProps> = ({
  booking: bookingData,
  setCurrentStep,
  role,
  setActiveTab,
}) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [otpSubmitted, setOtpSubmitted] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const { booking, technician, service } = bookingData;

  // useEffect(() => {
  //   if (localStorage.getItem(`otp_${booking._id}`) === "submitted") {
  //     setOtpSubmitted(true);
  //   }
  // }, [booking._id]);

 const handleCancel = async () => {
    setIsCancelling(true);
    const data = {
      orderId: booking._id,
      userId: localStorage.getItem("userId")
    };

    try {
      const response = await bookingCancleByUser(data);
      if (response.success) {
        setActiveTab("cancelled");
        setCurrentStep("bookings");
        // You might want to trigger a refresh of the bookings list here
      } else {
        console.error("Failed to cancel booking:", response.message);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsCancelling(false);
    }
  };

 const handleCompleted = () => {
    setActiveTab("completed");
    setCurrentStep("completed-details");
    localStorage.removeItem(`otp_${booking._id}`);
  };

  // Format the address
  const formattedAddress = `${technician.buildingName}, ${technician.areaName}, ${technician.city}, ${technician.state} - ${technician.pincode}`;

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
          <span className="text-gray-400 text-sm">Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
          <img
            src={service.serviceImg}
            alt={`Image of ${service.serviceName} service`}
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
                {technician.username}
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
                {service.serviceName}
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
                {technician.phoneNumber}
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
                {formattedAddress}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Total Price:</span>
              <span className="text-gray-900 font-medium ml-2">
                ₹{booking.totalPrice}
              </span>
            </div>
          </div>
          {role === "user" && (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-600">OTP:</span>
                <span className="text-gray-900 font-medium ml-2">
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
                  bookingOtp={booking.otp.toString()}
                  bookingId={booking._id}
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
        className={`py-2 px-4 bg-gray-50 text-red-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition-colors ${isCancelling ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handleCancel}
        disabled={isCancelling}
      >
        {isCancelling ? 'Cancelling...' : 'Cancel Service'}
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