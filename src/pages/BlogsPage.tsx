import React from 'react';
import BlogGrid from '../components/blogs/BlogGrid';
import { Blog } from '../types/blog';

interface BlogsPageProps {
  blogs: Blog[];
  onReadMore: (blogId: number) => void;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogs, onReadMore }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">All Blogs</h1>
          <p className="text-xl opacity-90">Expert tips and guides for home and business services</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="relative overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                    <span>{blog.date}</span>
                  </div>
                  
                  <button
                    onClick={() => onReadMore(blog.id)}
                    className="text-pink-500 font-semibold hover:text-pink-600 transition-colors duration-200"
                  >
                    Read more →
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;