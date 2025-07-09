import React from 'react';
import { ChevronLeft, User, Wrench, Phone, MapPin } from 'lucide-react';

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

interface CompletedDetailsProps {
  booking: Booking;
  setCurrentStep: (step: string) => void;
  reviewText: string;
  selectedRating: number;
  role: 'user' | 'technician' | null;
}

const CompletedDetails: React.FC<CompletedDetailsProps> = ({
  booking,
  setCurrentStep,
  reviewText,
  selectedRating,
  role,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentStep('bookings')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4">Booking Details</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
            Completed
          </span>
          <span className="text-gray-1
00 text-sm">Date: {booking.date}</span>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
          <img
            src={booking.image}
            alt={booking.service}
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
              <span className="text-gray-900 font-medium ml-2">{booking.floor}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Service:</span>
              <span className="text-gray-900 font-medium ml-2">{booking.service}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Contact:</span>
              <span className="text-gray-900 font-medium ml-2">{booking.contact}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-900 font-medium ml-2 text-sm">{booking.address}</span>
            </div>
          </div>
          {role === 'technician' && (
            <div className="flex items-center space-x-4 md:col-span-2">
              <span className="text-gray-600">Payment Amount:</span>
              <span className="text-gray-900 font-medium ml-2">₹236</span>
            </div>
          )}
        </div>
        {role === 'user' && (
          <button
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
            onClick={() => setCurrentStep('savings')}
          >
            View Payment Details
          </button>
        )}
        {role === 'technician' && (
          <button
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
            onClick={() => setCurrentStep('savings')}
          >
            View Payment History
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletedDetails;