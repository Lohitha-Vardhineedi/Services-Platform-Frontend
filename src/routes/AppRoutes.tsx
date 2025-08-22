import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
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
import CategoriesPage from '../pages/CategoriesPage';
import KeyFeaturesPage from '../pages/KeyFeaturesPage';
import ServicePage from '../pages/ServicePage';
import ProfilePage from '../pages/ProfilePage';
import CartPage from '../pages/CartPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import TransactionPage from '../pages/TransactionPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import TechnicianPhotos from '../pages/technician/TechnicianPhotos';
import TechnicianServices from '../pages/technician/TechnicianService';
import TechnicianReviews from '../pages/technician/TechnicianReviews';
import TechnicianProfile from '../pages/technician/TechnicianProfile';
import TechnicianSubscription from '../pages/technician/TechnicianSubscription';
import TechnicianSubscriptionPlans from '../pages/technician/TechnicianSubscriptionPlans';
import BuySubscription from '../pages/technician/BuySubscription';
import TechnicianTransactions from '../pages/technician/TechnicianTransactions';
import { GuestBooking } from '../pages/GuestBooking';
import SearchFilterPage from '../pages/SearchFilterPage';
import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
import TechnicianPanel from '../pages/technician/TechnicianPanel';
import { AuthContext } from '../context/AuthContext';
import ReferralPanel from '../components/referral/ReferralPanel';
import ReferralCodeInput from '../components/referral/ReferralCodeInput';
import ReferralModal from '../components/referral/ReferralModal';
// Define types
type UserRole = 'user' | 'technician';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

// PrivateRoute component to protect routes based on role
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('PrivateRoute must be used within an AuthProvider');
  }
  const { isAuthenticated, userRole, loading } = context;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={allowedRoles.includes('technician') ? '/login/technician' : '/login/user'} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<HomePage />} />
      <Route path="/:categoryname/:cityname/:areaname-pincode" element={<SearchFilterPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<KeyFeaturesPage />} />
      <Route path="/franchise" element={<FranchisePage />} />
      <Route path="/referral" element={<ReferralPanel isOpen={true} onClose={() => {}} />} />
      <Route path="/referral/code" element={<ReferralCodeInput />} />
      <Route path="/referral/modal" element={<ReferralModal isOpen={true} onClose={() => {}} />} />
      <Route path="/contact" element={<GuestBooking />} />
      <Route path="/technicians/:categoryId" element={<ServicePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/subscription/:subscriptionId" element={<PlanDetailsPage />}/>
      <Route path="*" element={<NotFoundPage />} />

      {/* Auth Routes - Login and Signup */}
      <Route element={<AuthLayout />}>
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/technician" element={<TechnicianLogin />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/signup/technician" element={<TechnicianSignup />} />
      </Route>

      {/* Common Private Routes - Accessible to both authenticated users and technicians */}
      <Route path="/technicianById/:technicianId" 
      element={<PrivateRoute allowedRoles={['user']}><ProfilePage /></PrivateRoute>}
      />

      {/* User Private Routes - Accessible only to authenticated users */}
      <Route
        path="/cart"
        element={
          <PrivateRoute allowedRoles={['user']}>
            <CartPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/editProfile"
        element={
          <PrivateRoute allowedRoles={['user']}>
            <ProfileEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute allowedRoles={['user']}>
            <TransactionPage />
          </PrivateRoute>
        }
      />

      {/* Technician Private Routes - Accessible only to authenticated technicians */}
      <Route
        path="/technician/dashboard"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/dashboardById"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            {/* Pass a valid data prop here. Replace 'null' with actual data as needed */}
            <TechnicianDashboard data={null} />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/photos"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianPhotos />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/services"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianServices />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/reviews"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianReviews />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/profile"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/subscription"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianSubscription />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/plans"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianSubscriptionPlans />
          </PrivateRoute>
        }
      />
      <Route
        path="/buyPlan"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <BuySubscription />
          </PrivateRoute>
        }
      />
      <Route
        path="/technician/transactions"
        element={
          <PrivateRoute allowedRoles={['technician']}>
            <TechnicianTransactions />
          </PrivateRoute>
        }
      />

      <Route
        path="/referral"
        element={
          <PrivateRoute allowedRoles={['user']}>
            <ReferralPanel isOpen={true} onClose={() => {}} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
// import { data, Route, Routes } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
// import AboutPage from '../pages/AboutPage';
// import NotFoundPage from '../pages/NotFoundPage';
// import UserLogin from '../pages/login/UserLogin';
// import TechnicianLogin from '../pages/login/TechnicianLogin';
// import UserSignup from '../pages/signup/UserSignup';
// import TechnicianSignup from '../pages/signup/TechnicianSignup';
// import AuthLayout from '../components/layout/AuthLayout'; 
// import FranchisePage from '../pages/FranchisePage';
// import PlanDetailsPage from '../pages/PlanDetailsPage';
// import ComingSoonPage from '../pages/ComingSoonPage';
// import CategoriesPage from '../pages/CategoriesPage';
// import KeyFeaturesPage from '../pages/KeyFeaturesPage';
// import ServicePage from '../pages/ServicePage';
// import ProfilePage from '../pages/ProfilePage';
// import CartPage from '../pages/CartPage';
// import ProfileEditPage from '../pages/ProfileEditPage';
// import ProfileEdit from '../pages/ProfileEdit';
// import TransactionPage from '../pages/TransactionPage';
// import SubscriptionPage from '../pages/SubscriptionPage';
// import TechnicianPhotos from '../pages/technician/TechnicianPhotos';
// import TechnicianServices from '../pages/technician/TechnicianService';
// import TechnicianReviews from '../pages/technician/TechnicianReviews';
// import TechnicianProfile from '../pages/technician/TechnicianProfile';
// import TechnicianSubscription from '../pages/technician/TechnicianSubscription';
// import TechnicianSubscriptionPlans from '../pages/technician/TechnicianSubscriptionPlans';
// import BuySubscription from '../pages/technician/BuySubscription';
// import TechnicianTransactions from '../pages/technician/TechnicianTransactions';
// import { GuestBooking } from '../pages/GuestBooking';
// import SerarchFilterPage from '../pages/SearchFilterPage';
// import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
// import TechnicianPanel from '../pages/technician/TechnicianPanel';

// const AppRoutes = () => {
//     return (
//         <Routes>
//             <Route path="/" element={<HomePage />}/>
//             <Route path="/:categoryname/:cityname/:areaname-pincode" element={<SerarchFilterPage />}/>
//             <Route element={<AuthLayout />}>
//                 <Route path="/login/user" element={<UserLogin />} />
//                 <Route path="/login/technician" element={<TechnicianLogin />}/>
//                 <Route path="/signup/user" element={<UserSignup />}/>
//                 <Route path="/signup/technician" element={<TechnicianSignup />}/>
//             </Route>   


//              <Route path="/categories" element={<CategoriesPage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/subscription" element={<SubscriptionPage/>}/>
//             <Route path="/subscription/:subscriptionId" element={<PlanDetailsPage />} />
//             <Route path="/features" element={<KeyFeaturesPage />} />
//             <Route path="/franchise" element={<FranchisePage />} />


//             <Route path="/technicians/:categoryId" element={<ServicePage />} />
//             <Route path="/contact" element={<GuestBooking />} />
//             <Route path="/technicianById/:technicianId" element={<ProfilePage />} />
//             <Route path="/cart" element={<CartPage/>} />
//             <Route path="/editProfile" element={<ProfileEditPage />} />
//             <Route path="/transactions" element={<TransactionPage/>} />


//             <Route path="/technician/dashboard" element={<TechnicianPanel/>} />
//             <Route path='/technician/dashboardById' element= {<TechnicianDashboard/>} />
//             <Route path="/technician/photos" element={<TechnicianPhotos />} />
//             <Route path="/technician/services" element={<TechnicianServices/>} />
//             <Route path="/technician/reviews" element={<TechnicianReviews />} />
//             <Route path="/technician/profile" element={<TechnicianProfile />} />
//             <Route path="/technician/subscription" element={<TechnicianSubscription />} />
//             <Route path="/technician/plans" element={<TechnicianSubscriptionPlans />} />
//             <Route path="/buyPlan" element={<BuySubscription />} />
//             <Route path="/technician/transactions" element={<TechnicianTransactions />} />

            

            
//             <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//     );
// };

// export default AppRoutes;
{/* <Route path="/comingsoon" element={<ComingSoonPage />} /> */}
{/* <Route path="/profile/edit" element={<ProfileEdit/>} /> */}