import React from 'react';
import { BlogDetailProps } from './types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
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

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {post.id === '1' && (
            <div className="mb-8">
              <img 
                src="https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Plumbing Service" 
                className="mx-auto max-w-2xl w-full h-auto"
              />
            </div>
          )}
          
          {post.id !== '1' && (
            <div className="mb-8">
              <img 
                src={post.heroImage} 
                alt={post.title}
                className="mx-auto max-w-2xl w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center mr-6">
              <Calendar size={16} className="mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Tag size={16} className="mr-2" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => (
              <div key={index} className="mb-4">
                {paragraph.includes(':') && paragraph.length < 100 ? (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-6">
                    {paragraph}
                  </h3>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">
                Need Professional Help?
              </h4>
              <p className="text-blue-800">
                PRNV Services provides expert solutions for all your home maintenance needs. 
                Contact our professional team for reliable and affordable services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;