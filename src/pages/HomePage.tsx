const HomePage = () => {
    return (
        <>
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
        </>
    )
}

export default HomePage;