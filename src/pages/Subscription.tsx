import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Crown, Zap, BadgeIndianRupee } from 'lucide-react';
import { plans } from '../utils/jsonData.js';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleFullDetails = (plan) => {
    navigate(`/plans/${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Technician Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan to grow your technical service business and connect with more customers
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border ${
                  plan.popular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {plan.discount}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-800">{plan.price}</div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">{plan.gst}</div>
                    </div>

                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      {plan.validity}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <BadgeIndianRupee className="text-green-600" size={12} />
                        </div>
                        <span className="text-sm text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${plan.buttonColor} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                    >
                      CHOOSE PLAN
                    </button>
                    <button
                      onClick={() => handleFullDetails(plan)}
                      className="w-full py-2 px-4 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
                    >
                      Full Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BadgeIndianRupee className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No Commission</h3>
              <p className="text-gray-600 text-sm">Keep 100% of your earnings with our commission-free model</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Quality Leads</h3>
              <p className="text-gray-600 text-sm">Get verified customer leads in your service area</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Professional Growth</h3>
              <p className="text-gray-600 text-sm">Build your reputation and grow your business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;