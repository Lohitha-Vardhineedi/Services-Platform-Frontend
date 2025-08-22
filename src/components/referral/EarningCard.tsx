import React from 'react';

interface EarningCardProps {
  type: string;
  amount: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  iconBg: string;
}

function EarningCard({ type, amount, description, icon, gradient, border, iconBg }: EarningCardProps) {
  return (
    <div className={`p-8 rounded-2xl border-2 transform hover:scale-105 transition-transform ${gradient} ${border}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        <div>
          <h4 className="text-2xl font-bold text-gray-800">{type}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gray-700">{amount}</span>
      </div>
    </div>
  );
}

export default EarningCard;