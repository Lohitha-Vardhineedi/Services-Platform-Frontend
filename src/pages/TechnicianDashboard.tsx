import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { TechnicianProfileProvider } from '../context/TechnicianProfileContext';
import TechnicianSidebar from './technician/TechnicianSidebar';
import TechnicianMainContent from './technician/TechnicianMainContent';

const TECHNICIAN_ID = localStorage.getItem('userId') || "686a65f24551a5e01e71afb9";

const TechnicianDashboard: React.FC = () => {
    const [showSidebarMobile, setShowSidebarMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const userData = user ? JSON.parse(user) : {};
        setRole(userData.role || null);
    }, []);

    useEffect(() => {
        // Set initial tab based on current path
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        if (lastSegment && lastSegment !== 'technician') {
            setActiveTab(lastSegment.replace('dashboardById', 'dashboard'));
        }
    }, []);

    // Redirect non-technicians
    if (role && role !== 'technician') {
        return <Navigate to="/profile" replace />;
    }

    return (
        <TechnicianProfileProvider technicianId={TECHNICIAN_ID}>
            <div className="h-screen bg-gray-50 text-gray-800 overflow-hidden">
                <div className="flex h-full max-w-7xl mx-auto">
                    {/* Sidebar */}
                    <TechnicianSidebar 
                        showSidebarMobile={showSidebarMobile}
                        setShowSidebarMobile={setShowSidebarMobile}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    {/* Main Content */}
                    <TechnicianMainContent 
                        showSidebarMobile={showSidebarMobile}
                        activeTab={activeTab}
                    />
                </div>
            </div>
        </TechnicianProfileProvider>
    );
};

export default TechnicianDashboard;
// TechnicianDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { TechnicianProfileProvider } from '../context/TechnicianProfileContext';
// import TechnicianSidebar from './technician/TechnicianSidebar';
// import TechnicianMainContent from './technician/TechnicianMainContent';
// import TechnicianPanel from './technician/TechnicianPanel';
// import TechnicianServices from './technician/TechnicianService';
// import TechnicianProfile from './technician/TechnicianProfile';
// import TechnicianPhotos from './technician/TechnicianPhotos';
// import TechnicianReviews from './technician/TechnicianReviews';
// import TechnicianTransactions from './technician/TechnicianTransactions';
// import TechnicianSubscription from './technician/TechnicianSubscription';

// const TECHNICIAN_ID = localStorage.getItem('userId') || "686a65f24551a5e01e71afb9";

// const TechnicianDashboard: React.FC = () => {
//     const [showSidebarMobile, setShowSidebarMobile] = useState(false);
//     const [role, setRole] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('dashboard');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const user = localStorage.getItem('user');
//         const userData = user ? JSON.parse(user) : {};
//         setRole(userData.role || null);
//     }, []);

//     // Redirect non-technicians
//     if (role && role !== 'technician') {
//         return <Navigate to="/profile" replace />;
//     }

//     const components: { [key: string]: JSX.Element } = {
//         dashboard: <TechnicianPanel />,
//         profile: <TechnicianProfile />,
//         services: <TechnicianServices/>,
//         photos: <TechnicianPhotos />,
//         reviews: <TechnicianReviews />,
//         transactions: <TechnicianTransactions />,
//         subscription: <TechnicianSubscription />,
//     };

//     const handleTabChange = (tab: string, path: string) => {
//         setActiveTab(tab);
//         navigate(path);
//         if (window.innerWidth < 768) setShowSidebarMobile(false);
//     };

//     return (
//         <TechnicianProfileProvider technicianId={TECHNICIAN_ID}>
//             <div className="h-screen bg-gray-50 text-gray-800 overflow-hidden">
//                 <div className="flex flex-col md:flex-row h-full max-w-7xl mx-auto px-4">
//                     <TechnicianSidebar 
//                         showSidebarMobile={showSidebarMobile}
//                         setShowSidebarMobile={setShowSidebarMobile}
//                         activeTab={activeTab}
//                         onTabChange={handleTabChange}
//                     />
//                     <TechnicianMainContent 
//                         showSidebarMobile={showSidebarMobile}
//                         activeComponent={components[activeTab]}
//                     />
//                 </div>
//             </div>
//         </TechnicianProfileProvider>
//     );
// };

// export default TechnicianDashboard;