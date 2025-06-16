import React from 'react';
import { User, Star } from 'lucide-react';
import { customerReviews } from '../data/customerReviewsData';

function CustomerReviewCarousel() {
  const [page, setPage] = React.useState(0);
  const reviewsPerPage = 3;
  const pageCount = Math.ceil(customerReviews.length / reviewsPerPage);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % pageCount);
    }, 3500);
    return () => clearInterval(interval);
  }, [pageCount]);
  const start = page * reviewsPerPage;
  let reviewsToShow = customerReviews.slice(start, start + reviewsPerPage);
  if (reviewsToShow.length < reviewsPerPage) {
    reviewsToShow = [
      ...reviewsToShow,
      ...customerReviews.slice(0, reviewsPerPage - reviewsToShow.length),
    ];
  }
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviewsToShow.map((review, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center h-full">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-1">{review.name}</h4>
            <div className="flex mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <Star key={i + review.rating} className="w-5 h-5 text-gray-300" />
              ))}
            </div>
            <p className="text-gray-600 text-sm text-center flex-1">{review.review}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: pageCount }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === page ? 'bg-blue-600' : 'bg-gray-300'}`}
            type="button"
            tabIndex={-1}
            aria-label={`Go to review page ${idx + 1}`}
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </div>
    </div>
  );
}

function CustomerReviews() {
  return (
    <div className="mb-12">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
        <CustomerReviewCarousel />
      </div>
    </div>
  );
}

export default CustomerReviews; 