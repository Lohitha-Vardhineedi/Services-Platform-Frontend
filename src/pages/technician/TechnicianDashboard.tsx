import React, { useEffect, useState } from "react";
import {
  Wrench,
  CheckCircle,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Users,
  MapPin,
} from "lucide-react";
import MonthlyEarningsChart from "../../components/techDashboard/MonthlyEarningChart";
import RecentHistory from "../../components/techDashboard/RecentHistory";
import StatsCard from "../../components/techDashboard/StatusCards";
import { getServicesByTechId } from "../../api/apiMethods";
import AvgRatingChart from "../../components/techDashboard/AvgRating";

type Props = {
  data: TechnicianProfileData | null;
};

const TechnicianDashboard: React.FC<Props> = ({ data }) => {
  const [role, setRole] = useState<string | null>(null);
  const totalServicePrice =
    data?.technicianProfile?.services?.reduce(
      (sum, s) => sum + (s.servicePrice || 0),
      0
    ) ?? 300;
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
          console.error("Failed to fetch technician services:", err);
        });
    }
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
      label: "Completed services",
      value: 2,
      color: "bg-green-100",
    },
    {
      icon: <DollarSign className="w-6 h-6 " />,
      label: "Plan Earnings",
      value: `₹ 300`,
      color: "bg-yellow-100",
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-400 fill-current" />,
      label: "Average Rating",
      value: "4.8 ",
      color: "bg-purple-100",
    },
  ];
  // ⭐
  return (
    <div className="relative space-y-8 px-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen max-w-7xl mx-auto">
      {/* Header Section with reduced z-index */}
      <div className="relative z-[1] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 transform rotate-45 group-hover:rotate-90 transition-transform duration-1000 z-[1]"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 animate-pulse group-hover:animate-bounce z-[1]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000 z-[1]"></div>
        
        <div className="flex items-center justify-between relative z-[2]">
          <div>
            <h1 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">Welcome back, Technician! 👋</h1>
            <p className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">Here's your performance overview</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 group-hover:text-white transition-colors duration-300">Today's Date</p>
            <div className="text-xl font-semibold bg-white bg-opacity-20 px-4 py-2 backdrop-blur-sm border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section with reduced z-index */}
      <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatsCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            // trend={item.trend}
            color={item.color}
          />
        ))}
      </div>

      {/* Charts and Activities Section with reduced z-index */}
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentHistory/>
        <AvgRatingChart/>
      </div>

      {/* Monthly Earnings Chart Section with reduced z-index */}
      <div className="relative z-[1] mb-8">
        <MonthlyEarningsChart/>
      </div>
    </div>
  );
};

export default TechnicianDashboard;