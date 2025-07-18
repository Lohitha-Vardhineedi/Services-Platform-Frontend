import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import TransactionSidebar from '../components/transaction/TransactionSidebar';
import BookingsList from '../components/transaction/Bookinglist';
import UpcomingDetails from '../components/transaction/UpcomingDetails';
import CompletedDetails from '../components/transaction/CompletedDetails';
import CongratulationsModal from '../components/transaction/CongratulationsModel';
import Savings from '../components/transaction/Savings';
import FinalRating from '../components/transaction/FinalRating';
import SuccessModal from '../components/transaction/SuccessModel';
import OTPModal from '../components/transaction/OTPModel';
import { getOrdersByUserId } from '../api/apiMethods';
import CancelledCard from '../components/transaction/CancellationDetails';

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
  service: Service | null;
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

interface ApiResponse {
  success: boolean;
  message: string;
  result: {
    user: User;
    bookings: BookingData[];
  };
}

const TransactionPage: React.FC = () => {
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
  },[]);

     const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response: ApiResponse = await getOrdersByUserId(userId);
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

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);


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
            reviewText={reviewText}
            selectedRating={selectedRating}
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
        return <Savings setCurrentStep={setCurrentStep} />;
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
            <Link to="/" className="hover:underline">
              Home
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

export default TransactionPage;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Clock,
//   Wrench,
//   ChevronRight,
//   MapPin,
//   User,
//   ChevronLeft,
//   Phone,
//   Key,
//   Star,
//   Checka
// } from 'lucide-react';

// const TransactionPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [currentStep, setCurrentStep] = useState('bookings');
//   const [selectedRating, setSelectedRating] = useState(5);
//   const [reviewText, setReviewText] = useState('Great service, very professional!');

//   // Sample booking data
//   const bookingData = {
//     name: 'Madipally soujanya',
//     service: 'Home Cleaning',
//     contact: '8978023927', 
//     address: '123 Main Street, City hyderabad',
//     otp: '123456',
//     date: '2024-06-10',
//     provider: 'uday kumar',
//     rating: 5,
//     review: 'Great service, very professional!'
//   };

//   // Transaction status options
//   const transactionTabs = [
//     { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
//     { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
//     { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' }
//   ];

//   const renderBookingsList = () => (
//     <div className="space-y-4">
//       {activeTab === 'upcoming' && (
//         <>
//           <div 
//             className="bg-gray-50 rounded-2xl p-4 cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
//             onClick={() => setCurrentStep('upcoming-details')}
//           >
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Cleaning"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">{bookingData.service}</h3>
//                 <p className="text-gray-500 text-sm truncate">{bookingData.provider}</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Upcoming
//                   </span>
//                   <span className="text-gray-400 text-xs">{bookingData.date}</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Laundry"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Laundry Services</h3>
//                 <p className="text-gray-500 text-sm truncate">Aileen Fullbright</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Upcoming
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-12</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Bathroom"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Bathroom Cleaning</h3>
//                 <p className="text-gray-500 text-sm truncate">Freida Varnes</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Upcoming
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-15</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>
//         </>
//       )}

//       {activeTab === 'completed' && (
//         <>
//           <div 
//             className="bg-gray-50 rounded-2xl p-4 cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
//             onClick={() => setCurrentStep('completed-details')}
//           >
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Cleaning"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">{bookingData.service}</h3>
//                 <p className="text-gray-500 text-sm truncate">{bookingData.provider}</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Completed
//                   </span>
//                   <span className="text-gray-400 text-xs">{bookingData.date}</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>
          
//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Laundry"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Laundry Services</h3>
//                 <p className="text-gray-500 text-sm truncate">Aileen Fullbright</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Completed
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-08</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Painting"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Wall Painting</h3>
//                 <p className="text-gray-500 text-sm truncate">Alfonzo Schuessler</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Completed
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-05</span>
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>
//         </>
//       )}

//       {activeTab === 'cancelled' && (
//         <>
//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Bathroom"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Bathroom Cleaning</h3>
//                 <p className="text-gray-500 text-sm truncate">Freida Varnes</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Cancelled
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-03</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Kitchen"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Kitchen Cleaning</h3>
//                 <p className="text-gray-500 text-sm truncate">Sarah Johnson</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Cancelled
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-06-01</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img 
//                   src="https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
//                   alt="Carpet"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">Carpet Cleaning</h3>
//                 <p className="text-gray-500 text-sm truncate">Mike Wilson</p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
//                     Cancelled
//                   </span>
//                   <span className="text-gray-400 text-xs">2024-05-28</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   const renderUpcomingDetails = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       {/* Header */}
//       <div className="border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center space-x-3">
//           <button 
//             onClick={() => setCurrentStep('bookings')}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span>Back</span>
//           </button>
//           <h2 className="text-xl font-semibold text-gray-900 ml-4">Booking Details</h2>
//         </div>
//       </div>

//       <div className="p-6">
//         {/* Status */}
//         <div className="flex items-center justify-between mb-6">
//           <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
//             Upcoming
//           </span>
//           <span className="text-gray-400 text-sm">Date: {bookingData.date}</span>
//         </div>

//         {/* Service Image */}
//         <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <img 
//             src="https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
//             alt="Cleaning Service"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Name:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.name}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Wrench className="w-6 h-6 text-orange-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Service:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.service}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Phone className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Contact:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.contact}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <MapPin className="w-6 h-6 text-red-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Address:</span>
//               <span className="text-gray-900 font-medium ml-2 text-sm">{bookingData.address}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4 md:col-span-2">
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Key className="w-6 h-6 text-yellow-600" />
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-600">OTP:</span>
//               <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold ml-4">
//                 {bookingData.otp}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Rating Section */}
//         <div className="mb-6">
//           <h3 className="font-medium text-gray-900 mb-4">Edit your review</h3>
//           <div className="flex space-x-2 mb-4 justify-center">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 className={`w-8 h-8 cursor-pointer ${
//                   star <= selectedRating
//                     ? 'text-yellow-400 fill-current'
//                     : 'text-gray-300'
//                 }`}
//                 onClick={() => setSelectedRating(star)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button 
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={() => setCurrentStep('completed-details')}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );

//   const renderCompletedDetails = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       {/* Header */}
//       <div className="border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center space-x-3">
//           <button 
//             onClick={() => setCurrentStep('bookings')}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
//           >
//             <ChevronLeft className="w-5 h-5" />
//             <span>Back</span>
//           </button>
//           <h2 className="text-xl font-semibold text-gray-900 ml-4">Booking Details</h2>
//         </div>
//       </div>

//       <div className="p-6">
//         {/* Status */}
//         <div className="flex items-center justify-between mb-6">
//           <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
//             Completed
//           </span>
//           <span className="text-gray-400 text-sm">Date: {bookingData.date}</span>
//         </div>

//         {/* Service Image */}
//         <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
//           <img 
//             src="https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
//             alt="Cleaning Service"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Name:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.name}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Wrench className="w-6 h-6 text-orange-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Service:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.service}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Phone className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Contact:</span>
//               <span className="text-gray-900 font-medium ml-2">{bookingData.contact}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <MapPin className="w-6 h-6 text-red-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className="text-gray-600">Address:</span>
//               <span className="text-gray-900 font-medium ml-2 text-sm">{bookingData.address}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4 md:col-span-2">
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Key className="w-6 h-6 text-yellow-600" />
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-600">OTP:</span>
//               <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold ml-4">
//                 {bookingData.otp}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Rating Section */}
//         <div className="mb-6">
//           <h3 className="font-medium text-gray-900 mb-4">Your review</h3>
//           <div className="flex space-x-2 mb-4 justify-center">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 className="w-8 h-8 text-yellow-400 fill-current"
//               />
//             ))}
//           </div>
//           <p className="text-gray-700 text-center">{reviewText}</p>
//         </div>

//         {/* Complete Work Button */}
//         <button 
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={() => setCurrentStep('congratulations')}
//         >
//           Complete the Work
//         </button>
//       </div>
//     </div>
//   );

//   const renderCongratulations = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
//       <div className="text-center max-w-md mx-auto p-8">
//         <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//           <Check className="w-10 h-10 text-green-500" />
//         </div>
        
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h2>
        
//         <p className="text-gray-600 mb-2">Work completed successfully</p>
        
//         <div className="bg-blue-50 rounded-2xl p-4 mb-8">
//           <p className="text-blue-800 font-medium">
//             You have 1 week work guarantee
//           </p>
//         </div>
        
//         <button 
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={() => setCurrentStep('savings')}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );

//   const renderSavings = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       {/* Header */}
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
//             onClick={() => setCurrentStep('final-rating')}
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderFinalRating = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
//       <div className="text-center max-w-md mx-auto p-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
        
//         <div className="flex justify-center space-x-2 mb-8">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               className={`w-12 h-12 cursor-pointer transition-colors ${
//                 star <= selectedRating
//                   ? 'text-yellow-400 fill-current'
//                   : 'text-gray-300'
//               }`}
//               onClick={() => setSelectedRating(star)}
//             />
//           ))}
//         </div>
        
//         <button 
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={() => setCurrentStep('success')}
//         >
//           Submit Rating
//         </button>
//       </div>
//     </div>
//   );

//   const renderSuccess = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
//       <div className="text-center max-w-md mx-auto p-8">
//         <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//           <Check className="w-10 h-10 text-green-500" />
//         </div>
        
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Successfully!</h2>
        
//         <p className="text-gray-600 mb-8">
//           Thank you for using our service. Your booking has been completed successfully.
//         </p>
        
//         <button 
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={() => {
//             setCurrentStep('bookings');
//             setActiveTab('completed');
//           }}
//         >
//           Back to Bookings
//         </button>
//       </div>
//     </div>
//   );

//   const renderMainContent = () => {
//     if (currentStep !== 'bookings') {
//       switch (currentStep) {
//         case 'upcoming-details':
//           return renderUpcomingDetails();
//         case 'completed-details':
//           return renderCompletedDetails();
//         case 'congratulations':
//           return renderCongratulations();
//         case 'savings':
//           return renderSavings();
//         case 'final-rating':
//           return renderFinalRating();
//         case 'success':
//           return renderSuccess();
//         default:
//           return renderBookingsList();
//       }
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//         {/* Content Header */}
//         <div className="border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center space-x-3">
//             <div className={`w-8 h-8 rounded-lg ${
//               activeTab === 'upcoming' ? 'bg-purple-100' : 
//               activeTab === 'completed' ? 'bg-green-100' : 'bg-red-100'
//             } flex items-center justify-center`}>
//               <Clock className={`w-4 h-4 ${
//                 activeTab === 'upcoming' ? 'text-purple-600' : 
//                 activeTab === 'completed' ? 'text-green-600' : 'text-red-600'
//               }`} />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               {activeTab === 'upcoming' ? 'Upcoming' : 
//                activeTab === 'completed' ? 'Completed' : 'Cancelled'}
//             </h2>
//           </div>
//         </div>

//         {/* Content Body */}
//         <div className="p-6">
//           {renderBookingsList()}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Page Title */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Transactions</h1>
//           <div className="flex items-center space-x-2 text-sm text-gray-500">
//             <Link to={"/technician/dashboard"}>dashboard</Link>
//             <ChevronRight className="w-4 h-4" />
//             <span>My Transactions</span>
//           </div>
//         </div>

//         <div className="flex gap-8">
//           {/* Sidebar - Simplified with only transaction status tabs */}
//           <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <nav className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500 mb-3">Transaction Status</h3>
//               {transactionTabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => {
//                     setActiveTab(tab.id);
//                     setCurrentStep('bookings');
//                   }}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors hover:bg-gray-50 ${
//                     activeTab === tab.id ? `${tab.bgColor} border-l-4 border-current` : ''
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-3 h-3 rounded-full ${
//                       tab.id === 'upcoming' ? 'bg-purple-500' :
//                       tab.id === 'completed' ? 'bg-green-500' : 'bg-red-500'
//                     }`}></div>
//                     <span className={`font-medium ${
//                       activeTab === tab.id ? tab.color : 'text-gray-700'
//                     }`}>
//                       {tab.name}
//                     </span>
//                   </div>
//                   {/* <ChevronRight className={`w-4 h-4 ${
//                     activeTab === tab.id ? tab.color : 'text-gray-400'
//                   }`} /> */}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {renderMainContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TransactionPage;