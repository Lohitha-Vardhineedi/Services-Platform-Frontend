import React from 'react';
import { useTechnicianProfile } from '../../context/TechnicianProfileContext';
import TechnicianPanel from './TechnicianPanel';
import TechnicianProfile from './TechnicianProfile';
import TechnicianServices from './TechnicianService';
import TechnicianPhotos from './TechnicianPhotos';
import TechnicianReviews from './TechnicianReviews';
import TechnicianTransactions from './TechnicianTransactions';
import TechnicianSubscription from './TechnicianSubscription';


interface TechnicianMainContentProps {
    showSidebarMobile: boolean;
    activeTab: string;
}

const TechnicianMainContent: React.FC<TechnicianMainContentProps> = ({ 
    showSidebarMobile, 
    activeTab 
}) => {
    const { loading, error } = useTechnicianProfile();

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TechnicianPanel />;
            case 'profile':
                return <TechnicianProfile/>;
            case 'services':
                return <TechnicianServices />;
            case 'photos':
                return <TechnicianPhotos />;
            case 'reviews':
                return <TechnicianReviews />;
            case 'transactions':
                return <TechnicianTransactions />;
            case 'subscription':
                return <TechnicianSubscription />;
            default:
                return <TechnicianPanel />;
        }
    };

    return (
        <div
            className={`flex-1 overflow-y-auto transition-all duration-300 ${
                showSidebarMobile ? 'blur-sm md:blur-none' : ''
            } p-6 ml-0 md:ml-0`}
        >
            <div className="max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default TechnicianMainContent;
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { useTechnicianProfile } from '../../context/TechnicianProfileContext';
// import TechnicianPanel from './TechnicianPanel';

// interface TechnicianMainContentProps {
//     showSidebarMobile: boolean;
// }

// const TechnicianMainContent: React.FC<TechnicianMainContentProps> = ({ showSidebarMobile }) => {
//     const { loading, error } = useTechnicianProfile();

//     return (
//         <div
//             className={`flex-1 overflow-y-auto transition-all duration-300 ${
//                 showSidebarMobile ? 'hidden md:block' : 'block'
//             } p-6 w-full`}
//         >
//             {loading ? (
//                 <div>Loading...</div>
//             ) : error ? (
//                 <TechnicianPanel />
//             ) : (
//                 <Outlet />
//             )}
//         </div>
//     );
// };

// export default TechnicianMainContent;