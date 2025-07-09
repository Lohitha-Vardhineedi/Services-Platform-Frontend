import React from 'react';
import { User, Wrench, Phone, MapPin, XCircle } from 'lucide-react';

interface CancelledBooking {
  id: string;
  name: string;
  service: string;
  contact: string;
  address: string;
  date: string;
  image: string;
}

interface CancelledCardProps {
  booking: CancelledBooking;
}

const CancelledCard: React.FC<CancelledCardProps> = ({ booking }) => {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Date: {booking.date}</span>
        <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          Cancelled
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <User className="text-blue-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">{booking.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Wrench className="text-orange-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">{booking.service}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="text-green-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">{booking.contact}</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="text-red-500 w-5 h-5" />
          <span className="text-gray-700 text-sm">{booking.address}</span>
        </div>
      </div>
    </div>
  );
};

export default CancelledCard;
