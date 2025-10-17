import React, { useState, useEffect, useContext } from "react";
import { IoCall, IoPerson } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight, MdMessage } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { createGetInTouch } from "../../api/apiMethods";
import { CategoryContext } from "../../context/CategoryContext";
import { Category } from "../homepage/CategoriesGrid";

export const ContactForm = () => {
  const { categories }: { categories: Category[] } = useContext(CategoryContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    categoryId: "",
    categoryName: "",
    message: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate name: only alphabets and spaces allowed
    if (name === "name" && value && !/^[A-Za-z\s]*$/.test(value)) {
      setError("Name can only contain alphabets and spaces");
      return;
    }

    // Validate phone number: only digits allowed
    if (name === "phoneNumber" && value && !/^\d*$/.test(value)) {
      setError("Phone number can only contain digits");
      return;
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      if (name === "categoryId" && value) {
        const selectedCategory = categories.find((cat) => cat._id === value);
        if (selectedCategory) {
          newData.categoryName = selectedCategory.category_name;
        }
      }
      return newData;
    });
    setError(null);
    setSuccess(null);
  };

  // Restrict phone number input to digits only
  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode || e.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  // Restrict name input to alphabets and spaces
  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode || e.key.charCodeAt(0);
    if (!(charCode >= 65 && charCode <= 90) && // A-Z
        !(charCode >= 97 && charCode <= 122) && // a-z
        charCode !== 32) { // space
      e.preventDefault();
    }
  };

  // Validate form data
  const validateForm = () => {
    // Name validation: only letters and spaces, 2-50 characters
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!formData.name) {
      return "Name is required";
    }
    if (!nameRegex.test(formData.name)) {
      return "Name must be 2-50 characters long and contain only letters and spaces";
    }

    // Phone number validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      return "Phone number must be exactly 10 digits";
    }

    // Category validation
    if (!formData.categoryId) {
      return "Please select a category";
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await createGetInTouch(formData);
      if (response.success) {
        setSuccess("Thanks for contacting us! We'll get back to you soon.");
        setFormData({ name: "", phoneNumber: "", categoryId: "", categoryName: "", message: "" });
      } else {
        setError(response.message || "Failed to submit contact form");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-300 rounded-xl shadow-xl p-6">
          <div className="rounded-xl p-4">
            <div className="text-lg md:text-xl text-center mb-6 font-semibold">
              Get in <span className="text-fuchsia-600">Touch</span>
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm mb-4 text-center">
                {success}
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
                    onKeyPress={handleNameKeyPress}
                    placeholder="Enter your Name"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full"
                    required
                    pattern="[A-Za-z\s]{2,50}"
                    title="Name must be 2-50 characters long and contain only letters and spaces"
                    aria-label="Name"
                  />
                </div>

                {/* Phone Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <IoCall size={20} color="#aaa" />
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onKeyPress={handlePhoneKeyPress}
                    placeholder="Enter 10-digit phone number"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    aria-label="Phone number"
                  />
                </div>

                {/* Category Select Input */}
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
                      .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Message Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <MdMessage size={20} color="#aaa" />
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message (optional)"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full resize-none"
                    rows={3}
                    aria-label="Message"
                  />
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









// import React, { useState, useEffect, useContext } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight, MdMessage } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { createGetInTouch } from "../../api/apiMethods";
// import { CategoryContext } from "../../context/CategoryContext";
// import { Category } from "../homepage/CategoriesGrid";

// export const ContactForm = () => {
//   const { categories }: { categories: Category[] } = useContext(CategoryContext);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     categoryId: "",
//     categoryName: "",
//     message: "",
//   });

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const newData = {
//         ...prev,
//         [name]: value,
//       };
//       if (name === "categoryId" && value) {
//         const selectedCategory = categories.find((cat) => cat._id === value);
//         if (selectedCategory) {
//           newData.categoryName = selectedCategory.category_name;
//         }
//       }
//       return newData;
//     });
//     setError(null);
//     setSuccess(null);
//   };

//   // Validate form data
//   const validateForm = () => {
//     // Name validation: only letters and spaces, 2-50 characters
//     const nameRegex = /^[A-Za-z\s]{2,50}$/;
//     if (!formData.name) {
//       return "Name is required";
//     }
//     if (!nameRegex.test(formData.name)) {
//       return "Name must be 2-50 characters long and contain only letters and spaces";
//     }

//     // Phone number validation: exactly 10 digits
//     const phoneRegex = /^\d{10}$/;
//     if (!formData.phoneNumber) {
//       return "Phone number is required";
//     }
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       return "Phone number must be exactly 10 digits with no other characters";
//     }

//     // Category validation
//     if (!formData.categoryId) {
//       return "Please select a category";
//     }

//     return null;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // Validate form
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await createGetInTouch(formData);
//       if (response.success) {
//         alert("Thanks for contacting us! We'll get back to you soon.");
//         setFormData({ name: "", phoneNumber: "", categoryId: "", categoryName: "", message: "" });
//       } else {
//         setError(response.message || "Failed to submit contact form");
//       }
//     } catch (err) {
//       setError(err?.message || "An error occurred while submitting the form");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-xl p-6">
//           <div className="rounded-xl p-4">
//             <div className="text-lg md:text-xl text-center mb-6 font-semibold">
//               Get in <span className="text-fuchsia-600">Touch</span>
//             </div>
//             {error && (
//               <div className="text-red-500 text-sm mb-4 text-center">
//                 {error}
//               </div>
//             )}
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
//                     type="number"
//                     name="phoneNumber"
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                     pattern="[0-9]{10}"
//                     maxLength={10}
//                     title="Please enter a valid 10-digit phone number"
//                     aria-label="Phone number"
//                   />
//                 </div>

//                 {/* Category Select Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <BiSolidCategory size={20} color="#aaa" />
//                   <select
//                     id="categoryId"
//                     name="categoryId"
//                     value={formData.categoryId}
//                     onChange={handleChange}
//                     required
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
//                     aria-label="Select category"
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {categories
//                       // .filter((category) => category?.status === 1)
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 {/* Message Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <MdMessage size={20} color="#aaa" />
//                   <textarea
//                     name="message"
//                     id="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     placeholder="Enter your message (optional)"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full resize-none"
//                     rows={3}
//                     aria-label="Message"
//                     required
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors disabled:bg-fuchsia-300"
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-center">
//                     <span className="text-sm md:text-lg font-semibold me-2">
//                       {isLoading ? "Submitting..." : "Get in Touch"}
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

// export default ContactForm;





// import React, { useState, useEffect, useRef } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, createGetInTouch } from "../../api/apiMethods";

// export const ContactForm = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     categoryId: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

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

//   // Handle clicks outside the dropdown to close it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError(null);
//     setSuccess(null);
//   };

//   // Validate form data
//   const validateForm = () => {
//     // Name validation: only letters and spaces, 2-50 characters
//     const nameRegex = /^[A-Za-z\s]{2,50}$/;
//     if (!formData.name) {
//       return "Name is required";
//     }
//     if (!nameRegex.test(formData.name)) {
//       return "Name must be 2-50 characters long and contain only letters and spaces";
//     }

//     // Phone number validation: exactly 10 digits
//     const phoneRegex = /^\d{10}$/;
//     if (!formData.phoneNumber) {
//       return "Phone number is required";
//     }
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       return "Phone number must be exactly 10 digits with no other characters";
//     }

//     // Category validation
//     if (!formData.categoryId) {
//       return "Please select a category";
//     }

//     return null;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // Validate form
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await createGetInTouch(formData);
//       if (response.success) {
//         alert("Thanks for contacting us! We'll get back to you soon.");
//         setFormData({ name: "", phoneNumber: "", categoryId: "" });
//         setSearchTerm("");
//       } else {
//         setError(response.message || "Failed to submit contact form");
//       }
//     } catch (err) {
//       setError(err?.message || "An error occurred while submitting the form");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
//           <div className="rounded-xl shadow-xl p-4">
//             <div className="text-lg md:text-xl text-center mb-6 font-semibold">
//               Get in <span className="text-fuchsia-600">Touch</span>
//             </div>
//             {error && (
//               <div className="text-red-500 text-sm mb-4 text-center">
//                 {error}
//               </div>
//             )}
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
//                     type="tel" // Changed to text to prevent browser number input quirks
//                     name="phoneNumber"
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                     maxLength={10}
//                     aria-label="Phone number"
//                   />
//                 </div>

//                 {/* Category Select Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <BiSolidCategory size={20} color="#aaa" />
//                   <select
//                     id="categoryId"
//                     name="categoryId"
//                     value={formData.categoryId}
//                     onChange={handleChange}
//                     required
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
//                     aria-label="Select category"
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {categories
//                       .filter((category) => category?.status === 1)
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
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
//                   className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors disabled:bg-fuchsia-300"
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-center">
//                     <span className="text-sm md:text-lg font-semibold me-2">
//                       {isLoading ? "Submitting..." : "Get in Touch"}
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

// export default ContactForm;
// import React, { useState, useEffect, useRef } from "react";
// import { IoCall, IoPerson } from "react-icons/io5";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { BiSolidCategory } from "react-icons/bi";
// import { getAllCategories, createGuestBooking, createGetInTouch } from "../../api/apiMethods";

// export const ContactForm = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     categoryId: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

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

//   // Handle clicks outside the dropdown to close it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setError(null);
//     setSuccess(null);
//   };


//   // Handle category selection
//   const handleCategorySelect = (category) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryId: category._id,
//     }));
//     setSearchTerm(category.category_name);
//   };

//   // Filter categories based on search term
//   const filteredCategories = categories
//     .filter(
//       (category) =>
//         category?.status === 1 &&
//         category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .slice(0, 5); // Limit to 5 suggestions for better UX

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // Validate phone number
//     if (!/^\d{10}$/.test(formData.phoneNumber)) {
//       setError("Please enter a valid 10-digit phone number (e.g., 9876543210)");
//       return;
//     }

//     // Validate category selection
//     if (!formData.categoryId) {
//       setError("Please select a category");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await createGetInTouch(formData);
//       if (response.success) {
//         // setSuccess("Thanks for contacting us! We'll get back to you soon.");
//         alert("Thanks for contacting us! We'll get back to you soon.");
//         setFormData({ name: "", phoneNumber: "", categoryId: "" });
//         setSearchTerm("");
//       } else {
//         setError(response.message || "Failed to submit contact form");
//       }
//     } catch (err) {
//       setError(err?.message || "An error occurred while submitting the form");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 ">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
//           <div className="rounded-xl shadow-xl p-4">
//             <div className="text-lg md:text-xl text-center mb-6 font-semibold">
//               Get in <span className="text-fuchsia-600">Touch</span>
//             </div>
//             {error && (
//               <div className="text-red-500 text-sm mb-4 text-center">
//                 {error}
//               </div>
//             )}
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
//                     type="number"
//                     name="phoneNumber"
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full"
//                     required
//                     pattern="[0-9]{10}"
//                     max={10}
//                     title="Please enter a valid 10-digit phone number"
//                     aria-label="Phone number"
//                   />
//                 </div>

//                 {/* Category Search Input */}
//                 <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
//                   <BiSolidCategory size={20} color="#aaa" />
//                   <select
//                     id="categoryId"
//                     name="categoryId"
//                     value={formData.categoryId}
//                     onChange={handleChange}
//                     required
//                     className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
//                     aria-label="Select category"
//                   >
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {categories
//                       // .filter((category) => category?.status === 1)
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
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
//                   className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors disabled:bg-fuchsia-300"
//                   disabled={isLoading}
//                 >
//                   <div className="flex items-center justify-center">
//                     <span className="text-sm md:text-lg font-semibold me-2">
//                       {isLoading ? "Submitting..." : "Get in Touch"}
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

// export default ContactForm;
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
