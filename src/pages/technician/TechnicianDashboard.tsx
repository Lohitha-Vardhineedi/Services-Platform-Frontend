import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle, DollarSign, Star, Clock, TrendingUp, Users, MapPin } from 'lucide-react';
import MonthlyEarningsChart from '../../components/techDashboard/MonthlyEarningChart';
import RecentHistory from '../../components/techDashboard/RecentHistory';
import StatsCard from '../../components/techDashboard/StatusCards';
import { getServicesByTechId } from '../../api/apiMethods';
import AvgRatingChart from '../../components/techDashboard/AvgRating';

type Props = {
  data: TechnicianProfileData | null;
};

const TechnicianDashboard: React.FC<Props> = ({ data }) => {
    const [role, setRole] = useState<string | null>(null);
  const totalServicePrice = data?.technicianProfile?.services?.reduce((sum, s) => sum + (s.servicePrice || 0), 0) ?? 300;
  const [services, setServices] = useState<any[]>([]); // Adjust type as needed
  const [serviceCount, setServiceCount] = useState<number>(0); // State for count

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    if (storedRole !== "technician") return;

    const id = localStorage.getItem("userId");
    if (id) {
      getServicesByTechId(id)
        .then((data: any) => {
          if (data?.result && Array.isArray(data.result)) {
            const fetchedServices = data.result.map((service: any) => ({
              id: service._id,
              serv: service.serviceName,
              price: service.servicePrice,
              image: service.serviceImg,
            }));
            setServices(fetchedServices);
            setServiceCount(fetchedServices.length); // Set the count
          }
        })
        .catch((err: any) => {
          console.error('Failed to fetch technician services:', err);
        });
    }
  }, []);

  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const stats = [
    { 
      icon: <Wrench className="w-6 h-6" />, 
      label: 'Total Services', 
      value: serviceCount,
      color: 'bg-blue-100'
    },
    { 
      icon: <CheckCircle className="w-6 h-6" />, 
      label: 'Completed services', 
      value: 2,
      color: 'bg-green-100'
    },
    { 
      icon: <DollarSign className="w-6 h-6 " />, 
      label: 'Monthly Earnings', 
      value: `₹${totalServicePrice.toLocaleString()}`,
      color: 'bg-yellow-100'
    },
    { 
      icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />, 
      label: 'Average Rating', 
      value: '4.8 ',
      color: 'bg-purple-100'
    }
  ];
// ⭐
  return (
    <div className="space-y-8 px-6  bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto ">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000"></div>
        
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">Welcome back, Technician! 👋</h1>
            <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">Here's your performance overview for today</p>
          </div>
          <div className="text-right relative z-10">
            <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
            <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatsCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            trend={item.trend}
            color={item.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
        <RecentHistory/>
        <AvgRatingChart/>
      </div>
       <div className="mb-8">
          <MonthlyEarningsChart/>
        </div>
     
    </div>
  );
};

export default TechnicianDashboard;

// import React from 'react';
// import { Wrench, CheckCircle, DollarSign, Star, Clock } from 'lucide-react';

// type TechnicianProfileData = {
//   technician: any;
//   profile: {
//     services?: any[];
//     // ...other fields
//   } | null;
// };

// type Props = {
//   data: TechnicianProfileData | null;
// };

// const TechnicianDashboard: React.FC<Props> = ({ data }) => {
//   console.log("response",data?.technician.services)
//   const serviceCount = data?.technician.services?.length ?? 0;
//   const totalServicePrice = data?.technician.services?.reduce((sum, s) => sum + (s.servicePrice || 0), 0) ?? 0;

//   const stats = [
//     { icon: <Wrench />, label: 'Total Services', value: serviceCount },
//     { icon: <CheckCircle />, label: 'Completed Jobs', value: serviceCount },
//     { icon: <DollarSign />, label: 'Earnings (₹)', value: totalServicePrice },
//     { icon: <Star />, label: 'Average Rating', value: '4.8 ⭐' },
//   ];

//   const recentActivities = [
//     {
//       customer: 'John Doe',
//       service: 'AC Repair',
//       date: 'July 3, 2025',
//       status: 'Completed',
//     },
//     {
//       customer: 'Priya Verma',
//       service: 'Washing Machine Fix',
//       date: 'July 2, 2025',
//       status: 'Pending',
//     },
//     {
//       customer: 'Amit Sharma',
//       service: 'Geyser Installation',
//       date: 'June 30, 2025',
//       status: 'Completed',
//     },
//   ];

//   return (
//     <div className="space-y-8 max-w-7xl mx-auto">
//       {/* Top Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((item, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
//           >
//             <div className="p-3 bg-gray-100 rounded-full text-gray-600">{item.icon}</div>
//             <div>
//               <p className="text-sm text-gray-500">{item.label}</p>
//               <p className="text-xl font-semibold text-gray-800">{item.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
//           <Clock size={20} /> Recent Activity
//         </h3>

//         <div className="divide-y divide-gray-100">
//           {recentActivities.map((activity, i) => (
//             <div
//               key={i}
//               className="py-3 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition"
//             >
//               <div>
//                 <p className="font-medium text-gray-700">{activity.customer}</p>
//                 <p className="text-sm text-gray-500">
//                   {activity.service} • {activity.date}
//                 </p>
//               </div>
//               <span
//                 className={`text-xs px-3 py-1 rounded-full font-medium ${
//                   activity.status === 'Completed'
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-yellow-100 text-yellow-700'
//                 }`}
//               >
//                 {activity.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TechnicianDashboard;

