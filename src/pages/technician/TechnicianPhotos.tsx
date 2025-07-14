import React, { useRef, useState, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { getTechImagesByTechId, createTechImagesControl } from "../../api/apiMethods";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import axios from "axios";

const TechnicianPhotos = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [techId, setTechId] = useState<string | null>(null);

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
        })
        .catch((err: any) => {
          console.error("Failed to fetch technician images:", err);
        });
    }
  }, []);

  const visibleImages = showAll ? images : images.slice(0, 6);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !techId) return;

    const formData = new FormData();
    formData.append("technicianId", techId);
    formData.append("photos", file);

    try {
      await createTechImagesControl(formData);
      setImages((prev) => [URL.createObjectURL(file), ...prev]);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

   const handleDelete = async (index: number) => {
    const imageUrlToDelete = images[index];
    const technicianId = localStorage.getItem("userId");

    if (!technicianId || !imageUrlToDelete) {
      console.error('Missing technicianId or imageUrlToDelete');
      return;
    }

    try {
      const payload = {
        technicianId: technicianId,
        imageUrlToDelete: imageUrlToDelete
      };

      console.log('Deleting image with payload:', payload);

      const response = await axios.delete('http://localhost:5000/api/techImages/deleteSingletechImg', {
        data: payload
      });

      if (response.data.success) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        console.log('Image deleted successfully');
      } else {
        console.error('Failed to delete image:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

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

      {/* Upload Button (only for technician) */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {visibleImages.map((img: string, index: number) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-36 object-cover rounded-lg"
            />
            {isTechnician && (
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {images.length > 6 && (
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

      {isTechnician && (
        <div className="mb-4">
          <button
            onClick={handleUploadClick}
            className="flex items-center mt-5 gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <IoMdCloudUpload className="text-xl" />
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            hidden
          />
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