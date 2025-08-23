import React from 'react';
import { Link } from 'react-router-dom';
import { User, ReferralData } from './types';
import { Users, Building2, Star, IndianRupee, Gift } from 'lucide-react';
import EarningCard from './EarningCard';
import InstructionCard from './IntructionCard';
import StatsCard from './StatsCard';
import ShareButton from './ShareButton';

interface ReferralMainProps {
  user: User;
  referralData: ReferralData | null;
}

function ReferralMain({ user, referralData }: ReferralMainProps) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {!referralData ? (
        // Welcome View
        <div>
          <div className="text-center mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Start Earning with Referrals!</h3>
            <p className="text-xl text-gray-600 mb-8">Join thousands of users earning by referring technicians and franchises.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <EarningCard
              type="Technician Referral"
              amount="₹250"
              description="Earn when they complete their first subscription payment"
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="from-green-50 to-emerald-100"
              border="border-green-200"
              iconBg="bg-green-600"
            />
            <EarningCard
              type="Franchise Referral"
              amount="₹300"
              description="Earn on every subscription payment they make"
              icon={<Building2 className="w-8 h-8 text-white" />}
              gradient="from-purple-50 to-violet-100"
              border="border-purple-200"
              iconBg="bg-purple-600"
            />
          </div>
          <InstructionCard
            title="How it Works"
            steps={[
              'Fill out the registration form with your bank details.',
              'Receive your unique referral code instantly.',
              'Share your code and earn on every successful referral.',
            ]}
            icon={<Star className="w-6 h-6 text-yellow-500" />}
          />
          <div className="text-center mt-8">
            <Link
              to="/referrals/form"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Become a Referral Partner
            </Link>
          </div>
        </div>
      ) : (
        // Dashboard View
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Referral Dashboard</h3>
          <p className="text-gray-600 text-lg mb-8">Welcome back, {referralData.username}!</p>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8">
            <h4 className="text-2xl font-bold mb-4">Your Referral Code</h4>
            <div className="flex items-center gap-6 flex-wrap">
              <code className="bg-white/20 px-6 py-4 rounded-xl text-3xl font-mono">{referralData.referralCode}</code>
              <ShareButton referralCode={referralData.referralCode} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Earnings"
              value={`₹${referralData.totalEarnings}`}
              icon={<IndianRupee className="w-6 h-6 text-white" />}
              gradient="from-green-50 to-emerald-100"
              iconBg="bg-green-600"
            />
            <StatsCard
              title="Technicians"
              value={referralData.referralCount.technicians.toString()}
              icon={<Users className="w-6 h-6 text-white" />}
              gradient="from-blue-50 to-cyan-100"
              iconBg="bg-blue-600"
            />
            <StatsCard
              title="Franchises"
              value={referralData.referralCount.franchises.toString()}
              icon={<Building2 className="w-6 h-6 text-white" />}
              gradient="from-purple-50 to-violet-100"
              iconBg="bg-purple-600"
            />
          </div>
          <InstructionCard
            title="How to Share Your Referral Code"
            steps={[
              `Share your code: ${referralData.referralCode}`,
              'Ask them to enter it during registration.',
              'Earn ₹250 for each technician’s first payment and ₹300 for each franchise payment.',
            ]}
            icon={<Star className="w-6 h-6 text-yellow-600" />}
          />
        </div>
      )}
    </div>
  );
}

export default ReferralMain;