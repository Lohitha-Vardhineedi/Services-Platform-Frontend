import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { blogPosts } from './blogData';
import { BlogPost } from './types';

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBlogClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest Blog Posts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover expert tips and insights for home maintenance and improvement
          </p>
        </div>
        
        {/* Horizontal Scrollable Container */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-8 px-4 gap-2 snap-x snap-mandatory">
            {blogPosts.map((post) => (
              <div key={post.id} className="snap-center">
                <BlogCard 
                  post={post} 
                  onClick={handleBlogClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {blogPosts.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;