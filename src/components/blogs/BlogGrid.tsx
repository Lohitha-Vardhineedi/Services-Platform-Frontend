import React from 'react';
import { ArrowRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { BlogGridProps } from '../../types/blog';

const BlogGrid: React.FC<BlogGridProps> = ({ blogs, onReadMore }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              BLOGS
            </h2>
            <div className="absolute -left-1 top-0 w-1 h-12 bg-gradient-to-b from-blue-500 to-pink-500 rounded-full"></div>
          </div>
          
          <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group">
            View All
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                ${index === 3 ? 'lg:col-span-2' : ''}
                ${index === 6 ? 'md:col-span-2' : ''}
              `}
            >
              <BlogCard blog={blog} onReadMore={onReadMore} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;