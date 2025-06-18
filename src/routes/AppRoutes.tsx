import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import UserLogin from '../pages/login/UserLogin';
import TechnicianLogin from '../pages/login/TechnicianLogin';
import UserSignup from '../pages/signup/UserSignup';
import TechnicianSignup from '../pages/signup/TechnicianSignup';
import AuthLayout from '../components/layout/AuthLayout'; 
import SubscriptionPage from '../pages/SubscriptionPage';
import FranchisePage from '../pages/FranchisePage';
import PlanDetailsPage from '../pages/PlanDetailsPage';
import ComingSoonPage from '../pages/ComingSoonPage';
import CategoriesPage from '../pages/CategoriesPage';
import KeyFeaturesPage from '../pages/KeyFeaturesPage';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route element={<AuthLayout />}>
                <Route path="/login/user" element={<UserLogin />} />
                <Route path="/login/technician" element={<TechnicianLogin />} />
                <Route path="/signup/user" element={<UserSignup />} />
                <Route path="/signup/technician" element={<TechnicianSignup />} />
            </Route>    
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/plans/:id" element={<PlanDetailsPage />} />
            <Route path="/comingsoon" element={<ComingSoonPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/features" element={<KeyFeaturesPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
