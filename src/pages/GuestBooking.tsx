import React, { useEffect, useState, useRef } from "react";
import { IoCall, IoPerson } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { getAllCategories, createGuestBooking } from "../api/apiMethods";

export const GuestBooking = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    categoryId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories
  const fetchCategoriesForSearch = async () => {
    try {
      const response = await getAllCategories();
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

  // Handle category search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category._id,
    }));
    setSearchTerm(category.category_name);
    setIsDropdownOpen(false);
  };

  // Filter categories based on search term
  const filteredCategories = categories
    .filter(
      (category) =>
        category?.status === 1 &&
        category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate category selection
    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createGuestBooking(formData);
      if (response.success) {
        alert("Booking created successfully! We'll get back to you soon.");
        setFormData({ name: "", phoneNumber: "", categoryId: "" });
        setSearchTerm("");
      } else {
        setError(response.message || "Failed to create booking");
      }
    } catch (err) {
      setError(err?.message || "An error occurred while creating the booking");
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
              Guest <span className="text-fuchsia-600 ms-1">Booking</span>
            </div>
            {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
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
                      {isLoading ? "Booking..." : "Book Now"}
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

export default GuestBooking;
// import React, { useEffect, useState } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, createGuestBooking } from "../api/apiMethods";

// export const GuestBooking = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     categoryId: "",
//   });

//   // Fetch categories
//   const fetchCategoriesForSearch = async () => {
//     try {
//       const response = await getAllCategories();
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
//     setError(null); // Clear error on input change
//     setSuccess(null); // Clear success message on input change
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // Validate phone number
//     if (!/^\d{10}$/.test(formData.phoneNumber)) {
//       setError("Please enter a valid 10-digit phone number");
//       return;
//     }

//     // Validate category selection
//     if (!formData.categoryId) {
//       setError("Please select a category");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await createGuestBooking(formData);
//       if (response.success) {
//         setSuccess("Booking created successfully! We'll get back to you soon.");
//         setFormData({ name: "", phone: "", categoryId: "" }); // Reset form
//       } else {
//         setError(response.message || "Failed to create booking");
//       }
//     } catch (err) {
//       setError(err?.message || "An error occurred while creating the booking");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
//           <div className="rounded-xl shadow-xl p-4">
//             <div className="text-lg md:text-xl text-center mb-6">
//               Guest <span className="text-fuchsia-600 ms-1">Booking</span>
//             </div>
//             {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
//             {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}
//             <form onSubmit={handleSubmit}>
//               <div className="flex flex-col space-y-6">
//                 {/* Name Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <IoPerson size={20} color="#aaa" />
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your Name"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                     aria-label="Name"
//                   />
//                 </div>

//                 {/* Phone Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <IoCall size={20} color="#aaa" />
//                   <input
//                     type="tel"
//                     name="phone"
//                     id="phone"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                     pattern="[0-9]{10}"
//                     title="Please enter a valid 10-digit phone number"
//                     aria-label="Phone number"
//                   />
//                 </div>

//                 {/* Category Select */}
                // <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                //   <BiSolidCategory size={20} color="#aaa" />
                //   <select
                //     id="categoryId"
                //     name="categoryId"
                //     value={formData.categoryId}
                //     onChange={handleChange}
                //     required
                //     className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
                //     aria-label="Select category"
                //   >
                //     <option value="" disabled>
                //       Select a category
                //     </option>
                //     {categories
                //       .filter((category) => category?.status === 1)
                //       .map((item) => (
                //         <option key={item._id} value={item._id}>
                //           {item.category_name}
                //         </option>
                //       ))}
                //   </select>
                // </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors disabled:bg-fuchsia-300"
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-center">
//                     <span className="text-sm md:text-lg font-semibold me-2">
//                       {isLoading ? "Booking..." : "Book Now"}
//                     </span>
//                     <MdKeyboardDoubleArrowRight size={30} />
//                   </div>
//                 </button>

//                 {/* Footer Text */}
//                 <div className="text-sm text-gray-500 text-center mt-4">
//                   We will get back to you as soon as possible
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestBooking;
// import React, { useEffect, useState } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories } from "../api/apiMethods";


// export const GuestBooking = () => {
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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Submitted Data:", formData);
//     // Handle form submission here
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
//           <div className="rounded-xl shadow-xl p-4">
//             <div className="text-lg md:text-xl text-center mb-6">
//               Geust<span className="clr-purple ms-1">Booking</span>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="flex flex-col space-y-6">
//                 {/* Name Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <IoPerson size={20} color="#aaa" />
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your Name"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                   />
//                 </div>

//                 {/* Phone Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <IoCall size={20} color="#aaa" />
//                   <input
//                     type="tel"
//                     name="phone"
//                     id="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                   />
//                 </div>

//                 {/* Category Select */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <BiSolidCategory size={20} color="#aaa" />
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.categoryId}
//                     onChange={handleChange}
//                     required
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {categories
//                       .filter((category) => category?.status === 1)
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors"
//                 >
//                   <div className="flex items-center justify-center">
//                     <span className="text-sm md:text-lg font-semibold me-2">
//                       Book Now
//                     </span>
//                     <MdKeyboardDoubleArrowRight size={30} />
//                   </div>
//                 </button>

//                 {/* Footer Text */}
//                 <div className="text-sm text-gray-500 text-center mt-4">
//                   We will get back to you as soon as possible
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

