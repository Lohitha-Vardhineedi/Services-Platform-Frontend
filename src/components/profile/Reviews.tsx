import React from 'react'
import { FaRegComment, FaRegThumbsUp } from 'react-icons/fa6';
import { MdOutlineStar } from 'react-icons/md';
import { PiShareFatBold } from 'react-icons/pi';

const Reviews = () => {
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
    {
      image:
        "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Rishika",
      ratings: "3.5",
      reviews: "41",
      date: "10-June-2025",
      data: "I am not happy with this Service.",
    },
    {
      image:
        "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Rishika",
      ratings: "3.5",
      reviews: "41",
      date: "10-June-2025",
      data: "I am not happy with this Service.",
    },
    {
      image:
        "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Rishika",
      ratings: "3.5",
      reviews: "41",
      date: "10-June-2025",
      data: "I am not happy with this Service.",
    },
    {
      image:
        "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Rishika",
      ratings: "3.5",
      reviews: "41",
      date: "10-June-2025",
      data: "I am not happy with this Service.",
    },
    {
      image:
        "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_hybrid&w=740",
      name: "Rishika",
      ratings: "3.5",
      reviews: "41",
      date: "10-June-2025",
      data: "I am not happy with this Service.",
    },
  ];

  return (
       <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)]">
            <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
              Reviews
            </div>

            <div className=" overflow-y-auto  scrollbar-hide">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 my-3 shadow rounded-xl p-3"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={review?.image}
                      alt={review?.name}
                      className="w-14 h-14 object-cover rounded-full"
                    />
                    <div className="flex flex-col ">
                      <span className="text-md sm:text-md md:text-md lg:text-lg xl:text-lg font-extralight">
                        {review?.name}
                      </span>
                      <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-gray-500">
                        {review?.reviews} Reviews
                      </span>
                      <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md text-gray-500">
                        {review?.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex ms-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <MdOutlineStar size={20} color="#aaa" />
                      </div>
                    ))}
                  </div>
                  <div className="my-3 text-sm sm:text-sm md:text-sm lg:text-md xl:text-md ms-2 text-gray-600">
                    {review?.data}
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
                      <FaRegThumbsUp size={18} color='#00b800'/>
                      <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
                        Helpful
                      </span>
                    </div>
                    <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
                      <FaRegComment size={18} color='#ffc71b'/>
                      <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
                        Comment
                      </span>
                    </div>
                    <div className="flex items-center border border-gray-300 px-3 py-1 gap-2 rounded-xl cursor-pointer">
                      <PiShareFatBold size={20} className='clr-blue'/>
                      <span className="text-sm sm:text-sm md:text-sm lg:text-md xl:text-md font-extralight">
                        Share
                      </span>
                    </div>
                  </div>
                </div>
              ))}
             
            </div>
          </div>
  )
}

export default Reviews