import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Users, Gift, CreditCard, Phone, MapPin, Building2, IndianRupee } from 'lucide-react';

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

interface ReferralPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ReferralPanel({ isOpen, onClose }: ReferralPanelProps) {
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
    const storedReferralData = localStorage.getItem(`referral_${parsedUser?.username}`);
    if (storedReferralData) {
      const referralInfo: ReferralData = JSON.parse(storedReferralData);
      setReferralData(referralInfo);
      setCurrentStep('dashboard');
    }
  }, []);

  const isEligibleForReferral = () => {
    if (!user) return false;
    return user.role === 'user';
  };

  const generateReferralCode = (username: string) => {
    const prefix = 'REF';
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-blue-600" />
            Referral Program
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">Please login to access the referral program</p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          ) : !isEligibleForReferral() ? (
            <div className="text-center py-12">
              <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Not Eligible</h3>
              <p className="text-gray-600 mb-2">
                {user.role === 'technician' && "Technicians are not eligible for the referral program."}
                {user.role === 'franchise' && "Franchise partners are not eligible for the referral program."}
                {user.role === 'staff' && "PRNV staff members are not eligible for the referral program."}
              </p>
              <p className="text-sm text-gray-500 mb-6">Only regular users can participate as referral partners.</p>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Welcome Step */}
              {currentStep === 'welcome' && (
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Referral Program</h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Earn money by referring technicians and franchise partners to our platform
                    </p>
                  </div>

                  {/* Earning Structure */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-green-800">Technician Referral</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">₹250 per referral</span>
                        </div>
                        <p className="text-sm text-green-600">Earn when they complete their first subscription payment</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-purple-800">Franchise Referral</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-700">₹300 per payment</span>
                        </div>
                        <p className="text-sm text-purple-600">Earn on every subscription payment they make</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
                    <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                      <li>Fill out the referral partner form</li>
                      <li>Get your unique referral code</li>
                      <li>Share your code with potential technicians and franchises</li>
                      <li>Earn money when they register and make payments</li>
                      <li>Receive payments directly to your bank account</li>
                    </ol>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep('form')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                    >
                      Become a Referral Partner
                    </button>
                  </div>
                </div>
              )}

              {/* Form Step */}
              {currentStep === 'form' && (
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Referral Partner Application</h3>
                    <p className="text-gray-600">Please fill out all required information to become a referral partner</p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Address Information
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({
                              ...formData, 
                              address: {...formData.address, street: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your street address"
                            required
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              value={formData.address.city}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, city: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="City"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <input
                              type="text"
                              value={formData.address.state}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, state: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="State"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              PIN Code *
                            </label>
                            <input
                              type="text"
                              value={formData.address.pincode}
                              onChange={(e) => setFormData({
                                ...formData, 
                                address: {...formData.address, pincode: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="PIN Code"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Bank Details
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.accountHolderName}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Account holder name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.bankName}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, bankName: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bank name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.accountNumber}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Account number"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            IFSC Code *
                          </label>
                          <input
                            type="text"
                            value={formData.bankDetails.ifscCode}
                            onChange={(e) => setFormData({
                              ...formData, 
                              bankDetails: {...formData.bankDetails, ifscCode: e.target.value.toUpperCase()}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="IFSC code"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('welcome')}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Create Referral Account
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Dashboard Step */}
              {currentStep === 'dashboard' && referralData && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Referral Dashboard</h3>
                    <p className="text-gray-600">Welcome back, {referralData.username}! Here's your referral overview.</p>
                  </div>

                  {/* Referral Code Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Your Referral Code</h4>
                        <div className="flex items-center gap-4">
                          <code className="bg-white/20 px-4 py-2 rounded-lg text-xl font-mono tracking-wider">
                            {referralData.referralCode}
                          </code>
                          <button
                            onClick={copyReferralCode}
                            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <Gift className="w-16 h-16 opacity-20" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-800">Total Earnings</h4>
                      </div>
                      <p className="text-2xl font-bold text-green-600">₹{referralData.totalEarnings}</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-blue-800">Technicians Referred</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{referralData.referralCount.technicians}</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-purple-800">Franchises Referred</h4>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{referralData.referralCount.franchises}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3">How to use your referral code:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                      <li>Share your referral code <strong>{referralData.referralCode}</strong> with potential technicians and franchises</li>
                      <li>Ask them to enter your code during their registration process</li>
                      <li>You'll earn ₹250 for each technician's first subscription payment</li>
                      <li>You'll earn ₹300 for each franchise subscription payment (recurring)</li>
                      <li>Earnings will be transferred to your registered bank account</li>
                    </ol>
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

export default ReferralPanel;