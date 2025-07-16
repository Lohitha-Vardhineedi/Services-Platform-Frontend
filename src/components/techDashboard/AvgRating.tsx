import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const AvgRatingChart: React.FC = () => {
  const jobStatusData = [
    { name: 'High', value: 40, color: '#10B981' },    // Green
    { name: 'Medium', value: 35, color: '#FACC15' },  // Yellow moved to red place
    { name: 'Low', value: 25, color: '#EF4444' },     // Red moved to yellow place
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const total = jobStatusData.reduce((acc, item) => acc + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-300 px-3 py-2 text-sm rounded shadow-md">
          <p className="font-semibold">{name}</p>
          <p>{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    const total = jobStatusData.reduce((sum, item) => sum + item.value, 0);
    return (
      <ul className="space-y-1 text-sm">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-700 font-medium">{percentage}% {entry.payload.name}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
          </div>
        </div>
      </div>

      <div className="relative h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={jobStatusData}
              cx="40%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {jobStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={<CustomLegend />}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-gray-600">High</p>
          <p className="text-xl font-bold text-green-600">40%</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors cursor-pointer">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-gray-600">Medium</p>
          <p className="text-xl font-bold text-yellow-600">35%</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-gray-600">Low</p>
          <p className="text-xl font-bold text-red-600">25%</p>
        </div>
      </div>
    </div>
  );
};

export default AvgRatingChart;
