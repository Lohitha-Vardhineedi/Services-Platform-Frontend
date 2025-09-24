import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Users, Gift, CreditCard, Phone, MapPin, Building2, IndianRupee, Star } from 'lucide-react';

interface User {
  username: string;
  role: 'user' | 'technician' | 'franchise' | 'staff';
}

interface ReferralData {
  id: string;
  username: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  referralCode: string;
  isActive: boolean;
  totalEarnings: number;
  referralCount: {
    technicians: number;
    franchises: number;
  };
  createdAt: string;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'form' | 'dashboard'>('welcome');
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    // Check if user already has referral data
    if (parsedUser) {
      const storedReferralData = localStorage.getItem(`referral_${parsedUser.username}`);
      if (storedReferralData) {
        const referralInfo: ReferralData = JSON.parse(storedReferralData);
        setReferralData(referralInfo);
        setCurrentStep('dashboard');
      }
    }
  }, []);

  const isEligibleForReferral = () => {
    if (!user) return false;
    return user.role === 'user';
  };

  const generateReferralCode = (username: string) => {
    const prefix = 'PRNV';
    const timestamp = Date.now().toString().slice(-6);
    const userCode = username.slice(0, 3).toUpperCase();
    return `${prefix}${userCode}${timestamp}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const referralCode = generateReferralCode(user.username);
    const newReferralData: ReferralData = {
      id: Date.now().toString(),
      username: user.username,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      bankDetails: formData.bankDetails,
      referralCode,
      isActive: true,
      totalEarnings: 0,
      referralCount: {
        technicians: 0,
        franchises: 0
      },
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`referral_${user.username}`, JSON.stringify(newReferralData));
    setReferralData(newReferralData);
    setCurrentStep('dashboard');
  };

  const copyReferralCode = async () => {
    if (referralData?.referralCode) {
      await navigator.clipboard.writeText(referralData.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Gift className="w-8 h-8" />
            PRNV Referral Program
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-12">
              <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
              <p className="text-gray-600 mb-8 text-lg">Please login to access the referral program and start earning!</p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : !isEligibleForReferral() ? (
            <div className="text-center py-12">
              <X className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Not Eligible</h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <p className="text-red-700 text-lg mb-2">
                  {user.role === 'technician' && "Technicians cannot participate in the referral program."}
                  {user.role === 'franchise' && "Franchise partners cannot participate in the referral program."}
                  {user.role === 'staff' && "PRNV staff members cannot participate in the referral program."}
                </p>
                <p className="text-red-600 font-medium">Only regular users can become referral partners.</p>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Welcome Step */}
              {currentStep === 'welcome' && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Gift className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">Start Earning with Referrals!</h3>
                    <p className="text-xl text-gray-600 mb-8">
                      Join thousands of users earning money by referring technicians and franchise partners
                    </p>
                  </div>

                  {/* Earning Cards */}
                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border-2 border-green-200 transform hover:scale-105 transition-transform">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-green-800">Technician Referral</h4>
                          <p className="text-green-600">One-time earning</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <IndianRupee className="w-6 h-6 text-green-600" />
                          <span className="text-2xl font-bold text-green-700">₹250</span>
                        </div>
                        <p className="text-green-600 text-lg">Earn when they complete their first subscription payment</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-2xl border-2 border-purple-200 transform hover:scale-105 transition-transform">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-purple-800">Franchise Referral</h4>
                          <p className="text-purple-600">Recurring earning</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <IndianRupee className="w-6 h-6 text-purple-600" />
                          <span className="text-2xl font-bold text-purple-700">₹300</span>
                        </div>
                        <p className="text-purple-600 text-lg">Earn on every subscription payment they make</p>
                      </div>
                    </div>
                  </div>

                  {/* How it Works */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 mb-10">
                    <h4 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-500" />
                      How it works - Simple as 1-2-3!
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
                        <h5 className="font-semibold text-blue-900 mb-2">Fill Registration Form</h5>
                        <p className="text-blue-700">Complete your profile with contact and bank details</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
                        <h5 className="font-semibold text-blue-900 mb-2">Get Your Code</h5>
                        <p className="text-blue-700">Receive your unique referral code instantly</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
                        <h5 className="font-semibold text-blue-900 mb-2">Start Earning</h5>
                        <p className="text-blue-700">Share your code and earn money on every successful referral</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep('form')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Become a Referral Partner Now!
                    </button>
                  </div>
                </div>
              )}

              {/* Form Step */}
              {currentStep === 'form' && (
                <div className="max-w-3xl mx-auto">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Referral Partner Registration</h3>
                    <p className="text-gray-600 text-lg">Fill out the form below to start your referral journey</p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-600" />
                        Personal Information
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 font-medium"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your phone number"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-green-600" />
                        Address Information
                      </h4>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({
                              ...formData, 
                              address: {...formData.address, street: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your complete street address"
                            required
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={formData.address.city}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, city: e.target.value}
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="City"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={formData.address.state}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, state: e.target.value}
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="State"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              PIN Code *
                            </label>
                            <input
                              type="text"
                              value={formData.address.pincode}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, pincode: e.target.value}
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="PIN Code"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                        Bank Details for Payments
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.accountHolderName}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Account holder name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.bankName}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, bankName: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Bank name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.accountNumber}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Account number"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            IFSC Code *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.ifscCode}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, ifscCode: e.target.value.toUpperCase()}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="IFSC code"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('welcome')}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
                      >
                        Create Referral Account
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Dashboard Step */}
              {currentStep === 'dashboard' && referralData && (
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Referral Dashboard</h3>
                    <p className="text-gray-600 text-lg">Welcome back, {referralData.username}! Track your earnings and referrals.</p>
                  </div>

                  {/* Referral Code Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <Gift className="w-8 h-8" />
                        Your Referral Code
                      </h4>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                          <code className="text-3xl font-mono font-bold tracking-wider">
                            {referralData.referralCode}
                          </code>
                        </div>
                        <button
                          onClick={copyReferralCode}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-4 rounded-xl transition-all flex items-center gap-3 font-medium"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-green-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                          <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 text-lg">Total Earnings</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-600">₹{referralData.totalEarnings}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border-2 border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-blue-800 text-lg">Technicians</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{referralData.referralCount.technicians}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border-2 border-purple-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-purple-800 text-lg">Franchises</h4>
                      </div>
                      <p className="text-3xl font-bold text-purple-600">{referralData.referralCount.franchises}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-8 rounded-2xl border border-yellow-200">
                    <h4 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-600" />
                      How to Share Your Referral Code
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-yellow-800 mb-3">For Technicians (₹250 each):</h5>
                        <ul className="space-y-2 text-yellow-700">
                          <li>• Share your code: <strong>{referralData.referralCode}</strong></li>
                          <li>• Ask them to enter it during registration</li>
                          <li>• You earn ₹250 on their first subscription payment</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-bold text-yellow-800 mb-3">For Franchises (₹300 recurring):</h5>
                        <ul className="space-y-2 text-yellow-700">
                          <li>• Share your code: <strong>{referralData.referralCode}</strong></li>
                          <li>• Ask them to enter it during registration</li>
                          <li>• You earn ₹300 on every subscription payment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReferralModal;