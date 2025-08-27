import React, { useEffect, useState } from "react";
import {
  Wrench,
  CheckCircle,
  DollarSign,
  Star,
} from "lucide-react";
import RecentHistory from "../../components/techDashboard/RecentHistory";
import StatsCard from "../../components/techDashboard/StatusCards";
import AvgRatingChart from "../../components/techDashboard/AvgRating";
import { getServicesByTechId, getMonthlyBookingByTechId, getBookingDashboardByTechId, getTodaybookingBytechId } from "../../api/apiMethods";
import MonthlyEarningsChart from "../../components/techDashboard/MonthlyEarningChart";

// Define interfaces for type safety
interface Service {
  id: string;
  serv: string;
  price: number;
  image: string;
}

interface Booking {
  _id: string;
  service?: { serviceName: string };
  user?: { username: string };
  status: string;
  bookingDate: string;
}

interface MonthlyEarning {
  month: number;
  monthName: string;
  totalEarnings: number;
  bookingCount: number;
}

const TechnicianDashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0); // Fixed: Changed polluting0 to 0
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const year = new Date().getFullYear();
  
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

    // const year = new Date().getFullYear();

    const year = 2025;


    setLoading(true);
    Promise.all([
      getServicesByTechId(id),
      getTodaybookingBytechId(id),
      getMonthlyBookingByTechId(id),
      getBookingDashboardByTechId(id),
    ])
      .then(([servicesData, todayBookingsData, monthlyEarningsData, dashboardData]) => {
        // Handle services data
        if (servicesData?.success && Array.isArray(servicesData.result)) {
          const fetchedServices: Service[] = servicesData.result.map((service: any) => ({
            id: service._id,
            serv: service.serviceName,
            price: service.servicePrice,
            image: service.serviceImg,
          }));
          setServices(fetchedServices);
          setServiceCount(fetchedServices?.length || 0);
        }

        // Handle today's bookings
        if (todayBookingsData?.success && Array.isArray(todayBookingsData.result.todaysBookings)) {
          // Filter bookings for today
          const today = new Date().toISOString().split('T')[0];
          const filteredBookings = todayBookingsData.result.todaysBookings.filter(
            (booking: any) => new Date(booking.bookingDate).toISOString().split('T')[0] === today
          );
          setTodayBookings(filteredBookings);
        }

        // Handle monthly earnings
        if (monthlyEarningsData?.success && Array.isArray(monthlyEarningsData.result.monthlyEarnings)) {
          setMonthlyEarnings(monthlyEarningsData.result.monthlyEarnings);
          setTotalEarnings(monthlyEarningsData.result.totalEarnings || 0);
        }

        // Handle dashboard data
        if (dashboardData?.success) {
          setTotalBookings(dashboardData?.result?.totalBookings || 0);
          setTotalCompleted(dashboardData?.result?.totalCompleted || 0);
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
      value: `₹ ${totalEarnings}`,
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

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-red-600 text-lg">{error}</div>
  //     </div>
  //   );
  // }

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
            <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
            <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
              {currentDate}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatsCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentHistory bookings={todayBookings} />
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