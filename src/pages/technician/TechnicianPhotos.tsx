import React, { useRef, useState, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import {
  getTechImagesByTechId,
  createTechImagesControl,
  deletePhotoBySingle,
} from "../../api/apiMethods";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const TechnicianPhotos = () => {
  const inputImageRef = useRef<HTMLInputElement | null>(null);
  const inputVideoRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [techId, setTechId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_IMAGES = 5; // Maximum 5 images allowed
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");

    if (role === "technician" && id) {
      setIsTechnician(true);
      setTechId(id);

      getTechImagesByTechId(id)
        .then((data: any) => {
          if (data?.result && Array.isArray(data.result.imageUrl)) {
            setImages(data.result.imageUrl);
          }
          if (data?.result && Array.isArray(data.result.videoUrl)) {
            setVideos(data.result.videoUrl);
          }
        })
        .catch((err: any) => {
          console.error("Failed to fetch technician images:", err);
        });
    }
  }, []);

  const visibleImages = showAll ? images : images.slice(0, 6);
  const totalMedia = images.length + videos.length;

  const handleUploadImageClick = () => {
    // Check image limit before opening file dialog
    if (images.length >= MAX_IMAGES) {
      setUploadError(`Image limit of ${MAX_IMAGES} reached. Please delete an existing image to upload a new one.`);
      return;
    }
    inputImageRef.current?.click();
  };

  const handleUploadVideoClick = () => {
    inputVideoRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !techId) return;

    // Double-check the limit here as well
    if (images.length >= MAX_IMAGES) {
      setUploadError(`Image limit of ${MAX_IMAGES} reached. Please delete an existing image to upload a new one.`);
      e.target.value = ''; // Clear the input
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image file size exceeds 10MB limit");
      e.target.value = ''; // Clear the input
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append("technicianId", techId);
    formData.append("photos", file);

    try {
      await createTechImagesControl(formData);
      setImages((prev) => [URL.createObjectURL(file), ...prev]);
      // Clear the input after successful upload
      e.target.value = '';
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
      e.target.value = ''; // Clear the input on error
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !techId) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Video file size exceeds 10MB limit");
      e.target.value = ''; // Clear the input
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append("technicianId", techId);
    formData.append("videos", file);

    try {
      const response = await createTechImagesControl(formData);
      if (response?.data?.success) {
        setVideos((prev) => [URL.createObjectURL(file), ...prev]);
        e.target.value = ''; // Clear the input after successful upload
      } else {
        setUploadError("Failed to upload video. Please try again.");
        e.target.value = ''; // Clear the input on error
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      setUploadError("Failed to upload video. Please try again.");
      e.target.value = ''; // Clear the input on error
    }
  };

  const handleDelete = async (type: 'image' | 'video', index: number) => {
    const urlToDelete = type === 'image' ? images[index] : videos[index];
    const technicianId = localStorage.getItem("userId");

    if (window.confirm("Are you sure you want to delete this media?")) {
      if (!technicianId || !urlToDelete) {
        alert("Missing technicianId or urlToDelete");
        return;
      }
      try {
        const payload = {
          technicianId: technicianId,
          imageUrlToDelete: type === 'image' ? urlToDelete : undefined,
          videoUrlToDelete: type === 'video' ? urlToDelete : undefined,
        };

        const response = await deletePhotoBySingle(payload);

        if (response?.data?.success) {
          if (type === 'image') {
            setImages((prev) => prev.filter((_, i) => i !== index));
          } else {
            setVideos((prev) => prev.filter((_, i) => i !== index));
          }
          console.log("Media deleted successfully");
        } else {
          console.error("Failed to delete media:", response?.data?.message);
        }
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  };

  const isVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || (typeof url === 'string' && url.startsWith('blob:'));
  };

  const renderMedia = (src: string, index: number, type: 'image' | 'video') => {
    const actualType = type === 'video' || isVideoUrl(src) ? 'video' : 'image';
    return (
      <div key={`${type}-${index}`} className="relative group">
        {actualType === 'image' ? (
          <img
            src={src}
            alt={`Image ${index + 1}`}
            className="w-full h-36 object-cover rounded-lg"
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full h-36 object-cover rounded-lg"
          />
        )}
        {isTechnician && (
          <button
            onClick={() => handleDelete(actualType, index)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
    );
  };

  const allMedia = [
    ...images.map((img, i) => ({ src: img, type: 'image' as const, index: i })),
    ...videos.map((vid, i) => ({ src: vid, type: 'video' as const, index: i })),
  ];
  const visibleMedia = showAll ? allMedia : allMedia.slice(0, 6);

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4 max-w-7xl mx-auto">
      <div className="text-xl font-extralight mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Photos</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/technician/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>My Photos</span>
        </div>
      </div>

      {/* Upload Buttons (only for technician) */}
      {isTechnician && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={handleUploadImageClick}
            disabled={images.length >= MAX_IMAGES}
            className={`flex items-center mt-5 gap-2 px-4 py-2 rounded ${
              images.length >= MAX_IMAGES
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <IoMdCloudUpload className="text-xl" />
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={inputImageRef}
            onChange={handleImageChange}
            hidden
          />
          <button
            onClick={handleUploadVideoClick}
            className="flex items-center mt-5 gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <IoMdCloudUpload className="text-xl" />
            Upload Video
          </button>
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            ref={inputVideoRef}
            onChange={handleVideoChange}
            hidden
          />
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <div className="mb-4 text-red-600 text-sm text-center">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {visibleMedia && visibleMedia.length > 0 ? (
          visibleMedia.map((media) => renderMedia(media.src, media.index, media.type))
        ) : (
          <div className="text-gray-500 text-center py-4 col-span-full">
            No media available
          </div>
        )}
      </div>

      {totalMedia > 6 && (
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
    </div>
  );
};

export default TechnicianPhotos;

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

// import React, { useRef, useState, useEffect } from "react";
// import { IoMdCloudUpload } from "react-icons/io";
// import { FaChevronDown, FaChevronUp, FaTrash, FaPencilAlt } from "react-icons/fa";
// import { getTechImagesByTechId, createTechImagesControl } from '../../api/apiMethods';
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";

// const TechnicianPhotos = () => {
//   const [images, setImages] = useState<string[]>([]);
//   const [showAll, setShowAll] = useState(false);
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     setRole(localStorage.getItem("role"));
//     let id = localStorage.getItem("userId");
//     id = "686a65eb4551a5e01e71afb6"
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
//     id = "686a65eb4551a5e01e71afb6"
//     // id = "686a65eb4551a5e01e71afb6"
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

//   const handleDelete = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // User: view only, Technician: manage photos
//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4">
//       <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight mb-4">
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">My Photos</h1>
//           <div className="flex items-center space-x-2 text-sm text-gray-500">
//             <Link to="/technician/dashboard" className="hover:underline">
//               Dashboard
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <span>My Photos</span>
//           </div>
//         </div>
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
//     </div>
//   );
// };

// export default TechnicianPhotos;