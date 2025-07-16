import React from 'react';

const MonthlyEarningsChart: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', earnings: 100, jobs: 18 },
    { month: 'Feb', earnings: 200, jobs: 42 },
    { month: 'Mar', earnings: 90, jobs: 55 },
    { month: 'Apr', earnings: 80, jobs: 29 },
    { month: 'May', earnings: 60, jobs: 68 },
    { month: 'Jun', earnings: 40, jobs: 47 },
    { month: 'Jul', earnings: 180, jobs: 78 },
    { month: 'Aug', earnings: 190, jobs: 36 },
    { month: 'Sep', earnings: 130, jobs: 62 },
    { month: 'Oct', earnings: 80, jobs: 56 },
    { month: 'Nov', earnings: 150, jobs: 72 },
    { month: 'Dec', earnings: 140, jobs: 50 },
  ];

  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Monthly Earnings</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>2024</span>
        </div>
      </div>

      <div className="h-80 mb-6 bg-white border border-gray-200 rounded-lg p-4">
        {/* Grid lines */}
        <div className="relative h-full">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div 
                key={i} 
                className="absolute w-full border-t border-gray-200" 
                style={{ top: `${i * 10}%` }}
              />
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
            <span>200</span>
            <span>180</span>
            <span>160</span>
            <span>140</span>
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          
          {/* Bars */}
          <div className="flex items-end justify-between h-full px-4 pt-4">
            {monthlyData.map((data, index) => {
              const heightPercentage = (data.earnings / maxEarnings) * 100;
              
              return (
                <div key={data.month} className="flex flex-col items-center flex-1 group/bar">
                  <div className="relative w-full max-w-6 mb-2">
                    <div
                      className="bg-blue-500 transition-all duration-1000 ease-out cursor-pointer hover:bg-blue-600 relative"
                      style={{ 
                        height: `${heightPercentage}%`, 
                        minHeight: '4px',
                        transitionDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        <div className="text-center">
                          <div className="font-semibold">{data.earnings}</div>
                          <div className="text-gray-300">{data.jobs} jobs</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-medium text-gray-600 mt-1">
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group/card">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-600 group-hover/card:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
          <p className="text-xl font-bold text-gray-800 group-hover/card:text-blue-600 transition-colors">1,530</p>
          <p className="text-xs text-green-600 font-medium">↗ +24% from last period</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group/card">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-600 group-hover/card:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm text-gray-600">Avg per Month</p>
          </div>
          <p className="text-xl font-bold text-gray-800 group-hover/card:text-green-600 transition-colors">127.5</p>
          <p className="text-xs text-blue-600 font-medium">Target: 150</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEarningsChart;

// import React, { useState, useEffect } from 'react';
// import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

// const MonthlyEarningsChart: React.FC = () => {
//   const [animationComplete, setAnimationComplete] = useState(false);
//   const [hoveredBar, setHoveredBar] = useState<number | null>(null);

//   const monthlyData = [
//     { month: 'Jan', earnings: 8000, jobs: 25 },
//     { month: 'Feb', earnings: 15000, jobs: 42 },
//     { month: 'Mar', earnings: 22000, jobs: 58 },
//     { month: 'Apr', earnings: 12000, jobs: 35 },
//     { month: 'May', earnings: 28000, jobs: 72 },
//     { month: 'Jun', earnings: 18000, jobs: 48 },
//     { month: 'Jul', earnings: 35000, jobs: 85 },
//     { month: 'Aug', earnings: 9000, jobs: 28 },
//     { month: 'Sep', earnings: 31000, jobs: 78 },
//     { month: 'Oct', earnings: 25000, jobs: 65 },
//   ];

//   const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

//   useEffect(() => {
//     const timer = setTimeout(() => setAnimationComplete(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
//             <TrendingUp className="w-5 h-5 text-blue-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Monthly Earnings</h3>
//             <p className="text-sm text-gray-500">Last 10 months performance</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Calendar className="w-4 h-4" />
//           <span>2024</span>
//         </div>
//       </div>

//       <div className="relative h-64 mb-6">
//         <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
//           {monthlyData.map((data, index) => {
//             const heightPercentage = (data.earnings / maxEarnings) * 100;
//             const height = animationComplete ? heightPercentage : 0;
//             const isHovered = hoveredBar === index;
            
//             return (
//               <div key={data.month} className="flex flex-col items-center flex-1 group/bar">
//                 <div className="relative w-full max-w-8">
//                   <div
//                     className={`bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out cursor-pointer transform hover:scale-105 ${
//                       isHovered ? 'from-blue-700 to-blue-500 shadow-lg' : ''
//                     }`}
//                     style={{ 
//                       height: `${height}%`, 
//                       minHeight: height > 0 ? '8px' : '0px',
//                       transitionDelay: `${index * 100}ms`
//                     }}
//                     onMouseEnter={() => setHoveredBar(index)}
//                     onMouseLeave={() => setHoveredBar(null)}
//                   >
//                     {isHovered && (
//                       <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs transition-all duration-300">
//                         <div className="text-center">
//                           <div className="font-semibold">₹{data.earnings.toLocaleString()}</div>
//                           <div className="text-gray-300">{data.jobs} jobs</div>
//                         </div>
//                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="mt-2 text-xs font-medium text-gray-600 transition-colors group-hover/bar:text-blue-600">
//                   {data.month}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
        
//         <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-12">
//           {[1, 0.75, 0.5, 0.25, 0].map((multiplier, index) => (
//             <span 
//               key={index}
//               className={`transition-all duration-500 ${animationComplete ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
//               style={{ transitionDelay: `${index * 50}ms` }}
//             >
//               ₹{(maxEarnings * multiplier / 1000).toFixed(0)}k
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group/card">
//           <div className="flex items-center gap-2 mb-2">
//             <DollarSign className="w-4 h-4 text-blue-600 group-hover/card:animate-spin" />
//             <p className="text-sm text-gray-600">Total Earnings</p>
//           </div>
//           <p className="text-xl font-bold text-gray-800 group-hover/card:text-blue-600 transition-colors">₹2,61,000</p>
//           <p className="text-xs text-green-600 font-medium">↗ +18% from last period</p>
//         </div>
        
//         <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group/card">
//           <div className="flex items-center gap-2 mb-2">
//             <TrendingUp className="w-4 h-4 text-green-600 group-hover/card:animate-bounce" />
//             <p className="text-sm text-gray-600">Avg per Month</p>
//           </div>
//           <p className="text-xl font-bold text-gray-800 group-hover/card:text-green-600 transition-colors">₹26,100</p>
//           <p className="text-xs text-blue-600 font-medium">Target: ₹30,000</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyEarningsChart;