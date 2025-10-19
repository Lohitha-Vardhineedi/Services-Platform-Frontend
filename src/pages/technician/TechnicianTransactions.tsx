import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TransactionSidebar from '../../components/transaction/TransactionSidebar';
import BookingsList from '../../components/transaction/Bookinglist';
import UpcomingDetails from '../../components/transaction/UpcomingDetails';
import CompletedDetails from '../../components/transaction/CompletedDetails';
import CongratulationsModal from '../../components/transaction/CongratulationsModel';
import Savings from '../../components/transaction/Savings';
import FinalRating from '../../components/transaction/FinalRating';
import SuccessModal from '../../components/transaction/SuccessModel';
import OTPModal from '../../components/transaction/OTPModel';
import CancelledCard from '../../components/transaction/CancellationDetails';
import { getOrdersByTechnicianId } from '../../api/apiMethods';
// import { resetOTPSession } from '../../api/apiMethods'; 

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

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
}

interface Service {
  _id: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
}

interface BookingData {
  booking: Booking;
  user: User;
  service: Service | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: {
    technician: User;
    bookings: BookingData[];
  };
}

const TechnicianTransactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [currentStep, setCurrentStep] = useState<string>('bookings');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('Great service, very professional!');
  const [role, setRole] = useState<'user' | 'technician' | null>(null);
  const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  // Transaction status options
  const transactionTabs = [
    { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
  ];

  // Get role from localStorage and fetch bookings
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'user' | 'technician' | null;
    setRole(storedRole);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const techId = localStorage.getItem('userId');
      if (!techId) {
        throw new Error('Technician ID not found');
      }

      const response: ApiResponse = await getOrdersByTechnicianId(techId);
      if (response.success) {
        setBookingsData(response.result.bookings);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  console.log("bookingsData", bookingsData)
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  // Reset OTP session when navigating to upcoming-details
  useEffect(() => {
    if (currentStep === 'upcoming-details' && selectedBooking) {
      const resetOTP = async () => {
        try {
          const techId = localStorage.getItem('userId');
          if (!techId || !selectedBooking.booking._id) {
            console.error('Technician ID or Booking ID not found');
            return;
          }

          
          await resetOTPSession(techId, selectedBooking.booking._id);
          console.log('OTP session reset successfully');
        } catch (err) {
          console.error('Error resetting OTP session:', err);
        }
      };

      resetOTP();
    }
  }, [currentStep, selectedBooking]);

  const handleBookingSelect = (booking: BookingData) => {
    console.log("booking", booking);
    setSelectedBooking(booking);

    const status = booking.booking.status;

    if (status === 'completed') {
      setActiveTab('completed');
      setCurrentStep('completed-details');
    } else if (status === 'cancelled' || status === 'declined') {
      setActiveTab('cancelled');
      setCurrentStep('cancelled-details');
    } else {
      setActiveTab('upcoming');
      setCurrentStep('upcoming-details');
    }
  };

  const renderMainContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading bookings...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    switch (currentStep) {
      case 'upcoming-details':
        return selectedBooking ? (
          <UpcomingDetails
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            role={role}
            setActiveTab={setActiveTab}
            onBookingCancelled={fetchBookings}
          />
        ) : (
          <div className="text-center py-8">No booking selected</div>
        );
      case 'completed-details':
        return selectedBooking ? (
          <CompletedDetails
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            role={role}
          />
        ) : (
          <div className="text-center py-8">No booking selected</div>
        );
      case 'cancelled-details':
        return selectedBooking ? (
          <CancelledCard
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            reviewText={reviewText}
            selectedRating={selectedRating}
            role={role}
          />
        ) : (
          <div className="text-center py-8">No booking selected</div>
        );
      case 'congratulations':
        return (
          <CongratulationsModal
            setCurrentStep={setCurrentStep}
            role={role}
          />
        );
      case 'savings':
        return (
          <Savings
            setCurrentStep={setCurrentStep}
            booking={selectedBooking}
          />
        );
      case 'final-rating':
        return (
          <FinalRating
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            setCurrentStep={setCurrentStep}
          />
        );
      case 'success':
        return (
          <SuccessModal
            setCurrentStep={setCurrentStep}
            setActiveTab={setActiveTab}
          />
        );
      case 'otp-modal':
        return (
          <OTPModal
            setCurrentStep={setCurrentStep}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return (
          <BookingsList
            bookings={bookingsData}
            activeTab={activeTab}
            onBookingSelect={handleBookingSelect}
            role={role}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Transactions</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/technician/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>My Transactions</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <TransactionSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentStep={setCurrentStep}
            transactionTabs={transactionTabs}
          />
          <div className="flex-1">{renderMainContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTransactions;








// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import TransactionSidebar from '../../components/transaction/TransactionSidebar';
// import BookingsList from '../../components/transaction/Bookinglist';
// import UpcomingDetails from '../../components/transaction/UpcomingDetails';
// import CompletedDetails from '../../components/transaction/CompletedDetails';
// import CongratulationsModal from '../../components/transaction/CongratulationsModel';
// import Savings from '../../components/transaction/Savings';
// import FinalRating from '../../components/transaction/FinalRating';
// import SuccessModal from '../../components/transaction/SuccessModel';
// import OTPModal from '../../components/transaction/OTPModel';
// import CancelledCard from '../../components/transaction/CancellationDetails';
// import { getOrdersByTechnicianId } from '../../api/apiMethods';

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   profileImage?: string;
// }

// interface Service {
//   _id: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
// }

// interface BookingData {
//   booking: Booking;
//   user: User;
//   service: Service | null;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: {
//     technician: User;
//     bookings: BookingData[];
//   };
// }

// const TechnicianTransactions: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
//   const [currentStep, setCurrentStep] = useState<string>('bookings');
//   const [selectedRating, setSelectedRating] = useState<number>(5);
//   const [reviewText, setReviewText] = useState<string>('Great service, very professional!');
//   const [role, setRole] = useState<'user' | 'technician' | null>(null);
//   const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

//   // Transaction status options
//   const transactionTabs = [
//     { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
//     { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
//     { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
//   ];

//   // Get role from localStorage and fetch bookings
//   useEffect(() => {
//     const storedRole = localStorage.getItem('role') as 'user' | 'technician' | null;
//     setRole(storedRole);
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const techId = localStorage.getItem('userId');
//       if (!techId) {
//         throw new Error('Technician ID not found');
//       }

//       const response: ApiResponse = await getOrdersByTechnicianId(techId);
//       if (response.success) {
//         setBookingsData(response.result.bookings);
//       } else {
//         throw new Error(response.message || 'Failed to fetch bookings');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while fetching bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("bookingsData", bookingsData)
//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   const handleBookingSelect = (booking: BookingData) => {
//     console.log("booking", booking);
//     setSelectedBooking(booking);

//     const status = booking.booking.status;

//     if (status === 'completed') {
//       setActiveTab('completed');
//       setCurrentStep('completed-details');
//     } else if (status === 'cancelled' || status === 'declined') {
//       setActiveTab('cancelled');
//       setCurrentStep('cancelled-details');
//     } else {
//       setActiveTab('upcoming');
//       setCurrentStep('upcoming-details');
//     }
//   };

//   const renderMainContent = () => {
//     if (loading) {
//       return <div className="text-center py-8">Loading bookings...</div>;
//     }

//     if (error) {
//       return <div className="text-center py-8 text-red-500">{error}</div>;
//     }

//     switch (currentStep) {
//       case 'upcoming-details':
//         return selectedBooking ? (
//           <UpcomingDetails
//             booking={selectedBooking}
//             setCurrentStep={setCurrentStep}
//             role={role}
//             setActiveTab={setActiveTab}
//             onBookingCancelled={fetchBookings}
//           />
//         ) : (
//           <div className="text-center py-8">No booking selected</div>
//         );
//       case 'completed-details':
//         return selectedBooking ? (
//           <CompletedDetails
//             booking={selectedBooking}
//             setCurrentStep={setCurrentStep}
//             role={role}
//           />
//         ) : (
//           <div className="text-center py-8">No booking selected</div>
//         );
//       case 'cancelled-details':
//         return selectedBooking ? (
//           <CancelledCard
//             booking={selectedBooking}
//             setCurrentStep={setCurrentStep}
//             reviewText={reviewText}
//             selectedRating={selectedRating}
//             role={role}
//           />
//         ) : (
//           <div className="text-center py-8">No booking selected</div>
//         );
//       case 'congratulations':
//         return (
//           <CongratulationsModal
//             setCurrentStep={setCurrentStep}
//             role={role}
//           />
//         );
//       case 'savings':
//         return (
//         <Savings
//          setCurrentStep={setCurrentStep} 
//          booking={selectedBooking}
//         />);
//       case 'final-rating':
//         return (
//           <FinalRating
//             selectedRating={selectedRating}
//             setSelectedRating={setSelectedRating}
//             setCurrentStep={setCurrentStep}
//           />
//         );
//       case 'success':
//         return (
//           <SuccessModal
//             setCurrentStep={setCurrentStep}
//             setActiveTab={setActiveTab}
//           />
//         );
//       case 'otp-modal':
//         return (
//           <OTPModal
//             setCurrentStep={setCurrentStep}
//             setActiveTab={setActiveTab}
//           />
//         );
//       default:
//         return (
//           <BookingsList
//             bookings={bookingsData}
//             activeTab={activeTab}
//             onBookingSelect={handleBookingSelect}
//             role={role}
//           />
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Transactions</h1>
//           <div className="flex items-center space-x-2 text-sm text-gray-500">
//             <Link to="/technician/dashboard" className="hover:underline">
//               Dashboard
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <span>My Transactions</span>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <TransactionSidebar
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             setCurrentStep={setCurrentStep}
//             transactionTabs={transactionTabs}
//           />
//           <div className="flex-1">{renderMainContent()}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TechnicianTransactions;