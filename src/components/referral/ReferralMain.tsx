import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Star, IndianRupee, Gift } from 'lucide-react';
import EarningCard from './EarningCard';
import InstructionCard from './IntructionCard';
import StatsCard from './StatsCard';
import ShareButton from './ShareButton';
import { User, ReferralData } from './types';

function ReferralMain() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setUser({
          id: 'user-1',
          username: 'john_doe',
          role: 'user',
          phoneNumber: '1234567890',
          areaName: 'Downtown',
          buildingName: 'Building A',
          city: 'Metropolis',
          state: 'NY',
          pincode: '123456',
          token: 'abc123',
        });
        // setReferralData({
        //   id: 'referral-1',
        //   username: 'john_doe',
        //   bankDetails: {
        //     accountNumber: '1234567890',
        //     ifscCode: 'IFSC1234',
        //     bankName: 'Example Bank',
        //     accountHolderName: 'John Doe',
        //   },
        //   referralCode: 'REF123456',
        //   isActive: true,
        //   totalEarnings: 1000,
        //   referralCount: {
        //     technicians: 5,
        //     franchises: 2,
        //   },
        //   createdAt: '2023-01-01T00:00:00Z',
        // });
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load referral data');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-slate-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-5xl mx-auto">
        {!referralData ? (
          // Welcome View
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gift className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Start Earning with Referrals!
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of users earning rewards by referring technicians and franchises to our platform.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <EarningCard
                type="Technician Referral"
                amount="₹250"
                description="Earn when they complete their first subscription payment"
                icon={<Users className="w-10 h-10 text-white" />}
                gradient="from-green-200 to-emerald-300"
                border="border-green-200"
                iconBg="bg-green-600"
              />
              <EarningCard
                type="Franchise Referral"
                amount="₹100"
                description="Earn when they complete their first subscription payment"
                icon={<Building2 className="w-10 h-10 text-white" />}
                gradient="from-purple-200 to-violet-300"
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
              icon={<Star className="w-7 h-7 text-yellow-500" />}
            />
            <div className="text-center mt-10">
              <Link
                to="/referrals/form"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Become a Referral Partner
              </Link>
            </div>
          </div>
        ) : (
          // Dashboard View
          <div className="animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Your Referral Dashboard
            </h3>
            <p className="text-lg text-gray-600 mb-8">Welcome back, {referralData.username}!</p>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8 shadow-lg">
              <h4 className="text-2xl font-bold mb-4">Your Referral Code</h4>
              <div className="flex items-center gap-6 flex-wrap">
                <code className="bg-white/20 px-6 py-4 rounded-xl text-2xl md:text-3xl font-mono tracking-wider">
                  {referralData.referralCode}
                </code>
                <ShareButton referralCode={referralData.referralCode} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Earnings"
                value={`₹${referralData.totalEarnings.toLocaleString()}`}
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
              icon={<Star className="w-7 h-7 text-yellow-600" />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferralMain;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { User, ReferralData } from './types';
// import { Users, Building2, Star, IndianRupee, Gift } from 'lucide-react';
// import EarningCard from './EarningCard';
// import InstructionCard from './IntructionCard';
// import StatsCard from './StatsCard';
// import ShareButton from './ShareButton';

// function ReferralMain() {
//   const [referralData, setReferralData] = React.useState<ReferralData | null>(null);
//   const [user, setUser] = React.useState<User | null>(null);

//   setUser({
//     id: 'user-1',
//     username: 'john_doe',
//     role: 'user',
//     phoneNumber: '1234567890',
//     areaName: 'Downtown',
//     buildingName: 'Building A',
//     city: 'Metropolis',
//     state: 'NY',
//     pincode: '123456',
//     token: 'abc123',
//   });
//   setReferralData({
//     id: 'referral-1',
//     username: 'john_doe',
//     bankDetails: {
//       accountNumber: '1234567890',
//       ifscCode: 'IFSC1234',
//       bankName: 'Example Bank',
//       accountHolderName: 'John Doe',
//     },
//     referralCode: 'REF123456',
//     isActive: true,
//     totalEarnings: 1000,
//     referralCount: {
//       technicians: 5,
//       franchises: 2,
//     },
//     createdAt: '2023-01-01T00:00:00Z',
//   });

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       {!referralData ? (
//         // Welcome View
//         <div>
//           <div className="text-center mb-10">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Gift className="w-12 h-12 text-white" />
//             </div>
//             <h3 className="text-4xl font-bold text-gray-900 mb-4">Start Earning with Referrals!</h3>
//             <p className="text-xl text-gray-600 mb-8">Join thousands of users earning by referring technicians and franchises.</p>
//           </div>
//           <div className="grid md:grid-cols-2 gap-8 mb-10">
//             <EarningCard
//               type="Technician Referral"
//               amount="₹250"
//               description="Earn when they complete their first subscription payment"
//               icon={<Users className="w-8 h-8 text-white" />}
//               gradient="from-green-50 to-emerald-100"
//               border="border-green-200"
//               iconBg="bg-green-600"
//             />
//             <EarningCard
//               type="Franchise Referral"
//               amount="₹300"
//               description="Earn on every subscription payment they make"
//               icon={<Building2 className="w-8 h-8 text-white" />}
//               gradient="from-purple-50 to-violet-100"
//               border="border-purple-200"
//               iconBg="bg-purple-600"
//             />
//           </div>
//           <InstructionCard
//             title="How it Works"
//             steps={[
//               'Fill out the registration form with your bank details.',
//               'Receive your unique referral code instantly.',
//               'Share your code and earn on every successful referral.',
//             ]}
//             icon={<Star className="w-6 h-6 text-yellow-500" />}
//           />
//           <div className="text-center mt-8">
//             <Link
//               to="/referrals/form"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
//             >
//               Become a Referral Partner
//             </Link>
//           </div>
//         </div>
//       ) : (
//         // Dashboard View
//         <div>
//           <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Referral Dashboard</h3>
//           <p className="text-gray-600 text-lg mb-8">Welcome back, {referralData.username}!</p>
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white mb-8">
//             <h4 className="text-2xl font-bold mb-4">Your Referral Code</h4>
//             <div className="flex items-center gap-6 flex-wrap">
//               <code className="bg-white/20 px-6 py-4 rounded-xl text-3xl font-mono">{referralData.referralCode}</code>
//               <ShareButton referralCode={referralData.referralCode} />
//             </div>
//           </div>
//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <StatsCard
//               title="Total Earnings"
//               value={`₹${referralData.totalEarnings}`}
//               icon={<IndianRupee className="w-6 h-6 text-white" />}
//               gradient="from-green-50 to-emerald-100"
//               iconBg="bg-green-600"
//             />
//             <StatsCard
//               title="Technicians"
//               value={referralData.referralCount.technicians.toString()}
//               icon={<Users className="w-6 h-6 text-white" />}
//               gradient="from-blue-50 to-cyan-100"
//               iconBg="bg-blue-600"
//             />
//             <StatsCard
//               title="Franchises"
//               value={referralData.referralCount.franchises.toString()}
//               icon={<Building2 className="w-6 h-6 text-white" />}
//               gradient="from-purple-50 to-violet-100"
//               iconBg="bg-purple-600"
//             />
//           </div>
//           <InstructionCard
//             title="How to Share Your Referral Code"
//             steps={[
//               `Share your code: ${referralData.referralCode}`,
//               'Ask them to enter it during registration.',
//               'Earn ₹250 for each technician’s first payment and ₹300 for each franchise payment.',
//             ]}
//             icon={<Star className="w-6 h-6 text-yellow-600" />}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReferralMain;