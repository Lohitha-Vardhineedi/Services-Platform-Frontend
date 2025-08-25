import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import { blogPosts } from "./blogData";
import { BlogPost } from "./types";
import { Link } from "react-router-dom";

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleBlogClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`, { state: post });
  };

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current) return;

    const scrollInterval = setInterval(() => {
      const container = scrollContainerRef.current!;
      const cardWidth = 350 + 24; // card width + gap
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollPosition >= maxScroll) {
        // Reset to start when reaching the end
        container.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
      } else {
        // Scroll one card at a time
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
        setScrollPosition((prev) => prev + cardWidth);
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval);
  }, [scrollPosition, isPaused]);

  // Update scroll position state
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !scrollContainerRef.current) return;

    const touchEndX = e.touches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    scrollContainerRef.current.scrollBy({ left: diffX, behavior: "smooth" });
    touchStartX.current = touchEndX;
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setTimeout(() => setIsPaused(false), 2000); // Resume auto-scroll after 2s
  };

  // Calculate active indicator
  const getActiveIndicator = () => {
    const cardWidth = 350 + 24;
    return Math.floor(scrollPosition / cardWidth);
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative text-center flex justify-between items-center max-w-3xl mb-6">
          <div className="flex items-center">
            <span className="w-1 h-12 bg-gradient-to-b from-pink-500 to-purple-500 mr-4"></span>
            <h1 className="text-4xl font-bold text-gray-900">
              Blogs
            </h1>
          </div>
          <Link
            to="/all-blogs"
            className="text-4xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </Link>
        </div>
        {/* <div className="text-center mb-12 flex justify-between max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
            Blogs
          </h1>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
            View All
          </h1>
        </div> */}
        {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Discover expert tips and insights for home maintenance and improvement
          </p> */}
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-4 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[350px] snap-start transition-transform duration-300 hover:scale-105"
            >
              <BlogCard post={post} onClick={handleBlogClick} />
            </div>
          ))}
        </div>

        {/* Progress Indicators
        <div className="flex justify-center mt-8 space-x-3">
          {blogPosts.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === getActiveIndicator()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125'
                  : 'bg-gray-300 opacity-60'
              }`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default BlogListPage;
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import BlogCard from './BlogCard';
// import { blogPosts } from './blogData';
// import { BlogPost } from './types';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const BlogListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [scrollPosition, setScrollPosition] = React.useState(0);
//   const scrollContainerRef = React.useRef<HTMLDivElement>(null);

//   const handleBlogClick = (post: BlogPost) => {
//     navigate(`/blog/${post.id}`);
//   };

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const cardWidth = 350 + 24; // card width + gap
//       const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
//       container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const cardWidth = 350 + 24; // card width + gap
//       const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
//       container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const handleScroll = () => {
//     if (scrollContainerRef.current) {
//       setScrollPosition(scrollContainerRef.current.scrollLeft);
//     }
//   };

//   React.useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             Latest Blog Posts
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Discover expert tips and insights for home maintenance and improvement
//           </p>
//         </div>

//         {/* Train-style Horizontal Scrolling Container */}
//         <div className="relative max-w-6xl mx-auto">
//           {/* Left Arrow */}
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
//             style={{ marginLeft: '-20px' }}
//           >
//             <ChevronLeft size={24} className="text-gray-700" />
//           </button>

//           {/* Right Arrow */}
//           <button
//             onClick={scrollRight}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
//             style={{ marginRight: '-20px' }}
//           >
//             <ChevronRight size={24} className="text-gray-700" />
//           </button>

//           {/* Scrollable Container - Shows 4 cards */}
//           <div
//             ref={scrollContainerRef}
//             className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-4"
//             style={{
//               scrollSnapType: 'x mandatory',
//               scrollBehavior: 'smooth'
//             }}
//           >
//             {blogPosts.map((post, index) => (
//               <div
//                 key={post.id}
//                 className="flex-shrink-0"
//                 style={{ scrollSnapAlign: 'start' }}
//               >
//                 <BlogCard
//                   post={post}
//                   onClick={handleBlogClick}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Progress Indicators */}
//         <div className="flex justify-center mt-8 space-x-3">
//           {Array.from({ length: Math.ceil(blogPosts.length / 2) }).map((_, index) => (
//             <div
//               key={index}
//               className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 transition-opacity duration-300 hover:opacity-100"
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogListPage;
