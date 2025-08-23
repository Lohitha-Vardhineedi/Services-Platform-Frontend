import React from 'react';
import BlogCard from './BlogCard';
import { blogPosts } from './blogData';
import { BlogPost } from './types';

interface BlogListProps {
  onBlogClick: (post: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onBlogClick }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-gray-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-500 text-2xl font-bold mr-8">prnvservices</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-gray-300">CATEGORIES</a>
              <a href="#" className="hover:text-gray-300">ABOUT US</a>
              <a href="#" className="hover:text-gray-300">SUBSCRIPTIONS</a>
              <a href="#" className="hover:text-gray-300">KEY FEATURES</a>
              <a href="#" className="hover:text-gray-300">FRANCHISE</a>
            </nav>
          </div>
          <div className="flex space-x-4">
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded">LOGIN</button>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded">REGISTER</button>
          </div>
        </div>
      </div> */}

      {/* Single Horizontal Scrollable Row */}
      <div className="mb-8">
        <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-2 gap-4">
          {blogPosts.map((post) => (
            <BlogCard 
              key={post.id} 
              post={post} 
              onClick={onBlogClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;