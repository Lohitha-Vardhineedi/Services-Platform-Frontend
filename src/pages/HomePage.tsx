import React from "react";
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
import BlogListPage from "../components/blogs/BlogListPage";

const HomePage = () => {
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔍 Search bar */}
        <SearchBarSection />

        {/* 🏷️ Categories */}
        <CategoriesGrid lang="en" />

        {/* Optional sections */}
        {/* <WeddingBeautyRow />
        <RepairDailyRow />
        <BillsTravelRow /> */}

        <div className="relative z-[1]">
          {/* 🔥 Trending & Popular */}
          <TrendingSection />
          <PopularSearchesSection />

          {/* 📰 Blogs horizontally scrollable */}
          <section className="mt-8">
            {/* <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2> */}
            <BlogListPage />
          </section>

          {/* ⭐ Customer Reviews */}
          <CustomerReviews />
        </div>

        <div className="relative z-[1] mt-8">
          {/* 💼 Services */}
          <ServiceCardsRow />
        </div>
      </main>
    </>
  );
};

export default HomePage;
