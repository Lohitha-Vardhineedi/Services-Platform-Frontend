import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage.tsx';
import AboutPage from '../pages/AboutPage.tsx';
import NotFoundPage from '../pages/NotFoundPage.tsx';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
