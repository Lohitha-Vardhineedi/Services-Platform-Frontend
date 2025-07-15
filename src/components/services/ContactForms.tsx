import React, { useState, useEffect, useRef } from "react";
import { IoCall, IoPerson } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { getAllCategories, createGuestBooking, createGetInTouch } from "../../api/apiMethods";

export const ContactForm = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    categoryId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch categories
  const fetchCategoriesForSearch = async () => {
    try {
      const response = await getAllCategories();
      console.log("category Response : ", response);
      if (response.success === true && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      setError(err?.message || "Failed to fetch categories");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoriesForSearch();
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess(null);
  };


  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category._id,
    }));
    setSearchTerm(category.category_name);
  };

  // Filter categories based on search term
  const filteredCategories = categories
    .filter(
      (category) =>
        category?.status === 1 &&
        category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions for better UX

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number (e.g., 9876543210)");
      return;
    }

    // Validate category selection
    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createGetInTouch(formData);
      if (response.success) {
        // setSuccess("Thanks for contacting us! We'll get back to you soon.");
        alert("Thanks for contacting us! We'll get back to you soon.");
        setFormData({ name: "", phoneNumber: "", categoryId: "" });
        setSearchTerm("");
      } else {
        setError(response.message || "Failed to submit contact form");
      }
    } catch (err) {
      setError(err?.message || "An error occurred while submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
          <div className="rounded-xl shadow-xl p-4">
            <div className="text-lg md:text-xl text-center mb-6 font-semibold">
              Get in <span className="text-fuchsia-600">Touch</span>
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-6">
                {/* Name Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <IoPerson size={20} color="#aaa" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your Name"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full"
                    required
                    aria-label="Name"
                  />
                </div>

                {/* Phone Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <IoCall size={20} color="#aaa" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    aria-label="Phone number"
                  />
                </div>

                {/* Category Search Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <BiSolidCategory size={20} color="#aaa" />
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
                    aria-label="Select category"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories
                      .filter((category) => category?.status === 1)
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors disabled:bg-fuchsia-300"
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-sm md:text-lg font-semibold me-2">
                      {isLoading ? "Submitting..." : "Get in Touch"}
                    </span>
                    <MdKeyboardDoubleArrowRight size={30} />
                  </div>
                </button>

                {/* Footer Text */}
                <div className="text-sm text-gray-500 text-center mt-4">
                  We will get back to you as soon as possible
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
// import React, { useState, useEffect } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories } from "../../api/apiMethods";

// export const ContactForm = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     categoryId: "",
//   });

//   // Fetch categories
//   const fetchCategoriesForSearch = async () => {
//     try {
//       const response = await getAllCategories();
//       console.log("category Response : ", response);
//       if (response.success === true && Array.isArray(response.data)) {
//         setCategories(response.data);
//       } else {
//         setError("Invalid response format");
//       }
//     } catch (err) {
//       setError(err?.message || "Failed to fetch categories");
//     }
//   };

//   // Fetch categories on component mount
//   useEffect(() => {
//     fetchCategoriesForSearch();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted Data:", formData);
//     // TODO: Add API call to submit formData to your backend
//     // Example: await submitContactForm(formData);
//     // Reset form after submission (optional)
//     setFormData({
//       name: "",
//       phone: "",
//       categoryId: "",
//     });
//     setError(null); // Clear any previous errors
//   };

//   return (
//     <div className="flex border border-gray-300 rounded-xl shadow p-3">
//       <div className="rounded-xl shadow-xl p-4 w-full">
//         <div className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg text-center font-semibold">
//           Get in <span className="text-fuchsia-600">Touch</span>
//         </div>
//         {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
//         <form onSubmit={handleSubmit} className="mt-4">
//           <div className="flex flex-col gap-4">
//             {/* Name Input */}
//             <div className="flex items-center px-2 py-2 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//               <IoPerson size={20} color="#aaa" />
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your Name"
//                 className="text-sm md:text-md focus:outline-none ml-2 w-full"
//                 required
//                 aria-label="Name"
//               />
//             </div>
//             {/* Phone Input */}
//             <div className="flex items-center px-2 py-2 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//               <IoCall size={20} color="#aaa" />
//               <input
//                 type="tel"
//                 name="phone"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//                 className="text-sm md:text-md focus:outline-none ml-2 w-full"
//                 required
//                 pattern="[0-9]{10}"
//                 title="Please enter a valid 10-digit phone number"
//                 aria-label="Phone number"
//               />
//             </div>
//             {/* Category Dropdown */}
//             <div className="flex items-center px-2 py-2 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//               <BiSolidCategory size={20} color="#aaa" />
//               <select
//                 id="categoryId"
//                 name="categoryId"
//                 value={formData.categoryId}
//                 onChange={handleChange}
//                 required
//                 className="text-sm md:text-md focus:outline-none ml-2 w-full"
//                 aria-label="Select category"
//               >
//                 <option value="" disabled>
//                   Select category
//                 </option>
//                 {categories
//                   .filter((category) => category?.status === 1)
//                   .map((item) => (
//                     <option key={item._id} value={item._id}>
//                       {item.category_name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             {/* Submit Button */}
// <button
//   type="submit"
//   className="bg-fuchsia-500 text-white py-2 rounded-xl hover:bg-fuchsia-600 transition-colors flex items-center justify-center"
// >
//   <span className="text-sm md:text-md font-semibold mr-1">Get</span>
//   <MdKeyboardDoubleArrowRight size={30} />
// </button>
//             {/* Footer Text */}
//             <div className="text-sm text-gray-500 mt-3 text-center">
//               We will get back to you as soon as possible
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContactForm;
// import React, { useState } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { getAllCategories } from "../../api/apiMethods";

// import { BiSolidCategory } from "react-icons/bi";

// export const ContactForm = () => {
//   const [categories, setCategories] = useState([])

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     categoryId: ""
//   });

//   const fetchCategoriesForSearch = async () => {
//       try {
//         const response = await getAllCategories();
//         console.log("category Response : ", response);
//         if (response.success === true && Array.isArray(response.data)) {
//           setCategories(response.data);
//         } else {
//           setError('Invalid response format');
//         }
//       } catch (err) {
//         setError(err?.message || 'Failed to fetch categories');
//       }
//     };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted Data:", formData);
//   };

//   return (
//     <div className="flex border border-gray-300 rounded-xl shadow p-3">
//       <div className="rounded-xl shadow-xl p-4">
//         <div className=" text-sm sm:text-sm md:text-md lg:text-md xl:text-lg text-center">
//          Get in<span className="clr-purple ms-1">Touch</span>
//         </div>
//         <form onSubmit={handleSubmit} className="">
//           <div className="flex flex-col my-4">
//             <div className="flex px-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600">
//               <IoPerson size={20} color="#aaa" />
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your Name"
//                 className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md focus:outline-none ms-2"
//                 required
//               />
//             </div>
//            <div className="flex px-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 mt-6">
//               <IoCall size={20} color="#aaa" />
//               <input
//                 type="tel"
//                 name="phone"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//                 className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md focus:outline-none ms-2 "
//                 required
//               />
//             </div>
//             <div className="flex px-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 mt-6 mb-8">

//               <BiSolidCategory size={20} color="#aaa" />
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.categoryId}
//                 onChange={handleChange}
//                 required
//                 className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md focus:outline-none ms-2 "
//               >
//                 <option value="" disabled>
//                   Select category
//                 </option>
//                 {categories
//                 .filter((category) => category?.status === 1)
//                 .map((item, index) => (
//                   <option key={index} value={item?.category_name}>
//                     {item?.category_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
// <button
//   type="submit"
//   className=" bg-fuchsia-500 text-white py-1 rounded-xl hover:bg-fuchsia-600"
// >
//   <div className=" flex items-center justify-center">
//     <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg font-600 me-1">
//        Get
//     </span>

//     <MdKeyboardDoubleArrowRight size={30} />
//   </div>
// </button>

//             <div className="text-sm sm:text-sm md:text-sm lg:text-sm xl:text-md text-gray-500 mt-5">
//               We will get back to you seen, as soon as possible
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
