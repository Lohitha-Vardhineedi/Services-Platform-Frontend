import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { addReviewByUser } from '../../api/apiMethods';

interface Booking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  quantity: number;
  bookingDate: string;
  servicePrice: number;
  gst: number;
  totalPrice: number;
  status: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Technician {
  _id: string;
  userId: string;
  username: string;
  role: string;
  phoneNumber: string;
  category: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description?: string;
  profileImage?: string;
  service?: string;
}

interface User {
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
  __v: number;
}

interface Service {
  _id: string;
  technicianId: string;
  serviceName: string;
  serviceImg: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BookingData {
  booking: Booking;
  technician: Technician;
  user: User;
  service: Service | null;
}

interface FinalRatingProps {
  setCurrentStep: (step: string, data?: any) => void;
  booking: BookingData;
}

interface FormData {
  serviceId: string;
  technicianId: string;
  userId: string;
  review: string;
  rating: number;
}

const FinalRating: React.FC<FinalRatingProps> = ({ setCurrentStep, booking }) => {
  const { booking: bookingData, service } = booking;

  // Ensure service is not null
  if (!service) {
    return <div className="text-center py-8">Service details not available</div>;
  }

  const [formData, setFormData] = useState<FormData>({
    serviceId: bookingData.serviceId,
    technicianId: bookingData.technicianId,
    userId: bookingData.userId,
    review: '',
    rating: 0,
  });

  const handleSubmit = async() => {
    // Here you can handle the form submission, e.g., send formData to an API
    try{
      const response = await addReviewByUser(formData)
      if(response?.success && response?.result){
        alert('review successfuly submited')
      }else{
        alert('something went wrong')
      }
      
      setCurrentStep('congratulations');
    }catch(err){
      console.log('user review err', err)
        alert('something went wrong by user')
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-12 h-12 cursor-pointer transition-colors ${
                star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, rating: star })}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          ))}
        </div>

        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Leave a comment..."
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
        />

        <button
          className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
          onClick={handleSubmit}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default FinalRating;
// import React, { useState } from 'react';
// import { Check, Star } from 'lucide-react';

// interface Booking {
//   _id: string;
//   userId: string;
//   technicianId: string;
//   serviceId: string;
//   quantity: number;
//   bookingDate: string;
//   servicePrice: number;
//   gst: number;
//   totalPrice: number;
//   status: string;
//   otp: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Technician {
//   _id: string;
//   userId: string;
//   username: string;
//   role: string;
//   phoneNumber: string;
//   category: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   description?: string;
//   profileImage?: string;
//   service?: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   phoneNumber: string;
//   role: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Service {
//   _id: string;
//   technicianId: string;
//   serviceName: string;
//   serviceImg: string;
//   servicePrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface BookingData {
//   booking: Booking;
//   technician: Technician;
//   user: User;
//   service: Service | null;
// }

// interface FinalRatingProps {
//   setCurrentStep: (step: string) => void;
//   booking: Booking;
// }

// interface FormData {
//   serviceId: string;
//   technicianId: string;
//   userId: string;
//   review: string;
//   rating: number;
// }

// const FinalRating: React.FC<FinalRatingProps> = ({ setCurrentStep, booking }) => {
//     const { booking: bookingData, service } = booking;
//     console.log(booking)
//   const [formData, setFormData] = useState<FormData>({
//     serviceId: booking.serviceId,
//     technicianId: booking.technicianId,
//     userId: booking.userId,
//     review: '',
//     rating: 0,
//   });

//   const handleSubmit = () => {
//     // Here you can handle the form submission, e.g., send formData to an API
//     console.log('Submitting form data:', formData);
//     setCurrentStep('congratulations');
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
//       <div className="text-center max-w-md mx-auto p-8 flex flex-col items-center gap-2">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
//         <div className="flex justify-center space-x-2 mb-8">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               className={`w-12 h-12 cursor-pointer transition-colors ${
//                 star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//               }`}
//               onClick={() => setFormData({ ...formData, rating: star })}
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             />
//           ))}
//         </div>

//         <input
//           type="text"
//           className="border border-gray-300 rounded-lg p-2 w-full"
//           placeholder="Leave a comment..."
//           value={formData.review}
//           onChange={(e) => setFormData({ ...formData, review: e.target.value })}
//         />

//         <button
//           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-purple-600 transition-colors"
//           onClick={handleSubmit}
//         >
//           Submit Rating
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FinalRating;

// // import React, {useState} from 'react';
// // import { Check, Star } from 'lucide-react';

// // interface FinalRatingProps {
// //   selectedRating: number;
// //   setSelectedRating: (rating: number) => void;
// //   setCurrentStep: (step: string) => void;
// // }

// // interface Review {
// //   star: number;
// //   comment: string;
// // }

// // const FinalRating: React.FC<FinalRatingProps> = ({ selectedRating, setSelectedRating, setCurrentStep }) => {
// //     const [review, setReview] = useState<Review>({ star: 0, comment: '' });
// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
// //       <div className="text-center max-w-md mx-auto p-8 flex flex-col items-center gap-2">
// //         <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
// //         <div className="flex justify-center space-x-2 mb-8">
// //           {[1, 2, 3, 4, 5].map((star) => (
// //             <Star
// //             key={star}
// //               className={`w-12 h-12 cursor-pointer transition-colors ${
// //                 star <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
// //               }`}
// //               onClick={(e) => {
// //                 setSelectedRating(star);
// //                 setReview({ ...review, star });
// //               }}
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             />
// //           ))}
// //         </div>

// //         <input type="text" className="border border-gray-300 rounded-lg p-2" placeholder="Leave a comment..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}  />

// //         <button
// //           className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadowing-lg hover:bg-purple-600 transition-colors"
// //           onClick={() => setCurrentStep('congratulations')}
// //         >
// //           Submit Rating
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FinalRating;