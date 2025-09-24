import React, { useEffect, useState } from 'react';
import { Users, Building2, Star, Gift, UserPlus, Phone, UserCheck2, User2Icon, Users2, UsersRound, UsersIcon } from 'lucide-react';

interface EarningCardProps {
  type: string;
  amount: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  iconBg: string;
  isVisible?: boolean;
}

function EarningCard({ 
  type, 
  amount, 
  description, 
  icon, 
  gradient, 
  border, 
  iconBg,
  isVisible = false 
}: EarningCardProps) {
  return (
    <div className={`transform transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-8 scale-95'
    }`}>
      <div className={`bg-gradient-to-br ${gradient} ${border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
        <div className="flex items-center mb-4">
          <div className={`${iconBg} rounded-full p-3 mr-4 shadow-md`}>
            {icon}
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-1">{type}</h4>
            <p className="text-3xl font-extrabold text-gray-900">{amount}</p>
          </div>
        </div>
        <p className="text-gray-700 text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface InstructionCardProps {
  title: string;
  steps: string[];
  icon: React.ReactNode;
  isVisible?: boolean;
}

function InstructionCard({ title, steps, icon, isVisible = false }: InstructionCardProps) {
  return (
    <div className={`transform transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-8 scale-95'
    }`}>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          {icon}
          <h4 className="text-2xl font-bold text-gray-800 ml-3">{title}</h4>
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-base mr-4 flex-shrink-0 shadow-md">
                {index + 1}
              </div>
              <p className="text-gray-700 text-base leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferralMain() {
  const [visibleCards, setVisibleCards] = useState({
    technician: false,
    franchise: false,
    user: false,
    howItWorks: false
  });

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: ''
  });

  useEffect(() => {
    // Start showing cards sequentially after component mounts
    const delays = [500, 1200, 1900, 2600]; // Delays in milliseconds
    const cardKeys = ['technician', 'franchise', 'user', 'howItWorks'] as const;
    
    cardKeys.forEach((key, index) => {
      setTimeout(() => {
        setVisibleCards(prev => ({
          ...prev,
          [key]: true
        }));
      }, delays[index]);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Form submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-5">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Gift className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Start Earning with Referrals!
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Earning rewards by referring technicians, franchises and users to our platform.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Referral Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Technician Referral */}
            <EarningCard
              type="Technician Referral"
              amount="₹200"
              description="Earn when they complete their first subscription payment"
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="from-blue-100 to-blue-400"
              border="border-blue-200"
              iconBg="bg-blue-600"
              isVisible={visibleCards.technician}
            />

            {/* Franchise Referral */}
            <EarningCard
              type="Franchise Referral"
              amount="₹50"
              description="Earn when they complete their first subscription payment"
              icon={<UsersIcon className="w-8 h-8 text-white" />}
              gradient="from-purple-100 to-purple-400"
              border="border-purple-200"
              iconBg="bg-purple-600"
              isVisible={visibleCards.franchise}
            />

            {/* User Referral */}
            <EarningCard
              type="User Referral"
              amount="₹10"
              description="Earn when they complete their first service booking"
              icon={<UsersIcon className="w-8 h-8 text-white" />}
              gradient="from-green-100 to-green-400"
              border="border-green-200"
              iconBg="bg-green-600"
              isVisible={visibleCards.user}
            />

            {/* How it Works */}
            <InstructionCard
              title="How it Works"
              steps={[
                'Fill out the registration form with your bank details.',
                'Receive your unique referral code instantly.',
                'Share your code and earn on every successful referral.',
              ]}
              icon={<Star className="w-6 h-6 text-blue-500" />}
              isVisible={visibleCards.howItWorks}
            />
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              {/* Get Started Now Form with Blue Color */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="bg-white rounded-2xl p-6 m-1">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
                      <Phone className="text-white" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-2">
                      Get Started Now
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fill the form to apply
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Tell us about your interest..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      CONTACT US
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralMain;




























// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Building2, Star, IndianRupee, Gift } from 'lucide-react';
// import EarningCard from './EarningCard';
// import InstructionCard from './IntructionCard';
// import StatsCard from './StatsCard';
// import ShareButton from './ShareButton';
// import { User, ReferralData } from './types';

// function ReferralMain() {
//   const [referralData, setReferralData] = useState<ReferralData | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Simulate fetching data
//     setIsLoading(true);
//     try {
//       // Mock API call
//       setTimeout(() => {
//         setUser({
//           id: 'user-1',
//           username: 'john_doe',
//           role: 'user',
//           phoneNumber: '1234567890',
//           areaName: 'Downtown',
//           buildingName: 'Building A',
//           city: 'Metropolis',
//           state: 'NY',
//           pincode: '123456',
//           token: 'abc123',
//         });
//         setReferralData({
//           id: 'referral-1',
//           username: 'john_doe',
//           bankDetails: {
//             accountNumber: '1234567890',
//             ifscCode: 'IFSC1234',
//             bankName: 'Example Bank',
//             accountHolderName: 'John Doe',
//           },
//           referralCode: 'REF123456',
//           isActive: true,
//           totalEarnings: 1000,
//           referralCount: {
//             technicians: 5,
//             franchises: 2,
//           },
//           createdAt: '2023-01-01T00:00:00Z',
//         });
//         setIsLoading(false);
//       }, 1000);
//     } catch (err) {
//       setError('Failed to load referral data');
//       setIsLoading(false);
//     }
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
//           <p>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen max-w-7xl mx-auto bg-slate-100 py-4 sm:py-6 lg:py-8">
//       <div className="max-w-5xl mx-auto">
//           {/* // Welcome View */}
//           <div className="animate-fade-in">
//             <div className="text-center mb-12">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//                 <Gift className="w-14 h-14 text-white" />
//               </div>
//               <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
//                 Start Earning with Referrals!
//               </h3>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Join thousands of users earning rewards by referring technicians and franchises to our platform.
//               </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 mb-12">
//               <EarningCard
//                 type="Technician Referral"
//                 amount="₹250"
//                 description="Earn when they complete their first subscription payment"
//                 icon={<Users className="w-10 h-10 text-white" />}
//                 gradient="from-green-200 to-emerald-300"
//                 border="border-green-200"
//                 iconBg="bg-green-600"
//               />
//               <EarningCard
//                 type="Franchise Referral"
//                 amount="₹100"
//                 description="Earn when they complete their first subscription payment"
//                 icon={<Building2 className="w-10 h-10 text-white" />}
//                 gradient="from-purple-200 to-violet-300"
//                 border="border-purple-200"
//                 iconBg="bg-purple-600"
//               />
//             </div>
//             <InstructionCard
//               title="How it Works"
//               steps={[
//                 'Fill out the registration form with your bank details.',
//                 'Receive your unique referral code instantly.',
//                 'Share your code and earn on every successful referral.',
//               ]}
//               icon={<Star className="w-7 h-7 text-yellow-500" />}
//             />
//             <div className="text-center mt-10">
//               <Link
//                 to="/referrals/form"
//                 className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 Become a Referral Partner
//               </Link>
//             </div>
//           </div>
//       </div>
//     </div>
//   );
// }

// export default ReferralMain;
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