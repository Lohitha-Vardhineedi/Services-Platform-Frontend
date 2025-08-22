export interface User {
  id: string;
  username: string;
  role: 'user' | 'technician' | 'franchise' | 'staff';
  phoneNumber: string;
  areaName: string;
  buildingName: string;
  city: string;
  state: string;
  pincode: string;
  token: string;
}

export interface ReferralData {
  id: string;
  username: string;
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