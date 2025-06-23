import React from "react";
import { IoCall, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AdvertisementBanner from "../components/services/AdvertisementBanner.tsx";
import { ServiceFilters } from "../components/services/ServiceFilters.tsx";
import {  ServicesList } from "../data/ServicesList.ts";
import { ContactForm } from "../components/services/ContactForms.tsx";

const ServicePage = () => {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Adds.map((add, index) => (
          <img key={index} src={add?.Image} alt={`Add ${index + 1}`} className="w-full h-40 object-cover rounded-xl shadow-md"/>
        ))}
      </div> */}
      <AdvertisementBanner/>

      <div>
        <h2 className="text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl fw-600 my-4">
          Best Services
        </h2>
        <div>
          <ServiceFilters />
        </div>
        <div className="flex flex-col md:flex-row p-2 gap-3">
          <div onClick={()=>navigate("/profile")} className="flex-1 space-y-3  overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] ">
            {ServicesList.map((profile, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 cursor-pointer hover:bg-gray-100"
              >
             
                  <img
                    src={profile?.image}
                    alt={profile?.name}
                    className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-36 object-cover rounded-2xl"
                  />
               
                <div className="flex-1 space-y-1.5">
                  <h2 className="text-md sm:text-md md:text-lg lg:text-lg xl:text-xl fw-500">
                    {profile?.name}
                  </h2>
                  <div className="flex gap-3 items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                    <div className="flex border border-amber-500 rounded-lg px-1  text-black items-center  font-bold">
                      {profile?.reviews}
                      <MdOutlineStar size={20} className="ms-1 flex" color="#ffc71b" />
                    </div>
                    <div className="text-gray-600 font-extralight">{profile?.ratings}</div>
                  </div>

                  <div className="flex">
                    <div className=" bg-fuchsia-200 px-2 py-1 rounded-xl text-black text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                      {profile?.services}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IoLocationOutline size={23} color="red" />
                    <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-1">
                      {" "}
                      {profile?.location}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex bg-fuchsia-500 rounded text-white px-2 items-center cursor-pointer hover:bg-fuchsia-600">
                      <IoCall size={23} className="me-2" />
                     <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">{profile?.phn}</span> 
                    </div>

                    <div className="flex bg-neutral-200 rounded text-green px-2 items-center cursor-pointer hover:bg-neutral-300">

                      <img
                        src="https://cdn-icons-png.freepik.com/256/134/134937.png?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_incoming"
                        className="h-6 w-6 me-2"
                      />
                      <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-600">Whatsup</span>
                    </div>

                    <div className="flex bg-green-600 rounded text-white px-2 items-center cursor-pointer hover:bg-green-500">
                      <LuMessageSquareText size={22} className="me-2" />
                      <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">Enquiry</span>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
            <ContactForm/>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
