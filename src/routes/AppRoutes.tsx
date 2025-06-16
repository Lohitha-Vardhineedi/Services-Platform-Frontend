import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import UserLogin from '../pages/login/UserLogin';
import TechnicianLogin from '../pages/login/TechnicianLogin';
import UserSignup from '../pages/signup/UserSignup';
import TechnicianSignup from '../pages/signup/TechnicianSignup';
import AuthLayout from '../components/layout/AuthLayout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route element={<AuthLayout />}>
                {/* Login Pages */}
                <Route path="/login/user" element={<UserLogin />} />
                <Route path="/login/technician" element={<TechnicianLogin />} />

                {/* Signup Pages */}
                <Route path="/signup/user" element={<UserSignup />} />
                <Route path="/signup/technician" element={<TechnicianSignup />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
