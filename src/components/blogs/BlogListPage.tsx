import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { blogPosts } from './blogData';
import { BlogPost } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleBlogClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 350 + 24; // card width + gap
      const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 350 + 24; // card width + gap
      const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
             Blogs
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover expert tips and insights for home maintenance and improvement
          </p> */}
        </div>
        
        {/* Train-style Horizontal Scrolling Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Scrollable Container - Shows 4 cards */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-4"
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth'
            }}
          >
            {blogPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <BlogCard 
                  post={post} 
                  onClick={handleBlogClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: Math.ceil(blogPosts.length / 2) }).map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 transition-opacity duration-300 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;