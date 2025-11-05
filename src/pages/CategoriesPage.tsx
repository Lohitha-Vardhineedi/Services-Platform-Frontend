import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../context/CategoryContext';

const bgColors = [
  'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100',
  'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-orange-100'
];

const getRandomBgColor = (): string => {
  const i = Math.floor(Math.random() * bgColors.length);
  return bgColors[i];
};

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useContext(CategoryContext);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Split into active (status === 1) and inactive (status === 0)
  const popularCategories = categories
    .filter(cat => cat.status === 1)
    .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()));

  const otherCategories = categories
    .filter(cat => cat.status === 0)
    .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Most Popular Categories */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
          Most Popular Categories
        </h2>
        {popularCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCategories.map((category) => {
              const bgColor = getRandomBgColor();
              return (
                <div
                  key={category._id}
                  className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-white"
                  onClick={() =>
                    navigate(`/${category.category_slug}`, {
                      state: { category },
                    })
                  }
                >
                  <div
                    className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
                  >
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-category.png'; // optional fallback
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 text-center leading-tight">
                    {category.category_name}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-left">No popular categories available.</p>
        )}
      </section>

      {/* Other Categories */}
      <section className="mt-7">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
          Other Categories
        </h2>
        {otherCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherCategories.map((category) => {
              const bgColor = getRandomBgColor();
              return (
                <div
                  key={category._id}
                  className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white cursor-pointer"
                  onClick={() =>
                    navigate(`/${category.category_slug}`, {
                      state: { category },
                    })
                  }
                >
                  <div
                    className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
                  >
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-category.png';
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 text-center leading-tight">
                    {category.category_name}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-left">No other categories available.</p>
        )}
      </section>
    </div>
  );
};

export default CategoriesPage;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllCategories } from '../api/apiMethods';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   category_slug: string;
//   status: number;
// }

// const bgColors = [
//   'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100',
//   'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-orange-100'
// ];

// const getRandomBgColor = (): string => {
//   const i = Math.floor(Math.random() * bgColors.length);
//   return bgColors[i];
// };



// const CategoriesPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     getAllCategories({}).then((res: any) => {
//       if (res.success && Array.isArray(res.data)) {
//         setCategories(res.data.map((cat: any) => ({
//           ...cat,
//           id: cat.id || cat._id
//         })));
//       }
//     });
//   }, []);

// const [allCategories, setAllCategories] = useState<Category[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       if (response.success === true && Array.isArray(response.data)) {
//         setAllCategories(response.data);
//         console.log(response,"==>response");
        
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//     }
//   };
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   console.log("allCategories", allCategories)

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
//         Most Popular Categories
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {allCategories
//         .filter(category => category?.status === 1)
//         .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//         .map((category, index) => {
//           const bgColor = getRandomBgColor();
//           return (
//             <div
//               key={category._id}
//               className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-white"
//               onClick={() => navigate(`/${category.category_slug}`, {
//                       state: { category },
//                     })}
//             >
//               <div
//                 className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
//               >
//                 <img
//                 src={`${category.category_image}`}
//                   alt={category.category_name}
//                   // src={`https://prnvservices.com/${category_image}`}
//                   // alt={category_name}
//                   className="w-12 h-12 object-contain"
//                 />
//               </div>
//               <h3 className="text-sm font-medium text-gray-700 text-center leading-tight">
//                  {category.category_name}
//               </h3>
//             </div>
       
//           );
//         })}
//       </div>
//       <div className='mt-7'>
//        <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
//         Other Categories
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {allCategories
//         .filter(category => category?.status === 0)
//         .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//         .map((category, index) => {
//           const bgColor = getRandomBgColor();
//           return (
//             <div
//               key={category.id}
//               className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
//               onClick={() => navigate(`/${category.category_slug}`, {
//                       state: { category },
//                     })}
//             >
//               <div
//                 className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
//               >
//                 <img
//                 src={`${category.category_image}`}
//                   alt={category.category_name}
//                   // src={`https://prnvservices.com/${category_image}`}
//                   // alt={category_name}
//                   className="w-12 h-12 object-contain"
//                 />
//               </div>
//               <h3 className="text-sm font-medium text-gray-700 text-center leading-tight">
//                  {category.category_name}
//               </h3>
//             </div>
       
//           );
//         })}
//       </div>
//       </div>
//     </div>
//   );
// };

// export default CategoriesPage;
