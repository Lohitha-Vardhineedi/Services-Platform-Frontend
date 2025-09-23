import React, { useEffect, useState } from 'react'
import { MdOutlineStar } from 'react-icons/md';
import { Rating } from '../../pages/ProfilePage';

interface ReviewsProps {
  ratings: Rating | Rating[] | null;
}

const Reviews: React.FC<ReviewsProps> = ({ ratings }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const ratingList = Array.isArray(ratings) ? ratings : ratings ? [ratings] : [];

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[80vh]">
      <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-4">
        Reviews
      </div>

{ratingList.length === 0 ? (
        <p className="text-gray-600">No reviews available</p>
      ) : (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratingList.map((review) => (
          <div
            key={review._id}
            className="border border-gray-200 shadow rounded-xl p-3 flex flex-col"
          >
            <div className="flex gap-3 items-center">
              <img
                src={review?.profileImage || 'https://i.pinimg.com/736x/21/24/92/21249201424022cdd93cd144f099b056.jpg'}
                alt={review?.serviceId}
                className="w-14 h-14 object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
                  {review?.username}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex ms-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <MdOutlineStar key={i} size={20}  color={i < review.rating ? "#ffc71b" : "#ddd"} />
              ))}
            </div>
            <div className="my-3 text-sm sm:text-base md:text-base lg:text-md xl:text-md ms-2 text-gray-600">
              {review?.review}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
export default Reviews

// import React, { useEffect, useState } from 'react'
// import { MdOutlineStar } from 'react-icons/md';

// const Reviews = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const [replies, setReplies] = useState<{ [key: number]: string }>({});
//   const [inputs, setInputs] = useState<{ [key: number]: string }>({});

//   useEffect(() => {
//     setRole(localStorage.getItem("role"));
//   }, []);

//   const reviews = [
//     {
//       image:
//         "https://img.freepik.com/free-photo/portrait-smiling-blonde-woman_23-2148316635.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Lohitha",
//       ratings: "4.0",
//       reviews: "320",
//       date: "13-June-2025",
//       data: "I am Very happy with this Service.",
//     },
//     // ...other reviews...
//   ];

//   const handleInputChange = (index: number, value: string) => {
//     setInputs((prev) => ({ ...prev, [index]: value }));
//   };

//   const handleReply = (index: number) => {
//     if (inputs[index]?.trim()) {
//       setReplies((prev) => ({ ...prev, [index]: inputs[index] }));
//       setInputs((prev) => ({ ...prev, [index]: "" }));
//     }
//   };

//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[80vh]">
//       <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-4">
//         Reviews
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {reviews.map((review, index) => (
//           <div
//             key={index}
//             className="border border-gray-200 shadow rounded-xl p-3 flex flex-col"
//           >
//             <div className="flex gap-3 items-center">
//               <img
//                 src={review?.image}
//                 alt={review?.name}
//                 className="w-14 h-14 object-cover rounded-full"
//               />
//               <div className="flex flex-col">
//                 <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
//                   {review?.name}
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   {review?.date}
//                 </span>
//               </div>
//             </div>

//             <div className="flex ms-1 mt-2">
//               {[...Array(5)].map((_, i) => (
//                 <MdOutlineStar key={i} size={20} color="#aaa" />
//               ))}
//             </div>
//             <div className="my-3 text-sm sm:text-base md:text-base lg:text-md xl:text-md ms-2 text-gray-600">
//               {review?.data}
//             </div>

//             {/* Technician reply section */}
//             {/* {role === "technician" && (
//               // <div className="ms-2 mt-2">
//               //   {replies[index] ? (
//               //     <div className="bg-gray-100 rounded p-2 text-sm text-gray-700">
//               //       <span className="font-semibold text-blue-700">Your Reply: </span>
//               //       {replies[index]}
//               //     </div>
//               //   ) : (
//               //     <div className="flex gap-2 items-center">
//               //       <input
//               //         type="text"
//               //         value={inputs[index] || ""}
//               //         onChange={(e) => handleInputChange(index, e.target.value)}
//               //         placeholder="Reply to this review..."
//               //         className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
//               //       />
//               //       <button
//               //         onClick={() => handleReply(index)}
//               //         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//               //       >
//               //         Reply
//               //       </button>
//               //     </div>
//               //   )}
//               // </div>
//             )} */}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Reviews


// import React from 'react'
// import { FaRegComment, FaRegThumbsUp } from 'react-icons/fa6';
// import { MdOutlineStar } from 'react-icons/md';
// import { PiShareFatBold } from 'react-icons/pi';

// const Reviews = () => {
//   const reviews = [
//     {
//       image:
//         "https://img.freepik.com/free-photo/portrait-smiling-blonde-woman_23-2148316635.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Lohitha",
//       ratings: "4.0",
//       reviews: "320",
//       date: "13-June-2025",
//       data: "I am Very happy with this Service.",
//     },
//     {
//       image:
//         "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Rishika",
//       ratings: "3.5",
//       reviews: "41",
//       date: "10-June-2025",
//       data: "I am not happy with this Service.",
//     },
//     {
//       image:
//         "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Rishika",
//       ratings: "3.5",
//       reviews: "41",
//       date: "10-June-2025",
//       data: "I am not happy with this Service.",
//     },
//     {
//       image:
//         "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Rishika",
//       ratings: "3.5",
//       reviews: "41",
//       date: "10-June-2025",
//       data: "I am not happy with this Service.",
//     },
//     {
//       image:
//         "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Rishika",
//       ratings: "3.5",
//       reviews: "41",
//       date: "10-June-2025",
//       data: "I am not happy with this Service.",
//     },
//     {
//       image:
//         "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
//       name: "Rishika",
//       ratings: "3.5",
//       reviews: "41",
//       date: "10-June-2025",
//       data: "I am not happy with this Service.",
//     },
//   ];

//   return (
//        <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
//             <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
//               Reviews
//             </div>

//             <div className=" overflow-y-auto  scrollbar-hide">
//               {reviews.map((review, index) => (
//                 <div
//                   key={index}
//                   className="border border-gray-200 my-3 shadow rounded-xl p-3"
//                 >
//                   <div className="flex gap-3 items-center">
//                     <img
//                       src={review?.image}
//                       alt={review?.name}
//                       className="w-14 h-14 object-cover rounded-full"
//                     />
//                     <div className="flex flex-col ">
//                       <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
//                         {review?.name}
//                       </span>
//                       {/* <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-gray-500">
//                         {review?.reviews} Reviews
//                       </span> */}
//                       <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-gray-500">
//                         {review?.date}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex ms-1 mt-1">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="flex gap-3">
//                         <MdOutlineStar size={20} color="#aaa" />
//                       </div>
//                     ))}
//                   </div>
//                   <div className="my-3 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md ms-2 text-gray-600">
//                     {review?.data}
//                   </div>
//                   {/* <div className="flex gap-4 items-center">
//                     <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
//                       <FaRegThumbsUp size={18} color='#00b800'/>
//                       <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
//                         Helpful
//                       </span>
//                     </div>
//                     <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
//                       <FaRegComment size={18} color='#ffc71b'/>
//                       <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
//                         Comment
//                       </span>
//                     </div>
//                     <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
//                       <PiShareFatBold size={20} className='clr-blue'/>
//                       <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
//                         Share
//                       </span>
//                     </div>
//                   </div> */}
//                 </div>
//               ))}
             
//             </div>
//           </div>
//   )
// }

// export default Reviews