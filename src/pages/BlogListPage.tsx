import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { blogPosts } from '../components/blogData';
import { BlogPost } from '../types';

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBlogClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Latest Blog Posts
        </h1>
        
        {/* Horizontal Scrollable Container */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-6 px-4 gap-6 snap-x snap-mandatory">
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
        <div className="flex justify-center mt-6 space-x-2">
          {blogPosts.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;