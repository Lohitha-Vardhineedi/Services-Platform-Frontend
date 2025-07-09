import React, {useState} from 'react';
import { Check, Star } from 'lucide-react';

interface FinalRatingProps {
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  setCurrentStep: (step: string) => void;
}

interface Review {
  star: number;
  comment: string;
}

const FinalRating: React.FC<FinalRatingProps> = ({ selectedRating, setSelectedRating, setCurrentStep }) => {
    const [review, setReview] = useState<Review>({ star: 0, comment: '' });
    console.log('FinalRating component rendered with review:', review);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
            key={star}
              className={`w-12 h-12 cursor-pointer transition-colors ${
                star <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              onClick={(e) => {
                setSelectedRating(star);
                setReview({ ...review, star });
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          ))}
        </div>

        <input type="text" className="border border-gray-300 rounded-lg p-2" placeholder="Leave a comment..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}  />

        <button
          className="w-full bg-purple-500 text-white py-4 rounded-2xl font-semibold shadowing-lg hover:bg-purple-600 transition-colors"
          onClick={() => setCurrentStep('congratulations')}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default FinalRating;