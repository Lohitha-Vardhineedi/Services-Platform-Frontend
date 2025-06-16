import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBarSection from './components/SearchBarSection';
import ServiceCardsRow from './components/ServiceCardsRow';
import CategoriesGrid from './components/CategoriesGrid';
import CustomerReviews from './components/CustomerReviews';
import WeddingBeautyRow from './components/WeddingBeautyRow';
import RepairDailyRow from './components/RepairDailyRow';
import BillsTravelRow from './components/BillsTravelRow';
import TrendingSection from './components/TrendingSection';
import PopularSearchesSection from './components/PopularSearchesSection';
// import MoviesSection from './components/MoviesSection';
import CitiesSection from './components/CitiesSection';
import RainyDaySection from './components/RainyDaySection';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBarSection />
        <ServiceCardsRow />
        <CategoriesGrid lang="en" />
        <WeddingBeautyRow />
        <RepairDailyRow />
        <BillsTravelRow />
        <TrendingSection />
        <PopularSearchesSection />
        {/* <MoviesSection /> */}
        <CitiesSection />
        <RainyDaySection />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
}

export default App;