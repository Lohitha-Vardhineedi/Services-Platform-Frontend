import React, { useEffect, useState } from 'react';
import { Check, X, Star, Crown, Zap, Shield, Eye, EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlans, gettechnicianPlanById } from '../../api/apiMethods'; // Add your API method for current subscription

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("plans", plans )
  console.log("currentSubscription", currentSubscription )
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        

        const plansResponse = await getPlans();
        setPlans(plansResponse?.data || []);
        
        // Fetch current subscription
        const subscriptionResponse = await gettechnicianPlanById(userId);
        if (subscriptionResponse?.result) {
          console.log("subscriptionResponse?.result", subscriptionResponse?.result)
          setCurrentSubscription({
            subscriptionId: subscriptionResponse.result.subscriptionId,
            name: subscriptionResponse.result.subscriptionName,
            startDate: subscriptionResponse.result.startDate,
            endDate: subscriptionResponse.result.endDate
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getPlanConfig = (planName) => {
    const configs = {
      "Economy Plan": { icon: Zap, color: "blue" },
      "Gold Plan": { icon: Star, color: "yellow" },
      "Platinum Plan": { icon: Crown, color: "purple" },
      "Free Plan": { icon: Shield, color: "green" },
      // Add more plans as needed
    };
    return configs[planName] || { icon: Star, color: "gray" };
  };

  if (loading) return <div>Loading...</div>;

 

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Subscription Plan</h1>
        <button 
          onClick={() => navigate('/technician/plans')}
          className="px-3 py-2 border rounded-lg bg-purple-300 hover:bg-purple-400 flex text-purple-800 font-bold"
        >
          <EyeIcon />
         <span className='ms-1.5'> View All Plans</span>
        </button>
      </div>

      {currentSubscription && (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-5">
        <div className={`bg-${getPlanConfig(currentSubscription.name).color}-100 p-3 rounded-full mt-1`}>
          {React.createElement(getPlanConfig(currentSubscription.name).icon, {
            className: `text-${getPlanConfig(currentSubscription.name).color}-600 text-xl`
          })}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{currentSubscription.name}</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-medium">
                {new Date(currentSubscription.startDate).toLocaleDateString()}
              </p>
            </div>
            {currentSubscription?.endDate && (
            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-medium">
                {new Date(currentSubscription.endDate).toLocaleDateString()}
              </p>
            </div>
)}
            {currentSubscription?.ordersCount && (
            <div>
              <p className="text-gray-500">Orders Count</p>
              <p className="font-medium">{currentSubscription.ordersCount}</p>
            </div>
            )}
          </div>
        </div>

      </div>
      <div className="flex flex-col items-end">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          getDaysLeft(currentSubscription.endDate) <= 0 ? 'bg-red-100 text-red-800' :
          getDaysLeft(currentSubscription.endDate) <= 3 ? 'bg-red-100 text-red-800' :
          getDaysLeft(currentSubscription.endDate) <= 7 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {getDaysLeft(currentSubscription.endDate) <= 0 ? 'Expired' : 
           `${getDaysLeft(currentSubscription.endDate)} days left`}
        </span>
        {currentSubscription.leads !== null && (
          <div className="mt-3 text-right">
            <p className="text-gray-500 text-sm">Leads Available</p>
            <p className="font-medium">{currentSubscription.leads}</p>
          </div>
        )}
      </div>
    </div>
    
        <hr/>

        {currentSubscription && plans.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-4">Current Plan Details</h2>
    {plans
      .filter((plan) => plan._id === currentSubscription.subscriptionId)
      .map((plan) => {
        const config = getPlanConfig(plan.name);
        return (
          <div key={plan._id} className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className={`bg-${config.color}-100 text-${config.color}-600 w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                {React.createElement(config.icon, { size: 20 })}
              </div>
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-md font-medium text-gray-600">₹{plan.price}</p>
              </div>
            </div>
            <div className="space-y-2">
              {plan.features?.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  {feature.included ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
                  <span className="text-sm">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
  </div>
)}

  </div>
)}
     
    </div>
  );
};

export default SubscriptionPage;

// import React, { useEffect, useState } from 'react';
// import {
//   Check,
//   X,
//   Star,
//   Crown,
//   Zap,
//   Shield,
//   BadgeIndianRupee,
//   LucideIcon,
//   Cross,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getPlans } from '../../api/apiMethods';

// const iconMap: { [key: string]: LucideIcon } = {
//   Star,
//   Crown,
//   Zap,
//   Shield,
// };

// interface PlanFeature {
//   name: string;
//   included: boolean;
// }

// interface FullFeature {
//   text: string;
// }

// export interface Plan {
//   _id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   gst: number;
//   finalPrice: number;
//   validity: number;
//   validityUnit: string;
//   icon: string;
//   color: string;
//   features: PlanFeature[];
//   fullFeatures: FullFeature[];
//   discount?: number;
//   isPopular?: boolean;
//   buttonColor: string;
// }

// const TechnicianSubscription: React.FC = () => {
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const [plans, setPlans] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPlans = async () => {
//     try {
//       const response = await getPlans();
//       if (response) {
//         setPlans(response?.data);
//       }
//       else {
//       setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//       console.log(err, "==>err");
//     }
//   };
//   useEffect(() => {
//     fetchPlans();
//   }, []);


//   const handleFullDetails = (plan: Plan): void => {
//     navigate(`/subscription/${plan._id}`, { state: { plan } });
//   };

//   interface PlanConfig {
//   gradient: string;       
//   icon: LucideIcon;      
//   button: string;         
// }

// const PLAN_CONFIG: Record<string, PlanConfig> = {
//   "Economy Plan": {
//     gradient: "from-blue-500 to-blue-600",
//     icon: Zap,
//     button: "bg-blue-600 hover:bg-blue-700",
//   },
//   "Gold Plan": {
//     gradient: "from-yellow-400 to-yellow-600",
//     icon: Star,
//     button: "bg-yellow-500 hover:bg-yellow-600",
//   },
//   "Platinum Plan": {
//     gradient: "from-purple-500 to-purple-700",
//     icon: Crown,
//     button: "bg-purple-600 hover:bg-purple-700",
//   },
//   "Free Plan": {
//     gradient: "from-green-400 to-green-600",
//     icon: Shield,
//     button: "bg-green-500 hover:bg-green-700",
//   },
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-14">
//           <h1 className="text-4xl font-extrabold text-gray-800">
//             Technician Subscription Plans
//           </h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
//             Choose the right plan to grow your technical service business and reach more customers.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {plans.map((plan: Plan) => {
//             const config = PLAN_CONFIG[plan.name] || {
//               gradient: "from-gray-400 to-gray-600",
//               icon: Star,
//               button: "bg-gray-500 hover:bg-gray-600",
//             };
//             const IconComponent = config?.icon;

//             return (
//               <div
//                 key={plan._id}
//                 className={`relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
//                   ${selectedPlan === plan._id ? 'ring-2 ring-blue-500' : ''} 
//                   ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
//               >
//                 {plan.isPopular && (
//                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                     <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//                       MOST POPULAR
//                     </div>
//                   </div>
//                 )}

//                 {Number(plan.discount) > 0 && (
//                   <div className="absolute -top-2 -right-2 z-10">
//                     <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
//                       {plan?.discount}% OFF
//                     </div>
//                   </div>
//                 )}

//                 <div className="p-6 pb-6 flex flex-col h-full">
//                   <div className="text-center mb-6">
//                     <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config?.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
//                       <IconComponent className="text-white" size={28} />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-800">{plan?.name}</h3>

//                     <div className="mt-2">
//                       <div className="text-2xl font-extrabold text-gray-900">₹ {plan?.price}</div>
//                       {Number(plan.originalPrice) > 0 && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ₹{plan.originalPrice} + (GST 18%)
//                         </div>
//                       )}
//                       {Number(plan.price) > 0 && (
//                       <div className="text-sm text-gray-600">
//                         ₹{plan.price} +  ₹{plan.gst} (GST 18%)
//                         {/* INCL 18% GST: ₹ {plan.price} */}
//                       </div>
//                       )}
//                     </div>

//                     <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
//                       Valid until {plan.validity} {plan.validityUnit}
//                     </div>
//                   </div>

//                   <ul className="space-y-2 mb-6">
//                     {plan.features.map((feature, index) => (
//                       <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
//                         {feature.included ? (
//                           <Check size={16} className="text-green-500" />
//                         ) : (
//                           <X size={16} className="text-red-400" />
//                         )}
//                         {feature.name}
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="mt-auto space-y-3">
//                     <button
//                       onClick={() => setSelectedPlan(plan?.name)}
//                       className={`w-full py-3 px-4 rounded-2xl font-semibold transition duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02]
//                        ${config?.button}`}
//                     >
//                       {selectedPlan === plan?.name ? 'Selected' : 'Choose Plan'}
//                     </button>
//                     <button
//                       onClick={() => handleFullDetails(plan)}
//                       className="w-full py-2 px-4 text-gray-600 hover:text-blue-600 font-medium transition duration-300"
//                     >
//                       Full Details →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TechnicianSubscription;
