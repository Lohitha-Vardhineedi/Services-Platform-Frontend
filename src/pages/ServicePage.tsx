import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoCall, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineStar } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import AdvertisementBanner from "../components/services/AdvertisementBanner";
import { ServiceFilters } from "../components/services/ServiceFilters";
import { ContactForm } from "../components/services/ContactForms";
import { getTechByCategorie } from "../api/apiMethods";
import { Helmet } from "react-helmet-async";

interface Technician {
  technician: {
    _id: string;
    username: string;
    profileImage?: string;
    service?: string;
    areaName: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    description?: string;
  };
  ratings?: {
    rating: number;
  };
  servicesDone?: number;
}

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  meta_title: string;
  meta_description: string;
  status: number;
  seo_content?: string;
}

const ServicePage = () => {
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(
    []
  );
  const [error, setError] = useState("");
  const categoryDetails = location?.state?.category as Category;
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [errorContent, setErrorContent] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchTechByCategoryId = async () => {
      try {
        setIsDataLoading(true);
        const response = await getTechByCategorie(categoryId);
        const data = response?.result?.technicians || [];

        // Map API response to Technician interface
        const mappedTechnicians: Technician[] = data.map((item: any) => ({
          technician: {
            _id: item.technician._id,
            username: item.technician.username,
            profileImage:
              item.technician.profileImage ||
              "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg",
            service:
              item.services?.length > 0
                ? item.services[0].serviceName
                : undefined,
            areaName: item.technician.areaName,
            city: item.technician.city,
            state: item.technician.state,
            pincode: item.technician.pincode,
            phoneNumber: item.technician.phoneNumber,
            description: item.technician.description,
          },
          ratings: item.ratings || null, // Ratings are null in the provided response
          servicesDone: item.techSubDetails?.subscriptions[0]?.ordersCount || 0,
        }));

        setTechnicians(mappedTechnicians);
        setFilteredTechnicians(mappedTechnicians);
      } catch (error: any) {
        setError(error?.message || "Failed to fetch technicians");
        setErrorContent(error?.message || "Failed to fetch technicians");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchTechByCategoryId();
  }, [categoryId]);

  function openWhatsApp(number: number, message: string) {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // opens in new tab
  }

  const handleFilterChange = (filter: string) => {
    let updatedTechnicians = [...technicians];
    if (filter === "topRated") {
      updatedTechnicians = technicians.filter(
        (tech) => (tech.ratings?.rating ?? 0) >= 3.0
      );
    } else if (filter === "popular") {
      updatedTechnicians = technicians.sort(
        (a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0)
      );
    }
    setFilteredTechnicians(updatedTechnicians);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Helmet>
        <title>{categoryDetails?.meta_title || "Service Page"}</title>
        <meta
          name="description"
          content={
            categoryDetails?.meta_description ||
            "Explore our services and find the best technicians."
          }
        />
      </Helmet>

      <AdvertisementBanner />
      <h2 className="text-xl font-semibold my-4">Technicians</h2>
      <ServiceFilters onFilterChange={handleFilterChange} />

      <div className="flex flex-col md:flex-row p-2 gap-3">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
          {filteredTechnicians.length > 0 ? (
            filteredTechnicians.map((profile, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  navigate(`/technicianById/${profile.technician?._id}`)
                }
              >
                <img
                  src={profile.technician.profileImage}
                  alt={profile.technician.username}
                  className="w-36 h-36 object-cover rounded-2xl"
                />
                <div className="flex-1 space-y-2.5">
                  <h2 className="text-lg font-semibold">
                    {profile.technician.username}
                  </h2>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
                      {profile.ratings?.rating ?? "4"}
                      <MdOutlineStar
                        size={20}
                        className="ms-1"
                        color="#ffc71b"
                      />
                    </div>
                    {profile.ratings?.rating && (
                      <span className="text-gray-600 text-sm">
                        {profile.ratings.rating} Ratings
                      </span>
                    )}
                  </div>
                  {profile.technician?.service && (
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm">
                        {profile.technician?.service}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <IoLocationOutline size={20} color="red" />
                    <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                      {profile.technician.areaName}, {profile.technician.city},{" "}
                      {profile.technician.state}, {profile.technician.pincode}
                    </span>
                  </div>
                  {profile.technician?.description && (
                    <div className="flex items-center">
                      <FaThumbsUp size={22} color="#00B800" className="flex" />
                      <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                        {profile.technician?.description} years in Services
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {/* <div className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
                      <IoCall size={20} className="me-2" />
                      <span className="text-sm">{profile.technician.phoneNumber}</span>
                    </div> */}
                    <div className=" bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500">
                      <button
                        onClick={() =>
                          openWhatsApp(
                            +919603558369,
                            "Hello, I am interested in your services"
                          )
                        }
                        className="flex items-center"
                      >
                        <LuMessageSquareText size={20} className="me-2" />
                        <span className="text-sm">Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No technicians found.
            </div>
          )}
        </div>
        <ContactForm />
      </div>

      <div className="mt-6 space-y-4">
        {isDataLoading ? (
          <div className="text-center">Loading Data...</div>
        ) : errorContent ? (
          <div className="text-red-500 text-center">{errorContent}</div>
        ) : categoryDetails?.seo_content &&
          categoryDetails.seo_content.length > 0 ? (
          <div className="jodit-wysiwyg">
            <div
              className="jodit-wysiwyg"
              dangerouslySetInnerHTML={{ __html: categoryDetails?.seo_content }}
            />
          </div>
        ) : (
          <div>No Content for this Category</div>
        )}
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
// import { FaThumbsUp } from "react-icons/fa";
// import axios from "axios";
// import AdvertisementBanner from "../components/services/AdvertisementBanner";
// import { ServiceFilters } from "../components/services/ServiceFilters";
// import { ContactForm } from "../components/services/ContactForms";
// import { getTechByCategorie } from "../api/apiMethods";
// import { Helmet } from "react-helmet-async";

// interface Technician {
//   technician: {
//     _id: string;
//     username: string;
//     profileImage?: string;
//     service?: string;
//     areaName: string;
//     city: string;
//     state: string;
//     pincode: string;
//     phoneNumber: string;
//     description?: string;
//   };
//   ratings?: {
//     rating: number;
//   };
//   servicesDone?: number; // Added for sorting by popularity
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string;
//   meta_title: string;
//   meta_description: string;
//   status: number;
// }

// const ServicePage = () => {
//   const location = useLocation();
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const navigate = useNavigate();
//   const [technicians, setTechnicians] = useState<Technician[]>([]);
//   const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
//   const [error, setError] = useState("");
//   const categoryDetails = location?.state?.category as Category;
//   console.log(categoryDetails, "categoryDetails")
//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [errorContent, setErrorContent] = useState<string | null>(null);

//   useEffect(() => {
//     if (!categoryId) return;

//     const fetchTechByCategoryId = async () => {
//       try {
//         setIsDataLoading(true);
//         console.log(categoryId, "==> categoryId");
//         const response = await getTechByCategorie(categoryId);
//         console.log(response, "==> fetched response");
//         const data = response?.result || [];
//         setTechnicians(Array.isArray(data) ? data : []);
//         setFilteredTechnicians(Array.isArray(data) ? data : []);
//       } catch (error: any) {
//         setError(error?.message || "Failed to fetch technicians");
//         setErrorContent(error?.message || "Failed to fetch technicians");
//       } finally {
//         setIsDataLoading(false);
//       }
//     };

//     fetchTechByCategoryId();
//   }, [categoryId]);

//   const handleFilterChange = (filter: string) => {
//     let updatedTechnicians = [...technicians];
//     if (filter === "topRated") {
//       updatedTechnicians = technicians.filter(
//         (tech) => (tech.ratings?.rating ?? 0) >= 3.0
//       );
//     } else if (filter === "popular") {
//       updatedTechnicians = technicians.sort(
//         (a, b) => (b.servicesDone ?? 0) - (a.servicesDone ?? 0)
//       );
//     }
//     setFilteredTechnicians(updatedTechnicians);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       <Helmet>
//         <title>{categoryDetails?.meta_title || "Service Page"}</title>
//         <meta name="description" content={categoryDetails?.meta_description || "Explore our services and find the best technicians."} />
//       </Helmet>

//       <AdvertisementBanner />
//       <h2 className="text-xl font-semibold my-4">Technicians</h2>
//       <ServiceFilters onFilterChange={handleFilterChange} />

//       <div className="flex flex-col md:flex-row p-2 gap-3">
//         <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
//           {filteredTechnicians.length > 0 ? (
//             filteredTechnicians.map((profile, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => navigate(`/technicianById/${profile.technician?._id}`)}
//               >
//                 <img
//                   src={profile.technician.profileImage}
//                   alt={profile.technician.username}
//                   className="w-36 h-36 object-cover rounded-2xl"
//                 />
//                 <div className="flex-1 space-y-2.5">
//                   <h2 className="text-lg font-semibold">{profile.technician.username}</h2>
//                   <div className="flex gap-3 items-center">
//                     <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
//                       {profile.ratings?.rating ?? "4"}
//                       <MdOutlineStar size={20} className="ms-1" color="#ffc71b" />
//                     </div>
//                     {profile.ratings?.rating && (
//                       <span className="text-gray-600 text-sm">{profile.ratings.rating} Ratings</span>
//                     )}
//                   </div>
//                   {profile.technician?.service && (
//                     <div className="flex flex-wrap gap-2">
//                       <div className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm">
//                         {profile.technician?.service}
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center">
//                     <IoLocationOutline size={20} color="red" />
//                     <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                       {profile.technician.areaName}, {profile.technician.city}, {profile.technician.state}, {profile.technician.pincode}
//                     </span>
//                   </div>
//                   {profile.technician?.description && (
//                     <div className="flex items-center">
//                       <FaThumbsUp size={22} color="#00B800" className="flex" />
//                       <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                         {profile.technician?.description} years in Services
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex gap-3">
//                     {/* <div className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
//                       <IoCall size={20} className="me-2" />
//                       <span className="text-sm">{profile.technician.phoneNumber}</span>
//                     </div> */}
//                     <div className="flex items-center bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500">
//                       <LuMessageSquareText size={20} className="me-2" />
//                       <span className="text-sm">Message</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 text-center">No technicians found.</div>
//           )}
//         </div>
//         <ContactForm />
//       </div>

//       <div className="mt-6 space-y-4">
//         {isDataLoading ? (
//           <div className="text-center">Loading Data...</div>
//         ) : errorContent ? (
//           <div className="text-red-500 text-center">{errorContent}</div>
//         ) : categoryDetails?.seo_content.length > 0 ? (
//           <div className="ql-snow">
//             <div className="ql-editor" dangerouslySetInnerHTML={{ __html: categoryDetails?.seo_content }} />
//           </div>

//         ) : (
//         <div>No Content for this Category</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ServicePage;
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { IoCall, IoLocationOutline } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import { MdOutlineStar } from "react-icons/md";
// import axios from "axios";
// import AdvertisementBanner from "../components/services/AdvertisementBanner";
// import { ServiceFilters } from "../components/services/ServiceFilters";
// import { ContactForm } from "../components/services/ContactForms";
// import { FaThumbsUp } from "react-icons/fa";
// import { getTechByCategorie } from "../api/apiMethods";

// // interface category {
// //   _id: string;
// //   category_name: string;
// //   category_image: string;
// //   meta_title: string;
// //   meta_description: string;
// //   status: number;
// // }

// // interface LocationState {
// //   categoryDatails: category;
// // }

// const ServicePage = () => {
//   const location = useLocation();
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const navigate = useNavigate();
//   const [technicians, setTechnicians] = useState([]);
//   const [error, setError] = useState("");
//   const [filtedTechnicians, setFiltedTechnicians] = useState([]);
//   // const state = location.state as LocationState;
//   // const categoryDatails = state.categoryDatails;
//   const categoryDetails = location?.state?.category
//  console.log(categoryDetails, "==>categoryDetails")

//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [errorContent, setErrorContent] = useState<string | null>(null);

//   // useEffect(() => {
//   //   if (!categoryId) return;
//   //   console.log(categoryId, "==>categoryId")
//   //   const fetchTechByCategoryId = async () => {
//   //     const response = await getTechByCategorie(categoryId);

//   //     try {
//   //       console.log(response, "==>categoryId")
//   //       if (response) {

//   //         const data = response.data?.result || [];
//   //         setTechnicians(Array.isArray(data) ? data : []);
//   //       }
//   //     }
//   //     catch (error) {
//   //       setError(error?.message)
//   //     }
//   //   }
//   //   fetchTechByCategoryId()
//   // }, [categoryId]);

//   // useEffect(() => {
//   //   if (!categoryId) return;
//   //   console.log(categoryId,"==>categoryId")
//   //   axios
//   //     .get(`/api/techDetails/getAllTechniciansByCateId/${categoryId}`)
//   //     .then((res) => {
//   //       const data = res.data?.result || [];
//   //       setTechnicians(Array.isArray(data) ? data : []);
//   //     })
//   //     .catch((err) => console.error("API Error:", err));
//   // }, [categoryId]);

//   useEffect(() => {
//     if (!categoryId) return;

//     const fetchTechByCategoryId = async () => {
//       try {
//         console.log(categoryId, "==> categoryId");

//         const response = await getTechByCategorie(categoryId);
//         console.log(response, "==> fetched response");

//         const data = response?.result || [];
//         setTechnicians(Array.isArray(data) ? data : []);
//       } catch (error: any) {
//         setError(error?.message || "Failed to fetch technicians");
//       }
//     };

//     fetchTechByCategoryId();
//   }, [categoryId]);

//   // useEffect(() => {
//   //   if()
//   //   setFiltedTechnicians(technicians);
//   // }, [technicians]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       <AdvertisementBanner />
//       <h2 className="text-xl font-semibold my-4">Technicians</h2>
//       <ServiceFilters />

//       <div className="flex flex-col md:flex-row p-2 gap-3">
//         <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
//           {technicians.length > 0 ? (

//             technicians.map((profile, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => navigate(`/technicianById/${profile.technician?._id}`)}
//               >
//                 <img
//                   src={profile.technician.profileImage }
//                   alt={profile.technician.username}
//                   className="w-36 h-36 object-cover rounded-2xl"
//                 />

//                 <div className="flex-1 space-y-2.5">
//                   <h2 className="text-lg font-semibold">{profile.technician.username}</h2>

//                   <div className="flex gap-3 items-center">
//                     <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
//                       {profile.ratings?.rating ?? "4"}
//                       <MdOutlineStar size={20} className="ms-1" color="#ffc71b" />
//                     </div>
//                     {profile.ratings?.rating && (
//                       <span className="text-gray-600 text-sm">{profile.ratings.rating} Ratings</span>
//                     )}
//                   </div>
//                   {profile.technician?.service && (
//                     <div className="flex flex-wrap gap-2">
//                       <div
//                         className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm"
//                       >
//                         {profile.technician?.service}
//                       </div>
//                     </div>
//                   )}
//                   {/* <div className="flex flex-wrap gap-2">
//                     {profile.services?.map((s, i) => (
//                       <div
//                         key={i}
//                         className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm"
//                       >
//                         {s.serviceName}
//                       </div>
//                     ))}
//                   </div> */}

//                   <div className="flex items-center">
//                     <IoLocationOutline size={20} color="red" />
//                     <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                       {profile.technician.areaName}, {profile.technician.city}, {profile.technician.state}, {profile.technician.pincode}
//                     </span>
//                   </div>
//                   {profile.technician?.description && (
//                     <div className="flex items-center">
//                       <FaThumbsUp size={22} color="#00B800" className='flex' />
//                       <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                         {" "}
//                         {profile.technician?.description} years in Services
//                         {/* Years in Services */}
//                       </span>
//                     </div>
//                   )}

//                   <div className="flex gap-3">
//                     <div className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
//                       <IoCall size={20} className="me-2" />
//                       <span className="text-sm">{profile.technician.phoneNumber}</span>
//                     </div>
//                     <div className="flex items-center bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500">
//                       <LuMessageSquareText size={20} className="me-2" />
//                       <span className="text-sm">Message</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 text-center">No technicians found.</div>
//           )}
//         </div>
//         <ContactForm />
//       </div>

//       <div className="mt-6 space-y-4">
//         {isDataLoading ? (
//           <div className="text-center">Loading Data...</div>
//         ) : errorContent ? (
//           <div className="text-red-500 text-center">{errorContent}</div>
//         ) : categoryDetails?.meta_title ? (
//             <div key={categoryDetails._id}>
//               <h1 className="text-2xl font-bold mb-2">{categoryDetails?.meta_title}</h1>
//               <p className="text-base text-gray-700">{categoryDetails?.meta_description}</p>
//             </div>
//         ) : (
//           <> <h1 className="text-2xl font-bold">{categoryDetails?.category_name} Services</h1>
//             <p className="text-base text-gray-700">We offer complete services in {categoryDetails?.category_name} to ensure a tidy, fresh, and healthy atmosphere for your office or home. Our expert team of cleaners has modern tools and the Best cleaning services to take on the most demanding chores.</p>
//             <h2 className="text-2xl font-semibold">How to Hire Technicians in {categoryDetails?.category_name}</h2>
//             <p className="text-base text-gray-700">We are PRNV Services, We offer an array of Technicians in {categoryDetails?.category_name} to meet commercial and residential needs. Finding professional Technicians in Hyderabad is an easy process using PRNV Services. Here's how to ensure that you're hiring the correct cleaning service: Evaluate Your Cleaning Needs: Before hiring, evaluate what areas require a thorough cleaning.</p>
//             <h2 className="text-2xl font-semibold">Cost of Services in {categoryDetails?.category_name}</h2>
//             <p className="text-base text-gray-700">The cost of services in {categoryDetails?.category_name} is contingent upon a variety of aspects, such as the dimensions of the building and the kind of cleaning needed, as well as the particular requirements of the customer. We offer affordable and transparent prices without sacrificing the quality of our services.</p>
//           </>
//         )}
//       </div>

//     </div>
//   );
// };

// export default ServicePage;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { IoCall, IoLocationOutline } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import { MdOutlineStar } from "react-icons/md";
// import { FaThumbsUp } from "react-icons/fa";
// import axios from "axios";
// import AdvertisementBanner from "../components/services/AdvertisementBanner";
// import { ServiceFilters } from "../components/services/ServiceFilters";
// import { ContactForm } from "../components/services/ContactForms";

// interface Technician {
//   _id: string;
//   username: string;
//   profileImage?: string;
//   phoneNumber: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   service?: string;
//   description?: string;
// }

// interface Rating {
//   rating: number;
// }

// interface TechnicianProfile {
//   technician: Technician;
//   ratings?: Rating;
// }

// const ServicePage: React.FC = () => {
//   const location = useLocation();
//   const { categoryId } = useParams<{ categoryId: string }>();
//   const navigate = useNavigate();
//   const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!categoryId) {
//       setError("No category ID provided");
//       return;
//     }

//     const fetchTechnicians = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/techDetails/getAllTechniciansByCateId/${categoryId}`
//         );
//         const data = response.data?.result || [];
//         setTechnicians(Array.isArray(data) ? data : []);
//       } catch (err: any) {
//         console.error("API Error:", err);
//         setError("Failed to fetch technicians");
//       }
//     };

//     fetchTechnicians();
//   }, [categoryId]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       <AdvertisementBanner />
//       <h2 className="text-xl font-semibold my-4">Technicians</h2>
//       <ServiceFilters />

//       <div className="flex flex-col md:flex-row p-2 gap-3">
//         <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
//           {error ? (
//             <div className="text-red-500 text-center">{error}</div>
//           ) : technicians.length > 0 ? (
//             technicians.map((profile) => (
//               <div
//                 key={profile.technician._id}
//                 className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => navigate(`/technicianById/${profile.technician._id}`)}
//               >
//                 <img
//                   src={profile.technician.profileImage }
//                   alt={profile.technician.username}
//                   className="w-36 h-36 object-cover rounded-2xl"
//                 />

//                 <div className="flex-1 space-y-2.5">
//                   <h2 className="text-lg font-semibold">{profile.technician.username}</h2>

//                   <div className="flex gap-3 items-center">
//                     <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
//                       {profile.ratings?.rating ?? 4}
//                       <MdOutlineStar size={20} className="ms-1" color="#ffc71b" />
//                     </div>
//                     {profile.ratings?.rating && (
//                       <span className="text-gray-600 text-sm">{profile.ratings.rating} Ratings</span>
//                     )}
//                   </div>

//                   {profile.technician?.service && (
//                     <div className="flex flex-wrap gap-2">
//                       <div className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm">
//                         {profile.technician.service}
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center">
//                     <IoLocationOutline size={20} color="red" />
//                     <span className="text-sm ms-1">
//                       {profile.technician.areaName}, {profile.technician.city}, {profile.technician.state},{" "}
//                       {profile.technician.pincode}
//                     </span>
//                   </div>

//                   {profile.technician?.description && (
//                     <div className="flex items-center">
//                       <FaThumbsUp size={22} color="#00B800" />
//                       <span className="text-sm font-extralight ms-2">{profile.technician.description}</span>
//                     </div>
//                   )}

//                   <div className="flex gap-3">
//                     <button className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
//                       <IoCall size={20} className="me-2" />
//                       <span className="text-sm">{profile.technician.phoneNumber}</span>
//                     </button>
//                     <button className="flex items-center bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500">
//                       <LuMessageSquareText size={20} className="me-2" />
//                       <span className="text-sm">Message</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 text-center">No technicians found.</div>
//           )}
//         </div>
//         <ContactForm />
//       </div>
//     </div>
//   );
// };

// export default ServicePage;
