import React from 'react';
import { User, Wrench, Phone, MapPin, XCircle } from 'lucide-react';

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
  username: string;
  phoneNumber: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
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

interface CancelledCardProps {
  booking: {
    booking: BookingData;
    technician: Technician;
    service: Service;
    user: User;
  };
  role?: "user" | "technician" | null;
}

const CancelledCard: React.FC<CancelledCardProps> = ({ booking, role }) => {
  // Destructure the nested objects
  const { booking: bookingData, technician, service, user } = booking;

  // Format the addresses
  const formattedTechnicianAddress = `${technician.buildingName}, ${technician.areaName}, ${technician.city}, ${technician.state} - ${technician.pincode}`;
  const formattedUserAddress = `${user.buildingName}, ${user.areaName}, ${user.city}, ${user.state} - ${user.pincode}`;

  return (
    <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Date: {new Date(bookingData.bookingDate).toLocaleDateString()}</span>
        <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          Cancelled
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex items-center space-x-3">
          <User className="text-blue-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">
            {role === "user" ? technician.username : user.username}
          </span>
        </div>
        
        {/* Service */}
        <div className="flex items-center space-x-3">
          <Wrench className="text-orange-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">{service.serviceName}</span>
        </div>
        
        {/* Contact */}
        <div className="flex items-center space-x-3">
          <Phone className="text-green-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">
            {role === "user" ? technician.phoneNumber : user.phoneNumber}
          </span>
        </div>
        
        {/* Address */}
        <div className="flex items-center space-x-3">
          <MapPin className="text-red-500 w-5 h-5" />
          <span className="text-gray-700 text-sm">
            {role === "user" ? formattedTechnicianAddress : formattedUserAddress}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CancelledCard;