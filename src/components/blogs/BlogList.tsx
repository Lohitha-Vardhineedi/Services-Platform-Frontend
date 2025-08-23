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
