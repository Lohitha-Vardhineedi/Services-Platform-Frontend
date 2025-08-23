import React, { useState } from 'react';
import BlogList from './BlogList';
// import BlogDetail from './BlogDetail';
import { BlogPost } from './types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const BlogApp: React.FC = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const handleBlogClick = (post: BlogPost) => {
    setSelectedBlog(post);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  return (
    <div>
      {selectedBlog ? (
        <BlogDetail post={selectedBlog} onBack={handleBackToList} />
      ) : (
        <BlogList onBlogClick={handleBlogClick} />
      )}
    </div>
  );
};

export default BlogApp;