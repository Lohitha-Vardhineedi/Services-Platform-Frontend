import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BookingData {
  booking: {
    _id: string;
    status: string;
    bookingDate: string;
    totalPrice: number;
    quantity: number;
    servicePrice: number;
  };
  technician: {
    username: string;
    profileImage?: string;
  };
  service: {
    serviceName: string;
    serviceImg: string;
  } | null;
  user?: {
    username: string;
  };
}

interface BookingsListProps {
  bookings: BookingData[];
  activeTab: 'upcoming' | 'completed' | 'cancelled';
  onBookingSelect: (booking: BookingData) => void;
  role: 'user' | 'technician' | null;
}

const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  activeTab,
  onBookingSelect,
  role
}) => {
  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return ['upcomming', 'upcoming', 'accepted', 'started'].includes(
        booking.booking.status.toLowerCase()
      );
    } else if (activeTab === 'completed') {
      return booking.booking.status.toLowerCase() === 'completed';
    } else if (activeTab === 'cancelled') {
      return ['cancelled', 'declined'].includes(
        booking.booking.status.toLowerCase()
      );
    }
    return false;
  });

    const sortedBookings = activeTab === 'completed' 
    ? [...filteredBookings].sort((a, b) => new Date(b.booking.bookingDate) - new Date(a.booking.bookingDate))
    : filteredBookings;
  
  // If no bookings found
  if (sortedBookings?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-lg ${
              activeTab === 'upcoming'
                ? 'bg-purple-100'
                : activeTab === 'completed'
                ? 'bg-green-100'
                : 'bg-red-100'
            } flex items-center justify-center`}
          >
            <ChevronRight
              className={`w-4 h-4 ${
                activeTab === 'upcoming'
                  ? 'text-purple-600'
                  : activeTab === 'completed'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === 'upcoming'
              ? 'Upcoming'
              : activeTab === 'completed'
              ? 'Completed'
              : 'Cancelled'}
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <p className="text-gray-500">No {activeTab} bookings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
        <div
          className={`w-8 h-8 rounded-lg ${
            activeTab === 'upcoming'
              ? 'bg-purple-100'
              : activeTab === 'completed'
              ? 'bg-green-100'
              : 'bg-red-100'
          } flex items-center justify-center`}
        >
          <ChevronRight
            className={`w-4 h-4 ${
              activeTab === 'upcoming'
                ? 'text-purple-600'
                : activeTab === 'completed'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === 'upcoming'
            ? 'Upcoming'
            : activeTab === 'completed'
            ? 'Completed'
            : 'Cancelled'}
        </h2>
      </div>

      {/* Bookings list */}
      <div className="p-6 space-y-4">
        {sortedBookings?.map((bookingData) => {
          const isCancelled = ['cancelled', 'declined'].includes(
            bookingData.booking.status.toLowerCase()
          );

          return (
            <div
              key={bookingData.booking._id}
              className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-colors ${
                isCancelled
                  ? 'cursor-not-allowed opacity-80'
                  : 'cursor-pointer hover:bg-gray-100'
              }`}
              onClick={() => {
                if (!isCancelled) {
                  onBookingSelect(bookingData);
                }
              }}
            >
              <div className="flex items-center space-x-4">
                {/* Service / Technician image */}
                <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={
                      bookingData.service?.serviceImg ||
                      bookingData.technician?.profileImage 
                    }
                    alt={bookingData.service?.serviceName || 'Service'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Booking details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {bookingData.service?.serviceName ||
                      'Service not specified'}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {role === 'user' ? 'Technician Name : ' : 'User Name : '}
                    <span className="text-gray-900">
                      {role === 'user'
                        ? bookingData.technician?.username
                        : bookingData?.user?.username}
                    </span>
                  </p>

                  {/* Status & Date */}
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activeTab === 'upcoming'
                          ? 'bg-purple-100 text-purple-600'
                          : activeTab === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {bookingData.booking.status.charAt(0).toUpperCase() +
                        bookingData.booking.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(
                        bookingData.booking.bookingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Price & Quantity */}
                  <div className="mt-2 text-sm text-gray-700">
                    ₹{' '}
                    <span className="text-blue-500">
                      {bookingData.booking.totalPrice.toFixed(2)}
                    </span>{' '}
                    • {bookingData.booking.quantity}{' '}
                    {bookingData.booking.quantity > 1
                      ? 'services'
                      : 'service'}
                  </div>
                </div>

                {/* Arrow only if clickable */}
                {!isCancelled && (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsList;


// import React from 'react';
// import { ChevronRight } from 'lucide-react';

// interface BookingData {
//   booking: {
//     _id: string;
//     status: string;
//     bookingDate: string;
//     totalPrice: number;
//     quantity: number;
//     servicePrice: number;
//   };
//   technician: {
//     username: string;
//     profileImage?: string;
//   };
//   service: {
//     serviceName: string;
//     serviceImg: string;
//   } | null;
// }

// interface BookingsListProps {
//   bookings: BookingData[];
//   activeTab: 'upcoming' | 'completed' | 'cancelled';
//   onBookingSelect: (booking: BookingData) => void;
//   role: 'user' | 'technician' | null;
// }

// const BookingsList: React.FC<BookingsListProps> = ({
//   bookings,
//   activeTab,
//   onBookingSelect,
//   role
// }) => {
//   // In BookingsList component
//   const filteredBookings = bookings.filter(booking => {
//     if (activeTab === 'upcoming') {
//       return ['upcomming', 'upcoming', 'accepted', 'started'].includes(booking.booking.status);
//     } else if (activeTab === 'completed') {
//       return booking.booking.status === 'completed';
//     } else if (activeTab === 'cancelled') {
//       return ['cancelled', 'declined'].includes(booking.booking.status);
//     }
//     return false;
//   });
//   if (filteredBookings?.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shsadow-sm border border-gray-200 min-h-96">
//         <div className="border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
//           <div
//             className={`w-8 h-8 rounded-lg ${activeTab === 'upcoming'
//                 ? 'bg-purple-100'
//                 : activeTab === 'completed'
//                   ? 'bg-green-100'
//                   : 'bg-red-100'
//               } flex items-center justify-center`}
//           >
//             <ChevronRight
//               className={`w-4 h-4 ${activeTab === 'upcoming'
//                   ? 'text-purple-600'
//                   : activeTab === 'completed'
//                     ? 'text-green-600'
//                     : 'text-red-600'
//                 }`}
//             />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             {activeTab === 'upcoming' ? 'Upcoming' : activeTab === 'completed' ? 'Completed' : 'Cancelled'}
//           </h2>
//         </div>
//         <div className="p-6 flex items-center justify-center h-64">
//           <p className="text-gray-500">No {activeTab} bookings found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
//       <div className="border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
//         <div
//           className={`w-8 h-8 rounded-lg ${activeTab === 'upcoming'
//               ? 'bg-purple-100'
//               : activeTab === 'completed'
//                 ? 'bg-green-100'
//                 : 'bg-red-100'
//             } flex items-center justify-center`}
//         >
//           <ChevronRight
//             className={`w-4 h-4 ${activeTab === 'upcoming'
//                 ? 'text-purple-600'
//                 : activeTab === 'completed'
//                   ? 'text-green-600'
//                   : 'text-red-600'
//               }`}
//           />
//         </div>
//         <h2 className="text-xl font-semibold text-gray-900">
//           {activeTab === 'upcoming' ? 'Upcoming' : activeTab === 'completed' ? 'Completed' : 'Cancelled'}
//         </h2>
//       </div>
//       <div className="p-6 space-y-4">
//         {filteredBookings?.map((bookingData) => (
//           <div
//             key={bookingData?.booking._id}
//             className="bg-gray-50 rounded-2xl p-4 cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
//             onClick={() => onBookingSelect(bookingData)}
//           >
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                 <img
//                   src={bookingData.service?.serviceImg || bookingData?.technician?.profileImage }
//                   alt={bookingData.service?.serviceName || 'Service'}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 text-lg truncate">
//                   {bookingData?.service?.serviceName || 'Service not specified'}
//                 </h3>
//                 <p className="text-gray-500 text-sm truncate">


//                   {role === "user" ? "Technician Name : " : "User Name : "}

//                   <span className="text-gray-900">
//                     {role === "user" ? bookingData?.technician?.username : bookingData?.user?.username}
//                   </span>


//                 </p>
//                 <div className="flex items-center justify-between mt-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${activeTab === 'upcoming'
//                         ? 'bg-purple-100 text-purple-600'
//                         : activeTab === 'completed'
//                           ? 'bg-green-100 text-green-600'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                   >
//                     {bookingData.booking.status.charAt(0).toUpperCase() +
//                       bookingData.booking.status.slice(1).toLowerCase()}
//                   </span>
//                   <span className="text-gray-400 text-xs">
//                     {new Date(bookingData.booking.bookingDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-700">
//                   ₹ <span className='text-blue-500'>{bookingData.booking.totalPrice.toFixed(2)}</span> • {bookingData.booking.quantity} {bookingData.booking.quantity > 1 ? 'services' : 'service'}
//                 </div>
//               </div>
//               <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookingsList;