import React from 'react';
import { ChevronLeft, User, Wrench, Phone, MapPin, Key } from 'lucide-react';

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

interface CompletedDetailsProps {
  booking: {
    booking: BookingData;
    technician: Technician;
    user: User;
    service: Service;
  };
  setCurrentStep: (step: string) => void;
  role: 'user' | 'technician' | null;
}

const CompletedDetails: React.FC<CompletedDetailsProps> = ({
  booking,
  setCurrentStep,
  role,
}) => {
  const { booking: bookingData, technician, user, service } = booking;

  // Format the addresses
  const formattedTechnicianAddress = `${technician?.buildingName}, ${technician?.areaName}, ${technician?.city}, ${technician?.state} - ${technician?.pincode}`;
  const formattedUserAddress = `${user?.buildingName}, ${user?.areaName}, ${user?.city}, ${user?.state} - ${user?.pincode}`;

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
          <span className="text-gray-400 text-sm">
            Date: {new Date(bookingData.bookingDate).toLocaleDateString()}
          </span>
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 overflow-hidden">
          <img
            src={service.serviceImg}
            alt={service.serviceName}
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
                {role === 'user' ? 'Technician Name:' : 'Customer Name:'}
              </span>
              <span className="text-gray-900 font-medium ml-2">
                {role === 'user' ? technician.username : user.username}
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
              <span className="text-gray-900 font-medium ml-2">{service.serviceName}</span>
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
                {role === 'user' ? technician.phoneNumber : user.phoneNumber}
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
                {role === 'user' ? formattedTechnicianAddress : formattedUserAddress}
              </span>
            </div>
          </div>

          {/* Payment Amount (for technician) */}
          {role === 'technician' && (
            <div className="flex items-center space-x-4 md:col-span-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="text-gray-900 font-medium ml-2">
                  ₹{bookingData.totalPrice}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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