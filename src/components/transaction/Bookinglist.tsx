import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  service: string;
  contact: string;
  address: string;
  otp: string;
  date: string;
  provider: string;
  rating: number;
  review: string;
  image: string;
}

interface BookingsListProps {
  bookings: Booking[];
  activeTab: string;
  setCurrentStep: (step: string) => void;
  role: 'user' | 'technician' | null;
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings, activeTab, setCurrentStep, role }) => {
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
          {activeTab === 'upcoming' ? 'Upcoming' : activeTab === 'completed' ? 'Completed' : 'Cancelled'}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-50 rounded-2xl p-4 cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
            onClick={() =>
              setCurrentStep(activeTab === 'upcoming' ? 'upcoming-details' : 'completed-details')
            }
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.image}
                  alt={booking.service}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{booking.service}</h3>
                <p className="text-gray-500 text-sm truncate">{booking.provider}</p>
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
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                  <span className="text-gray-400 text-xs">{booking.date}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;