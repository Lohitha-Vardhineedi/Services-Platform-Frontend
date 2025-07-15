import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const MonthlyEarningsChart: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const monthlyData = [
    { month: 'Jan', earnings: 8000, jobs: 25 },
    { month: 'Feb', earnings: 15000, jobs: 42 },
    { month: 'Mar', earnings: 22000, jobs: 58 },
    { month: 'Apr', earnings: 12000, jobs: 35 },
    { month: 'May', earnings: 28000, jobs: 72 },
    { month: 'Jun', earnings: 18000, jobs: 48 },
    { month: 'Jul', earnings: 35000, jobs: 85 },
    { month: 'Aug', earnings: 9000, jobs: 28 },
    { month: 'Sep', earnings: 31000, jobs: 78 },
    { month: 'Oct', earnings: 25000, jobs: 65 },
  ];

  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Monthly Earnings</h3>
            <p className="text-sm text-gray-500">Last 10 months performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>2024</span>
        </div>
      </div>

      <div className="relative h-64 mb-6">
        <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
          {monthlyData.map((data, index) => {
            const heightPercentage = (data.earnings / maxEarnings) * 100;
            const height = animationComplete ? heightPercentage : 0;
            const isHovered = hoveredBar === index;
            
            return (
              <div key={data.month} className="flex flex-col items-center flex-1 group/bar">
                <div className="relative w-full max-w-8">
                  <div
                    className={`bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out cursor-pointer transform hover:scale-105 ${
                      isHovered ? 'from-blue-700 to-blue-500 shadow-lg' : ''
                    }`}
                    style={{ 
                      height: `${height}%`, 
                      minHeight: height > 0 ? '8px' : '0px',
                      transitionDelay: `${index * 100}ms`
                    }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {isHovered && (
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs transition-all duration-300">
                        <div className="text-center">
                          <div className="font-semibold">₹{data.earnings.toLocaleString()}</div>
                          <div className="text-gray-300">{data.jobs} jobs</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs font-medium text-gray-600 transition-colors group-hover/bar:text-blue-600">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-12">
          {[1, 0.75, 0.5, 0.25, 0].map((multiplier, index) => (
            <span 
              key={index}
              className={`transition-all duration-500 ${animationComplete ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              ₹{(maxEarnings * multiplier / 1000).toFixed(0)}k
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group/card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600 group-hover/card:animate-spin" />
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
          <p className="text-xl font-bold text-gray-800 group-hover/card:text-blue-600 transition-colors">₹2,61,000</p>
          <p className="text-xs text-green-600 font-medium">↗ +18% from last period</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group/card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 group-hover/card:animate-bounce" />
            <p className="text-sm text-gray-600">Avg per Month</p>
          </div>
          <p className="text-xl font-bold text-gray-800 group-hover/card:text-green-600 transition-colors">₹26,100</p>
          <p className="text-xs text-blue-600 font-medium">Target: ₹30,000</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEarningsChart;