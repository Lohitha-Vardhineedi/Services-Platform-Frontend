import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { MdOutlineStar } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { getTechnicianReviews } from '../../api/apiMethods';

interface TechnicianReview {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  serviceId?: {
    _id: string;
    serviceName: string;
    serviceImg: string;
    servicePrice: number;
  };
  userId: {
    _id: string;
    username: string;
    buildingName: string;
    areaName: string;
    city: string;
    profileImage?: string;
  };
}


const TechnicianReviews = () => {
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});
  // const [reviews, setReviews] = useState();
  const [error, setError] = useState<string | null>(null)

  const [reviews, setReviews] = useState<TechnicianReview[]>([]);
  const [loading, setLoading] = useState(true);



  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleReply = (index: number) => {
    if (inputs[index]?.trim()) {
      setReplies((prev) => ({ ...prev, [index]: inputs[index] }));
      setInputs((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const id = localStorage.getItem("userId");
   const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month:"short",
      year: "numeric",
    });
  };

   const fetchTechReviews = async () => {
      try {
        const response = await getTechnicianReviews(id);
        if (response) {
          setReviews(response?.result?.ratings ?? []);
          console.log(response,"==>response");
        //  setLoading(false)
        } else {
          setError('Invalid response format');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch Reviews');
      }
      finally{
        setLoading(false)
      }
    };
    useEffect(() => {
      if(id)
      fetchTechReviews();
    }, [id]);


  return (
    <div className="rounded-xl p-4 overflow-y-auto scrollbar-hide max-w-7xl mx-auto">
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

{loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow rounded-xl p-3 flex flex-col"
          >
            <div className="flex gap-3 items-center">
              <img
                src={review?.userId?.profileImage}
                alt={review?.userId?.username}
                className="w-14 h-14 object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
                  {review?.userId?.username}
                </span>
                <span className="text-sm text-gray-500">
                  {/* {review?.date} */}
                  {formatDate(review.createdAt)}
                  {/* {new Date(review.createdAt).toDateString()} */}
                </span>
              </div>
            </div>

            <div className="flex ms-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <MdOutlineStar key={i} size={20} color={i < review.rating ? "#facc15" : "#d1d5db"} />
              ))}
            </div>
            <div className="my-3 text-sm sm:text-base md:text-base lg:text-md xl:text-md ms-2 text-gray-600">
              {review?.review}
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
      )}
    </div>
  )
}

export default TechnicianReviews