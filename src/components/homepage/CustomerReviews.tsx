import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getCompanyReviews } from '../../api/apiMethods';

interface Review {
  _id: string;
  userId?: string;
  technicianId?: string;
  role: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  reviewer: {
    _id: string;
    username: string;
    phoneNumber: string;
    role: string;
    buildingName: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

const CustomerReviewCarousel: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const reviewsPerPage: number = 3;

  const fetchCompanyReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyReviews();
      if (response?.success && response.result?.length > 0) {
        setReviews(response.result);
      } else {
        setError('No reviews available at the moment.');
      }
    } catch (error) {
      setError('Failed to fetch reviews. Please try again later.');
      console.error('Error fetching company reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyReviews();
  }, []);

  const pageCount: number = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    if (pageCount <= 1) return;

    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % pageCount);
    }, 6000);

    return () => clearInterval(interval);
  }, [pageCount]);

  const start: number = page * reviewsPerPage;
  const reviewsToShow: Review[] = reviews.slice(start, start + reviewsPerPage);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={fetchCompanyReviews}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsToShow.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 text-center">
                  {item.reviewer?.username || 'Anonymous'}
                </h3>
                <p className="text-gray-500 text-sm text-center capitalize mb-4">{item.role}</p>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      fill={i < item.rating ? "#facc15" : "none"}
                      stroke={i < item.rating ? "#facc15" : "#d1d5db"}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm text-center italic line-clamp-3 relative z-10">
                  <span className="text-gray-300 select-none">“</span> {item.comment}{' '}
                  <span className="text-gray-300 select-none">”</span>
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  idx === page ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-blue-400'
                }`}
                onClick={() => setPage(idx)}
                aria-label={`Go to review page ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
          Voices of Our Customers
        </h2>
        <CustomerReviewCarousel />
      </div>
    </section>
  );
};

export default CustomerReviews;
// import React, { useEffect } from 'react';
// import { User, Star } from 'lucide-react';
// import { customerReviews } from '../../data/customerReviewsData';
// import { getCompanyReviews } from '../../api/apiMethods';
// import { useState } from 'react';

// function CustomerReviewCarousel() {
//   const [page, setPage] = React.useState(0);
//   const reviewsPerPage = 3;
//   const [reviews, setReviews] = useState([]);

  
//   const fetchCompanyReviews = async () => {
//     try {
//       const response = await getCompanyReviews()
//       if (response?.success) {
//         const data = response.result
//         console.log('Company reviews fetched successfully:', response);
//         setReviews(data)
//       } else {
//         console.log('error', response);
//       }
      
//     } catch (error) {
//       console.log('Error fetching company reviews:', error)
//     }
//   }
  
//   useEffect(() => {
//     fetchCompanyReviews();
//   }, []);
  
//   const pageCount = Math.ceil(reviews.length / reviewsPerPage);
  
//   useEffect(() => {
//     if (pageCount <= 1) return;
    
//     const interval = setInterval(() => {
//       setPage((prev) => (prev + 1) % pageCount);
//     }, 3000);
    
//     return () => clearInterval(interval);
//   }, [pageCount]);
  
//   const start = page * reviewsPerPage;
//   const reviewsToShow = reviews.slice(start, start + reviewsPerPage);
  
//   return (
//     <div className="relative w-full max-w-5xl mx-auto">
//       <div className="flex flex-wrap justify-center gap-6">
//         {reviewsToShow.map((item, index) => (
//           <div
//           className="bg-white p-4 rounded-lg shadow-md text-center w-72"
//           key={index}
//           >
//             <div className="flex justify-center mb-2">
//               <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                   >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                 </svg>
//               </div>
//             </div>
//             <h3 className="font-semibold text-lg">{item?.name || 'Lohitha'}</h3>
//             <p className="text-gray-500 text-sm mb-2 capitalize">({item?.role})</p>
//             <div className="flex justify-center mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                 key={i}
//                 size={20}
//                 fill={i < item?.rating ? "#facc15" : "none"}
//                 stroke={i < item?.rating ? "#facc15" : "#d1d5db"}
//                 />
//               ))}
//             </div>
//             <p className="text-gray-700 text-sm">{item.comment}</p>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-6 w-full space-x-2">
//         {Array.from({ length: pageCount }).map((_, idx) => (
//           <button
//           key={idx}
//           className={`w-3 h-3 rounded-full ${idx === page ? 'bg-blue-600' : 'bg-gray-300'}`}
//           type="button"
//           aria-label={`Go to review page ${idx + 1}`}
//           style={{ pointerEvents: 'none' }}
//           />
//         ))}
//       </div>
//     </div>

// );
// }

// function CustomerReviews() {
//         return (
//           <div className="mb-12">
//       <div className="bg-white rounded-lg p-6 shadow-md">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
//         <CustomerReviewCarousel />
//       </div>
//     </div>
//   );
// }

// export default CustomerReviews; 
// const fetchAvgReviews = async (serviceId) => {
  //   try {
//     const response = await getAvgReviews(serviceId, {
  //       params: {
    //         serviceId: serviceId,
    //       },
    //     });
    //     console.log('Average reviews fetched successfully:', response);
    //     if (response.data.rating >= 3) {
      //       setAvgReviews(response);
      //     } else { 
        //       setAvgReviews([]);
        //     }
        //   } catch (error) {
//     console.error('Error fetching average reviews:', error);
//   }
// };



//   <div className="relative w-full max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
//   {reviews.map((item, index) => (
  //     <div
  //       className="bg-white p-4 rounded-lg shadow-md text-center w-72"
  //       key={index}
  //     >
  //       <div className="flex justify-center mb-2">
  //         <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
  //           <svg
  //             className="w-6 h-6 text-blue-600"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  //             />
  //           </svg>
  //         </div>
  //       </div>
  //       <h3 className="font-semibold text-lg">Rahul Verma</h3>
  //       <p className="text-gray-500 text-sm mb-2 capitalize">
  //         ({item?.role})
  //       </p>
  //       <div className="flex justify-center mb-2">
  //         {[...Array(5)].map((_, i) => (
    //           <Star
    //             key={i}
    //             size={20}
    //             fill={i < item?.rating ? "#facc15" : "none"}
    //             stroke={i < item?.rating ? "#facc15" : "#d1d5db"}
    //           />
    //         ))}
    //       </div>
    //       <p className="text-gray-700 text-sm">{item.comment}</p>
    //     </div>
    //   ))}
    
    //   {/* Pagination dots */}
    //   <div className="flex justify-center mt-6 w-full space-x-2">
    //     {[0].map((_, idx) => (
      //       <button
      //         key={idx}
      //         className={`w-3 h-3 rounded-full bg-blue-600`}
      //         type="button"
      //         aria-label={`Go to review page ${idx + 1}`}
      //         style={{ pointerEvents: "none" }}
      //       />
      //     ))}
      //   </div>
      // </div>
      
      // <div className="relative w-full max-w-5xl mx-auto">
      
      //   <div className="bg-white p-4 rounded-lg shadow-md text-center w-72">
      //     {reviews.map((item, index) => {
        //         <div className="flex justify-center mb-2" key={index}>
        //     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        //       <svg
        //         className="w-6 h-6 text-blue-600"
        //         fill="none"
        //         stroke="currentColor"
        //         viewBox="0 0 24 24"
        //         xmlns="http://www.w3.org/2000/svg"
        //       >
        //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        //       </svg>
        //     </div>
        //   </div>
        //   <h3 className="font-semibold text-lg">Rahul Verma</h3>
        //   <p className="text-gray-500 text-sm mb-2 capitalize">({item?.role})</p>
        //   <div className="flex justify-center mb-2">
        //     {[...Array(5)].map((_, i) => (
          //       <Star
          //         key={i}
          //         size={20}
          //         fill={i < item?.rating ? "#facc15" : "none"}
          //         stroke={i < item?.rating ? "#facc15" : "#d1d5db"}
          //       />
          //     ))}
          //   </div>
          //   <p className="text-gray-700 text-sm">{comment}</p>
          // </div>
          //     })
          
          //   {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          //     {avgReviews && avgReviews.map((element, index) => (
            //       <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center h-full">
            //         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            //           <User className="w-8 h-8 text-blue-500" />
            //         </div>
            //         <h4 className="font-semibold text-lg text-gray-900 mb-1">{element.name}</h4>
            //         <div className="flex mb-2">
            //           {[...Array(element.rating)].map((_, i) => (
              //             <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              //           ))}
              
              //           {[...Array(5 - element.rating)].map((_, i) => (
                //             <Star key={i + element .rating} className="w-5 h-5 text-gray-300" />
                //           ))}
                //           <p className="text-gray-600 text-sm text-center flex-1">{element.review}</p>
                //         </div>
                //       </div>
                //       ))}
                
                
                //     {reviewsToShow.map((review, idx) => (
                  //       <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center h-full">
                  //         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  //           <User className="w-8 h-8 text-blue-500" />
                  //         </div>
    //         <h4 className="font-semibold text-lg text-gray-900 mb-1">{review.name}</h4>
    //         <div className="flex mb-2">
    //           {[...Array(review.rating)].map((_, i) => (
      //             <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      //           ))}
      //           {[...Array(5 - review.rating)].map((_, i) => (
        //             <Star key={i + review.rating} className="w-5 h-5 text-gray-300" />
        //           ))}
        //         </div>
        //         <p className="text-gray-600 text-sm text-center flex-1">{review.review}</p>
        //       </div>
        //     ))}
        //   </div> */}
        //   <div className="flex justify-center mt-6 space-x-2">
        //     {Array.from({ length: pageCount }).map((_, idx) => (
          //       <button
          //         key={idx}
          //         className={`w-3 h-3 rounded-full ${idx === page ? 'bg-blue-600' : 'bg-gray-300'}`}
          //         type="button"
          //         tabIndex={-1}
          //         aria-label={`Go to review page ${idx + 1}`}
          //         style={{ pointerEvents: 'none' }}
          //       />
          //     ))}
          //   </div>
          // </div>