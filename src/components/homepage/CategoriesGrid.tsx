import React, { useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CategoryContext } from '../../context/CategoryContext';

export interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  category_image: string;
  meta_title: string;
  meta_description: string;
  status: number;
  totalviews: number;
  ratings: number | null;
}

interface CategoriesGridProps {
  lang: string;
}

const bgColor = [
  'bg-red-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
  'bg-emerald-100',
  'bg-orange-100',
];

const CategoriesGrid: React.FC<CategoriesGridProps> = ({ lang }) => {
  const { categories, error, loading } = useContext(CategoryContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
          {lang === 'hi' ? 'श्रेणियाँ' : 'Most Popular Categories'}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading || !categories ? (
          <div className="flex justify-center items-center py-6">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No popular categories available.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories
              .filter((category) => category.status === 1)
              .sort((a, b) =>
                a.category_name.localeCompare(b.category_name, undefined, {
                  sensitivity: 'base',
                })
              )
              .map((category, index) => (
                <div
                  key={category._id}
                  className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
                  style={{
                    animationDelay: `${index * 60}ms`,
                    animationFillMode: 'both',
                  }}
                  onClick={() => {
                    navigate(`/${category.category_slug}`, {
                      state: { category },
                    });
                    console.log('Clicked category:', category);
                  }}
                >
                  <div
                    className={`w-20 h-20 ${
                      bgColor[index % bgColor.length]
                    } rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
                  >
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                    {category.category_name}
                  </h3>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
          {lang === 'hi' ? 'श्रेणियाँ' : 'Other Categories'}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading || !categories ? (
          <div className="flex justify-center items-center py-6">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No upcoming categories available.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories
              .filter((category) => category.status === 0)
              .sort((a, b) =>
                a.category_name.localeCompare(b.category_name, undefined, {
                  sensitivity: 'base',
                })
              )
              .map((category, index) => (
                <div
                  key={category._id}
                  className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
                  style={{
                    animationDelay: `${index * 60}ms`,
                    animationFillMode: 'both',
                  }}
                  onClick={() => {
                    navigate(`/${category.category_slug}`, {
                      state: { category },
                    });
                    console.log('Clicked category:', category);
                  }}
                >
                  <div
                    className={`w-20 h-20 ${bgColor[index % bgColor.length]} rounded-full  flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
                  >
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                    {category.category_name}
                  </h3>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesGrid;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllCategories } from '../../api/apiMethods';
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

// interface Category {
//   id: number;
//   category_name: string;
//   category_image: string;
//   status: number;
//   meta_title: string;
//   meta_description: string;
// }

// interface CategoriesGridProps {
//   lang: string;
// }

// const bgColor = [
//   'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100',
//   'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-orange-100'
// ];

// function CategoriesGrid({ lang }: CategoriesGridProps) {
//   const navigate = useNavigate();
//   const [allCategories, setAllCategories] = useState<Category[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const location = useLocation();

//   const fetchCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       console.log("category Response : ", response)
//       if (response.success === true && Array.isArray(response.data)) {
//         setAllCategories(response.data);
//         console.log(response, "==>response");

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

//   return (
//     <>

//       <div className="bg-white rounded-2xl shadow p-6 mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
//           {lang === 'hi' ? 'श्रेणियाँ' : 'Most Popular Categories'}
//         </h2>

//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {!allCategories || allCategories.length === 0 ? (
//           <div className="flex justify-center items-center py-6">
//             <div className="flex space-x-2">
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
//             {allCategories
//               .filter(category => category.status === 1)
//               .sort((a, b) => a.category_name.localeCompare(b.category_name))
//               .map((category, index) => (
//                 <div
//                   key={category.id}
//                   className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
//                   style={{
//                     animationDelay: `${index * 60}ms`,
//                     animationFillMode: 'both',
//                   }}
//                   onClick={() => {
//                     navigate(`/technicians/${category._id}`, {
//                       state: { category },
//                     });
//                     console.log('Clicked category:', category);
//                   }}
//                 >
//                   <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}>
//                     {/* <div className="w-12 h-12 flex items-center justify-center mb-2 overflow-hidden"> */}
//                     <img
//                       src={`${category.category_image}`}
//                       alt={category.category_name}
//                       className="w-16 h-16 object-contain"
//                     />
//                   </div>
//                   <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
//                     {category.category_name}
//                   </h3>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>
//       <div className="bg-white rounded-2xl shadow p-6 mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
//           {lang === 'hi' ? 'श्रेणियाँ' : 'Upcoming Categories'}
//         </h2>

//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {!allCategories || allCategories.length === 0 ? (
//           <div className="flex justify-center items-center py-6">
//             <div className="flex space-x-2">
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
//               <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
//             {allCategories
//               .filter(category => category.status === 0)
//               .sort((a, b) => a.category_name.localeCompare(b.category_name))
//               .map((category, index) => (
//                 <div
//                   key={category.id}
//                   className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
//                   style={{
//                     animationDelay: `${index * 60}ms`,
//                     animationFillMode: 'both',
//                   }}
//                   onClick={() => {
//                     navigate(`/technicians/${category._id}`, {
//                       state: { category },
//                     });
//                     console.log('Clicked category:', category);
//                   }}
//                 >
//                   <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}>
//                     {/* <div className="w-12 h-12 flex items-center justify-center mb-2 overflow-hidden"> */}
//                     <img
//                       src={`${category.category_image}`}
//                       alt={category.category_name}
//                       className="w-16 h-16 object-contain"
//                     />
//                   </div>
//                   <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
//                     {category.category_name}
//                   </h3>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//     </>
//   );
// }

// export default CategoriesGrid;

//     .map((category, index) => (
//       <div
//         key={category.id}
//         className="relative rounded-xl shadow group p-4 flex flex-col items-center transition-all duration-300 "
//         style={{
//           animationDelay: `${index * 60}ms`,
//           animationFillMode: 'both',
//         }}
//       >
//         <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}>
//           {/* <div className="w-12 h-12 flex items-center justify-center mb-2 overflow-hidden"> */}
//           <img
//             src={`${category.category_image}`}
//             alt={category.category_name}
//             className="w-12 h-12 object-contain"
//           />
//         </div>
//         <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
//           {category.category_name}
//         </h3>
//       </div>
//     ))}
// </div>