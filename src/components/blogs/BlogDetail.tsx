// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { blogPosts } from '../components/blogData';
// import { Calendar, Tag } from 'lucide-react';

// const BlogDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const post = blogPosts.find(p => p.id === id);

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
//           <p className="text-gray-600">The blog post you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Image Section */}
//       <div className="relative w-full h-96 mb-8">
//         <img 
//           src={post.heroImage} 
//           alt={post.title}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="text-center text-white px-4">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
//               {post.title}
//             </h1>
//             <p className="text-lg opacity-90 max-w-2xl">
//               {post.excerpt}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="max-w-4xl mx-auto px-4 pb-12">
//         <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
//           {/* Meta Information */}
//           <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
//             <div className="flex items-center text-gray-600">
//               <Calendar size={18} className="mr-2" />
//               <span className="font-medium">{post.date}</span>
//             </div>
//             <div className="flex items-center">
//               <Tag size={18} className="mr-2 text-gray-600" />
//               <div className="flex flex-wrap gap-2">
//                 {post.tags.map((tag, index) => (
//                   <span 
//                     key={index}
//                     className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
//               {post.category}
//             </span>
//           </div>

//           {/* Article Content */}
//           <article className="prose prose-lg max-w-none">
//             {post.content.map((paragraph, index) => (
//               <div key={index} className="mb-6">
//                 {paragraph.includes(':') && paragraph.length < 100 && !paragraph.includes('https://') ? (
//                   <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8 border-l-4 border-blue-500 pl-4">
//                     {paragraph}
//                   </h3>
//                 ) : (
//                   <p className="text-gray-700 leading-relaxed text-lg">
//                     {paragraph}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </article>

//           {/* Call to Action */}
//           <div className="mt-12 pt-8 border-t border-gray-200">
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
//               <h4 className="text-2xl font-bold text-gray-900 mb-4">
//                 Need Professional Help?
//               </h4>
//               <p className="text-gray-700 text-lg mb-6">
//                 PRNV Services provides expert solutions for all your home maintenance needs. 
//                 Contact our professional team for reliable and affordable services.
//               </p>
//               <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
//                 Contact PRNV Services
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetail;