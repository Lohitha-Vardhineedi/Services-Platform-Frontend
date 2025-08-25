import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewBlog: React.FC = () => {
  const location = useLocation();
  const post = location.state;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <img src={post.heroImage} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">{post.category}</span>
        </div>
        <div className="space-y-4">
          {post.content.map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;