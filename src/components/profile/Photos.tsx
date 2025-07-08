import React, { useRef, useState, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaTrash, FaPencilAlt } from "react-icons/fa";
import { getTechImagesByTechId, createTechImagesControl } from '../../api/apiMethods';

const Photos = () => {
  const [images, setImages] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    let id = localStorage.getItem("userId");
    id = "686a65eb4551a5e01e71afb6"
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
    id = "686a65eb4551a5e01e71afb6"
    // id = "686a65eb4551a5e01e71afb6"
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

  const handleDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        {visibleImages.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-36 object-cover rounded-lg"
            />
            {role === "technician" && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  title="Delete"
                  onClick={() => handleDelete(index)}
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
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

      {role === "technician" && (
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
          >
            <IoMdCloudUpload size={22} />
            <span className="text-sm md:text-base font-light">Upload Photo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Photos;


// import React, { useRef, useState } from "react";
// import { IoMdCloudUpload } from "react-icons/io";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// const Photos = () => {

//     const [images, setImages] = useState([
//     "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
//     "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",
//     "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg",
//     "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?b=1&s=612x612&w=0&k=20&c=NUX8oizSVtCWuC9VqFkjUc-EYq3c2Yypzqx-hcaMSKs=",    
//     "https://img.freepik.com/free-photo/electrician-installing-electricity_1398-1567.jpg", 

//   ]);

//   const [showAll, setShowAll] = useState(false);
//   const visibleImages = showAll ? images : images.slice(0, 6);
//     const inputRef = useRef(null);

//     const handleUploadClick = () => {
//     inputRef.current.click();
//   };

//     const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImages((prev) => [imageUrl, ...prev]);
//     }
//   };

//   return (
//     <div className="border border-gray-200 shadow-md rounded-xl p-4">
   
//       <h2 className="text-xl md:text-2xl font-light mb-4">Photos</h2>

//       <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
//         {visibleImages.map((img, index) => (
//           <img
//             key={index}
//             src={img}
//             alt={`Image ${index + 1}`}
//             className="w-full h-36 object-cover rounded-lg"
//           />
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

//       <div className="mt-5">
//           <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           ref={inputRef}
//           className="hidden"
//         />
//         <button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
//          onClick={handleUploadClick}
//         >
//           <IoMdCloudUpload size={22} />
//           <span className="text-sm md:text-base font-light">Upload Photo</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;