import React, { useRef, useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface PhotosProps {
  images: string[];
}

const Photos: React.FC<PhotosProps> = ({ images }) => {
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleImages = showAll ? images : images?.slice(0, 6);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4">
      <h2 className="text-xl md:text-2xl font-light mb-4">Photos</h2>

      <div
        className="
          grid 
          grid-cols-1 
          xs:grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-6 
          gap-3
        "
      >
        {visibleImages && visibleImages.length > 0 ? (
          visibleImages.map((img: string, index: number) => (
            <div key={index} className="relative group cursor-pointer">
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full h-36 object-cover rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-full text-center py-8">
            No images available
          </div>
        )}
      </div>
      
      {images?.length > 6 && (
        <div
          className="flex justify-center mt-4 cursor-pointer text-blue-600 hover:underline text-sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <span className="flex items-center gap-1">
              View Less <FaChevronUp />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              View More <FaChevronDown />
            </span>
          )}
        </div>
      )}

      {/* Slideshow Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div 
            className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={images[currentIndex]}
              alt={`Slideshow Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                >
                  <FaChevronRight size={24} />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              <span>{currentIndex + 1} / {images.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;

// import React, { useRef, useState, useEffect } from "react";
// import { IoMdCloudUpload } from "react-icons/io";
// import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

// interface PhotosProps {
//   images: string[];
// }

// const Photos: React.FC<PhotosProps> = ({ images }) => {
//   const [showAll, setShowAll] = useState(false);
//   const visibleImages = showAll ? images : images?.slice(0, 6);

//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4">
//       <h2 className="text-xl md:text-2xl font-light mb-4">Photos</h2>
//       <div
//         className="
//           grid 
//           grid-cols-1 
//           xs:grid-cols-2 
//           sm:grid-cols-2 
//           md:grid-cols-3 
//           lg:grid-cols-4 
//           xl:grid-cols-6 
//           gap-3
//         "
//       >
//         {visibleImages && visibleImages.length > 0 ? (
//           visibleImages.map((img: string, index: number) => (
//             <div key={index} className="relative group">
//               <img
//                 src={img}
//                 alt={`Image ${index + 1}`}
//                 className="w-full h-36 object-cover rounded-lg"
//               />
//             </div>
//           ))
//         ) : (
//           <div className="text-gray-500">
//             No images available
//           </div>
//         )}
//       </div>
//       {images?.length > 6 && (
//         <div
//           className="flex justify-center mt-4 cursor-pointer text-blue-600 hover:underline text-sm"
//           onClick={() => setShowAll(!showAll)}
//         >
//           {showAll ? (
//             <span className="flex items-center gap-1">
//               View Less <FaChevronUp />
//             </span>
//           ) : (
//             <span className="flex items-center gap-1">
//               View More <FaChevronDown />
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Photos;

// import React, { useRef, useState, useEffect } from "react";
// import { IoMdCloudUpload } from "react-icons/io";
// import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
// import { getTechImagesByTechId, createTechImagesControl} from '../../api/apiMethods';
// import axios from 'axios';

// const Photos = () => {
//   const [images, setImages] = useState<string[]>([]);
//   const [showAll, setShowAll] = useState(false);
//   const [role, setRole] = useState<string | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     setRole(localStorage.getItem("role"));
//     let id = localStorage.getItem("userId");
//     console.log(id)
//     if (id) {
//       getTechImagesByTechId(id)
//         .then((data: any) => {
//           if (data?.result && Array.isArray(data.result.imageUrl)) {
//             setImages(data.result.imageUrl);
//           }
//         })
//         .catch((err: any) => {
//           console.error('Failed to fetch technician images:', err);
//         });
//     }
//   }, []);

//   const visibleImages = showAll ? images : images.slice(0, 6);

//   const handleUploadClick = () => {
//     inputRef.current?.click();
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     let id = localStorage.getItem("userId");
//     const formData = new FormData();
//     formData.append("technicianId", id || "");
//     if (file instanceof File) {
//       formData.append("photos", file);
//     }
//     for (let pair of formData.entries()) {
//       console.log("debug : ", pair[0] + ':', pair[1]);
//     }
//     await createTechImagesControl(formData);
//     setImages((prev) => [URL.createObjectURL(file), ...prev]);
//   };

//   const handleDelete = async (index: number) => {
//     const imageUrlToDelete = images[index];
//     const technicianId = localStorage.getItem("userId");

//     if (!technicianId || !imageUrlToDelete) {
//       console.error('Missing technicianId or imageUrlToDelete');
//       return;
//     }

//     try {
//       const payload = {
//         technicianId: technicianId,
//         imageUrlToDelete: imageUrlToDelete
//       };

//       console.log('Deleting image with payload:', payload);

//       const response = await axios.delete('http://localhost:5000/api/techImages/deleteSingletechImg', {
//         data: payload
//       });

//       if (response.data.success) {
//         // Remove the image from local state only after successful API call
//         setImages((prev) => prev.filter((_, i) => i !== index));
//         console.log('Image deleted successfully');
//       } else {
//         console.error('Failed to delete image:', response.data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting image:', error);
//     }
//   };

//   // User: view only, Technician: manage photos
//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4">
//       <h2 className="text-xl md:text-2xl font-light mb-4">Photos</h2>
//       <div
//         className="
//           grid
//           grid-cols-1
//           xs:grid-cols-2
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-4
//           xl:grid-cols-6
//           gap-3
//         "
//       >
//         {visibleImages.map((img: string, index: number) => (
//           <div key={index} className="relative group">
//             <img
//               src={img}
//               alt={`Image ${index + 1}`}
//               className="w-full h-36 object-cover rounded-lg"
//             />
//             {/* Delete button overlay, visible on hover */}
//             <button
//               className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 text-red-600 opacity-0 group-hover:opacity-100 transition"
//               onClick={() => handleDelete(index)}
//               title="Delete"
//               type="button"
//             >
//               <FaTrash size={16} />
//             </button>
//           </div>
//         ))}
//       </div>
//       {images.length > 6 && (
//         <div
//           className="flex justify-center mt-4 cursor-pointer text-blue-600 hover:underline text-sm"
//           onClick={() => setShowAll(!showAll)}
//         >
//           {showAll ? (
//             <span className="flex items-center gap-1">
//               View Less <FaChevronUp />
//             </span>
//           ) : (
//             <span className="flex items-center gap-1">
//               View More <FaChevronDown />
//             </span>
//           )}
//         </div>
//       )}
//       {/* Upload Button */}
//       <div className="mt-5">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           ref={inputRef}
//           className="hidden"
//         />
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
//           onClick={handleUploadClick}
//           type="button"
//         >
//           <IoMdCloudUpload size={22} />
//           <span className="text-sm md:text-base font-light">Upload Photo</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;
