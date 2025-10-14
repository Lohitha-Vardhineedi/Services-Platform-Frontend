import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  CheckCircle,
  DollarSign,
  Star,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import {
  getMonthlyBookingByTechId,
  getBookingDashboardByTechId,
  getTodaybookingBytechId,
} from "../../api/apiMethods";
import TodayEarnings from "../../components/techDashboard/RecentHistory";
import MonthlyEarningsChart from "../../components/techDashboard/MonthlyEarningChart";
import StatsCard from "../../components/referral/StatsCard";
import AvgRatingChart from "../../components/techDashboard/AvgRating";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

// Interface Definitions
export interface CategoryService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
}

export interface Technician {
  _id: string;
  franchiseId: string | null;
  userId: string;
  username: string;
  role: string;
  phoneNumber: string;
  password: string;
  category: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  admin: boolean;
  categoryServices: CategoryService[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileImage: string;
}

export interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  role: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Service {
  _id: string;
  categoryId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Booking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  quantity: number;
  bookingDate: string;
  servicePrice: number;
  gst: number;
  totalPrice: number;
  status: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MonthlyEarning {
  month: number;
  monthName: string;
  totalEarnings: number;
  bookingCount: number;
}

export interface MonthlyBookingResponse {
  success: boolean;
  message: string;
  result: {
    technician: Technician;
    year: string;
    monthlyEarnings: MonthlyEarning[];
    totalEarnings: number;
    totalBookings: number;
    averageEarningsPerMonth: number;
    averageBookingsPerMonth: number;
  };
}

export interface TodayBooking {
  booking: Booking;
  user: User;
  service: Service;
  technician: Technician;
}

export interface TodayBookingResponse {
  success: boolean;
  message: string;
  result: {
    technician: Technician;
    todaysBookings: TodayBooking[];
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalEarnings: number;
  };
}

export interface BookingItem {
  booking: Booking;
  user: User;
  service: Service;
  technician: Technician;
}

export interface BookingDashboardResponse {
  success: boolean;
  message: string;
  result: {
    technician: Technician;
    totalBookings: number;
    totalCompleted: number;
    totalEarns: number;
    bookings: BookingItem[];
  };
}

// StatsCard Component
export interface StatsCardProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  color?: string;
}


// TodayEarnings Component
export interface TodayEarningsProps {
  bookings: TodayBooking[];
  totalEarnings: number;
}

const TechnicianDashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [todayBookings, setTodayBookings] = useState<TodayBooking[]>([]);
  const [dashboardBookings, setDashboardBookings] = useState<BookingItem[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [todayEarnings, setTodayEarnings] = useState<number>(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUsername(storedUser.username || "Technician");

    if (storedRole !== "technician") {
      setLoading(false);
      setError("Access restricted to technicians only.");
      return;
    }

    const id = localStorage.getItem("userId");
    if (!id) {
      setLoading(false);
      setError("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    Promise.all([
      getTodaybookingBytechId(id),
      getMonthlyBookingByTechId(id),
      getBookingDashboardByTechId(id),
    ])
      .then(([todayBookingsData, monthlyEarningsData, dashboardData]) => {
        // Handle today's bookings
        if ((todayBookingsData as TodayBookingResponse)?.success) {
          const response = todayBookingsData as TodayBookingResponse;
          setTodayBookings(response.result.todaysBookings || []);
          setTodayEarnings(response.result.totalEarnings || 0);
          if (response.result.technician?.categoryServices) {
            setServiceCount(response.result.technician.categoryServices.length);
          }
        }

        // Handle monthly earnings
        if ((monthlyEarningsData as MonthlyBookingResponse)?.success) {
          const data = monthlyEarningsData as MonthlyBookingResponse;
          setMonthlyEarnings(data.result.monthlyEarnings || []);
          setTotalEarnings(data.result.totalEarnings || 0);
        }

        // Handle dashboard data
        if ((dashboardData as BookingDashboardResponse)?.success) {
          const data = dashboardData as BookingDashboardResponse;
          setDashboardBookings(data.result.bookings || []);
          setTotalBookings(data.result.totalBookings || 0);
          setTotalCompleted(data.result.totalCompleted || 0);
        }

        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch technician data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      icon: <Wrench className="w-6 h-6" />,
      label: "Total Services",
      value: serviceCount,
      color: "bg-blue-100",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Completed Services",
      value: totalCompleted,
      color: "bg-green-100",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: "Total Earnings",
      value: `₹${totalEarnings}`,
      color: "bg-yellow-100",
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />,
      label: "Average Rating",
      value: "4.8", // Static as no API data for ratings
      color: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 px-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto">
      <div className="relative z-[1] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000 z-[1]"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce z-[1]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000 z-[1]"></div>
        <div className="flex items-center justify-between relative z-[2]">
          <div>
            <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
              Welcome back, {username}! 👋
            </h1>
            <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">
              Here's your performance overview
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 group-hover:text-white transition-colors duration-300">
              Today's Date
            </p>
            <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
              {currentDate}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatsCard
            icon={item.icon}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodayEarnings bookings={todayBookings} totalEarnings={todayEarnings} />
        <AvgRatingChart />
      </div>
      <div className="relative z-[1] mb-8">
        <MonthlyEarningsChart monthlyEarnings={monthlyEarnings} />
      </div>
    </div>
  );
};

export default TechnicianDashboard;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Wrench,
//   CheckCircle,
//   DollarSign,
//   Star,
//   PieChart as PieChartIcon,
// } from "lucide-react";
// import {
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip as ChartTooltip,
//   Legend as ChartLegend,
// } from "chart.js";
// import {
//   getMonthlyBookingByTechId,
//   getBookingDashboardByTechId,
//   getTodaybookingBytechId
// } from "../../api/apiMethods";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

// interface CategoryService {
//   categoryServiceId: string;
//   status: boolean;
//   _id: string;
// }

// interface Technician {
//   _id: string;
//   franchiseId: string | null;
//   userId: string;
//   username: string;
//   role: string;
//   phoneNumber: string;
//   password: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   admin: boolean;
//   categoryServices: CategoryService[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   profileImage: string;
// }

// interface MonthlyEarning {
//   month: number;
//   monthName: string;
//   totalEarnings: number;
//   bookingCount: number;
// }

// interface MonthlyBookingResponse {
//   success: boolean;
//   message: string;
//   result: {
//     technician: Technician;
//     year: string;
//     monthlyEarnings: MonthlyEarning[];
//     totalEarnings: number;
//     totalBookings: number;
//     averageEarningsPerMonth: number;
//     averageBookingsPerMonth: number;
//   };
// }

// interface CategoryService {
//   categoryServiceId: string;
//   status: boolean;
//   _id: string;
// }

// interface Technician {
//   _id: string;
//   franchiseId: string | null;
//   userId: string;
//   username: string;
//   role: string;
//   phoneNumber: string;
//   password: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   admin: boolean;
//   categoryServices: CategoryService[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   profileImage: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Service {
//   _id: string;
//   categoryId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface TodayBooking {
//   booking: Booking;
//   user: User;
//   service: Service;
//   technician: Technician;
// }

// interface TodayBookingResponse {
//   success: boolean;
//   message: string;
//   result: {
//     technician: Technician;
//     todaysBookings: TodayBooking[];
//     totalBookings: number;
//     completedBookings: number;
//     pendingBookings: number;
//     cancelledBookings: number;
//     totalEarnings: number;
//   };
// }

// // StatsCard Component
// interface StatsCardProps {
//   icon: React.ReactElement;
//   label: string;
//   value: string | number;
//   color?: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color = "bg-gray-100" }) => {
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
//               <p className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
//                 {value}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
//     </div>
//   );
// };

// // RecentHistory Component
// interface RecentHistoryProps {
//   bookings: Booking[];
// }

// const RecentHistory: React.FC<RecentHistoryProps> = ({ bookings }) => {
//   const navigate = useNavigate();

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-700';
//       case 'cancelled':
//         return 'bg-red-100 text-red-700';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
//             <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Today's Bookings</h3>
//           </div>
//         </div>
//         <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={() => navigate('/technician/transactions')}>
//           View All
//         </button>
//       </div>

//       <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
//         {bookings.length === 0 ? (
//           <div className="text-center text-gray-600 py-4">
//             No bookings found for today
//           </div>
//         ) : (
//           bookings.map((activity, index) => (
//             <div
//               key={activity._id}
//               className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer group/item"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <div className="flex-1 min-w-0 scrollbar-hide">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h4 className="text-sm font-semibold text-gray-800 group-hover/item:text-blue-600 transition-colors">
//                       {activity.status || "Service"}
//                     </h4>
//                     <p className="text-xs text-gray-600 mt-1">
//                       {activity.user?.username || "Unknown Client"}
//                     </p>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
//                       {activity.status}
//                     </span>
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <p className="text-xs text-gray-500 mt-1">
//                       {new Date(activity.bookingDate).toLocaleDateString("en-IN")}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Today's Schedule</p>
//             <p className="font-semibold text-gray-800">{bookings.length} Bookings</p>
//           </div>
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors" onClick={() => navigate('/technician/transactions')}>
//             View Schedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // AvgRatingChart Component
// const AvgRatingChart: React.FC = () => {
//   const jobStatusData = [
//     { name: 'High', value: 40, color: '#10B981' },
//     { name: 'Medium', value: 35, color: '#FACC15' },
//     { name: 'Low', value: 25, color: '#EF4444' },
//   ];

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const { name, value } = payload[0].payload;
//       const total = jobStatusData.reduce((acc, item) => acc + item.value, 0);
//       const percentage = ((value / total) * 100).toFixed(1);
//       return (
//         <div className="bg-white border border-gray-300 px-3 py-2 text-sm rounded shadow-md">
//           <p className="font-semibold">{name}</p>
//           <p>{percentage}%</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomLegend = ({ payload }: any) => {
//     const total = jobStatusData.reduce((sum, item) => sum + item.value, 0);
//     return (
//       <ul className="space-y-1 text-sm">
//         {payload.map((entry: any, index: number) => {
//           const percentage = ((entry.payload.value / total) * 100).toFixed(1);
//           return (
//             <li key={`item-${index}`} className="flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
//               <span className="text-gray-700 font-medium">{percentage}% {entry.payload.name}</span>
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
//             <PieChartIcon className="w-5 h-5 text-purple-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
//           </div>
//         </div>
//       </div>

//       <div className="relative h-80 mb-6">
//         <ResponsiveContainer width="100%" height="100%">
//           <RechartsPieChart>
//             <Pie
//               data={jobStatusData}
//               cx="40%"
//               cy="50%"
//               outerRadius={100}
//               dataKey="value"
//               stroke="#fff"
//               strokeWidth={2}
//             >
//               {jobStatusData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend
//               verticalAlign="middle"
//               align="right"
//               layout="vertical"
//               content={<CustomLegend />}
//             />
//           </RechartsPieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <div className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
//           <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
//           <p className="text-sm font-medium text-gray-600">High</p>
//           <p className="text-xl font-bold text-green-600">40%</p>
//         </div>
//         <div className="text-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors cursor-pointer">
//           <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
//           <p className="text-sm font-medium text-gray-600">Medium</p>
//           <p className="text-xl font-bold text-yellow-600">35%</p>
//         </div>
//         <div className="text-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
//           <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
//           <p className="text-sm font-medium text-gray-600">Low</p>
//           <p className="text-xl font-bold text-red-600">25%</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // MonthlyEarningsChart Component
// interface MonthlyEarningsChartProps {
//   monthlyEarnings: MonthlyEarning[];
// }

// const MonthlyEarningsChart: React.FC<MonthlyEarningsChartProps> = ({ monthlyEarnings }) => {
//   const monthlyData = monthlyEarnings.map((item) => ({
//     month: item.monthName.slice(0, 3),
//     earnings: item.totalEarnings,
//     jobs: item.bookingCount,
//   }));

//   const maxEarnings = Math.max(...monthlyData.map(d => d.earnings), 100);

//   const chartData = {
//     labels: monthlyData.map(data => data.month),
//     datasets: [
//       {
//         label: 'Earnings (₹)',
//         data: monthlyData.map(data => data.earnings),
//         backgroundColor: 'rgba(59, 130, 246, 0.6)',
//         borderColor: 'rgba(59, 130, 246, 1)',
//         borderWidth: 1,
//         hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
//         hoverBorderColor: 'rgba(59, 130, 246, 1)',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuad',
//       delay: (context: any) => context.dataIndex * 100,
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: Math.ceil(maxEarnings / 100) * 100,
//         ticks: {
//           stepSize: Math.ceil(maxEarnings / 1000) * 100,
//           callback: (value: number) => `₹${value}`,
//           color: '#4B5563',
//         },
//         grid: {
//           color: '#E5E7EB',
//         },
//         title: {
//           display: true,
//           text: 'Earnings',
//           color: '#4B5563',
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//         },
//       },
//       x: {
//         ticks: {
//           color: '#4B5563',
//         },
//         grid: {
//           display: false,
//         },
//         title: {
//           display: true,
//           text: 'Month',
//           color: '#4B5563',
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context: any) => {
//             const index = context.dataIndex;
//             const earnings = context.parsed.y;
//             const jobs = monthlyData[index].jobs;
//             const percentage = ((earnings / maxEarnings) * 100).toFixed(1);
//             return [
//               `Earnings: ₹${earnings}`,
//               `Jobs: ${jobs}`,
//               `Percentage: ${percentage}%`,
//             ];
//           },
//         },
//         backgroundColor: 'rgba(31, 41, 55, 0.9)',
//         titleColor: '#FFFFFF',
//         bodyColor: '#D1D5DB',
//         borderColor: 'rgba(59, 130, 246, 0.2)',
//         borderWidth: 1,
//       },
//     },
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 group">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
//             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//             </svg>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Monthly Earnings</h3>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//           <span>{new Date().getFullYear()}</span>
//         </div>
//       </div>
//       {monthlyData.every(data => data.earnings === 0) ? (
//         <div className="text-center text-gray-600 py-4">
//           No earnings data available for this year
//         </div>
//       ) : (
//         <>
//           <div className="h-80 mb-6">
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group/card">
//               <div className="flex items-center gap-2 mb-2">
//                 <svg className="w-4 h-4 text-blue-600 group-hover/card:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//                 <p className="text-sm text-gray-600">Total Earnings</p>
//               </div>
//               <p className="text-xl font-bold text-gray-800 group-hover/card:text-blue-600 transition-colors">
//                 ₹{monthlyEarnings.reduce((acc, item) => acc + item.totalEarnings, 0)}
//               </p>
//             </div>
//             <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group/card">
//               <div className="flex items-center gap-2 mb-2">
//                 <svg className="w-4 h-4 text-green-600 group-hover/card:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//                 <p className="text-sm text-gray-600">Avg per Month</p>
//               </div>
//               <p className="text-xl font-bold text-gray-800 group-hover/card:text-green-600 transition-colors">
//                 ₹{(monthlyEarnings.reduce((acc, item) => acc + item.totalEarnings, 0) / 12).toFixed(2)}
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Main TechnicianDashboard Component
// const TechnicianDashboard: React.FC = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const [username, setUsername] = useState<string | null>(null);
//   const [serviceCount, setServiceCount] = useState<number>(0);
//   const [todayBookings, setTodayBookings] = useState<TodayBooking>([]);
//   const [totalBookings, setTotalBookings] = useState<number>(0);
//   const [totalCompleted, setTotalCompleted] = useState<number>(0);
//   const [totalEarnings, setTotalEarnings] = useState<number>(0);
//   const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     setUsername(storedUser.username || "Technician");

//     if (storedRole !== "technician") {
//       setLoading(false);
//       setError("Access restricted to technicians only.");
//       return;
//     }

//     const id = localStorage.getItem("userId");
//     if (!id) {
//       setLoading(false);
//       setError("User ID not found. Please log in again.");
//       return;
//     }

//     setLoading(true);

//     Promise.all([
//       getTodaybookingBytechId(id),
//       getMonthlyBookingByTechId(id),
//       getBookingDashboardByTechId(id),
//     ])
//       .then(([todayBookingsData, monthlyEarningsData, dashboardData]) => {
//         // Handle today's bookings
//         if ((todayBookingsData as TodayBookingResponse)?.success) {
//           const response = todayBookingsData as TodayBookingResponse;
//           setTodayBookings(response.result.todaysBookings || []);

//           // Set service count from technician's categoryServices
//           if (response.result.technician?.categoryServices) {
//             setServiceCount(response.result.technician.categoryServices.length);
//           }
//         }

//         // Handle monthly earnings
//         if ((monthlyEarningsData as MonthlyBookingResponse)?.success) {
//           const data = monthlyEarningsData as MonthlyBookingResponse;
//           setMonthlyEarnings(data.result.monthlyEarnings || []);
//           setTotalEarnings(data.result.totalEarnings || 0);
//         }

//         // Handle dashboard data
//         if ((dashboardData as DashboardResponse)?.success) {
//           const data = dashboardData as DashboardResponse;
//           setTotalBookings(data.result?.totalBookings || 0);
//           setTotalCompleted(data.result?.totalCompleted || 0);
//         }

//         setLoading(false);
//       })
//       .catch((err: any) => {
//         console.error("Failed to fetch technician data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//         setLoading(false);
//       });
//   }, []);

//   const currentDate = new Date().toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const stats = [
//     {
//       icon: <Wrench className="w-6 h-6" />,
//       label: "Total Services",
//       value: serviceCount,
//       color: "bg-blue-100",
//     },
//     {
//       icon: <CheckCircle className="w-6 h-6" />,
//       label: "Completed Services",
//       value: totalCompleted,
//       color: "bg-green-100",
//     },
//     {
//       icon: <DollarSign className="w-6 h-6" />,
//       label: "Total Earnings",
//       value: `₹ ${totalEarnings}`,
//       color: "bg-yellow-100",
//     },
//     {
//       icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />,
//       label: "Average Rating",
//       value: "4.8", // Static as no API data for ratings
//       color: "bg-purple-100",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-600 text-lg">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative space-y-8 px-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto">
//       <div className="relative z-[1] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000 z-[1]"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce z-[1]"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000 z-[1]"></div>
//         <div className="flex items-center justify-between relative z-[2]">
//           <div>
//             <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
//               Welcome back, {username}! 👋
//             </h1>
//             <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">
//               Here's your performance overview
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
//             <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
//               {currentDate}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => (
//           <StatsCard
//             key={index}
//             icon={item.icon}
//             label={item.label}
//             value={item.value}
//             color={item.color}
//           />
//         ))}
//       </div>
//       <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <RecentHistory bookings={todayBookings} />
//         <AvgRatingChart />
//       </div>
//       <div className="relative z-[1] mb-8">
//         <MonthlyEarningsChart monthlyEarnings={monthlyEarnings} />
//       </div>
//     </div>
//   );
// };

// export default TechnicianDashboard;
// import React, { useEffect, useState } from "react";
// import {
//   Wrench,
//   CheckCircle,
//   DollarSign,
//   Star,
// } from "lucide-react";
// import RecentHistory from "../../components/techDashboard/RecentHistory";
// import StatsCard from "../../components/techDashboard/StatusCards";
// import AvgRatingChart from "../../components/techDashboard/AvgRating";
// import { getServicesByTechId, getMonthlyBookingByTechId, getBookingDashboardByTechId, getTodaybookingBytechId } from "../../api/apiMethods";
// import MonthlyEarningsChart from "../../components/techDashboard/MonthlyEarningChart";

// // Define interfaces for type safety
// interface Service {
//   id: string;
//   serv: string;
//   price: number;
//   image: string;
// }

// interface Booking {
//   _id: string;
//   service?: { serviceName: string };
//   user?: { username: string };
//   status: string;
//   bookingDate: string;
// }

// interface MonthlyEarning {
//   month: number;
//   monthName: string;
//   totalEarnings: number;
//   bookingCount: number;
// }

// const TechnicianDashboard: React.FC = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const [username, setUsername] = useState<string | null>(null);
//   const [services, setServices] = useState<Service[]>([]);
//   const [serviceCount, setServiceCount] = useState<number>(0);
//   const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
//   const [totalBookings, setTotalBookings] = useState<number>(0);
//   const [totalCompleted, setTotalCompleted] = useState<number>(0);
//   const [totalEarnings, setTotalEarnings] = useState<number>(0); // Fixed: Changed polluting0 to 0
//   const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const year = new Date().getFullYear();

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     setUsername(storedUser.username || "Technician");
//     if (storedRole !== "technician") {
//       setLoading(false);
//       setError("Access restricted to technicians only.");
//       return;
//     }

//     const id = localStorage.getItem("userId");
//     if (!id) {
//       setLoading(false);
//       setError("User ID not found. Please log in again.");
//       return;
//     }

//     // const year = new Date().getFullYear();

//     const year = 2025;

//     setLoading(true);
//     Promise.all([
//       getServicesByTechId(id),
//       getTodaybookingBytechId(id),
//       getMonthlyBookingByTechId(id),
//       getBookingDashboardByTechId(id),
//     ])
//       .then(([servicesData, todayBookingsData, monthlyEarningsData, dashboardData]) => {
//         // Handle services data
//         if (servicesData?.success && Array.isArray(servicesData.result)) {
//           const fetchedServices: Service[] = servicesData.result.map((service: any) => ({
//             id: service._id,
//             serv: service.serviceName,
//             price: service.servicePrice,
//             image: service.serviceImg,
//           }));
//           setServices(fetchedServices);
//           setServiceCount(fetchedServices.length || 0);
//         }

//         // Handle today's bookings
//         if (todayBookingsData?.success && Array.isArray(todayBookingsData.result.todaysBookings)) {
//           // Filter bookings for today
//           const today = new Date().toISOString().split('T')[0];
//           const filteredBookings = todayBookingsData.result.todaysBookings.filter(
//             (booking: any) => new Date(booking.bookingDate).toISOString().split('T')[0] === today
//           );
//           setTodayBookings(filteredBookings);
//         }

//         // Handle monthly earnings
//         if (monthlyEarningsData?.success && Array.isArray(monthlyEarningsData.result.monthlyEarnings)) {
//           setMonthlyEarnings(monthlyEarningsData.result.monthlyEarnings);
//           setTotalEarnings(monthlyEarningsData.result.totalEarnings || 0);
//         }

//         // Handle dashboard data
//         if (dashboardData?.success) {
//           setTotalBookings(dashboardData?.result?.totalBookings || 0);
//           setTotalCompleted(dashboardData?.result?.totalCompleted || 0);
//         }

//         setLoading(false);
//       })
//       .catch((err: any) => {
//         console.error("Failed to fetch technician data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//         setLoading(false);
//       });
//   }, []);

//   const currentDate = new Date().toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const stats = [
//     {
//       icon: <Wrench className="w-6 h-6" />,
//       label: "Total Services",
//       value: serviceCount,
//       color: "bg-blue-100",
//     },
//     {
//       icon: <CheckCircle className="w-6 h-6" />,
//       label: "Completed Services",
//       value: totalCompleted,
//       color: "bg-green-100",
//     },
//     {
//       icon: <DollarSign className="w-6 h-6" />,
//       label: "Total Earnings",
//       value: `₹ ${totalEarnings}`,
//       color: "bg-yellow-100",
//     },
//     {
//       icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />,
//       label: "Average Rating",
//       value: "4.8", // Static as no API data for ratings
//       color: "bg-purple-100",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // if (error) {
//   //   return (
//   //     <div className="flex justify-center items-center min-h-screen">
//   //       <div className="text-red-600 text-lg">{error}</div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="relative space-y-8 px-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto">
//       <div className="relative z-[1] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000 z-[1]"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce z-[1]"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000 z-[1]"></div>
//         <div className="flex items-center justify-between relative z-[2]">
//           <div>
//             <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
//               Welcome back, {username}! 👋
//             </h1>
//             <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">
//               Here's your performance overview
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
//             <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
//               {currentDate}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => (
//           <StatsCard
//             key={index}
//             icon={item.icon}
//             label={item.label}
//             value={item.value}
//             color={item.color}
//           />
//         ))}
//       </div>
//       <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <RecentHistory bookings={todayBookings} />
//         <AvgRatingChart />
//       </div>
//       <div className="relative z-[1] mb-8">
//         <MonthlyEarningsChart monthlyEarnings={monthlyEarnings} />
//       </div>
//     </div>
//   );
// };

// export default TechnicianDashboard;
// import React, { useEffect, useState } from "react";
// import {
//   Wrench,
//   CheckCircle,
//   DollarSign,
//   Star,
//   Clock,
//   TrendingUp,
//   Users,
//   MapPin,
// } from "lucide-react";
// import MonthlyEarningsChart from "../../components/techDashboard/MonthlyEarningChart";
// import RecentHistory from "../../components/techDashboard/RecentHistory";
// import StatsCard from "../../components/techDashboard/StatusCards";
// import { getServicesByTechId } from "../../api/apiMethods";
// import AvgRatingChart from "../../components/techDashboard/AvgRating";

// const TechnicianDashboard: React.FC = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const totalServicePrice = 300;
//   const [services, setServices] = useState<any[]>([]); // Adjust type as needed
//   const [serviceCount, setServiceCount] = useState<number>(0); // State for count

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//     if (storedRole !== "technician") return;

//     const id = localStorage.getItem("userId");
//     if (id) {
//       getServicesByTechId(id)
//         .then((data: any) => {
//           if (data?.result && Array.isArray(data.result)) {
//             const fetchedServices = data.result.map((service: any) => ({
//               id: service._id,
//               serv: service.serviceName,
//               price: service.servicePrice,
//               image: service.serviceImg,
//             }));
//             setServices(fetchedServices);
//             setServiceCount(fetchedServices.length); // Set the count
//           }
//         })
//         .catch((err: any) => {
//           console.error("Failed to fetch technician services:", err);
//         });
//     }
//   }, []);

//   const currentDate = new Date().toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const stats = [
//     {
//       icon: <Wrench className="w-6 h-6" />,
//       label: "Total Services",
//       value: serviceCount,
//       color: "bg-blue-100",
//     },
//     {
//       icon: <CheckCircle className="w-6 h-6" />,
//       label: "Completed services",
//       value: 2,
//       color: "bg-green-100",
//     },
//     {
//       icon: <DollarSign className="w-6 h-6 " />,
//       label: "Plan Earnings",
//       value: `₹ 300`,
//       color: "bg-yellow-100",
//     },
//     {
//       icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />,
//       label: "Average Rating",
//       value: "4.8 ",
//       color: "bg-purple-100",
//     },
//   ];
//   // ⭐
//   return (
//     <div className="relative space-y-8 px-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto">
//       {/* Header Section with reduced z-index */}
//       <div className="relative z-[1] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000 z-[1]"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce z-[1]"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000 z-[1]"></div>

//         <div className="flex items-center justify-between relative z-[2]">
//           <div>
//             <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">Welcome back, Technician! 👋</h1>
//             <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">Here's your performance overview</p>
//           </div>
//           <div className="text-right">
//             <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
//             <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
//               {currentDate}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards Section with reduced z-index */}
//       <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => (
//           <StatsCard
//             key={index}
//             icon={item.icon}
//             label={item.label}
//             value={item.value}
//             // trend={item.trend}
//             color={item.color}
//           />
//         ))}
//       </div>

//       {/* Charts and Activities Section with reduced z-index */}
//       <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <RecentHistory/>
//         <AvgRatingChart/>
//       </div>

//       {/* Monthly Earnings Chart Section with reduced z-index */}
//       <div className="relative z-[1] mb-8">
//         <MonthlyEarningsChart/>
//       </div>
//     </div>
//   );
// };

// export default TechnicianDashboard;