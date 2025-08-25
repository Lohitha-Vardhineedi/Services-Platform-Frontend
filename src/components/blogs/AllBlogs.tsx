import React from "react";
import { blogPosts } from "./blogData";
import { ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllBlogs = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mt-2 line-clamp-1">{post.content}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span className="font-medium">{post.date}</span>
                </div>
                <div className="flex items-center">
                  <button
                  onClick={() => navigate(`/blog/${post.id}`, { state: post })}
                  className="text-red-600 px-4 py-2 rounded-lg hover:text-red-700 transition-colors cursor-pointer font-semibold"
                >
                  Read More <ArrowRight className="w-4 h-4 inline-block" />
                </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
