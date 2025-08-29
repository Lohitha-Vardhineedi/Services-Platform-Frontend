import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactElement<LucideIcon>;
  label: string;
  value: string | number;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color = "bg-gray-100" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 ${color} rounded-full text-gray-600 group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors">{label}</p>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {value}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default StatsCard;
// import React from 'react';
// import { DivideIcon as LucideIcon } from 'lucide-react';

// interface StatsCardProps {
//   icon: React.ReactElement<LucideIcon>;
//   label: string;
//   value: string | number;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   color?: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, trend, color = "bg-gray-100" }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 group overflow-hidden relative">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
//       <div className="p-6 relative z-10">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className={`p-3 ${color} rounded-full text-gray-600 group-hover:scale-110 transition-transform duration-300`}>
//               {icon}
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors">{label}</p>
//               <p className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{value}</p>
//             </div>
//           </div>
//           {trend && (
//             <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 group-hover:scale-110 ${
//               trend.isPositive ? 'text-green-600' : 'text-red-600'
//             }`}>
//               <span className="animate-bounce">{trend.isPositive ? '↗' : '↘'}</span>
//               <span>{Math.abs(trend.value)}%</span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
//     </div>
//   );
// };

// export default StatsCard;