import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Blog } from '../../types/blog';

interface BlogGridProps {
  blogs: Blog[];
  onReadMore: (blog: Blog) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs, onReadMore }) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 320; // Width of one card plus gap
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    'All Categories',
    'Plumbing',
    'Elevator',
    'TV Repair',
    'Laptop',
    'Water',
    'CCTV',
    'Computer',
    'Electrical',
    'AC Repair'
  ];

  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-12 bg-red-600 mr-4"></div>
          <h2 className="text-3xl font-bold text-gray-800">BLOGS</h2>
        </div>
        <button className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors">
          View All
        </button>
      </div>

      {/* Categories Scroll */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Horizontal Scroll */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>

        <div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onReadMore(blog)}
            >
              <div className="relative">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {blog.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{blog.date}</span>
                  <span>{blog.author}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {blog.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;