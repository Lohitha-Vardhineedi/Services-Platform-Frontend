import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Pages/Signup/Signup";
import "./index.css";
import Login from "./Pages/Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import HomePage from "./Pages/HomePage/HomePage";
import "swiper/css"; // Core Swiper
import CategoryDetailPage from "./Pages/CategoryDetailPage/CategoryDetailPage";
import PartnerProfilePage from "./Pages/PartnerProfilePage/PartnerProfilePage";
import AllIndiaPage from "./Pages/AllIndiapage/AllIndiaPage";
import CategoriesPage from "./Pages/CategoriesPage/CategoriesPage";
import SubscriptionPlans from "./Pages/SubscriptionPlans/SubscriptionPland";
import LeadsDashboard from "./Pages/LeadsPage/LeadsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryDetailPage />} />
          <Route path="/profile" element={<PartnerProfilePage />} />
          <Route path="/all-india-page" element={<AllIndiaPage />} />
          <Route path="/all-categories" element={<CategoriesPage />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/leads" element={<LeadsDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
