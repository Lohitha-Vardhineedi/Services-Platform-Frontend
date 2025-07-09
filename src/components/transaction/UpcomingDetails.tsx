import React, { useState, useRef } from 'react';
import { ChevronLeft, User, Wrench, Phone, MapPin, Key } from 'lucide-react';
import OTPModel from './OTPModel';
import SuccessModal from './SuccessModel';

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



interface UpcomingDetailsProps {
    booking: Booking;
    setCurrentStep: (step: string) => void;
    role: 'user' | 'technician' | null;
    setActiveTab: (tab: string) => void;
}

const UpcomingDetails: React.FC<UpcomingDetailsProps> = ({ booking, setCurrentStep, role, setActiveTab }) => {

    const handleCancel = () => {
        // Implement cancellation logic
        setActiveTab('cancelled');
        setCurrentStep('bookings');
    };

    const handleCompleted = () => {
        // Implement completion logic
        setActiveTab('completed');
        setCurrentStep('completed-details');
    };

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
                    <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
                        Upcoming
                    </span>
                    <span className="text-gray-400 text-sm">Date: {booking.date}</span>
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
                            <span className="text-gray-900 font-medium ml-2">{booking.name}</span>
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
                    {role === 'user' && (
                        <div className="flex items-center space-x-4 md:col-span-2">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Key className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-600">OTP:</span>
                                <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold ml-4">
                                    {booking.otp}
                                </span>
                            </div>
                        </div>
                    )}
                    {role === 'technician' && (
                        <OTPModel
                            setCurrentStep={setCurrentStep}
                            setActiveTab={setActiveTab}
                            setShowSuccess={() => {SuccessModal}}
                        />
                    )}
                </div>
                {role === 'user' && (
                    <div className="flex justify-end space-x-4">

                        <button
                            className="py-2 px-4 bg-gray-50 text-red-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="py-2 px-4 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
                            onClick={handleCompleted}
                        >
                            Mark as Completed
                        </button>
                    </div>

                )}
            </div>
        </div >
    );
};

export default UpcomingDetails;