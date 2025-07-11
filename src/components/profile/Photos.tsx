import React, { useRef, useState, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { getTechImagesByTechId, createTechImagesControl } from '../../api/apiMethods';
import axios from 'axios';

const Photos = () => {
  const [images, setImages] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    let id = localStorage.getItem("userId");
    console.log(id)
    if (id) {
      getTechImagesByTechId(id)
        .then((data: any) => {
          if (data?.result && Array.isArray(data.result.imageUrl)) {
            setImages(data.result.imageUrl);
          }
        })
        .catch((err: any) => {
          console.error('Failed to fetch technician images:', err);
        });
    }
  }, []);

  const visibleImages = showAll ? images : images.slice(0, 6);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let id = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("technicianId", id || "");
    if (file instanceof File) {
      formData.append("photos", file);
    }
    for (let pair of formData.entries()) {
      console.log("debug : ", pair[0] + ':', pair[1]);
    }
    await createTechImagesControl(formData);
    setImages((prev) => [URL.createObjectURL(file), ...prev]);
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
        // Remove the image from local state only after successful API call
        setImages((prev) => prev.filter((_, i) => i !== index));
        console.log('Image deleted successfully');
      } else {
        console.error('Failed to delete image:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // User: view only, Technician: manage photos
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
        {visibleImages.map((img: string, index: number) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-36 object-cover rounded-lg"
            />
            {/* Delete button overlay, visible on hover */}
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 text-red-600 opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleDelete(index)}
              title="Delete"
              type="button"
            >
              <FaTrash size={16} />
            </button>
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
      {/* Upload Button */}
      <div className="mt-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
          onClick={handleUploadClick}
          type="button"
        >
          <IoMdCloudUpload size={22} />
          <span className="text-sm md:text-base font-light">Upload Photo</span>
        </button>
      </div>
    </div>
  );
};

export default Photos;