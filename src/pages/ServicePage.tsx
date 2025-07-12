import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoCall, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineStar } from "react-icons/md";
import axios from "axios";
import AdvertisementBanner from "../components/services/AdvertisementBanner";
import { ServiceFilters } from "../components/services/ServiceFilters";
import { ContactForm } from "../components/services/ContactForms";
import { FaThumbsUp } from "react-icons/fa";

const ServicePage = () => {
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    axios
      .get(http://localhost:5000/api/techDetails/getAllTechniciansByCateId/${categoryId})
      .then((res) => {
        const data = res.data?.result || [];
        setTechnicians(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("API Error:", err));
  }, [categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <AdvertisementBanner />
      <h2 className="text-xl font-semibold my-4">Technicians</h2>
      <ServiceFilters />

      <div className="flex flex-col md:flex-row p-2 gap-3">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
          {technicians.length > 0 ? (
            technicians.map((profile, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(/technicianById/${profile.technician._id})}
              >
                <img
                  src={profile.technician.profileImage || "https://via.placeholder.com/150"}
                  alt={profile.technician.username}
                  className="w-36 h-36 object-cover rounded-2xl"
                />

                <div className="flex-1 space-y-2.5">
                  <h2 className="text-lg font-semibold">{profile.technician.username}</h2>

                  <div className="flex gap-3 items-center">
                    <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
                      {profile.ratings?.rating ?? "4"}
                      <MdOutlineStar size={20} className="ms-1" color="#ffc71b" />
                    </div>
                    {profile.ratings?.rating && (
                      <span className="text-gray-600 text-sm">{profile.ratings.rating} Ratings</span>
                    )}
                  </div>
{profile.technician?.service && (
                  <div className="flex flex-wrap gap-2">
                      <div
                        className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm"
                      >
                        {profile.technician?.service}
                      </div>
                  </div>
                  )}
                  {/* <div className="flex flex-wrap gap-2">
                    {profile.services?.map((s, i) => (
                      <div
                        key={i}
                        className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm"
                      >
                        {s.serviceName}
                      </div>
                    ))}
                  </div> */}

                  <div className="flex items-center">
                    <IoLocationOutline size={20} color="red" />
                    <span className="text-sm ms-1">
                      {profile.technician.areaName}, {profile.technician.city}, {profile.technician.state}, {profile.technician.pincode}
                    </span>
                  </div>
{profile.technician?.description && (
                  <div className="flex items-center">
                              <FaThumbsUp size={22} color="#00B800" className='flex' />
                              <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                                {" "}
                                 {profile.technician?.description}
                                {/* Years in Services */}
                              </span>
                            </div>
                            )}

                  <div className="flex gap-3">
                    <div className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
                      <IoCall size={20} className="me-2" />
                      <span className="text-sm">{profile.technician.phoneNumber}</span>
                    </div>
                    <div className="flex items-center bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500">
                      <LuMessageSquareText size={20} className="me-2" />
                      <span className="text-sm">Message</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No technicians found.</div>
          )}
        </div>
        <ContactForm />
      </div>
    </div>
  );
};

export default ServicePage;


// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { IoCall, IoLocationOutline } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import { MdOutlineStar } from "react-icons/md";
// import axios from "axios";
// import AdvertisementBanner from "../components/services/AdvertisementBanner";
// import { ServiceFilters } from "../components/services/ServiceFilters";
// import { ServicesList } from "../data/ServicesList";
// import { ContactForm } from "../components/services/ContactForms";

// const ServicePage = () => {
//   const location = useLocation();
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const navigate = useNavigate();
//   const [technicians, setTechnicians] = useState([]);

//   useEffect(() => {
//     console.log("Category", categoryId)
//     if (!categoryId) return;
//     axios
//       .get(`http://localhost:5000/api/techDetails/getAllTechniciansByCateId/${categoryId}`)
//       .then((res) => {
//         const data = res.data?.result || [];
//         setTechnicians(Array.isArray(data) ? data : []);
//         console.log("lohiresponse", res)
//       })
//       .catch((err) => console.error(err));
//   }, [categoryId]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       <AdvertisementBanner />
//       <div>
//         <h2 className="text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl fw-600 my-4">
//           Technicians
//         </h2>
//         <div>
//           <ServiceFilters />
//         </div>
//         <div className="flex flex-col md:flex-row p-2 gap-3">
//           <div className="flex-1 space-y-3  overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] ">
//             {technicians.length > 0 ? (technicians.map((profile, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 cursor-pointer hover:bg-gray-100"
//                 onClick={() => navigate(`/technicianById/${profile.technician._id}`)}
//               // onClick={() => navigate(`/technicianById/${profile.technician._id}`, { state: { technicianId: profile.technician._id } })}
//               >
//                 <img
//                   src={
//                     profile?.technician?.profileImage ||
//                     "https://via.placeholder.com/150"
//                   }
//                   alt={profile?.technician.username}
//                   className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-36 object-cover rounded-2xl"
//                 />

//                 <div className="flex-1 space-y-1.5">
//                   <h2 className="text-md sm:text-md md:text-lg lg:text-lg xl:text-xl fw-500">
//                     {profile.technician.username}
//                   </h2>
//                   <div className="flex gap-3 items-center text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
//                     <div className="flex border border-amber-500 rounded-lg px-1  text-black items-center  font-bold">
//                       {profile.ratings.rating || "No ratings"}
//                       <MdOutlineStar size={20} className="ms-1 flex" color="#ffc71b" />
//                     </div>
//                     <div className="text-gray-600 font-extralight">
//                       {profile.ratings.rating} Ratings
//                     </div>
//                   </div>

//                   <div className="flex">
//                     <div className=" bg-fuchsia-200 px-2 py-1 rounded-xl text-black text-sm sm:text-sm md:text-md lg:text-md xl:text-lg">
//                       {profile.technician.service}
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <IoLocationOutline size={23} color="red" />
//                     <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-1">
//                       {profile.technician.areaName}, {profile.technician.city}, {profile.technician.state}, {profile.technician.pincode}
//                     </span>
//                   </div>

//                   <div className="flex gap-3">
//                     <div className="flex bg-fuchsia-500 rounded text-white px-2 items-center cursor-pointer hover:bg-fuchsia-600">
//                       <IoCall size={23} className="me-2" />
//                       <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">{profile.technician.phoneNumber}</span>
//                     </div>

//                     {/* <div className="flex bg-neutral-200 rounded text-green px-2 items-center cursor-pointer hover:bg-neutral-300">

//                       <img
//                         src="https://cdn-icons-png.freepik.com/256/134/134937.png?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_incoming"
//                         className="h-6 w-6 me-2"
//                       />
//                       <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-600">Whatsup</span>
//                     </div> */}

//                     <div className="flex bg-green-600 rounded text-white px-2 items-center cursor-pointer hover:bg-green-500">
//                       <LuMessageSquareText size={22} className="me-2" />
//                       <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg fw-500">Message</span>
//                     </div>

//                   </div>
//                 </div>

//               </div>
//             ))) : (
//               <div className="text-gray-500">No technicians found.</div>
//             )
//             }
//           </div>
//           <ContactForm />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServicePage;
