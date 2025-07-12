import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { MdOutlineStar } from 'react-icons/md';
import { Link } from 'react-router-dom';

const TechnicianReviews = () => {
  const [role, setRole] = useState<string | null>(null);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const reviews = [
    {
      image:
        "https://img.freepik.com/free-photo/portrait-smiling-blonde-woman_23-2148316635.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Lohitha",
      ratings: "4.0",
      reviews: "320",
      date: "13-June-2025",
      data: "I am Very happy with this Service.",
    },
    // ...other reviews...
  ];

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleReply = (index: number) => {
    if (inputs[index]?.trim()) {
      setReplies((prev) => ({ ...prev, [index]: inputs[index] }));
      setInputs((prev) => ({ ...prev, [index]: "" }));
    }
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[80vh]">
      <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/technician/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>My Reviews</span>
          </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow rounded-xl p-3 flex flex-col"
          >
            <div className="flex gap-3 items-center">
              <img
                src={review?.image}
                alt={review?.name}
                className="w-14 h-14 object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
                  {review?.name}
                </span>
                <span className="text-sm text-gray-500">
                  {review?.date}
                </span>
              </div>
            </div>

            <div className="flex ms-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <MdOutlineStar key={i} size={20} color="#aaa" />
              ))}
            </div>
            <div className="my-3 text-sm sm:text-base md:text-base lg:text-md xl:text-md ms-2 text-gray-600">
              {review?.data}
            </div>

            {/* Technician reply section */}
            {/* {role === "technician" && (
              // <div className="ms-2 mt-2">
              //   {replies[index] ? (
              //     <div className="bg-gray-100 rounded p-2 text-sm text-gray-700">
              //       <span className="font-semibold text-blue-700">Your Reply: </span>
              //       {replies[index]}
              //     </div>
              //   ) : (
              //     <div className="flex gap-2 items-center">
              //       <input
              //         type="text"
              //         value={inputs[index] || ""}
              //         onChange={(e) => handleInputChange(index, e.target.value)}
              //         placeholder="Reply to this review..."
              //         className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
              //       />
              //       <button
              //         onClick={() => handleReply(index)}
              //         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              //       >
              //         Reply
              //       </button>
              //     </div>
              //   )}
              // </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechnicianReviews