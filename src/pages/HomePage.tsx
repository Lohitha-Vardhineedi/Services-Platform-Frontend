import SearchBarSection from "../components/homepage/SearchBarSection";
import ServiceCardsRow from "../components/homepage/ServiceCardsRow";
import CategoriesGrid from "../components/homepage/CategoriesGrid";
import WeddingBeautyRow from "../components/homepage/WeddingBeautyRow";
import RepairDailyRow from "../components/homepage/RepairDailyRow";
import BillsTravelRow from "../components/homepage/BillsTravelRow";
import TrendingSection from "../components/homepage/TrendingSection";
import PopularSearchesSection from "../components/homepage/PopularSearchesSection";
import CitiesSection from "../components/homepage/CitiesSection";
import RainyDaySection from "../components/homepage/RainyDaySection";
import CustomerReviews from "../components/homepage/CustomerReviews";
import BlogApp from "../components/blogs/BlogApp";
const HomePage = () => {
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBarSection />
        <CategoriesGrid lang="en" />
        {/* <WeddingBeautyRow />
        <RepairDailyRow />
        <BillsTravelRow /> */}
        <div className="relative z-[1]">
          <TrendingSection />
          <PopularSearchesSection />
          <BlogApp />
          <CustomerReviews />
        </div>
        <div className="relative z-[1]">
          <ServiceCardsRow />
        </div>
      </main>
    </>
  );
};

export default HomePage;
