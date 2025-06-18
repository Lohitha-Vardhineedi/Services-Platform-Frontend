import React, { useState } from "react";
import { IoCall, IoPerson } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="flex border border-gray-300 rounded-xl shadow p-3">
      <div className="rounded-xl shadow-xl p-4">
        <div className=" text-sm sm:text-sm md:text-md lg:text-md xl:text-lg text-center">
          Get the list of Top <span className="clr-purple">Services</span>
        </div>
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col my-4">
            <div className="flex px-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600">
              <IoPerson size={20} color="#aaa" />
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your Name"
                className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md focus:outline-none ms-2"
                required
              />
            </div>
            <div className="flex px-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 mt-6 mb-8">
              <IoCall size={20} color="#aaa" />
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="text-sm sm:text-sm md:text-md lg:text-md xl:text-md focus:outline-none ms-2 "
                required
              />
            </div>
            <button
              type="submit"
              className=" bg-fuchsia-500 text-white py-1 rounded-xl hover:bg-fuchsia-600"
            >
              <div className=" flex items-center justify-center">
                <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg font-600 me-1">
                  Get Best Services
                </span>

                <MdKeyboardDoubleArrowRight size={30} />
              </div>
            </button>

            <div className="text-sm sm:text-sm md:text-sm lg:text-sm xl:text-md text-gray-500 mt-5">
              We will get back to you seen, as soon as possible
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
