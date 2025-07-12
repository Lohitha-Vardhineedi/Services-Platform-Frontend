import React from 'react';
import { 
    LayoutDashboard, 
    UserCog, 
    PlusSquare, 
    Image, 
    List, 
    CreditCard,
    Star,
    Menu,
    X
} from 'lucide-react';

interface TechnicianSidebarProps {
    showSidebarMobile: boolean;
    setShowSidebarMobile: (value: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TechnicianSidebar: React.FC<TechnicianSidebarProps> = ({ 
    showSidebarMobile, 
    setShowSidebarMobile,
    activeTab,
    setActiveTab
}) => {
    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { key: 'profile', label: 'Profile', icon: <UserCog size={20} /> },
        { key: 'services', label: 'Services', icon: <PlusSquare size={20} /> },
        { key: 'photos', label: 'Photos', icon: <Image size={20} /> },
        { key: 'reviews', label: 'Reviews', icon: <Star size={20} /> },
        { key: 'transactions', label: 'Transactions', icon: <List size={20} /> },
        { key: 'subscription', label: 'Subscriptions', icon: <CreditCard size={20} /> },
    ];

    const handleTabClick = (key: string) => {
        setActiveTab(key);
        if (window.innerWidth < 768) {
            setShowSidebarMobile(false);
        }
        // Update URL without page reload
        const newPath = `/technician/${key === 'dashboard' ? 'dashboardById' : key}`;
        window.history.pushState(null, '', newPath);
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className={`h-full bg-white border-r border-gray-200 flex flex-col ${
            isMobile ? 'w-64' : 'w-16 lg:w-64'
        }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                {isMobile && (
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                        <button
                            onClick={() => setShowSidebarMobile(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
                {!isMobile && (
                    <div className="hidden lg:block">
                        <h2 className="text-lg font-semibold text-gray-800">Technician</h2>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleTabClick(item.key)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200 group ${
                                activeTab === item.key 
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        >
                            <span className={`${
                                activeTab === item.key ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'
                            }`}>
                                {item.icon}
                            </span>
                            <span className={`${
                                isMobile ? 'block' : 'hidden lg:block'
                            } font-medium`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setShowSidebarMobile(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
                <Menu size={20} />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <SidebarContent />
            </div>
            
            {/* Mobile Sidebar Overlay */}
            {showSidebarMobile && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setShowSidebarMobile(false)}
                >
                    <div 
                        className="bg-white h-full shadow-xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent isMobile />
                    </div>
                </div>
            )}
        </>
    );
};

export default TechnicianSidebar;
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//     LayoutDashboard, 
//     UserCog, 
//     PlusSquare, 
//     Image, 
//     List, 
//     CreditCard,
//     Star 
// } from 'lucide-react';

// interface TechnicianSidebarProps {
//     showSidebarMobile: boolean;
//     setShowSidebarMobile: (value: boolean) => void;
// }

// const TechnicianSidebar: React.FC<TechnicianSidebarProps> = ({ showSidebarMobile, setShowSidebarMobile }) => {
//     const location = useLocation();
    
//     // Map path to menu item key for correct tab highlighting
//     const pathToKey: { [key: string]: string } = {
//         'dashboard': 'dashboard',
//         'profile': 'profile',
//         'services': 'services',
//         'photos': 'photos',
//         'reviews': 'reviews',
//         'transactions': 'transactions',
//         'subscription': 'subscription',
//     };
    
//     const selectedTab = pathToKey[location.pathname.split('/').pop() || 'dashboard'] || 'dashboard';

//     const menuItems = [
//         { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/technician/dashboardById' },
//         { key: 'profile', label: 'Profile', icon: <UserCog size={20} />, path: '/technician/profile' },
//         { key: 'services', label: 'Services', icon: <PlusSquare size={20} />, path: '/technician/services' },
//         { key: 'photos', label: 'Photos', icon: <Image size={20} />, path: '/technician/photos' },
//         { key: 'reviews', label: 'Reviews', icon: <Star size={20} />, path: '/technician/reviews' },
//         { key: 'transactions', label: 'Transactions', icon: <List size={20} />, path: '/technician/transactions' },
//         { key: 'subscription', label: 'Subscriptions', icon: <CreditCard size={20} />, path: '/technician/subscription' },
//     ];

//     const SidebarContent = (
//         <div className="h-full border-r border-gray-200 bg-gray-50 p-4 flex flex-col w-full md:w-64">
//             <nav className="flex flex-col gap-2">
//                 {menuItems.map((item) => (
//                     <Link
//                         key={item.key}
//                         to={item.path}
//                         onClick={() => {
//                             if (window.innerWidth < 768) setShowSidebarMobile(false);
//                         }}
//                         className={`flex items-center gap-3 p-2 rounded-md text-sm hover:bg-orange-100 transition ${
//                             selectedTab === item.key ? 'bg-orange-200 font-semibold' : ''
//                         }`}
//                     >
//                         <span>{item.icon}</span>
//                         <span>{item.label}</span>
//                     </Link>
//                 ))}
//             </nav>
//         </div>
//     );

//     return (
//         <>
//             {/* Desktop Sidebar */}
//             <div className="hidden md:block">{SidebarContent}</div>
            
//             {/* Mobile Sidebar */}
//             {showSidebarMobile && (
//                 <div
//                     className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden"
//                     onClick={() => setShowSidebarMobile(false)}
//                 >
//                     <div 
//                         className="w-64 bg-gray-50 h-full shadow-lg" 
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {SidebarContent}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default TechnicianSidebar;