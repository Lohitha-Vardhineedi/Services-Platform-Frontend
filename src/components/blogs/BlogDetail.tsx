import React from 'react';
import { Calendar, User, Tag, Share2, Bookmark } from 'lucide-react';
import { Blog } from '../../types/blog';

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        ← Back to Blogs
      </button>

      {/* Hero Image */}
      <div className="relative mb-8 rounded-lg overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            {blog.category.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{blog.author}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
          {blog.title}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          {blog.excerpt}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
            <Bookmark size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        <div className="space-y-6">
          {blog.content.map((section, index) => (
            <div key={index}>
              {section.type === 'heading' && (
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  {section.text}
                </h2>
              )}
              {section.type === 'paragraph' && (
                <p className="text-gray-700 leading-relaxed mb-4">
                  {section.text}
                </p>
              )}
              {section.type === 'list' && (
                <ul className="space-y-2 mb-4">
                  {section.items?.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Tag size={18} className="text-gray-500" />
          <span className="text-gray-700 font-medium">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;