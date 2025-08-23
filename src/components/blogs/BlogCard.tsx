import React from 'react';
import { BlogCardProps } from './types';
import { Calendar, Tag } from 'lucide-react';

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 min-w-[320px] max-w-[320px] flex-shrink-0"
      onClick={() => onClick(post)}
    >
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Tag size={14} className="mr-1" />
            <span>{post.tags[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;