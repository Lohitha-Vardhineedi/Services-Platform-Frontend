import React from 'react';

const RecentHistory: React.FC = () => {
  const recentActivities = [
    {
      id: 1,
      title: 'AC Repair Completed',
      client: 'John Smith',
      location: 'Downtown Office',
      time: '2 hours ago',
      status: 'completed',
      earnings: '₹2,500'
    },
    {
      id: 2,
      title: 'Plumbing Service',
      client: 'Sarah Johnson',
      location: 'Residential Complex',
      time: '4 hours ago',
      status: 'completed',
      earnings: '₹1,800'
    },
    {
      id: 3,
      title: 'Electrical Installation',
      client: 'Mike Wilson',
      location: 'New Construction',
      time: '6 hours ago',
      status: 'in-progress',
      earnings: '₹3,200'
    },
    {
      id: 4,
      title: 'HVAC Maintenance',
      client: 'Corporate Plaza',
      location: 'Business District',
      time: '1 day ago',
      status: 'completed',
      earnings: '₹4,500'
    },
    {
      id: 5,
      title: 'Emergency Repair',
      client: 'Lisa Brown',
      location: 'Suburban Home',
      time: '2 days ago',
      status: 'completed',
      earnings: '₹2,100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recent History</h3>
            <p className="text-sm text-gray-500">Latest activities</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {recentActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer group/item"
            style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 group-hover/item:text-blue-600 transition-colors">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.client} • {activity.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
                  >
                    {activity.status.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {activity.earnings}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

       <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">Today's Schedule</p>
             <p className="font-semibold text-gray-800">3 Services</p>
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

// import React from 'react';
// import { Clock, CheckCircle, AlertCircle, Calendar, XCircle } from 'lucide-react';

// const RecentHistory: React.FC = () => {
//   const activities = [
//     {
//       id: 1,
//       customer: 'Priya Sharma',
//       service: 'AC Repair',
//       time: '2 hours ago',
//       amount: '₹1,200',
//       status: 'Completed',
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//     {
//       id: 2,
//       customer: 'Rajesh Kumar',
//       service: 'Washing Machine Fix',
//       time: 'Tomorrow 10:00 AM',
//       amount: '₹800',
//       status: 'Upcoming',
//       icon: Calendar,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//     },
//     {
//       id: 3,
//       customer: 'Anita Reddy',
//       service: 'Geyser Installation',
//       time: '1 day ago',
//       amount: '₹2,500',
//       status: 'Cancelled',
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100',
//     },
//     {
//       id: 4,
//       customer: 'Suresh Babu',
//       service: 'Electrical Wiring',
//       time: '3 days ago',
//       amount: '₹3,200',
//       status: 'Completed',
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//     {
//       id: 5,
//       customer: 'Meera Patel',
//       service: 'Plumbing Work',
//       time: 'Next Monday 2:00 PM',
//       amount: '₹1,500',
//       status: 'Upcoming',
//       icon: Calendar,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//     },
//     {
//       id: 6,
//       customer: 'Vikram Singh',
//       service: 'Fan Installation',
//       time: '5 days ago',
//       amount: '₹600',
//       status: 'Cancelled',
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100',
//     },
//     {
//       id: 7,
//       customer: 'Lakshmi Devi',
//       service: 'Refrigerator Repair',
//       time: '1 week ago',
//       amount: '₹2,800',
//       status: 'Completed',
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//     {
//       id: 8,
//       customer: 'Arjun Reddy',
//       service: 'TV Mounting',
//       time: 'Friday 4:00 PM',
//       amount: '₹900',
//       status: 'Upcoming',
//       icon: Calendar,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//     },
//     {
//       id: 9,
//       customer: 'Deepika Sharma',
//       service: 'Microwave Repair',
//       time: '2 weeks ago',
//       amount: '₹1,100',
//       status: 'Cancelled',
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100',
//     },
//     {
//       id: 10,
//       customer: 'Ravi Kumar',
//       service: 'Water Heater Service',
//       time: '3 weeks ago',
//       amount: '₹1,800',
//       status: 'Completed',
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-indigo-100 rounded-lg">
//             <Clock className="w-5 h-5 text-indigo-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Recent History</h3>
//             <p className="text-sm text-gray-500">Latest 10 job updates</p>
//           </div>
//         </div>
//         <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
//           View All
//         </button>
//       </div>

//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {activities.map((activity) => {
//           const IconComponent = activity.icon;
//           return (
//             <div
//               key={activity.id}
//               className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
//             >
//               <div className={`p-2 ${activity.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
//                 <IconComponent className={`w-4 h-4 ${activity.color}`} />
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <p className="font-medium text-gray-800 truncate">{activity.customer}</p>
//                   <span className="text-sm font-semibold text-gray-800">{activity.amount}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">{activity.service}</p>
//                   <span className="text-xs text-gray-500">{activity.time}</span>
//                 </div>
//               </div>
              
//               <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.bgColor} ${activity.color}`}>
//                 {activity.status}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Today's Schedule</p>
//             <p className="font-semibold text-gray-800">3 appointments remaining</p>
//           </div>
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
//             View Schedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentHistory;