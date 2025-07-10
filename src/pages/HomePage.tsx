import SearchBarSection from "../components/homepage/SearchBarSection";
import ServiceCardsRow from "../components/homepage/ServiceCardsRow";
import CategoriesGrid from "../components/homepage/CategoriesGrid.js";
import WeddingBeautyRow from "../components/homepage/WeddingBeautyRow";
import RepairDailyRow from "../components/homepage/RepairDailyRow.js";
import BillsTravelRow from "../components/homepage/BillsTravelRow.js";
import TrendingSection from "../components/homepage/TrendingSection";
import PopularSearchesSection from "../components/homepage/PopularSearchesSection";
import CitiesSection from "../components/homepage/CitiesSection";
import RainyDaySection from "../components/homepage/RainyDaySection";
import CustomerReviews from "../components/homepage/CustomerReviews.js";

const HomePage = () => {
    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchBarSection />
                <CategoriesGrid lang="en" />
                {/* <WeddingBeautyRow />
                <RepairDailyRow />
                <BillsTravelRow /> */}
                <TrendingSection />
                <PopularSearchesSection />
                {/* <MoviesSection /> */}
                {/* <CitiesSection /> */}
                {/* <RainyDaySection /> */}
                <CustomerReviews />
                <ServiceCardsRow />
            </main>
        </>
    )
}

export default HomePage;