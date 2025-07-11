import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    UserCog, 
    PlusSquare, 
    Image, 
    List, 
    CreditCard,
    Star 
} from 'lucide-react';

interface TechnicianSidebarProps {
    showSidebarMobile: boolean;
    setShowSidebarMobile: (value: boolean) => void;
}

const TechnicianSidebar: React.FC<TechnicianSidebarProps> = ({ showSidebarMobile, setShowSidebarMobile }) => {
    const location = useLocation();
    
    // Map path to menu item key for correct tab highlighting
    const pathToKey: { [key: string]: string } = {
        'dashboard': 'dashboard',
        'profile': 'profile',
        'services': 'services',
        'photos': 'photos',
        'reviews': 'reviews',
        'transactions': 'transactions',
        'subscription': 'subscription',
    };
    
    const selectedTab = pathToKey[location.pathname.split('/').pop() || 'dashboard'] || 'dashboard';

    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/technician/dashboardById' },
        { key: 'profile', label: 'Profile', icon: <UserCog size={20} />, path: '/technician/profile' },
        { key: 'services', label: 'Services', icon: <PlusSquare size={20} />, path: '/technician/services' },
        { key: 'photos', label: 'Photos', icon: <Image size={20} />, path: '/technician/photos' },
        { key: 'reviews', label: 'Reviews', icon: <Star size={20} />, path: '/technician/reviews' },
        { key: 'transactions', label: 'Transactions', icon: <List size={20} />, path: '/technician/transactions' },
        { key: 'subscription', label: 'Subscriptions', icon: <CreditCard size={20} />, path: '/technician/subscription' },
    ];

    const SidebarContent = (
        <div className="h-full border-r border-gray-200 bg-gray-50 p-4 flex flex-col w-full md:w-64">
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.key}
                        to={item.path}
                        onClick={() => {
                            if (window.innerWidth < 768) setShowSidebarMobile(false);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-md text-sm hover:bg-orange-100 transition ${
                            selectedTab === item.key ? 'bg-orange-200 font-semibold' : ''
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">{SidebarContent}</div>
            
            {/* Mobile Sidebar */}
            {showSidebarMobile && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden"
                    onClick={() => setShowSidebarMobile(false)}
                >
                    <div 
                        className="w-64 bg-gray-50 h-full shadow-lg" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {SidebarContent}
                    </div>
                </div>
            )}
        </>
    );
};

export default TechnicianSidebar;