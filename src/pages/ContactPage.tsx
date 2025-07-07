import React, { useState } from "react";
import { IoCall, IoPerson } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";

const categories = ["plumbing", "carpenter", "electrician"];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6">
          <div className="rounded-xl shadow-xl p-4">
            <div className="text-lg md:text-xl text-center mb-6">
              Get in<span className="clr-purple ms-1">Touch</span>
            </div>
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
                  />
                </div>

                {/* Phone Input */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <IoCall size={20} color="#aaa" />
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="text-sm md:text-base focus:outline-none ms-2 w-full"
                    required
                  />
                </div>

                {/* Category Select */}
                <div className="flex px-3 py-3 border border-gray-400 rounded-lg focus-within:ring-2 focus-within:ring-fuchsia-600">
                  <BiSolidCategory size={20} color="#aaa" />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="text-sm md:text-base focus:outline-none ms-2 w-full bg-transparent"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-fuchsia-500 text-white py-3 rounded-xl hover:bg-fuchsia-600 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-sm md:text-lg font-semibold me-2">
                      Get in Touch
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

export default ContactPage;