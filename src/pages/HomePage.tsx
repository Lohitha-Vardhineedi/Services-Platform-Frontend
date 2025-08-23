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
import BlogGrid from "../components/blogs/BlogGrid";
import BlogDetail from "../components/blogs/BlogDetail";
import { useState } from "react";


const HomePage = () => {
    // Dummy handler for "Read More" action
    const onReadMore = (blog: Blog) => {
        // Implement navigation or modal logic here
        console.log("Read more clicked for blog:", blog);
    };

    // Dummy blogs array for demonstration (replace with actual data source)
    const blogs: Blog[] = [];

    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    function handleBackToBlog(): void {
        setSelectedBlog(null);
    }

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

  <BlogGrid
        blogs={blogs.slice(0, 8)} // Show first 8 blogs on homepage
        onReadMore={onReadMore}
    />

                </div>
                {/* <MoviesSection /> */}
                {/* <CitiesSection /> */}
                {/* <RainyDaySection /> */}
                <CustomerReviews />
                <div className="relative z-[1]">
                <ServiceCardsRow />
                </div>
            </main>
        </>
    )
}

export default HomePage;