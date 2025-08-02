import React, { useEffect, useState } from 'react';
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  BadgeIndianRupee,
  Cross,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlans } from '../../api/apiMethods';

const iconMap = {
  Star,
  Crown,
  Zap,
  Shield,
};

const TechnicianSubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      if (response) {
        setPlans(response?.data || []);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch categories');
      console.log(err, "==>err");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleFullDetails = (plan) => {
    navigate(`/subscription/${plan._id}`, { state: { plan } });
  };

  const PLAN_CONFIG = {
    "Economy Plan": {
      gradient: "from-blue-500 to-blue-600",
      icon: Zap,
      button: "bg-blue-600 hover:bg-blue-700",
    },
    "Gold Plan": {
      gradient: "from-yellow-400 to-yellow-600",
      icon: Star,
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    "Platinum Plan": {
      gradient: "from-purple-500 to-purple-700",
      icon: Crown,
      button: "bg-purple-600 hover:bg-purple-700",
    },
    "Free Plan": {
      gradient: "from-green-400 to-green-600",
      icon: Shield,
      button: "bg-green-500 hover:bg-green-700",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Technician Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
            Choose the right plan to grow your technical service business and reach more customers.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {plans
          .filter(plan => plan.name === "Free Plan" || plan.name === "Economy Plan")
          .map((plan) => {
            const config = PLAN_CONFIG[plan.name] || {
              gradient: "from-gray-400 to-gray-600",
              icon: Star,
              button: "bg-gray-500 hover:bg-gray-600",
            };
            const IconComponent = config?.icon;

            return (
              <div
                key={plan._id}
                className={`relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
                  ${selectedPlan === plan._id ? 'ring-2 ring-blue-500' : ''} 
                  ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {Number(plan.discount) > 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {plan?.discount}% OFF
                    </div>
                  </div>
                )}

                <div className="p-6 pb-6 flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config?.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{plan?.name}</h3>

                    <div className="mt-2">
                      <div className="text-2xl font-extrabold text-gray-900">₹ {plan?.price}</div>
                      {Number(plan.originalPrice) > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{plan.originalPrice} + (GST 18%)
                        </div>
                      )}
                      {Number(plan.price) > 0 && (
                        <div className="text-sm text-gray-600">
                          ₹{plan.price} + ₹{plan.gst} (GST 18%)
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                      Valid until {plan?.validity === null ? (plan.leads) : (plan.validity)} {plan?.validity === null ? "leads" : "days"}
                    </div>
                  </div>

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

                  <div className="mt-auto space-y-3">

                    <button
                      onClick={() => navigate('/buyPlan', { state: { plan } })}
                      className={`w-full py-3 px-4 rounded-2xl font-semibold transition duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02]
   ${config?.button}`}
                    >
                      {plan?.name === "Free Plan" ? "Free Plan" : "Buy Plan"}
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

export default TechnicianSubscriptionPlans;