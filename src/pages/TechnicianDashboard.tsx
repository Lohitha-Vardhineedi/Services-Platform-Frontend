import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { TechnicianProfileProvider } from '../context/TechnicianProfileContext';
import TechnicianSidebar from './technician/TechnicianSidebar';
import TechnicianMainContent from './technician/TechnicianMainContent';

const TECHNICIAN_ID = localStorage.getItem('userId') || "686a65f24551a5e01e71afb9";

const TechnicianDashboard: React.FC = () => {
    const [showSidebarMobile, setShowSidebarMobile] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const userData = user ? JSON.parse(user) : {};
        setRole(userData.role || null);
    }, []);

    // Redirect non-technicians
    if (role && role !== 'technician') {
        return <Navigate to="/profile" replace />;
    }

    return (
        <TechnicianProfileProvider technicianId={TECHNICIAN_ID}>
            <div className="h-screen bg-gray-50 text-gray-800 overflow-hidden">
                <div className="flex flex-col md:flex-row h-full max-w-7xl mx-auto px-4">
                    {/* Sidebar */}
                    <TechnicianSidebar 
                        showSidebarMobile={showSidebarMobile}
                        setShowSidebarMobile={setShowSidebarMobile}
                    />
                    {/* Main Content */}
                    <TechnicianMainContent showSidebarMobile={showSidebarMobile} />
                </div>
            </div>
        </TechnicianProfileProvider>
    );
};

export default TechnicianDashboard;

// import React, { useState, useEffect } from 'react';
// import {
//     LayoutDashboard, UserCog, PlusSquare, Image, List, CreditCard,
//     Star
// } from 'lucide-react';
// import { useTechnicianProfile } from '../context/TechnicianProfileContext';
// import { TechnicianProfileProvider } from "../context/TechnicianProfileContext";
// import TechnicianServices from './technician/TechnicianService';
// import TechnicianProfile from './technician/TechnicianProfile';
// import TechnicianPhotos from './technician/TechnicianPhotos';
// import TechnicianReviews from './technician/TechnicianReviews';
// import TechnicianTransactions from './technician/TechnicianTransactions';
// import TechnicianSubscription from './technician/TechnicianSubscription';

// const TECHNICIAN_ID = localStorage.getItem('userId') || "686a65f24551a5e01e71afb9"; // or get this dynamically

// const TechnicianDashboard: React.FC = () => {
//     const [selectedTab, setSelectedTab] = useState('dashboard');
//     const [showSidebarMobile, setShowSidebarMobile] = useState(true);
//     const [role, setRole] = useState<string | null>(null);

//     useEffect(() => {
//         const storedRole = localStorage.getItem('role');
//         console.log("Stored Value",storedRole)
//         setRole(storedRole);
//     }, []);

//     const menuItems = [
//         { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
//         { key: 'profile', label: 'Profile', icon: <UserCog size={20} /> },
//         { key: 'service', label: 'Service', icon: <PlusSquare size={20} /> },
//         { key: 'photos', label: 'Photos', icon: <Image size={20} /> },
//         { key: 'reviews', label: 'Reviews ', icon: <Star size={20} /> },
//         { key: 'transactions', label: 'Transactions', icon: <List size={20} /> },
//         { key: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} /> },
//     ];

//     const { loading, error } = useTechnicianProfile();
//     const { data } = localStorage.getItem('user') ? JSON.stringify(localStorage.getItem('user')) : {};


//     const renderContent = () => {
//         if (loading) return <div>Loading...</div>;
//         if (error) return <div>Error: {error}</div>;
//         console.log("technicna Data : ",data)
//         switch (selectedTab) {
//             case 'dashboard':
//                 return <TechnicianDashboard data={data} />;
//             case 'profile':
//                 return <TechnicianProfile data={data} />;
//             case 'service':
//                 return <TechnicianServices data={data} />;
//             case 'photos':
//                 return <TechnicianPhotos data={data} />;
//             case 'reviews':
//                 return <TechnicianReviews data={data} />;
//             case 'transactions':
//                 return <TechnicianTransactions data={data} />;
//             case 'subscriptions':
//                 return <TechnicianSubscription data={data} />;
//             default:
//                 return <TechnicianDashboard data={data} />;
//         }
//     };

//     // Sidebar component
//     const Sidebar = (
//         <div className="h-full border-r border-gray-200 bg-gray-50 p-4 flex flex-col w-64">
//             <nav className="flex flex-col gap-2">
//                 {menuItems.map((item) => (
//                     <button
//                         key={item.key}
//                         onClick={() => {
//                             setSelectedTab(item.key);
//                             // On mobile, hide sidebar after selecting
//                             if (window.innerWidth < 768) setShowSidebarMobile(false);
//                         }}
//                         className={`flex items-center gap-3 p-2 rounded-md text-sm hover:bg-orange-100 transition ${selectedTab === item.key ? 'bg-orange-200 font-semibold' : ''
//                             }`}
//                     >
//                         <span>{item.icon}</span>
//                         <span>{item.label}</span>
//                     </button>
//                 ))}
//             </nav>
//         </div>
//     );

//     return (
//         <div className="h-screen bg-gray-50 text-gray-800 overflow-hidden">
//             <div className="flex h-full max-w-7xl mx-auto px-4">
//                 {/* Sidebar for desktop */}
//                 <div className="hidden md:block">{Sidebar}</div>

//                 {/* Sidebar for mobile */}
//                 {showSidebarMobile && (
//                     <div className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden" onClick={() => setShowSidebarMobile(false)}>
//                         <div className="w-64 bg-gray-50 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
//                             {Sidebar}
//                         </div>
//                     </div>
//                 )}

//                 {/* Main Content: on mobile, full width if sidebar hidden */}
//                 <div className={`flex-1 overflow-y-auto transition-all duration-300 ${showSidebarMobile ? 'hidden md:block' : 'block'
//                     } p-6 w-full'}`}>
//                     {renderContent()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const TechnicianDashboardWithProvider = () => (
//   <TechnicianProfileProvider technicianId={TECHNICIAN_ID}>
//     <TechnicianDashboard />
//   </TechnicianProfileProvider>
// );

// export default TechnicianDashboardWithProvider;