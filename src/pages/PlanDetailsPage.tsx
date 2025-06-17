import React from 'react';
import { useParams } from 'react-router-dom';
import { plans } from '../data/subscriptionPlans';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  gst: string;
  validity: string;
  features: PlanFeature[];
}

interface PlanDetailsProps {
  plan?: Plan;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ plan }) => {
  const { id } = useParams();
  const selectedPlan = plan || plans.find((p) => p.id === id);

  if (!selectedPlan) {
    return <div className="p-4 text-red-500">Plan not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{selectedPlan.name}</h1>
      <div className="mb-4">
        <p className="text-xl font-semibold text-gray-700">Price: {selectedPlan.price}</p>
        {selectedPlan.originalPrice && (
          <p className="text-sm text-gray-500 line-through">Original: {selectedPlan.originalPrice}</p>
        )}
        <p className="text-md text-gray-600">{selectedPlan.gst}</p>
        <p className="text-sm mt-1 font-medium bg-blue-50 inline-block px-3 py-1 rounded-full text-blue-700">
          Validity: {selectedPlan.validity}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2 text-gray-800">Plan Features:</h2>
      <ul className="list-disc ml-6 space-y-2">
        {selectedPlan.features.map((f, idx) => (
          <li
            key={idx}
            className={`text-base ${
              f.included ? 'text-green-600' : 'text-gray-400 line-through'
            }`}
          >
            {f.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanDetails;
