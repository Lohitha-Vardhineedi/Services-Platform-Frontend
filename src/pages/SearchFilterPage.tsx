import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoCall, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import { MdOutlineStar } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
import {
  getAllTechByAddress,
  getSearchContentByAddress,
} from "../api/apiMethods";
import AdvertisementBanner from "../components/services/AdvertisementBanner";
import ContactForm from "../components/services/ContactForms";
import { ServiceFilters } from "../components/services/ServiceFilters";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Helmet } from "react-helmet-async";
import { BsWhatsapp } from "react-icons/bs";
import { Rating } from "./ProfilePage";

interface Technician {
  _id: string;
  username: string;
  profileImage?: string;
  categories?: string;
  areaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneNumber?: string;
  description?: string;
}

interface TechnicianProfile {
  technician: Technician;
  ratings?: Rating[];
}
interface SearchContent {
  id: string;
  categoryId: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  meta_title: string;
  meta_description: string;
  seo_content: any;
}

const SearchFilterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [content, setContent] = useState<SearchContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorContent, setErrorContent] = useState<string | null>(null);
  const searchAddress = localStorage.getItem("selectAddress");
  console.log("searchAddress", searchAddress);

  const parsedSearchAddress = searchAddress ? JSON.parse(searchAddress) : null;

  const categoryId = parsedSearchAddress?.category;
  const areaName = parsedSearchAddress?.areaName;
  const subAreaName = parsedSearchAddress?.subAreaName;
  const city = parsedSearchAddress?.city;
  const pincode = parsedSearchAddress?.pincode;
  const state = parsedSearchAddress?.state;

  const formData = { categoryId, areaName, subAreaName, pincode, city, state };
  console.log(formData);

  const fetchTechBySearch = async () => {
    if (!categoryId || !city) {
      setError("Missing required search parameters");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllTechByAddress(formData);
      if (response.success && Array.isArray(response.result)) {
        setTechnicians(response.result);
      } else {
        setTechnicians([]);
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setError("Failed to fetch technicians. Please try again.");
      setTechnicians([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTechBySearch();
  }, [categoryId, areaName, pincode, city, state, subAreaName]);

  const fetchSearchContent = async () => {
    if (!categoryId || !city) {
      // if (!categoryId || !areaName || !subAreaName || !pincode || !city || !state) {
      setErrorContent("Missing required search parameters");
      return;
    }
    setIsDataLoading(true);
    setErrorContent(null);
    try {
      const response = await getSearchContentByAddress(formData);
      console.log(response, "==>lohiresponse");
      if (response?.success === true) {
        setContent(response?.result);
      } else {
        setContent([]);
      }
    } catch (error) {
      setContent([]);
      // setErrorContent(error?.message);
    } finally {
      setIsDataLoading(false);
    }
  };
  console.log("setContent", content);
  useEffect(() => {
    fetchSearchContent();
  }, [categoryId, areaName, pincode, city, state, subAreaName]);

  const handleTechnicianClick = (
    technicianId: string,
    city?: string,
    pincode?: string
  ) => {
    const cityPincode =
      pincode && city ? `${pincode}-${city}` : pincode || city || "";
    navigate(
      `/technicianById/${technicianId}?cityPincode=${encodeURIComponent(
        cityPincode
      )}`
    );
  };

  function openWhatsApp(number: number, message: string) {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // opens in new tab
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Helmet>
        <title>
          {content?.meta_title || "Search for technicians in your area"}
        </title>
        <meta
          name="description"
          content={
            content?.meta_description || "Search for technicians in your area"
          }
        />
      </Helmet>

      <AdvertisementBanner />
      <h2 className="text-xl font-semibold my-4">Technicians</h2>
      <ServiceFilters />

      <div className="flex flex-col md:flex-row p-2 gap-3">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="text-center">Loading technicians...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : technicians.length > 0 ? (
            technicians.map((profile, index) => (
              <div
                key={profile.technician._id || index}
                className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                onClick={() =>
                  handleTechnicianClick(
                    profile.technician._id,
                    profile.technician.city,
                    profile.technician.pincode
                  )
                }
              >
                <img
                  src={
                    profile.technician.profileImage ||
                    "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"
                  }
                  alt={profile.technician.username || "Technician"}
                  className="w-36 h-36 object-cover rounded-2xl"
                />

                <div className="flex-1 space-y-2.5">
                  <h2 className="text-lg font-semibold">
                    {profile.technician.username || "Unknown Technician"}
                  </h2>

                  <div className="flex gap-3 items-center">
                    <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
                      {profile.ratings && profile.ratings.length > 0
                        ? (
                            profile.ratings.reduce(
                              (sum, r) => sum + r.rating,
                              0
                            ) / profile.ratings.length
                          ).toFixed(1)
                        : "4"}
                      <MdOutlineStar
                        size={20}
                        className="ml-1"
                        color="#ffc71b"
                      />
                    </div>
                    {profile.ratings && (
                      <span className="text-gray-600 text-sm">
                        {profile.ratings.length} Ratings
                      </span>
                    )}
                  </div>

                  {profile.technician?.categories && (
                    <div className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm inline-block">
                      {profile.technician.categories}
                    </div>
                  )}

                  <div className="flex items-center">
                    <IoLocationOutline size={20} color="red" />
                    <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                      {[
                        profile.technician.areaName?.toLowerCase(),
                        profile.technician.city,
                        profile.technician.state,
                        profile.technician.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location not available"}
                    </span>
                  </div>

                  {profile.technician?.description && (
                    <div className="flex items-center">
                      <FaThumbsUp size={22} color="#00B800" />
                      <span className="sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                        {profile.technician.description} years in Services
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {/* <button
                      className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <IoCall size={20} className="mr-2" />
                      <span className="text-sm">
                        {profile.technician.phoneNumber || "N/A"}
                      </span>
                    </button> */}
                    <button
                      className="flex items-center bg-green-600 rounded text-white px-2 py-1 hover:bg-green-500 transition-colors duration-200"
                      onClick={() =>
                        openWhatsApp(
                          +919603558369,
                          "Hello, I am interested in your services"
                        )
                      }
                    >
                      <BsWhatsapp size={18} className="mr-2" />
                      <span className="text-sm">WhatsApp</span>
                    </button>
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

      {/* <div className="mt-6 space-y-4">
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
      </div> */}

      <div className="mt-6 space-y-4">
        {isDataLoading ? (
          <div className="text-center">Loading Data...</div>
        ) : errorContent ? (
          <div className="text-red-500 text-center">{errorContent}</div>
        ) : content?.seo_content?.length > 0 ? (
          <div className="ql-container border-black">
            <div
              className="jodit-wysiwyg"
              dangerouslySetInnerHTML={{ __html: content.seo_content }}
            />
          </div>
        ) : (
          <div> No content for this Address</div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterPage;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { IoCall, IoLocationOutline } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import { MdOutlineStar } from "react-icons/md";
// import axios from "axios";
// import AdvertisementBanner from "../components/categoriess/AdvertisementBanner";
// import { categoriesFilters } from "../components/categoriess/categoriesFilters";
// import { ContactForm } from "../components/categoriess/ContactForms";
// import { FaThumbsUp } from "react-icons/fa";
// import SearchInfo from "../components/categoriess/SearchInfo";
// import { getAllTechByAddress } from "../api/apiMethods";

// const SerarchFilterPage: React.FC = () => {
//   const location = useLocation();
//   const { categoryId, areaName, pincode } = useParams<{ categoryId: string; areaName:string ; pincode:string }>();
//   const navigate = useNavigate();
//   const [technicians, setTechnicians] = useState([]);

//   const formData = { categoryId, areaName, pincode }

//   const fetchTechBySearch = async () =>{
//     if (!categoryId && !areaName && !pincode) return;

//     try{

//         const response = await getAllTechByAddress(formData)
//         if (response.success === true && Array.isArray(response.data)) {
//         setTechnicians(Array.isArray(response?.data) ? response?.data : []);
//         console.log(response)
//     }

//     }catch(error){
//         console.log(error.message, 'geting error')
//     }

//   }

//   useEffect(() => {

//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4">
//       <AdvertisementBanner />
//       <h2 className="text-xl font-semibold my-4">Technicians</h2>
//       <categoriesFilters />

//       <div className="flex flex-col md:flex-row p-2 gap-3">
//         <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]">
//           {technicians.length > 0 ? (
//             technicians.map((profile, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 rounded-2xl shadow p-3 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-100 cursor-pointer"
//                 onClick={() =>
//                   navigate(`/technicianById/${profile.technician._id}`)
//                 }
//               >
//                 <img
//                   src={
//                     profile.technician.profileImage
//                   }
//                   alt={profile.technician.username}
//                   className="w-36 h-36 object-cover rounded-2xl"
//                 />

//                 <div className="flex-1 space-y-2.5">
//                   <h2 className="text-lg font-semibold">
//                     {profile.technician.username}
//                   </h2>

//                   <div className="flex gap-3 items-center">
//                     <div className="flex items-center border border-amber-500 rounded-lg px-2 text-black font-bold">
//                       {profile.ratings?.rating ?? "4"}
//                       <MdOutlineStar
//                         size={20}
//                         className="ms-1"
//                         color="#ffc71b"
//                       />
//                     </div>
//                     {profile.ratings?.rating && (
//                       <span className="text-gray-600 text-sm">
//                         {profile.ratings.rating} Ratings
//                       </span>
//                     )}
//                   </div>
//                   {profile.technician?.categories && (
//                     <div className="flex flex-wrap gap-2">
//                       <div className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm">
//                         {profile.technician?.categories}
//                       </div>
//                     </div>
//                   )}
//                   {/* <div className="flex flex-wrap gap-2">
//                     {profile.categoriess?.map((s, i) => (
//                       <div
//                         key={i}
//                         className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm"
//                       >
//                         {s.categoriesName}
//                       </div>
//                     ))}
//                   </div> */}

//                   <div className="flex items-center">
//                     <IoLocationOutline size={20} color="red" />
//                     <span className="text-sm ms-1">
//                       {profile.technician.areaName}, {profile.technician.city},{" "}
//                       {profile.technician.state}, {profile.technician.pincode}
//                     </span>
//                   </div>
//                   {profile.technician?.description && (
//                     <div className="flex items-center">
//                       <FaThumbsUp size={22} color="#00B800" className="flex" />
//                       <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                         {" "}
//                         {profile.technician?.description}
//                         {/* Years in categoriess */}
//                       </span>
//                     </div>
//                   )}

//                   <div className="flex gap-3">
//                     <div className="flex items-center bg-fuchsia-500 rounded text-white px-2 py-1 hover:bg-fuchsia-600">
//                       <IoCall size={20} className="me-2" />
//                       <span className="text-sm">
//                         {profile.technician.phoneNumber}
//                       </span>
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
//             <div className="text-gray-500 text-center">
//               No technicians found.
//             </div>
//           )}
//         </div>
//         <ContactForm />
//       </div>

//       <div className="my-3">
//         <SearchInfo />
//       </div>
//     </div>
//   );
// };

// export default SerarchFilterPage;
