import React, { useEffect, useState } from 'react';
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  BadgeIndianRupee,
  LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlans } from '../api/apiMethods';
// import { plans } from '../data/subscriptionPlans';





// Icon mapping based on string stored in DB
const iconMap: { [key: string]: LucideIcon } = {
  Star,
  Crown,
  Zap,
  Shield,
};

interface PlanFeature {
  name: string;
  included: boolean;
}

interface FullFeature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  gst: number;
  totalPrice: number;
  validity: number;
  validityUnit: string;
  icon: string;
  color: string;
  features: PlanFeature[];
  fullFeatures: FullFeature[];
  discount?: number;
  isPopular?: boolean;
  buttonColor: string;
}

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  // const [plans,setPlans] = useState([])
    const [plans, setPlans] = useState<any[]>([]);

 const fetchPlans = async () => {
      try {
        const response = await getPlans();
        if (response) {
          setPlans(response);
          console.log(response,"==>response");
          
        } 
        // else {
          // setError('Invalid response format');
        // }
      } catch (err: any) {
        // setError(err?.message || 'Failed to fetch categories');
        console.log(err,"==>err");
      }
    };
    useEffect(() => {
      fetchPlans();
    }, []);


  const handleFullDetails = (plan: Plan): void => {
    navigate(`/plans/${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Technician Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
            Choose the right plan to grow your technical service business and reach more customers.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: Plan) => {
            const IconComponent = iconMap[plan.icon] || Star;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
                  ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''} 
                  ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {plan.discount}% OFF
                    </div>
                  </div>
                )}

                <div className="p-8 pb-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>

                    <div className="mt-2">
                      <div className="text-2xl font-extrabold text-gray-900">₹{plan.price}</div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{plan.originalPrice} + ₹{plan.gst} (GST 18%)
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        INCL 18% GST: ₹{plan.totalPrice}
                      </div>
                    </div>

                    <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                      Valid until {plan.validity} {plan.validityUnit}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                        {feature.included ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <X size={16} className="text-red-400" />
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition duration-300 ${plan.buttonColor} text-white shadow-md hover:shadow-lg hover:scale-[1.02]`}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                    </button>
                    <button
                      onClick={() => handleFullDetails(plan)}
                      className="w-full py-2 px-4 text-gray-600 hover:text-blue-600 font-medium transition duration-300"
                    >
                      Full Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
