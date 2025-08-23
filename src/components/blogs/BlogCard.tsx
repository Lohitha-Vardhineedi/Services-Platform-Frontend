import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogCardProps } from '../../types/blog';

const BlogCard: React.FC<BlogCardProps> = ({ blog, onReadMore }) => {
  const handleReadMore = () => {
    onReadMore(blog.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{blog.date}</span>
          </div>
          
          <button
            onClick={handleReadMore}
            className="flex items-center text-pink-500 font-semibold hover:text-pink-600 transition-colors duration-200 group/btn"
          >
            Read more
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
        
        {blog.category && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;