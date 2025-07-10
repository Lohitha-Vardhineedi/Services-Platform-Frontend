import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import UserLogin from '../pages/login/UserLogin';
import TechnicianLogin from '../pages/login/TechnicianLogin';
import UserSignup from '../pages/signup/UserSignup';
import TechnicianSignup from '../pages/signup/TechnicianSignup';
import AuthLayout from '../components/layout/AuthLayout'; 
import FranchisePage from '../pages/FranchisePage';
import PlanDetailsPage from '../pages/PlanDetailsPage';
import ComingSoonPage from '../pages/ComingSoonPage';
import CategoriesPage from '../pages/CategoriesPage';
import KeyFeaturesPage from '../pages/KeyFeaturesPage';
import ServicePage from '../pages/ServicePage';
import ProfilePage from '../pages/ProfilePage';
import CartPage from '../pages/CartPage';
import ContactPage from '../pages/ContactPage';
import ProfileEditPage from '../pages/ProfileEditPage';
// import ProfileEdit from '../components/profile/ProfileEdit';
// import TransactionPage from '../pages/TransactionPage';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import ProfileEdit from '../pages/ProfileEdit';
import TransactionPage from '../pages/TransactionPage';
import SubscriptionPage from '../pages/SubscriptionPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route element={<AuthLayout />}>
                <Route path="/login/user" element={<UserLogin />} />
                <Route path="/login/technician" element={<TechnicianLogin />}/>
                <Route path="/signup/user" element={<UserSignup />}/>
                <Route path="/signup/technician" element={<TechnicianSignup />}/>
            </Route>   


             <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/subscription" element={<SubscriptionPage/>}/>
            <Route path="/plans/:id" element={<PlanDetailsPage />} />
            <Route path="/features" element={<KeyFeaturesPage />} />
            <Route path="/franchise" element={<FranchisePage />} />


            <Route path="/technicians" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/technicianById" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/userEdit" element={<ProfileEditPage />} />
            <Route path="/transactions" element={<TransactionPage/>} />


            <Route path="/technician/dashboard" element={<TechnicianDashboard />} />

            

            {/* <Route path="/comingsoon" element={<ComingSoonPage />} /> */}
            {/* <Route path="/profile/edit" element={<ProfileEdit/>} /> */}
            
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;