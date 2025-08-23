import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

function StatsCard({ title, value, icon, gradient, iconBg }: StatsCardProps) {
  return (
    <div className={`p-6 rounded-2xl border-2 transform hover:scale-105 transition-transform ${gradient}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        <h4 className="font-bold text-lg text-gray-800">{title}</h4>
      </div>
      <p className="text-3xl font-bold text-gray-600">{value}</p>
    </div>
  );
}

export default StatsCard;