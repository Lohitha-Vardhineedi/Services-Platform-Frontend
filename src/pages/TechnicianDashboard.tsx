import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, UserCog, PlusSquare, Image, List, CreditCard,
    Star
} from 'lucide-react';
import SubscriptionPage from './SubscriptionPage';
import Reviews from '../components/profile/Reviews';
import Photos from '../components/profile/Photos';
import TransactionPage from './TransactionPage';
import Services from '../components/profile/Services';
import ProfileCard from '../components/profile/ProfileCard';
import TechnicianHomeView from '../components/profile/TechnicianHomeView';

const TechnicianDashboard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [showSidebarMobile, setShowSidebarMobile] = useState(true);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        console.log("Stored Value",storedRole)
        setRole(storedRole);
    }, []);

    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { key: 'profile', label: 'Profile', icon: <UserCog size={20} /> },
        { key: 'service', label: 'Service', icon: <PlusSquare size={20} /> },
        { key: 'photos', label: 'Photos', icon: <Image size={20} /> },
        { key: 'reviews', label: 'Reviews ', icon: <Star size={20} /> },
        { key: 'transactions', label: 'Transactions', icon: <List size={20} /> },
        { key: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} /> },
    ];

    const renderContent = () => {
        switch (selectedTab) {
            case 'dashboard':
                return <TechnicianHomeView />;
            case 'profile':
                return <ProfileCard />;
            case 'service':
                return <Services />;;
            case 'photos':
                return <Photos />;
            case 'reviews':
                return <Reviews />;
            case 'transactions':
                return <TransactionPage />;
            case 'subscriptions':
                return <SubscriptionPage />;
            default:
                return <DashboardHomeView />;
        }
    };

    // Sidebar component
    const Sidebar = (
        <div className="h-full border-r border-gray-200 bg-gray-50 p-4 flex flex-col w-64">
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => {
                            setSelectedTab(item.key);
                            // On mobile, hide sidebar after selecting
                            if (window.innerWidth < 768) setShowSidebarMobile(false);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-md text-sm hover:bg-orange-100 transition ${selectedTab === item.key ? 'bg-orange-200 font-semibold' : ''
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 text-gray-800 overflow-hidden">
            <div className="flex h-full max-w-7xl mx-auto px-4">
                {/* Sidebar for desktop */}
                <div className="hidden md:block">{Sidebar}</div>

                {/* Sidebar for mobile */}
                {showSidebarMobile && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden" onClick={() => setShowSidebarMobile(false)}>
                        <div className="w-64 bg-gray-50 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
                            {Sidebar}
                        </div>
                    </div>
                )}

                {/* Main Content: on mobile, full width if sidebar hidden */}
                <div className={`flex-1 overflow-y-auto transition-all duration-300 ${showSidebarMobile ? 'hidden md:block' : 'block'
                    } p-6 w-full'}`}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;