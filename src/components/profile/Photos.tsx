import React, { useRef, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Photos = () => {

    const [images, setImages] = useState([
    "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
    "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",    
    "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",    
    "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",    
    "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",    

  ]);

  const [showAll, setShowAll] = useState(false);
  const visibleImages = showAll ? images : images.slice(0, 6);
    const inputRef = useRef(null);

    const handleUploadClick = () => {
    inputRef.current.click();
  };

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [imageUrl, ...prev]);
    }
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-4">
   
      <h2 className="text-xl md:text-2xl font-light mb-4">Photos</h2>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {visibleImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Image ${index + 1}`}
            className="w-full h-36 object-cover rounded-lg"
          />
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

      <div className="mt-5">
          <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
         onClick={handleUploadClick}
        >
          <IoMdCloudUpload size={22} />
          <span className="text-sm md:text-base font-light">Upload Photo</span>
        </button>
      </div>
    </div>
  );
};

export default Photos;