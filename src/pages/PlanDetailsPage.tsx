import { useParams } from 'react-router-dom';
import { plans } from '../data/subscriptionPlans';
import { LucideIcon } from 'lucide-react';

interface PlanFeature {
  text: string;
  included?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  gst: string;
  validity: string;
  icon: LucideIcon;
  color: string;
  features: PlanFeature[];
  fullFeatures: PlanFeature[];
  discount?: string;
  popular?: boolean;
  buttonColor: string;
}

const PlanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const plan = plans.find((p: Plan) => p.id.toString() === id);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-xl font-semibold">
        Plan not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{plan.name}</h1>
          <p className="text-lg text-gray-500">{plan.validity}</p>
        </div>

        {plan.discount && (
          <div className="text-center mb-5">
            <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {plan.discount}
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-3xl font-extrabold text-gray-900">{plan.price}</p>
          {plan.originalPrice && (
            <p className="text-sm text-gray-500 line-through">{plan.originalPrice}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">{plan.gst}</p>
        </div>

        <hr className="my-6 border-gray-200" />

        <h2 className="text-xl font-semibold text-gray-800 mb-4">What's included:</h2>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          {plan.fullFeatures.map((feature, index) => (
            <li key={index} className="leading-relaxed">{feature.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
