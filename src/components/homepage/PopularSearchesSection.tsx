import React, { useContext } from 'react';
import { CategoryContext } from '../../context/CategoryContext';
import { useNavigate } from 'react-router-dom';

const PopularSearchesSection = () => {
  const { categories, error, loading } = useContext(CategoryContext);
  const navigate = useNavigate()

  // Define the specific categories to display
  const popularCategoryNames = [
    'CCTV Repair & Services',
    'Lift Repair & Services',
    'Web & App Development Services',
    'Health Insurance Services',
    'Digital Marketing Services',
    'AC Repair & Services',
  ];

  // Filter categories to match the defined names, case-insensitive, and limit to 6
  const popularCategories = categories
    .filter((category) =>
      popularCategoryNames.some(
        (name) => category.category_name.toLowerCase() === name.toLowerCase()
      )
    )
    .slice(0, 6);

  if (loading)
    return (
      <div className="text-center text-gray-600 animate-pulse">
        Loading popular categories...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mb-12 bg-gradient-to-br from-teal-100 to-blue-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-left bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-shift">
        Popular Searches
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {popularCategories.length > 0 ? (
          popularCategories.map((category, idx) => (
            <div
              key={category._id}
              className="group relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:shadow-xl"
              onClick={() => {
                navigate(`/${category.category_slug}`, {
                  state: { category },
                });
              }}
            >
              {/* Animated gradient border on hover */}
              <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-gradient-to-r group-hover:from-emerald-400 group-hover:via-teal-400 group-hover:to-cyan-400 transition-all duration-500"></div>
              
              {/* Dynamic background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              <img
                src={category.category_image}
                alt={category.category_name}
                // className="max-w-20 max-h-20 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                className="w-16 h-16 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"

              />
              <h3 className="text-xs font-semibold text-gray-800 text-center transition-colors duration-300 group-hover:text-emerald-600 mt-2">
                {category.category_name}
              </h3>
              
              {/* Ripple effect on hover */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-cyan-200 to-transparent opacity-0 group-hover:opacity-50 transform scale-0 group-hover:scale-150 rounded-full transition-all duration-500 origin-center"></div> */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-6">
            No popular categories available.
          </p>
        )}
      </div>
    </div>
  );
};

export default PopularSearchesSection;
// import React, { useContext } from 'react';
// import { CategoryContext } from '../../context/CategoryContext';

// const PopularSearchesSection = () => {
//   const { categories, error, loading } = useContext(CategoryContext);

//   // Define the specific categories to display with their icons
//   const popularCategoriesData = [
//     { name: 'CCTV Repair & Services', icon: '📹' },
//     { name: 'Lift Repair & Services', icon: '🛗' },
//     { name: 'Web & App Development Services', icon: '💻' },
//     { name: 'Health Insurance Services', icon: '🩺' },
//     { name: 'Digital Marketing Services', icon: '📊' },
//     { name: 'AC Repair & Services', icon: '❄️' },
//   ];

//   // Filter categories to match the defined names, case-insensitive, and limit to 6
//   const popularCategories = categories
//     .filter((category) =>
//       popularCategoriesData.some(
//         (data) => category.category_name.toLowerCase() === data.name.toLowerCase()
//       )
//     )
//     .slice(0, 6);

//   if (loading)
//     return (
//       <div className="text-center text-gray-600 animate-pulse">
//         Loading popular categories...
//       </div>
//     );
//   if (error)
//     return <div className="text-center text-red-500">Error: {error}</div>;

//   return (
//     <div className="mb-12 bg-gradient-to-br from-teal-100 to-blue-50 p-6 rounded-lg">
//       <h2 className="text-2xl font-bold mb-4 text-left text-green-600">
//         Popular Searches
//       </h2>
//       <div className="grid grid-cols-6 gap-4">
//         {popularCategories.length > 0 ? (
//           popularCategories.map((category, idx) => {
//             const categoryData = popularCategoriesData.find(
//               (data) => data.name.toLowerCase() === category.category_name.toLowerCase()
//             );
//             return (
//               <div
//                 key={category._id}
//                 className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-300"
//               >
//                 <div className="text-3xl mb-2">{categoryData?.icon || '📌'}</div>
//                 <h3 className="text-xs font-semibold text-gray-800">
//                   {category.category_name}
//                 </h3>
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-500 col-span-6">
//             No popular categories available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PopularSearchesSection;
// import React, { useContext } from 'react';
// import { CategoryContext } from '../../context/CategoryContext';

// const PopularSearchesSection = () => {
//   const { categories, error, loading } = useContext(CategoryContext);

//   // Define the specific categories to display
//   const popularCategoryNames = [
//     'CCTV Repair & Services',
//     'Lift Repair & Services',
//     'Web & App Development Services',
//     'Digital Marketing Services',
//     'AC Repair & Services',
//     'Health Insurance Services',
//   ];

//   // Filter categories to only include the popular ones, case-insensitive, and limit to 6
//   const popularCategories = categories
//     .filter((category) =>
//       popularCategoryNames.some(
//         (name) => category.category_name.toLowerCase() === name.toLowerCase()
//       )
//     )
//     .slice(0, 6);

//   if (loading)
//     return (
//       <div className="text-center text-gray-600 animate-pulse">
//         Loading popular categories...
//       </div>
//     );
//   if (error)
//     return <div className="text-center text-red-500">Error: {error}</div>;

//   return (
//     <div className="mb-12">
//       <h2 className="text-2xl font-bold mb-4 text-left bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-shift">
//         Popular Searches
//       </h2>
//       <div className="grid grid-cols-6 gap-4">
//         {popularCategories.length > 0 ? (
//           popularCategories.map((category, idx) => (
//             <div
//               key={category._id}
//               className="group relative bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-md p-4 flex flex-col items-center overflow-hidden transition-all duration-300 hover:shadow-xl"
//             >
//               {/* Animated gradient border on hover */}
//               <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-gradient-to-r group-hover:from-emerald-400 group-hover:via-teal-400 group-hover:to-cyan-400 transition-all duration-500"></div>
              
//               {/* Dynamic background glow on hover */}
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              
//               <img
//                 src={category.category_image}
//                 alt={category.category_name}
//                 className="w-18 h-18 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
//               />
//               <h3 className="text-xs font-semibold text-gray-800 text-center transition-colors duration-300 group-hover:text-emerald-600">
//                 {category.category_name}
//               </h3>
              
//               {/* Ripple effect on hover */}
//               <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-cyan-200 to-transparent opacity-0 group-hover:opacity-50 transform scale-0 group-hover:scale-150 rounded-full transition-all duration-500 origin-center"></div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 col-span-6">
//             No popular categories available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PopularSearchesSection;
// import React, { useContext } from 'react';
// import { CategoryContext } from '../../context/CategoryContext';

// const PopularSearchesSection = () => {
//   const { categories, error, loading } = useContext(CategoryContext);

//   // Define the specific categories to display
//   const popularCategoryNames = [
//     'CCTV Repair & Services',
//     'Lift Repair & Services',
//     'Web & App Development Services',
//     'Digital Marketing Services',
//     'AC Repair & Services',
//     'Health Insurance Services',
//   ];

//   // Filter categories to only include the popular ones, case-insensitive
//   const popularCategories = categories.filter((category) =>
//     popularCategoryNames.some(
//       (name) => category.category_name.toLowerCase() === name.toLowerCase()
//     )
//   );

//   if (loading) return <div className="text-center text-gray-600">Loading popular categories...</div>;
//   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

//   return (
//     <div className="mb-12">
//       <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Popular Searches</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//         {popularCategories.length > 0 ? (
//           popularCategories.map((category, idx) => (
//             <div
//               key={category._id}
//               className="rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
//               style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
//             >
//               <img
//                 src={category.category_image}
//                 alt={category.category_name}
//                 className="w-full h-20 object-cover rounded mb-2"
//               />
//               <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
//                 {category.category_name}
//               </h3>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No popular categories available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PopularSearchesSection;
// import React from 'react';
// import { popularSearches } from '../../data/popularSearchesData';

// function PopularSearchesSection() {
//   return (
//     <div className="mb-12">
//       <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Popular Searches</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//         {popularSearches.map((item, idx) => (
//           <div key={idx} className={`rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in ${item.color}`}
//             style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
//           >
//             <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
//             <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
//               {item.name}
//             </h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PopularSearchesSection; 