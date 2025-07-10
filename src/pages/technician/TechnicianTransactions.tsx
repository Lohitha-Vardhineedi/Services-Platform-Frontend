import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import BookingsList from '../../components/transaction/Bookinglist';
import UpcomingDetails from '../../components/transaction/UpcomingDetails';
import CompletedDetails from '../../components/transaction/CompletedDetails';
import CongratulationsModal from '../../components/transaction/CongratulationsModel';
import Savings from '../../components/transaction/Savings';
import FinalRating from '../../components/transaction/FinalRating';
import SuccessModal from '../../components/transaction/SuccessModel';
import OTPModal from '../../components/transaction/OTPModel';
import TransactionSidebar from '../../components/transaction/TransactionSidebar';

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

const TechnicianTransactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [currentStep, setCurrentStep] = useState<string>('bookings');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('Great service, very professional!');
  const [role, setRole] = useState<'user' | 'technician' | null>(null);

  // Sample booking data
  const bookings: Booking[] = [
    {
      id: '1',
      name: 'Madipally Soujanya',
      service: 'Home Cleaning',
      contact: '8978023927',
      address: '123 Main Street, City Hyderabad',
      otp: '123456',
      date: '2024-06-10',
      provider: 'Uday Kumar',
      rating: 5,
      review: 'Great service, very professional!',
      image: 'https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
    // Add more sample bookings as needed
  ];

  // Transaction status options
  const transactionTabs = [
    { id: 'upcoming', name: 'Upcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'completed', name: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'cancelled', name: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
  ];

  // Get role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'user' | 'technician' | null;
    setRole(storedRole);
  }, []);

  const renderMainContent = () => {
    switch (currentStep) {
      case 'upcoming-details':
        return (
          <UpcomingDetails
            booking={bookings[0]}
            setCurrentStep={setCurrentStep}
            role={role}
            setActiveTab={setActiveTab}
          />
        );
      case 'completed-details':
        return (
          <CompletedDetails
            booking={bookings[0]}
            setCurrentStep={setCurrentStep}
            reviewText={reviewText}
            selectedRating={selectedRating}
            role={role}
          />
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
            bookings={bookings}
            activeTab={activeTab}
            setCurrentStep={setCurrentStep}
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