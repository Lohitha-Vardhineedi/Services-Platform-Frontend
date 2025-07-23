import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { BiRupee } from 'react-icons/bi';

interface Booking {
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
  category: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description?: string;
  profileImage?: string;
  service?: string;
}

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  role: string;
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

interface BookingData {
  booking: Booking;
  technician: Technician;
  user: User;
  service: Service | null;
}

interface SavingsProps {
  setCurrentStep: (step: string, data?: any) => void;
  booking: BookingData;
}

const Savings: React.FC<SavingsProps> = ({ setCurrentStep, booking }) => {
  const role = localStorage.getItem('role') as 'user' | 'technician' | null;
  const { booking: bookingData, service } = booking;

  // Ensure service is not null
  if (!service) {
    return <div className="text-center py-8">Service details not available</div>;
  }

  // Calculate base amount (servicePrice * quantity)
  const baseAmount = bookingData.servicePrice * bookingData.quantity;
  // Discount is assumed to be 0 for now (modify if you have discount logic)
  const discount = 0;

  // Function to handle sharing payment details
  // const handleShare = async () => {
  //   const shareText = `
  //     Payment Summary for ${service.serviceName}
  //     Base Amount: ₹${baseAmount}
  //     Discount Applied: -₹${discount}
  //     GST (18%): ₹${bookingData.gst}
  //     Total Amount: ₹${bookingData.totalPrice}
  //   `.trim();

  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: 'Payment Summary',
  //         text: shareText,
  //       });
  //     } catch (error) {
  //       console.error('Error sharing:', error);
  //       alert('Failed to share payment details.');
  //     }
  //   } else {
  //     // Fallback: Copy to clipboard
  //     navigator.clipboard.writeText(shareText).then(() => {
  //       alert('Payment details copied to clipboard!');
  //     }).catch((error) => {
  //       console.error('Error copying to clipboard:', error);
  //       alert('Failed to copy payment details.');
  //     });
  //   }
  // };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentStep('completed-details', { booking })}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4">Payment Summary</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BiRupee className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Payment for {service?.serviceName}</h2>
        </div>
        <div className="max-w-md mx-auto space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Base Amount</span>
            <span className="text-gray-900 font-medium">₹{baseAmount}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-green-600">Discount Applied</span>
            <span className="text-green-600 font-medium">-₹{discount}</span>
          </div>
          <div className="flex justify-between items-center Pythagorean 3 border-b border-gray-100">
            <span className="text-gray-600">GST (18%)</span>
            <span className="text-gray-900 font-medium">₹{bookingData?.gst}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
            <span className="text-gray-900 text-xl font-semibold">Total Amount</span>
            <span className="text-purple-600 text-xl font-bold">₹{bookingData?.totalPrice}</span>
          </div>
        </div>
        <div className="max-w-md mx-auto space-y-4">
          {role === 'user' ? (
            <button
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
          onClick={
            () => {setCurrentStep('final-rating', {booking}) }}
            >
          Done
          </button>
          ) : (
            <button
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
          onClick={() => setCurrentStep('bookings')}
            >
          Done
          </button>
          )}
          
          {/* <button
            className="w-full bg-gray-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-gray-600 transition-colors"
            onClick={handleShare}
            Share Payment Details
          >
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Savings;
// import React from 'react';
// import { ChevronLeft } from 'lucide-react';

// interface SavingsProps {
//   setCurrentStep: (step: string) => void;
// }

// const Savings: React.FC<SavingsProps> = ({ setCurrentStep }) => {
//     const role = localStorage.getItem('role') as 'user' | 'technician' | null; 
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       <div className="border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => setCurrentStep('bookings')}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span>Back</span>
//           </button>
//           <h2 className="text-xl font-semibold text-gray-900 ml-4">Your Savings Box</h2>
//         </div>
//       </div>
//       <div className="p-6">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//             <div className="text-2xl">💰</div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
//         </div>
//         <div className="max-w-md mx-auto space-y-4 mb-8">
//           <div className="flex justify-between items-center py-3 border-b border-gray-100">
//             <span className="text-gray-600">Base Amount</span>
//             <span className="text-gray-900 font-medium">₹200</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-100">
//             <span className="text-green-600">Discount Applied</span>
//             <span className="text-green-600 font-medium">-₹0</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-100">
//             <span className="text-gray-600">GST (18%)</span>
//             <span className="text-gray-900 font-medium">₹36</span>
//           </div>
//           <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
//             <span className="text-gray-900 text-xl font-semibold">Total Amount</span>
//             <span className="text-purple-600 text-xl font-bold">₹236</span>
//           </div>
//         </div>
//         <div className="max-w-md mx-auto">
//           <button
//             className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//             onClick={() => setCurrentStep(role === 'user' ? 'final-rating' : 'bookings')}
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Savings;