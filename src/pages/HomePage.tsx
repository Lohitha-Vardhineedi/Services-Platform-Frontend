import React from "react";
import { Link } from "react-router-dom";
import SearchBarSection from "../components/homepage/SearchBarSection";
import ServiceCardsRow from "../components/homepage/ServiceCardsRow";
import CategoriesGrid from "../components/homepage/CategoriesGrid";
import TrendingSection from "../components/homepage/TrendingSection";
import PopularSearchesSection from "../components/homepage/PopularSearchesSection";
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

        <div className="relative z-[1]">
          {/* 🔥 Trending & Popular */}
          <TrendingSection />
          <PopularSearchesSection />

          {/* 📰 Blogs horizontally scrollable */}
          <section className="mt-8">
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

      {/* 📌 Footer Routes Links */}
      <footer className="bg-gray-100 border-t border-gray-300 mt-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-6 justify-center text-sm text-gray-700">
          <Link to="/professional-agreement" className="hover:text-blue-600">
            Professional Agreement
          </Link>
          <Link to="/refund-policy" className="hover:text-blue-600">
            Refund Policy
          </Link>
          <Link to="/terms-conditions" className="hover:text-blue-600">
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:text-blue-600">
            Privacy Policy
          </Link>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} PRNV Services. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default HomePage;
