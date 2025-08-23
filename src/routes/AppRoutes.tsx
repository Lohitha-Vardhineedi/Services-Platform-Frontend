import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async'; // Use react-helmet-async
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
import ReferralMain from '../components/referral/ReferralMain';
import ReferralForm from '../components/referral/ReferralForm';

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
      <Route
        path="/"
        element={
          <>
            <Helmet>
              <title>Home - Your Service Platform</title>
              <meta name="description" content="Welcome to our service platform, connecting users with top technicians for all your needs." />
            </Helmet>
            <HomePage />
          </>
        }
      />
      <Route
        path="/:categoryname/:cityname/:areaname-pincode"
        element={<SearchFilterPage />}
      />
      <Route
        path="/categories"
        element={
          <>
            <Helmet>
              <title>Categories - Explore Services</title>
              <meta name="description" content="Browse a wide range of service categories to find the perfect technician for your needs." />
            </Helmet>
            <CategoriesPage />
          </>
        }
      />
      <Route
        path="/about"
        element={
          <>
            <Helmet>
              <title>About Us - Your Service Platform</title>
              <meta name="description" content="Learn more about our mission to connect users with reliable technicians." />
            </Helmet>
            <AboutPage />
          </>
        }
      />
      <Route
        path="/features"
        element={
          <>
            <Helmet>
              <title>Key Features - Service Platform</title>
              <meta name="description" content="Discover the key features that make our platform the best choice for your service needs." />
            </Helmet>
            <KeyFeaturesPage />
          </>
        }
      />
      <Route
        path="/franchise"
        element={
          <>
            <Helmet>
              <title>Franchise Opportunities</title>
              <meta name="description" content="Explore franchise opportunities with our growing service platform." />
            </Helmet>
            <FranchisePage />
          </>
        }
      />
      <Route
        path="/referral/code"
        element={
          <>
            <Helmet>
              <title>Referral Code - Invite Friends</title>
              <meta name="description" content="Invite your friends with a referral code and earn rewards." />
            </Helmet>
            <ReferralCodeInput />
          </>
        }
      />
      <Route
        path="/contact"
        element={
          <>
            <Helmet>
              <title>Contact Us - Guest Booking</title>
              <meta name="description" content="Get in touch with us or book a service as a guest." />
            </Helmet>
            <GuestBooking />
          </>
        }
      />
      <Route
        path="/technicians/:categoryId"
        element={<ServicePage />}
      />
      <Route
        path="/subscription"
        element={
          <>
            <Helmet>
              <title>Subscriptions - Choose Your Plan</title>
              <meta name="description" content="Explore our subscription plans to find the best fit for your needs." />
            </Helmet>
            <SubscriptionPage />
          </>
        }
      />
      <Route
        path="/subscription/:subscriptionId"
        element={<PlanDetailsPage />}
      />
      <Route
        path="*"
        element={
          <>
            <Helmet>
              <title>404 - Page Not Found</title>
              <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>
            <NotFoundPage />
          </>
        }
      />

      {/* Auth Routes - Login and Signup */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login/user"
          element={
            <>
              <Helmet>
                <title>User Login</title>
                <meta name="description" content="Log in as a user to access your account and book services." />
              </Helmet>
              <UserLogin />
            </>
          }
        />
        <Route
          path="/login/technician"
          element={
            <>
              <Helmet>
                <title>Technician Login</title>
                <meta name="description" content="Log in as a technician to manage your services and bookings." />
              </Helmet>
              <TechnicianLogin />
            </>
          }
        />
        <Route
          path="/signup/user"
          element={
            <>
              <Helmet>
                <title>User Signup</title>
                <meta name="description" content="Sign up as a user to start booking services with ease." />
              </Helmet>
              <UserSignup />
            </>
          }
        />
        <Route
          path="/signup/technician"
          element={
            <>
              <Helmet>
                <title>Technician Signup</title>
                <meta name="description" content="Join our platform as a technician and offer your services." />
              </Helmet>
              <TechnicianSignup />
            </>
          }
        />
      </Route>

      {/* Common Private Routes - Accessible to both authenticated users and technicians */}
      <Route
        path="/technicianById/:technicianId"
        element={
          <PrivateRoute allowedRoles={['user']}>
            <ProfilePage />
          </PrivateRoute>
        }
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
          <PrivateRoute allowedRoles={['user', 'technician']}>
            <ReferralMain />
          </PrivateRoute>
        }
      />
      <Route
        path="/referral/form"
        element={
          <PrivateRoute allowedRoles={['user', 'technician']}>
            <ReferralForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
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
// import CategoriesPage from '../pages/CategoriesPage';
// import KeyFeaturesPage from '../pages/KeyFeaturesPage';
// import ServicePage from '../pages/ServicePage';
// import ProfilePage from '../pages/ProfilePage';
// import CartPage from '../pages/CartPage';
// import ProfileEditPage from '../pages/ProfileEditPage';
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
// import SearchFilterPage from '../pages/SearchFilterPage';
// import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
// import TechnicianPanel from '../pages/technician/TechnicianPanel';
// import { AuthContext } from '../context/AuthContext';
// import ReferralPanel from '../components/referral/ReferralPanel';
// import ReferralCodeInput from '../components/referral/ReferralCodeInput';
// import ReferralModal from '../components/referral/ReferralModal';
// import ReferralMain from '../components/referral/ReferralMain';
// import ReferralForm from '../components/referral/ReferralForm';
// // Define types
// type UserRole = 'user' | 'technician';

// interface PrivateRouteProps {
//   children: React.ReactNode;
//   allowedRoles: UserRole[];
// }

// // PrivateRoute component to protect routes based on role
// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('PrivateRoute must be used within an AuthProvider');
//   }
//   const { isAuthenticated, userRole, loading } = context;

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to={allowedRoles.includes('technician') ? '/login/technician' : '/login/user'} replace />;
//   }

//   if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// const AppRoutes: React.FC = () => {
//   return (
//     <Routes>
//       {/* Public Routes - Accessible to everyone */}
//       <Route path="/" element={<HomePage />} />
//       <Route path="/:categoryname/:cityname/:areaname-pincode" element={<SearchFilterPage />} />
//       <Route path="/categories" element={<CategoriesPage />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/features" element={<KeyFeaturesPage />} />
//       <Route path="/franchise" element={<FranchisePage />} />
//       <Route path="/referral/code" element={<ReferralCodeInput />} />
      
//       {/* <Route path="/referral/modal" element={<ReferralModal isOpen={true} onClose={false} />} /> */}
//       <Route path="/contact" element={<GuestBooking />} />
//       <Route path="/technicians/:categoryId" element={<ServicePage />} />
//       <Route path="/subscription" element={<SubscriptionPage />} />
//       <Route path="/subscription/:subscriptionId" element={<PlanDetailsPage />}/>
//       <Route path="*" element={<NotFoundPage />} />

//       {/* Auth Routes - Login and Signup */}
//       <Route element={<AuthLayout />}>
//         <Route path="/login/user" element={<UserLogin />} />
//         <Route path="/login/technician" element={<TechnicianLogin />} />
//         <Route path="/signup/user" element={<UserSignup />} />
//         <Route path="/signup/technician" element={<TechnicianSignup />} />
//       </Route>

//       {/* Common Private Routes - Accessible to both authenticated users and technicians */}
//       <Route path="/technicianById/:technicianId" 
//       element={<PrivateRoute allowedRoles={['user']}><ProfilePage /></PrivateRoute>}
//       />

//       {/* User Private Routes - Accessible only to authenticated users */}
//       <Route
//         path="/cart"
//         element={
//           <PrivateRoute allowedRoles={['user']}>
//             <CartPage />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/editProfile"
//         element={
//           <PrivateRoute allowedRoles={['user']}>
//             <ProfileEditPage />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/transactions"
//         element={
//           <PrivateRoute allowedRoles={['user']}>
//             <TransactionPage />
//           </PrivateRoute>
//         }
//       />

//       {/* Technician Private Routes - Accessible only to authenticated technicians */}
//       <Route
//         path="/technician/dashboard"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianPanel />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/dashboardById"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             {/* Pass a valid data prop here. Replace 'null' with actual data as needed */}
//             <TechnicianDashboard data={null} />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/photos"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianPhotos />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/services"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianServices />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/reviews"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianReviews />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/profile"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianProfile />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/subscription"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianSubscription />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/plans"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianSubscriptionPlans />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/buyPlan"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <BuySubscription />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/technician/transactions"
//         element={
//           <PrivateRoute allowedRoles={['technician']}>
//             <TechnicianTransactions />
//           </PrivateRoute>
//         }
//       />

//       <Route path="/referral" element={
//         <PrivateRoute allowedRoles={['user','technician']}>
//           <ReferralMain />
//         </PrivateRoute>
//       }
//       />
//       <Route path="/referral/form" element={
//         <PrivateRoute allowedRoles={['user','technician']}>
//           <ReferralForm />
//         </PrivateRoute>
//         }
//         />
//     </Routes>
//   );
// };

// export default AppRoutes;
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