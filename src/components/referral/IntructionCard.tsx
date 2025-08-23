import React from 'react';

interface InstructionCardProps {
  title: string;
  steps: string[];
  icon: React.ReactNode;
}

function InstructionCard({ title, steps, icon }: InstructionCardProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-8 rounded-2xl border border-yellow-200">
      <h4 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-3">{icon}{title}</h4>
      <ul className="space-y-2 text-yellow-700">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="font-bold">•</span> {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstructionCard;