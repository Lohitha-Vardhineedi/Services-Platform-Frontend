import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTechnicianProfile } from '../../context/TechnicianProfileContext';
import TechnicianPanel from './TechnicianPanel';

interface TechnicianMainContentProps {
    showSidebarMobile: boolean;
}

const TechnicianMainContent: React.FC<TechnicianMainContentProps> = ({ showSidebarMobile }) => {
    const { loading, error } = useTechnicianProfile();

    return (
        <div
            className={`flex-1 overflow-y-auto transition-all duration-300 ${
                showSidebarMobile ? 'hidden md:block' : 'block'
            } p-6 w-full`}
        >
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <TechnicianPanel />
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default TechnicianMainContent;