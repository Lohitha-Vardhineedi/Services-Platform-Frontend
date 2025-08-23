import React from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { BlogDetailProps } from '../../types/blog';

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onBack }) => {
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Blogs
          </button>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{blog.date}</span>
            </div>
            
            {blog.author && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{blog.author}</span>
              </div>
            )}
            
            {blog.readTime && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{blog.readTime} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-800">Summary</h3>
            </div>
            <p className="text-blue-700 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          <div className="text-gray-700 leading-relaxed space-y-6">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Share this article</h3>
            <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;