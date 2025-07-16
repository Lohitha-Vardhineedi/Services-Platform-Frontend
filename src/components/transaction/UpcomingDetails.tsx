import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Wrench,
  Phone,
  MapPin,
  KeyRound,
  Check,
  X,
} from "lucide-react";
import OTPInput from "./OTPModel";
import SuccessModal from "./SuccessModel";
import { bookingCancleByUser, updateBookingStatus } from "../../api/apiMethods";

// ... (keep all your existing interfaces)

const UpcomingDetails: React.FC<UpcomingDetailsProps> = ({
  booking: bookingData,
  setCurrentStep,
  role,
  setActiveTab,
}) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [otpSubmitted, setOtpSubmitted] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const { booking, technician, service, user } = bookingData;
console.log("booking", booking)
console.log("user", user)
  const formattedTechnicianAddress = `${technician.buildingName}, ${technician.areaName}, ${technician.city}, ${technician.state} - ${technician.pincode}`;
  const formattedUserAddress = `${user?.buildingName}, ${user?.areaName}, ${user?.city}, ${user.state} - ${user.pincode}`;

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
      } else {
        console.error("Failed to cancel booking:", response.message);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsCancelling(false);
    }
  };

const handleStatusUpdate = async (status: string, otp?: string) => {
  setIsUpdatingStatus(true);
  try {
    const requestData = {
      orderId: booking._id,
      technicianId: localStorage.getItem("userId"),
      status,
      ...(otp && { otp: Number(otp) })
    };

    const response = await updateBookingStatus(requestData);
    
    if (response.success) {
      if (status === "completed") {
        setActiveTab("completed");
        setCurrentStep("completed-details");
      } else if (status === "declined") {
        setActiveTab("cancelled");
        setCurrentStep("cancelled-details");
      } else if (status === "started") {
        setShowSuccess(true);
        setOtpSubmitted(true);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating status:", error);
    return false;
  } finally {
    setIsUpdatingStatus(false);
  }
};

const handleOtpSubmit = async (otp: string) => {
  const success = await handleStatusUpdate("started", otp);
  if (!success) {
    alert("OTP verification failed. Please try again.");
  }
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
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            booking.status === "upcoming" ? "bg-purple-100 text-purple-600" :
            booking.status === "accepted" ? "bg-blue-100 text-blue-600" :
            booking.status === "started" ? "bg-yellow-100 text-yellow-600" :
            "bg-green-100 text-green-600"
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
          {/* Name */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">
                {role === "user" ? "Technician Name:" : "Customer Name:"}
              </span>
              <span className="text-gray-900 font-medium ml-2">
                {role === "user" ? technician.username : user.username}
              </span>
            </div>
          </div>
          
          {/* Service */}
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
          
          {/* Contact */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Contact:</span>
              <span className="text-gray-900 font-medium ml-2">
                {role === "user" ? technician.phoneNumber : user.phoneNumber}
              </span>
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-900 font-medium ml-2 text-sm">
                {role === "user" ? formattedTechnicianAddress : formattedUserAddress}
              </span>
            </div>
          </div>
          
          {/* Price */}
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
          
          {/* OTP Section */}
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
          
          {/* Technician Actions */}
          {role === "technician" && (
            <div className="md:col-span-2">
              {booking.status === "upcoming" && (
                <div className="flex justify-end space-x-4">
                  <button
                    className={`py-2 px-4 bg-red-100 text-red-600 rounded-2xl font-semibold shadow-lg hover:bg-red-200 transition-colors flex items-center gap-2 ${isUpdatingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={() => handleStatusUpdate("declined")}
                    disabled={isUpdatingStatus}
                  >
                    <X className="w-5 h-5" />
                    {isUpdatingStatus ? 'Processing...' : 'Decline'}
                  </button>
                  <button
                    className={`py-2 px-4 bg-green-100 text-green-600 rounded-2xl font-semibold shadow-lg hover:bg-green-200 transition-colors flex items-center gap-2 ${isUpdatingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={() => handleStatusUpdate("accepted")}
                    disabled={isUpdatingStatus}
                  >
                    <Check className="w-5 h-5" />
                    {isUpdatingStatus ? 'Processing...' : 'Accept'}
                  </button>
                </div>
              )}
              
              {booking.status === "accepted" && !otpSubmitted && (
                <OTPInput
                  setCurrentStep={setCurrentStep}
                  setActiveTab={setActiveTab}
                  setShowSuccess={setShowSuccess}
                  setOtpSubmitted={setOtpSubmitted}
                  bookingOtp={booking.otp.toString()}
                  bookingId={booking._id}
                  onOtpSubmit={handleOtpSubmit}
                />
              )}
              
              {(booking.status === "started" || (booking.status === "accepted" && otpSubmitted)) && (
                <div className="flex justify-end space-x-4">
                  <button
                    className={`py-2 px-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition-colors ${isUpdatingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? 'Processing...' : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {(role === "user" && booking.status === "upcomming") && (
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