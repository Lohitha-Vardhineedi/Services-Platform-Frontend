import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, XCircle } from 'lucide-react';

const RecentHistory: React.FC = () => {
  const activities = [
    {
      id: 1,
      customer: 'Priya Sharma',
      service: 'AC Repair',
      time: '2 hours ago',
      amount: '₹1,200',
      status: 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 2,
      customer: 'Rajesh Kumar',
      service: 'Washing Machine Fix',
      time: 'Tomorrow 10:00 AM',
      amount: '₹800',
      status: 'Upcoming',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 3,
      customer: 'Anita Reddy',
      service: 'Geyser Installation',
      time: '1 day ago',
      amount: '₹2,500',
      status: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 4,
      customer: 'Suresh Babu',
      service: 'Electrical Wiring',
      time: '3 days ago',
      amount: '₹3,200',
      status: 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 5,
      customer: 'Meera Patel',
      service: 'Plumbing Work',
      time: 'Next Monday 2:00 PM',
      amount: '₹1,500',
      status: 'Upcoming',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 6,
      customer: 'Vikram Singh',
      service: 'Fan Installation',
      time: '5 days ago',
      amount: '₹600',
      status: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 7,
      customer: 'Lakshmi Devi',
      service: 'Refrigerator Repair',
      time: '1 week ago',
      amount: '₹2,800',
      status: 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 8,
      customer: 'Arjun Reddy',
      service: 'TV Mounting',
      time: 'Friday 4:00 PM',
      amount: '₹900',
      status: 'Upcoming',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 9,
      customer: 'Deepika Sharma',
      service: 'Microwave Repair',
      time: '2 weeks ago',
      amount: '₹1,100',
      status: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 10,
      customer: 'Ravi Kumar',
      service: 'Water Heater Service',
      time: '3 weeks ago',
      amount: '₹1,800',
      status: 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recent History</h3>
            <p className="text-sm text-gray-500">Latest 10 job updates</p>
          </div>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              <div className={`p-2 ${activity.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className={`w-4 h-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800 truncate">{activity.customer}</p>
                  <span className="text-sm font-semibold text-gray-800">{activity.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{activity.service}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.bgColor} ${activity.color}`}>
                {activity.status}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Today's Schedule</p>
            <p className="font-semibold text-gray-800">3 appointments remaining</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentHistory;