import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCall, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineStar } from "react-icons/md";
import axios from "axios";
import AdvertisementBanner from "../components/services/AdvertisementBanner";
import { ServiceFilters } from "../components/services/ServiceFilters";
import { ServicesList } from "../data/ServicesList";
import { ContactForm } from "../components/services/ContactForms";

const ServicePage = () => {
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    console.log("Category",categoryId)
    if (!categoryId) return;
    axios
      .get(`http://localhost:5000/api/techDetails/getAllTechniciansByCateId/${categoryId}`)
      .then((res) => {
        console.log("response : ",res.data.result)
        setTechnicians(Array.isArray(res.data.result) ? res.data.result : []);
      })
      .catch((err) => console.error(err));
  }, [categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <AdvertisementBanner/>
      <div>
        <h2 className="text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl fw-600 my-4">
          Technicians 
        </h2>
        <div>
          <ServiceFilters/>
        </div>
        <div className="flex flex-col md:flex-row p-2 gap-3">
          <div className="flex-1 space-y-3  overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] ">
            {Array.isArray(technicians) && technicians.map((profile, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate("/technicianById", { state: { technicianId: profile.technician._id } })}
              >
                  <img
                    src={
                      profile?.technicianImages ||
                      "https://via.placeholder.com/150" // fallback image
                    }
                    alt={profile?.technician.username}
                    className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-36 object-cover rounded-2xl"
                  />
               
                <div className="flex-1 space-y-1.5">
                  <h2 className="text-md sm:text-md md:text-lg lg:text-lg xl:text-xl fw-500">
                    {profile.technician.username}
                  </h2>
                  <div className="flex gap-3 items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                    <div className="flex border border-amber-500 rounded-lg px-1  text-black items-center  font-bold">
                      {profile.ratings || "No ratings"}
                      <MdOutlineStar size={20} className="ms-1 flex" color="#ffc71b" />
                    </div>
                    <div className="text-gray-600 font-extralight">
                      {profile.technician.userId}
                    </div>
                  </div>

                  <div className="flex">
                    <div className=" bg-fuchsia-200 px-2 py-1 rounded-xl text-black text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
                      {profile.technician.role}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IoLocationOutline size={23} color="red" />
                    <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-1">
                      {profile.technician.city}, {profile.technician.state}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex bg-fuchsia-500 rounded text-white px-2 items-center cursor-pointer hover:bg-fuchsia-600">
                      <IoCall size={23} className="me-2" />
                     <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">{profile.technician.phoneNumber}</span> 
                    </div>

                    {/* <div className="flex bg-neutral-200 rounded text-green px-2 items-center cursor-pointer hover:bg-neutral-300">

                      <img
                        src="https://cdn-icons-png.freepik.com/256/134/134937.png?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_incoming"
                        className="h-6 w-6 me-2"
                      />
                      <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-600">Whatsup</span>
                    </div> */}

                    <div className="flex bg-green-600 rounded text-white px-2 items-center cursor-pointer hover:bg-green-500">
                      <LuMessageSquareText size={22} className="me-2" />
                      <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">Message</span>
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
