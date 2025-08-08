import React, { useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { useNavigate } from "react-router-dom";

function TrendingSection() {
  const { categories, error, loading } = useContext(CategoryContext);
  const navigate = useNavigate()

  const trendingCategoryNames = [
    "Plumber Services",
    "Electrician Services",
    "Carpenter Services",
    "Painting Services",
    "Pest Control Services",
    "Deep Cleaning Services",
  ];

  const trendingCategories = categories.filter((category) =>
    trendingCategoryNames.includes(category.category_name)
  );

  if (loading)
    return (
      <div className="text-center text-gray-600 animate-pulse">
        Loading trending categories...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      {trendingCategories.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Trending Searches
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {trendingCategories.map((category, index) => (
              <div
                key={category._id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 flex flex-col items-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                onClick={() => {
                  navigate(`/technicians/${category._id}`, {
                    state: { category },
                  });
                }}
              >
                {/* Colorful background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Decorative ring effect */}
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500 transform -top-8 -left-8"></div>
                
                <img
                  src={category.category_image}
                  alt={category.category_name}
                  className="w-16 h-16 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="font-semibold text-sm text-gray-800 text-center relative z-10 mt-2 transition-colors duration-300 group-hover:text-indigo-600">
                  {category.category_name}
                </h3>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:opacity-60 transform -skew-x-12 transition-all duration-300 translate-x-[-150%] group-hover:translate-x-[150%]"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No trending categories available.
        </p>
      )}
    </div>
  );
}

export default TrendingSection;
// import React, { useContext } from "react";
// import { CategoryContext } from "../../context/CategoryContext";

// function TrendingSection() {
//   const { categories, error, loading } = useContext(CategoryContext);

//   // Define the specific categories to display
//   const trendingCategoryNames = [
//     "Plumber Services",
//     "Electrician Services",
//     "Carpenter Services",
//     "Painting Services",
//     "Pest Control Services",
//     "Deep Cleaning Services",
//   ];

//   // Filter categories to only include the trending ones
//   const trendingCategories = categories.filter((category) =>
//     trendingCategoryNames.includes(category.category_name)
//   );

//   if (loading)
//     return (
//       <div className="text-center text-gray-600">
//         Loading trending categories...
//       </div>
//     );
//   if (error)
//     return <div className="text-center text-red-500">Error: {error}</div>;

//   return (
//     <div className="container mx-auto">
//       {trendingCategories.length > 0 ? (
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
//             Trending Searches
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
//             {trendingCategories.map((category) => (
//               <div
//                 key={category._id}
//                 className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
//               >
//                 <img
//                   src={category.category_image}
//                   alt={category.category_name}
//                   className="max-w-xl h-20 object-cover rounded mb-2"
//                 />
//                 <h3 className="font-semibold text-sm text-gray-800 text-center">
//                   {category.category_name}
//                 </h3>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">
//           No trending categories available.
//         </p>
//       )}
//     </div>
//   );
// }

// export default TrendingSection;
 // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        //   {trendingCategories.map((category) => (
        //     <div
        //       key={category._id}
        //       className="group relative bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        //     >
        //       <img
        //         src={category.category_image}
        //         alt={category.category_name}
        //         className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
        //       />
        //       <div className="p-4 text-center">
        //         <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
        //           {category.category_name}
        //         </h3>
        //       </div>
        //       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        //     </div>
        //   ))}
        // </div>
// import React from 'react';
// import { trendingSearches } from '../../data/trendingSearchesData';

// function TrendingSection() {
//   return (
// <div className="mb-12">
//   <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Trending Searches</h2>
//   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
//     {trendingSearches.map((item, idx) => (
//       <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
//         <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
//         <h3 className="font-semibold text-sm text-gray-800 text-center">{item.name}</h3>
//       </div>
//     ))}
//   </div>
// </div>
//   );
// }

// export default TrendingSection;
