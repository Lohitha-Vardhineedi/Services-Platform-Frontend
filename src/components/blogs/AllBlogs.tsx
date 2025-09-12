import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { getAllBlogs } from "../../api/apiMethods";

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

// Define the API response interface
interface ApiResponse {
  success: boolean;
  data: Blog[];
}

const AllBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Assuming getAllBlogs returns a Promise<ApiResponse>
        const response: ApiResponse = await getAllBlogs();
        if (response.success) {
          setBlogs(response.data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        setError("An error occurred while fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span className="font-medium">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => navigate(`/blog/${post._id}`, { state: post })}
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
// import React from "react";
// import { blogPosts } from "./blogData";
// import { ArrowRight, Calendar } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const AllBlogs = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogPosts.map((post) => (
//           <div
//             key={post.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div className="relative">
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
//               />
//             </div>
//             <div className="p-4">
//               <p className="text-gray-600 mt-2 line-clamp-1">{post.content}</p>

//               <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
//                 <div className="flex items-center">
//                   <Calendar size={14} className="mr-2" />
//                   <span className="font-medium">{post.date}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <button
//                   onClick={() => navigate(`/blog/${post.id}`, { state: post })}
//                   className="text-red-600 px-4 py-2 rounded-lg hover:text-red-700 transition-colors cursor-pointer font-semibold"
//                 >
//                   Read More <ArrowRight className="w-4 h-4 inline-block" />
//                 </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllBlogs;
