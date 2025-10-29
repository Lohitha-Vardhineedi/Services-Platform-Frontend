// TransactionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import UpcomingDetails from '../../components/transaction/UpcomingDetails';
import CompletedDetails from '../../components/transaction/CompletedDetails';
import CancelledCard from '../../components/transaction/CancellationDetails';
import CongratulationsModal from '../../components/transaction/CongratulationsModel';
import Savings from '../../components/transaction/Savings';
import FinalRating from '../../components/transaction/FinalRating';
import SuccessModal from '../../components/transaction/SuccessModel';
import OTPInput from '../../components/transaction/OTPModel';
import BookingsList from '../../components/transaction/Bookinglist';
import TransactionSidebar from '../../components/transaction/TransactionSidebar';
import { getOrdersByTechnicianId } from '../../api/apiMethods';

// === REUSABLE TYPES ===
interface AuthorizedPerson {
  phone: string;
  photo: string;
  _id: string;
}

interface CategoryService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
}

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  role: 'user';
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileImage: string;
}

interface Service {
  _id: string;
  categoryId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Technician {
  _id: string;
  franchiseId: string | null;
  userId: string;
  username: string;
  role: 'technician';
  phoneNumber: string;
  password: string;
  category: string;
  description: string;
  service: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  admin: boolean;
  status: 'registered';
  authorizedPersons: AuthorizedPerson[];
  categoryServices: CategoryService[];
  profileImage: string;
  aadharFront: string;
  aadharBack: string;
  panCard: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  status: 'completed' | 'cancelled' | 'started' | 'declined' | 'upcoming' | 'accepted';
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BookingItem {
  booking: Booking;
  user: User;
  service: Service;
  technician: Technician;
}

interface BookingResult {
  bookings: BookingItem[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: BookingResult;
}

// === TAB TYPES ===
interface TransactionTab {
  id: 'upcoming' | 'completed' | 'cancelled';
  name: string;
  color: string;
  bgColor: string;
}

// === COMPONENT ===
const TransactionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [currentStep, setCurrentStep] = useState<string>('bookings');
  const [role, setRole] = useState<'user' | 'technician' | null>(null);
  const [bookingsData, setBookingsData] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const transactionTabs: TransactionTab[] = [
    { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
  ];

  // === Load Role from localStorage ===
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'user' | 'technician' | null;
    setRole(storedRole);
  }, []);

  // === Fetch Bookings ===
  const fetchBookings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found in localStorage');

      const response = (await getOrdersByTechnicianId(userId)) as ApiResponse;
      if (!response.success) throw new Error(response.message || 'Failed to fetch bookings');

      setBookingsData(response.result.bookings || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // === Handle Booking Selection ===
  const handleBookingSelect = (bookingItem: BookingItem) => {
    setSelectedBooking(bookingItem);
    const status = bookingItem.booking.status.toLowerCase();

    if (status === 'completed') {
      setActiveTab('completed');
      setCurrentStep('completed-details');
    } else if (['cancelled', 'declined'].includes(status)) {
      setActiveTab('cancelled');
      setCurrentStep('cancelled-details');
    } else {
      setActiveTab('upcoming');
      setCurrentStep('upcoming-details');
    }
  };

  // === Render Main Content ===
  const renderMainContent = () => {
    if (loading && !bookingsData.length) {
      return <div className="text-center py-8 text-gray-600">Loading bookings...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          {error}{' '}
          <button
            onClick={() => fetchBookings(true)}
            className="ml-2 underline text-blue-600 hover:text-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case 'upcoming-details':
        return selectedBooking ? (
          <UpcomingDetails
            booking={selectedBooking}
            setCurrentStep={setCurrentStep}
            role={role}
            setActiveTab={setActiveTab}
            onBookingCancelled={() => fetchBookings(true)}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">No booking selected</div>
        );

      case 'completed-details':
        return selectedBooking ? (
          <CompletedDetails booking={selectedBooking} setCurrentStep={setCurrentStep} role={role} />
        ) : (
          <div className="text-center py-8 text-gray-500">No booking selected</div>
        );

      case 'cancelled-details':
        return selectedBooking ? (
          <CancelledCard booking={selectedBooking} setCurrentStep={setCurrentStep} role={role} />
        ) : (
          <div className="text-center py-8 text-gray-500">No booking selected</div>
        );

      case 'congratulations':
        return <CongratulationsModal setCurrentStep={setCurrentStep} role={role} />;

      case 'savings':
        return selectedBooking ? (
          <Savings setCurrentStep={setCurrentStep} booking={selectedBooking} />
        ) : (
          <div className="text-center py-8 text-gray-500">No booking data</div>
        );

      case 'final-rating':
        return selectedBooking ? (
          <FinalRating setCurrentStep={setCurrentStep} booking={selectedBooking} />
        ) : (
          <div className="text-center py-8 text-gray-500">No booking data</div>
        );

      case 'success':
        return <SuccessModal setCurrentStep={setCurrentStep} setActiveTab={setActiveTab} />;

      case 'otp-modal':
        return <OTPInput setCurrentStep={setCurrentStep} setActiveTab={setActiveTab} />;

      default:
        return (
          <>
            {refreshing && (
              <div className="text-xs text-gray-400 mb-2 animate-pulse">Refreshing bookings...</div>
            )}
            <BookingsList
              bookings={bookingsData}
              activeTab={activeTab}
              onBookingSelect={handleBookingSelect}
              role={role}
            />
          </>
        );
    }
  };

  // === JSX ===
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Transactions</h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/technician/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span>My Transactions</span>
            </nav>
          </div>
          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          <TransactionSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentStep={setCurrentStep}
            transactionTabs={transactionTabs}
          />
          <main className="flex-1">{renderMainContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
// // TransactionPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import UpcomingDetails from '../../components/transaction/UpcomingDetails';
// import CompletedDetails from '../../components/transaction/CompletedDetails';
// import CancelledCard from '../../components/transaction/CancellationDetails';
// import CongratulationsModal from '../../components/transaction/CongratulationsModel';
// import Savings from '../../components/transaction/Savings';
// import FinalRating from '../../components/transaction/FinalRating';
// import SuccessModal from '../../components/transaction/SuccessModel';
// import OTPInput from '../../components/transaction/OTPModel';
// import BookingsList from '../../components/transaction/Bookinglist';
// import TransactionSidebar from '../../components/transaction/TransactionSidebar';
// import { getOrdersByTechnicianId } from '../../api/apiMethods';

// // Reusable sub-types
// interface AuthorizedPerson {
//   phone: string;
//   photo: string;
//   _id: string;
// }

// interface CategoryService {
//   categoryServiceId: string;
//   status: boolean;
//   _id: string;
// }

// // User (Customer)
// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   role: 'user';
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string; // ISO date
//   updatedAt: string;
//   __v: number;
//   profileImage: string;
// }

// // Service
// interface Service {
//   _id: string;
//   categoryId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // Technician
// interface Technician {
//   _id: string;
//   franchiseId: string | null;
//   userId: string;
//   username: string;
//   role: 'technician';
//   phoneNumber: string;
//   password: string;
//   category: string;
//   description: string;
//   service: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   admin: boolean;
//   status: 'registered';
//   authorizedPersons: AuthorizedPerson[];
//   categoryServices: CategoryService[];
//   profileImage: string;
//   aadharFront: string;
//   aadharBack: string;
//   panCard: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // Booking
// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string; // ISO date
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: 'completed' | 'cancelled' | 'started' | 'declined' | 'upcoming' | 'accepted'; // extend as needed
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// // Booking Item (with populated references)
// interface BookingItem {
//   booking: Booking;
//   user: User;
//   service: Service;
//   technician: Technician;
// }

// // API Result
// interface BookingResult {
//   bookings: BookingItem[];
// }

// // Full API Response
// interface ApiResponse {
//   success: boolean;
//   message: string;
//   result: BookingResult;
// }

// const TransactionPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
//   const [currentStep, setCurrentStep] = useState<string>('bookings');
//   const [role, setRole] = useState<'user' | 'technician' | null>(null);
//   const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false); // <-- new
//   const [error, setError] = useState<string | null>(null);
//   const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

//   const transactionTabs = [
//     { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
//     { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
//     { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
//   ];

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role') as 'user' | 'technician' | null;
//     setRole(storedRole);
//   }, []);

//   const fetchBookings = useCallback(async (isRefresh = false) => {
//     try {
//       if (isRefresh) setRefreshing(true);
//       else setLoading(true);

//       const userId = localStorage.getItem('userId');
//       if (!userId) throw new Error('User ID not found');

//       const response = await getOrdersByTechnicianId(userId) as ApiResponse;
//       if (!response.success) throw new Error(response.message || 'Failed to fetch bookings');

//       // ✅ No pre-sorting: let BookingsList own the freshness sorting
//       setBookingsData(response.result.bookings || []);
//       setError(null);
//     } catch (err: any) {
//       setError(err?.message || 'An error occurred while fetching bookings');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBookings(false);
//   }, [fetchBookings]);

//   const handleBookingSelect = (booking: Booking) => {
//     setSelectedBooking(booking);
//     const status = (booking.booking.status || '').toLowerCase();

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
//     if (loading && !bookingsData.length) {
//       return <div className="text-center py-8">Loading bookings...</div>;
//     }
//     if (error) {
//       return (
//         <div className="text-center py-8 text-red-500">
//           {error}{' '}
//           <button
//             className="ml-2 underline text-blue-600"
//             onClick={() => fetchBookings(true)}
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }

//     switch (currentStep) {
//       case 'upcoming-details':
//         return selectedBooking ? (
//           <UpcomingDetails
//             booking={selectedBooking}
//             setCurrentStep={setCurrentStep}
//             role={role}
//             setActiveTab={setActiveTab}
//             onBookingCancelled={() => fetchBookings(true)}
//           />
//         ) : <div className="text-center py-8">No booking selected</div>;

//       case 'completed-details':
//         return selectedBooking ? (
//           <CompletedDetails booking={selectedBooking} setCurrentStep={setCurrentStep} role={role} />
//         ) : <div className="text-center py-8">No booking selected</div>;

//       case 'cancelled-details':
//         return selectedBooking ? (
//           <CancelledCard booking={selectedBooking} setCurrentStep={setCurrentStep} role={role} />
//         ) : <div className="text-center py-8">No booking selected</div>;

//       case 'congratulations':
//         return <CongratulationsModal setCurrentStep={setCurrentStep} role={role} />;

//       case 'savings':
//         return <Savings setCurrentStep={setCurrentStep} booking={selectedBooking} />;

//       case 'final-rating':
//         return <FinalRating setCurrentStep={setCurrentStep} booking={selectedBooking} />;

//       case 'success':
//         return <SuccessModal setCurrentStep={setCurrentStep} setActiveTab={setActiveTab} />;

//       case 'otp-modal':
//         return <OTPInput setCurrentStep={setCurrentStep} setActiveTab={setActiveTab} />;

//       default:
//         return (
//           <>
//             {refreshing && (
//               <div className="text-xs text-gray-400 mb-2">Refreshing…</div>
//             )}
//             <BookingsList
//               bookings={bookingsData}
//               activeTab={activeTab}
//               onBookingSelect={handleBookingSelect}
//               role={role}
//             />
//           </>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Transactions</h1>
//             <div className="flex items-center space-x-2 text-sm text-gray-500">
//               <Link to="/technician/dashboard" className="hover:underline">Dashboard</Link>
//               <ChevronRight className="w-4 h-4" />
//               <span>My Transactions</span>
//             </div>
//           </div>
//           <button
//             onClick={() => fetchBookings(true)}
//             className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
//           >
//             Refresh
//           </button>
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

// export default TransactionPage;

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
// // import { resetOTPSession } from '../../api/apiMethods'; 

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
//         // Sort bookings by createdAt in descending order (newest first for freshness)
//         const sortedBookings = response.result.bookings.sort((a, b) => 
//           new Date(b.booking.bookingDate).getTime() - new Date(a.booking.bookingDate).getTime()
//         );
//         setBookingsData(sortedBookings);
//       } else {
//         throw new Error(response.message || 'Failed to fetch bookings');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while fetching bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   // Reset OTP session when navigating to upcoming-details
//   useEffect(() => {
//     if (currentStep === 'upcoming-details' && selectedBooking) {
//       const resetOTP = async () => {
//         try {
//           const techId = localStorage.getItem('userId');
//           if (!techId || !selectedBooking.booking._id) {
//             console.error('Technician ID or Booking ID not found');
//             return;
//           }

          
//           await resetOTPSession(techId, selectedBooking.booking._id);
//           console.log('OTP session reset successfully');
//         } catch (err) {
//           console.error('Error resetting OTP session:', err);
//         }
//       };

//       resetOTP();
//     }
//   }, [currentStep, selectedBooking]);

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
//           <Savings
//             setCurrentStep={setCurrentStep}
//             booking={selectedBooking}
//           />
//         );
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
// // import { resetOTPSession } from '../../api/apiMethods'; 

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

//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   // Reset OTP session when navigating to upcoming-details
//   useEffect(() => {
//     if (currentStep === 'upcoming-details' && selectedBooking) {
//       const resetOTP = async () => {
//         try {
//           const techId = localStorage.getItem('userId');
//           if (!techId || !selectedBooking.booking._id) {
//             console.error('Technician ID or Booking ID not found');
//             return;
//           }

          
//           await resetOTPSession(techId, selectedBooking.booking._id);
//           console.log('OTP session reset successfully');
//         } catch (err) {
//           console.error('Error resetting OTP session:', err);
//         }
//       };

//       resetOTP();
//     }
//   }, [currentStep, selectedBooking]);

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
//           <Savings
//             setCurrentStep={setCurrentStep}
//             booking={selectedBooking}
//           />
//         );
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