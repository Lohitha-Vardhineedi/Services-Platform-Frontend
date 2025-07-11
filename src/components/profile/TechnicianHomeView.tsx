import React from 'react';
import { Wrench, CheckCircle, DollarSign, Star, Clock } from 'lucide-react';

// No props or API data needed
const TechnicianHomeView: React.FC = () => {
  // Hardcoded values for demonstration
  const serviceCount = 12;
  const completedJobs = 10;
  const totalServicePrice = 15000;
  const averageRating = '4.8 ⭐';

  const stats = [
    { icon: <Wrench />, label: 'Total Services', value: serviceCount },
    { icon: <CheckCircle />, label: 'Completed Jobs', value: completedJobs },
    { icon: <DollarSign />, label: 'Earnings (₹)', value: totalServicePrice },
    { icon: <Star />, label: 'Average Rating', value: averageRating },
  ];

  const recentActivities = [
    {
      customer: 'John Doe',
      service: 'AC Repair',
      date: 'July 3, 2025',
      status: 'Completed',
    },
    {
      customer: 'Priya Verma',
      service: 'Washing Machine Fix',
      date: 'July 2, 2025',
      status: 'Pending',
    },
    {
      customer: 'Amit Sharma',
      service: 'Geyser Installation',
      date: 'June 30, 2025',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="p-3 bg-gray-100 rounded-full text-gray-600">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Clock size={20} /> Recent Activity
        </h3>

        <div className="divide-y divide-gray-100">
          {recentActivities.map((activity, i) => (
            <div
              key={i}
              className="py-3 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition"
            >
              <div>
                <p className="font-medium text-gray-700">{activity.customer}</p>
                <p className="text-sm text-gray-500">
                  {activity.service} • {activity.date}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  activity.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianHomeView;
