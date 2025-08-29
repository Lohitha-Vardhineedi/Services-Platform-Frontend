import { Calendar,Tag } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

// Define the Blog interface based on API response
interface Blog {
  _id: string;
  name: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}


const ViewBlog: React.FC = () => {
  const location = useLocation();
  const blog = location.state as Blog | undefined;


  if (!blog) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto text-center text-red-600">
          Blog post not found. Please try navigating from the blog list.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <div className="flex justify-center items-center">
              <img
                src={blog.image}
                alt={blog.title}
                className="max-w-full h-64 rounded-md mb-4 object-cover"
                onError={(e) => (e.currentTarget.src = '')} // Fallback for broken image
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700">Blog Title</h2>
                <p className="text-gray-900 font-semibold text-lg">{blog.title}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700">Service Name</h2>
              <p className="text-gray-900">{blog.name}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3">Blog Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          </div>
        </div>
    // <div className="container mx-auto p-6">
    //   <div className="max-w-4xl mx-auto">
    //     <img
    //       src={post.image}
    //       alt={post.title}
    //       className="h-auto object-cover rounded-lg mb-6 mx-auto"
    //     />
    //     <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
    //     <div className="flex items-center text-sm text-gray-500 mb-4">
    //       <span>{post.date}</span>
    //       <span className="mx-2">•</span>
    //       <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
    //         {post.category}
    //       </span>
    //     </div>
    //     <div className="space-y-4">
    //       {post.content.map((paragraph, index) => (
    //         <p key={index} className="text-gray-700 leading-relaxed">
    //           {paragraph}
    //         </p>
    //       ))}
    //     </div>
    //     <div className="mt-6">
    //       <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags:</h3>
    //       <div className="flex flex-wrap gap-2">
    //         {post.tags.map((tag, index) => (
    //           <span
    //             key={index}
    //             className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
    //           >
    //             {tag}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ViewBlog;
// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const ViewBlog: React.FC = () => {
//   const location = useLocation();
//   const post = location.state;

//   return (
//     <div className="container mx-auto p-6">
//       <div className="max-w-4xl mx-auto">
//         <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
//         <div className="flex items-center text-sm text-gray-500 mb-4">
//           <span>{post.date}</span>
//           <span className="mx-2">•</span>
//           <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">{post.category}</span>
//         </div>
//         <div className="space-y-4">
//           {post.content.map((paragraph: string, index: number) => (
//             <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
//           ))}
//         </div>
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags:</h3>
//           <div className="flex flex-wrap gap-2">
//             {post.tags.map((tag: string, index: number) => (
//               <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">{tag}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewBlog;