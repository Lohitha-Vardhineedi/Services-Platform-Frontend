import React, { useEffect, useState } from "react";
import { MapPin, RefreshCw, Search } from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";
import { getAllCategories, getAllPincodes as fetchPincodes } from "../../api/apiMethods";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchBarSection() {
  const [categories, setCategories] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Fetch pincodes
  const fetchPincodesData = async () => {
    try {
      const response = await fetchPincodes();
      if (Array.isArray(response?.data)) {
        setPincodeData(response.data);
      } else {
        setError("Invalid pincode data format");
      }
    } catch (error) {
      console.log("error in getAllPincodes", error);
      setError("Failed to fetch pincodes");
    }
  };

  // Handle pincode selection
  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setSelectedPincode(pincode);
    const found = pincodeData.find((p) => p.code === pincode);
    if (found && found.areas) {
      setAreaOptions(found.areas);
      setSelectedArea(""); // Reset selected area when pincode changes
    } else {
      setAreaOptions([]);
      setSelectedArea("");
    }
  };

  const handleSearch = (e) => {
    setSelectedCategories(e.target.value);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCategoriesForSearch();
    fetchPincodesData();
  }, []);

  // Update area options when selectedPincode changes
  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
      } else {
        setAreaOptions([]);
      }
    } else {
      setAreaOptions([]);
    }
  }, [selectedPincode, pincodeData]);

  // Handle search navigation with new format
  const handleSearchNavigation = () => {
    if (!selectedCategories || !selectedPincode || !selectedArea) {
      setError("Please select a category, pincode, and area.");
      return;
    }

    // Get city from pincode data
    const selectedPincodeData = pincodeData.find((p) => p.code === selectedPincode);
    const city = selectedPincodeData?.city || "UnknownCity";

    // Replace spaces with hyphens and construct the new path
    const formattedCategory = selectedCategories.replace(/\s+/g, "-");
    const formattedPincodeCity = `${selectedPincode}-${city.replace(/\s+/g, "-")}`;
    const formattedArea = selectedArea.replace(/\s+/g, "-");

    // Navigate with the new format
    navigate(`/${formattedCategory}/${formattedPincodeCity}/${formattedArea}`);
  };

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Hyderabad's Largest Marketplace !!
      </h1>
      <div className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
        Search From Awesome Verified Professionals
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Category Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              value={selectedCategories}
              onChange={handleSearch}
            >
              <option value="" disabled>Select Category</option>
              {categories
                .filter((category) => category?.status === 1)
                .map((item, index) => (
                  <option key={index} value={item?.category_name}>
                    {item?.category_name}
                  </option>
                ))}
            </select>
            <BiSolidCategory
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
            />
          </div>
          {/* Pincode Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              value={selectedPincode}
              onChange={handlePincodeChange}
            >
              <option value="" disabled>Select Pincode</option>
              {pincodeData.map((p) => (
                <option key={p._id} value={p.code}>
                  {p.code}
                </option>
              ))}
            </select>
            <MapPin
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
            />
          </div>
          {/* Area Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="" disabled>Select Area</option>
              {areaOptions.map((area) => (
                <option key={area._id} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
            <MapPin
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
            />
          </div>
          {/* Search and Reset Buttons */}
          <div className="flex flex-row gap-2 mt-4 md:mt-0">
            <button
              className="flex gap-2 justify-center items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition-colors"
              onClick={handleSearchNavigation}
            >
              <Search size={20} />
              Search
            </button>
            <button
              className="flex gap-2 justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={() => {
                setSelectedPincode("");
                setSelectedArea("");
                setSelectedCategories("");
                setAreaOptions([]);
              }}
            >
              <RefreshCw size={20} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBarSection;
// import React, { useEffect, useState } from 'react';
// import { MapPin, RefreshCw, Search } from 'lucide-react';
// import { BiSolidCategory } from 'react-icons/bi';
// import { getAllCategories, getAllPincodes as fetchPincodes } from '../../api/apiMethods';
// import { FaSearch } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// function SearchBarSection() {
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState('')
//   const [error, setError] = useState(null);
//   const navigate = useNavigate()

//   // Fetch categories
//   const fetchCategoriesForSearch = async () => {
//     try {
//       const response = await getAllCategories();
//       if (response.success === true && Array.isArray(response.data)) {
//         setCategories(response.data);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err) {
//       setError(err?.message || 'Failed to fetch categories');
//     }
//   };

//   // Fetch pincodes
//   const fetchPincodesData = async () => {
//     try {
//       const response = await fetchPincodes();
//       if (Array.isArray(response?.data)) {
//         setPincodeData(response.data);
//       } else {
//         setError('Invalid pincode data format');
//       }
//     } catch (error) {
//       console.log('error in getAllPincodes', error);
//       setError('Failed to fetch pincodes');
//     }
//   };

//   // Handle pincode selection
//   const handlePincodeChange = (e) => {
//     const pincode = e.target.value;
//     setSelectedPincode(pincode);
//     const found = pincodeData.find((p) => p.code === pincode);
//     if (found && found.areas) {
//       setAreaOptions(found.areas);
//       setSelectedArea(""); // Reset selected area when pincode changes
//     } else {
//       setAreaOptions([]);
//       setSelectedArea("");
//     }
//   };

//   const handleSearch = (e) =>{
//     setSelectedCategories(e.target.value)
//   }

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchCategoriesForSearch();
//     fetchPincodesData();
//   }, []);

//   // Update area options when selectedPincode changes
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   return (
//     <div className="text-center mb-8">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//         Hyderabad's Largest Marketplace !!
//       </h1>
//       <div className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
//         Search From Awesome Verified Professionals
//       </div>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           {/* Category Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               defaultValue=""
//               value={selectedCategories}
//               onChange={handleSearch}
//             >
//               <option value="" disabled>Select Category</option>
//               {categories
//                 .filter((category) => category?.status === 1)
//                 .map((item, index) => (
//                   <option key={index} value={item?.category_name}>
//                     {item?.category_name}
//                   </option>
//                 ))}
//             </select>
//             <BiSolidCategory
//               size={20}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
//             />
//           </div>
//           {/* Pincode Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               value={selectedPincode}
//               onChange={handlePincodeChange}
//             >
//               <option value="" disabled>Select Pincode</option>
//               {pincodeData.map((p) => (
//                 <option key={p._id} value={p.code}>
//                   {p.code}
//                 </option>
//               ))}
//             </select>
//             <MapPin
//               size={20}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
//             />
//           </div>
//           {/* Area Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               value={selectedArea}
//               onChange={(e) => setSelectedArea(e.target.value)}
//               // disabled={!areaOptions.length}
//             >
//               <option value="" disabled>Select Area</option>
//               {areaOptions.map((area) => (
//                 <option key={area._id} value={area.name}>
//                   {area.name}
//                 </option>
//               ))}
//             </select>
//             <MapPin
//               size={20}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none"
//             />
//           </div>
//           {/* Search and Reset Buttons */}
//           <div className="flex flex-row gap-2 mt-4 md:mt-0">
//             <button className="flex gap-2  justify-center items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition-colors"
//             onClick={()=>navigate(`/${selectedCategories}/${selectedPincode}/${selectedArea}`)}
//             >
//               <Search size={20}/>
//               Search
//             </button>
//             <button
//               className="flex gap-2 justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
//               onClick={() => {
//                 setSelectedPincode("");
//                 setSelectedArea("");
//                 setSelectedCategories('');
//                 setAreaOptions([]);
//               }}
//             >
//               <RefreshCw size={20} />
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SearchBarSection;
// import React, { useEffect, useState } from 'react';
// import { MapPin } from 'lucide-react';
// import { BiSolidCategory } from 'react-icons/bi';
// import { getAllCategories } from '../../api/apiMethods';
// import { getAllPincodes } from '../../api/apiMethods';

// function SearchBarSection() {
//   const [categories, setCategories] = useState([])
//   const [pincodeData, setPincodeData] = useState([])
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [selectedArea, setSelectedArea] = useState<string>("");

//   const fetchCategoriesForSearch = async () => {
//     try {
//       const response = await getAllCategories();
//       if (response.success === true && Array.isArray(response.data)) {
//         setCategories(response.data);

//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//     }
//   };

//   const getAllPincodes = async (res: any) => {
//     try {
//       if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//           console.log('this picode object',res)
//         }
//     } catch (error) {
//       console.log('error in getall pincodes', error)
//     }
//   }
//   useEffect(() => {
//     fetchCategoriesForSearch();

//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//     }
//   }, []);

//   return (
//     <div className="text-center mb-8">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//         Hyderabad's Largest Marketplace !!
//       </h1>
//       <div className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
//         Search From Awesome Verified Professionals
//       </div>
//       <div className="max-w-4xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           {/* Category Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               defaultValue=""
//             >
//               <option value="" disabled>Select Categorie</option>
//               {categories
//                 .filter(category => category?.status === 1)
//                 .map((item, index) => {
//                   return <option key={index}>{item?.category_name} </option>
//                 })}
//             </select>
//             <BiSolidCategory size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-non' />
//           </div>
//           {/* Pincode Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               defaultValue=""
//             >
//               <option value="" disabled>Select Pincode</option>
//               {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                 <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                   {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                 </option>
//               ) : (
//                 pincodeData.map((p) => (
//                   <option key={p._id} value={p.city}>{p.city}</option>
//                 ))
//               )}
//             </select>
//             <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none" />
//           </div>
//           {/* Area Dropdown */}
//           <div className="relative flex-1">
//             <select
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
//               defaultValue=""
//             >
//               <option value="" disabled>Select Area</option>
//               <option>Banjara Hills</option>
//               <option>Jubilee Hills</option>
//               <option>Gachibowli</option>
//               <option>Kukatpally</option>
//               <option>Secunderabad</option>
//             </select>
//             <MapPin size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none' />
//           </div>
//           {/* Search and Reset Buttons */}
//           <div className="flex flex-row gap-2 mt-4 md:mt-0">
//             <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition-colors">
//               Search
//             </button>
//             <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SearchBarSection; 