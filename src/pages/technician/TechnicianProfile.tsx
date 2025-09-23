import React, { useState, useEffect } from "react";
import { MdOutlineStar } from "react-icons/md";
import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import {
  technicianGetProfile,
  updateTechnicianControl,
  getAllPincodes,
} from "../../api/apiMethods";
import { Link } from "react-router-dom";
import { ChevronRight, Pencil } from "lucide-react";
import { FaThumbsUp, FaUser, FaTimes } from "react-icons/fa";
import { Rating } from "../ProfilePage";

// Define interfaces for type safety
interface Profile {
  username: string;
  category: string;
  categoryName: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  profileImage: string;
  phoneNumber: string;
  rating: Rating[];
}

interface ApiResponse {
  result?: {
    username?: string;
    category?: string;
    categoryName?: string;
    buildingName?: string;
    areaName?: string;
    subArea?: string;
    city?: string;
    state?: string;
    pincode?: string;
    description?: string;
    profileImage?: string;
    phoneNumber?: string;
    ratings: Rating[];
  };
}

const TechnicianProfile: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    username: "",
    category: "",
    categoryName: "",
    buildingName: "",
    areaName: "",
    subAreaName: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    profileImage: "",
    phoneNumber: "",
    rating: [],
  });
  const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pincodeData, setPincodeData] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const id = localStorage.getItem("userId");
        if (id) {
          const data: ApiResponse = await technicianGetProfile(id);
          if (data?.result) {
            setProfile({
              username: data.result.username || "",
              category: data.result.category || "",
              categoryName: data.result.categoryName || "",
              buildingName: data.result.buildingName || "",
              areaName: data.result.areaName || "",
              subAreaName: data.result.subAreaName || "",
              city: data.result.city || "",
              state: data.result.state || "",
              pincode: data.result.pincode || "",
              description: data.result.description || "",
              profileImage: data.result.profileImage,
              phoneNumber: data.result.phoneNumber || "",
              rating: data.result.ratings || null,
            });
          }
        }
      } catch (err: unknown) {
        setError("Failed to load profile. Please try again.");
        console.error("Failed to fetch technician profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (editModalOpen) {
      setSelectedPincode(editProfile.pincode);
    }
  }, [editModalOpen, editProfile.pincode]);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
        setEditProfile((prev) => ({
          ...prev,
          city: found.city || "",
          state: found.state || "",
          areaName: "",
          subAreaName: "",
        }));
        setSubAreaOptions([]);
      } else {
        setAreaOptions([]);
        setSubAreaOptions([]);
      }
    } else {
      setAreaOptions([]);
      setSubAreaOptions([]);
    }
  }, [selectedPincode, pincodeData]);

  useEffect(() => {
    if (editProfile.areaName) {
      const selectedArea = areaOptions.find(
        (a) => a.name === editProfile.areaName
      );
      if (selectedArea && selectedArea.subAreas) {
        setSubAreaOptions(selectedArea.subAreas);
        setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
      } else {
        setSubAreaOptions([]);
        setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
      }
    } else {
      setSubAreaOptions([]);
      setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [editProfile.areaName, areaOptions]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "pincode") {
      setSelectedPincode(value);
      const found = pincodeData.find((p) => p.code === value);
      if (found) {
        setEditProfile((prev) => ({
          ...prev,
          pincode: value,
          city: found.city || "",
          state: found.state || "",
          areaName: "",
          subAreaName: "",
        }));
        setAreaOptions(found.areas || []);
        setSubAreaOptions([]);
      }
    } else if (name === "areaName") {
      const selectedArea = areaOptions.find((a) => a.name === value);
      setSubAreaOptions(selectedArea?.subAreas || []);
      setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      const id = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("technicianId", id || "");
      formData.append("username", editProfile.username);
      formData.append("category", editProfile.category);
      formData.append("buildingName", editProfile.buildingName);
      formData.append("areaName", editProfile.areaName);
      formData.append("subAreaName", editProfile.subAreaName);
      formData.append("city", editProfile.city);
      formData.append("state", editProfile.state);
      formData.append("pincode", editProfile.pincode);
      formData.append("description", editProfile.description);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }
      await updateTechnicianControl(formData);
      setProfile({ ...editProfile, profileImage: editProfile.profileImage });
      setEditModalOpen(false);
      setImageFile(null);
    } catch (err: unknown) {
      setError("Failed to save profile. Please try again.");
      console.error("Failed to update profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const location = [
    profile.buildingName,
    profile.subAreaName,
    profile.areaName,
    profile.city,
    profile.state,
    profile.pincode,
  ]
    .filter(Boolean)
    .join(", ")
    .replace(/(, )+/g, ", ")
    .replace(/^, |, $/g, "");

  return (
    <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            My Profile
          </h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Link
              to="/technician/dashboard"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-600">My Profile</span>
          </div>
          <button
            className="flex absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={() => {
              setEditProfile(profile);
              setEditModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-5 me-2" />
            Edit Profile
          </button>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
            <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
              <img
                src={profile.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
                alt={profile.username}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">
                {profile.username}
              </h2>

              <div className="flex flex-wrap items-center gap-4 my-3">
                <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
                  {profile && profile.rating ? (profile.rating.length) : '4'}
                  <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
                </div>
                <div className="text-gray-600 text-sm font-light">
                  {profile.rating && profile.rating.length > 0
                    ? (
                        profile.rating.reduce((sum, r) => sum + r.rating, 0) /
                        profile.rating.length
                      ).toFixed(1)
                    : "4"}
                </div>
              </div>
              {profile.categoryName && (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
                    {profile.categoryName}
                  </span>
                </div>
              )}

              <div className="flex my-3 items-center">
                <IoLocationOutline size={27} color="red" />
                <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                  {location}
                </span>
              </div>
              {profile.description && (
                <div className="flex items-center">
                  <FaThumbsUp size={22} color="#00B800" className="flex" />
                  <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                    {profile.description} Years in Services
                  </span>
                </div>
              )}

              <div className="flex gap-4 mt-4 flex-wrap">
                <div className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
                  <IoCall size={22} className="me-2" />
                  <span>{profile.phoneNumber}</span>
                </div>
                <div className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
                  <LuMessageSquareText size={18} className="mr-2" />
                  Message
                </div>
                <div className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
                  <IoShareSocial size={18} className="mr-2" />
                  Share
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
            <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide">
              <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
                <div className="bg-white rounded-2xl p-8">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                    onClick={() => setEditModalOpen(false)}
                  >
                    <FaTimes />
                  </button>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
                      Edit Profile
                    </h2>
                  </div>
                  <form className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="text-red-500 text-sm font-medium">
                            {error}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Profile Image */}
                    <div className="flex flex-col items-center space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Image
                      </label>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {editProfile.profileImage ? (
                              <img
                                src={editProfile.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <FaUser className="text-gray-400 text-2xl" />
                            )}
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
                      />
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={editProfile.username}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editProfile.phoneNumber}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={editProfile.category}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-500"
                          placeholder="Enter service category"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years in Service
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={editProfile.description}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Enter years in service"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          House/Building Name
                        </label>
                        <input
                          type="text"
                          name="buildingName"
                          value={editProfile.buildingName}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Enter house or building name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <select
                          name="pincode"
                          value={editProfile.pincode}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value="">Select Pincode</option>
                          {pincodeData
                            .sort((a, b) => Number(a.code) - Number(b.code))
                            .map((p) => (
                              <option key={p._id} value={p.code}>
                                {p.code}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area Name
                        </label>
                        <select
                          name="areaName"
                          value={editProfile.areaName}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value="">Select Area</option>
                          {areaOptions.map((a: any) => (
                            <option key={a._id} value={a.name}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sub Area
                        </label>
                        <select
                          name="subArea"
                          value={editProfile.subAreaArea}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value="">Select Sub Area</option>
                          {subAreaOptions
                            .sort((a, b) =>
                              a.name
                                .toLowerCase()
                                .localeCompare(b.name.toLowerCase())
                            )
                            .map((a) => (
                              <option key={a._id} value={a.name}>
                                {a.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editProfile.city}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={editProfile.state}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {isLoading ? "Saving..." : "Update Profile"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditModalOpen(false)}
                        className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <FaTimes className="text-sm" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianProfile;
// import React, { useState, useEffect } from 'react';
// import { MdOutlineStar } from 'react-icons/md';
// import { IoCall, IoLocationOutline, IoShareSocial } from 'react-icons/io5';
// import { LuMessageSquareText } from 'react-icons/lu';
// import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods';
// import { Link } from 'react-router-dom';
// import { ChevronRight, Pencil } from 'lucide-react';
// import { FaThumbsUp } from 'react-icons/fa';

// // Define interfaces for type safety
// interface Profile {
//   name: string;
//   service: string;
//   location: string;
//   years: string;
//   image: string;
//   phone: string;
//   description: string;
// }

// interface ApiResponse {
//   result?: {
//     username?: string;
//     category?: string;
//     buildingName?: string;
//     areaName?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     ProfilePhone?: string;
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     name: '',
//     service: '',
//     location: '',
//     years: '',
//     image: '',
//     phone: '',
//     description: ''
//   });
//   const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem('userId');
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               name: data.result.username || '',
//               service: data.result.service || '',
//               location: ` ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`
//                 .replace(/(, )+/g, ', ')
//                 .replace(/^, |, $/g, ''),
//               years: data.result.description || '',
//               image: data.result.profileImage ,
//               phone: data.result.phoneNumber || '',
//               description: data.result.description || '',
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError('Failed to load profile. Please try again.');
//         console.error('Failed to fetch technician profile:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         if (ev.target?.result) {
//           setEditProfile((prev) => ({ ...prev, image: ev.target.result as string }));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const id = localStorage.getItem('userId');
//       const formData = new FormData();
//       formData.append('username', editProfile.name);
//       formData.append('technicianId', id || '');
//       formData.append('description', editProfile.years);
//       if (editProfile.image && typeof editProfile.image !== 'string') {
//         formData.append('profileImage', editProfile.image);
//       }
//       await updateTechnicianControl(formData);
//       setProfile(editProfile);
//       setEditModalOpen(false);
//     } catch (err: unknown) {
//       setError('Failed to save profile. Please try again.');
//       console.error('Failed to update profile:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">My Profile</h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link to="/technician/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
//             <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
//             <span className="text-gray-600">My Profile</span>
//           </div>
//           <button
//             className="flex absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
//             onClick={() => {
//               setEditProfile(profile);
//               setEditModalOpen(true);
//             }}
//           >
//             <Pencil className='w-4 h-5 me-2'/>
//             Edit Profile
//           </button>
//         </div>

//         {/* Main Content */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center">{error}</div>
//         ) : (
//           <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
//                 <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//                   <img
//                     src={profile.image}
//                     alt={profile.name}
//                     className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="text-xl font-semibold truncate">{profile.name}</h2>

//                   <div className="flex flex-wrap items-center gap-4 my-3">
//                     <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
//                       4.8
//                       <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//                     </div>
//                     <div className="text-gray-600 text-sm font-light">84 Ratings</div>
//                   </div>
//                   {profile.service && (
//                     <div className="flex flex-wrap gap-2">
//                       <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
//                         {profile.service}
//                       </span>
//                     </div>
//                   )}

//                   <div className="flex my-3 items-center">
//                     <IoLocationOutline size={27} color="red" />
//                     <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                       {profile.location}

//                     </span>
//                   </div>
//                   {profile?.description && (
//                     <div className="flex items-center">
//                       <FaThumbsUp size={22} color="#00B800" className='flex' />
//                       <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                         {" "}
//                         {profile?.description} Years in Services
//                       </span>
//                     </div>
//                   )}

//                   <div className="flex gap-4 mt-4 flex-wrap">
//                     <div className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
//                       <IoCall size={22} className="me-2" />
//                       <span> {profile?.phone}</span>
//                     </div>
//                     <div className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//                       <LuMessageSquareText size={18} className="mr-2" />
//                       Message
//                     </div>
//                     <div className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//                       <IoShareSocial size={18} className="mr-2" />
//                       Share
//                     </div>
//                   </div>
//                 </div>
//               </div>
//         )}

//         {/* Edit Modal */}
//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
//             <div className="bg-white rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh] shadow-xl">
//               <button
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
//                 onClick={() => setEditModalOpen(false)}
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
//               <div className="space-y-5">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">Profile Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="block w-full mt-1 text-sm border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   />
//                   {editProfile.image && (
//                     <img
//                       src={editProfile.image}
//                       alt="Preview"
//                       className="w-20 h-20 rounded-full object-cover mt-3 border border-gray-200"
//                     />
//                   )}
//                 </div>
//                 <InputField
//                   label="Name"
//                   name="name"
//                   value={editProfile.name}
//                   onChange={handleEditChange}
//                 />
//                 <InputField
//                   label="Service"
//                   name="service"
//                   value={editProfile.service}
//                   onChange={handleEditChange}
//                 />
//                 <InputField
//                   label="Location"
//                   name="location"
//                   value={editProfile.location}
//                   onChange={handleEditChange}
//                 />
//                 <InputField
//                   label="Years in Service"
//                   name="years"
//                   value={editProfile.years}
//                   onChange={handleEditChange}
//                 />
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
//                     onClick={handleSave}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Saving...' : 'Save'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Reusable InputField Component
// interface InputFieldProps {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange }) => (
//   <div>
//     <label className="text-sm font-medium text-gray-700">{label}</label>
//     <input
//       name={name}
//       type="text"
//       value={value}
//       onChange={onChange}
//       className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//     />
//   </div>
// );

// export default TechnicianProfile;

{
  /* <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
      <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
        <img
          src={technician.profileImage}
          alt={technician.username}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold truncate">{technician.username}</h2>

        <div className="flex flex-wrap items-center gap-4 my-3">
          <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
            4.8
            <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
          </div>
          <div className="text-gray-600 text-sm font-light">84 Ratings</div>
        </div>
        {technician.service && (
          <div className="flex flex-wrap gap-2">
            <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
              {technician.service}
            </span>
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
                  </div> */
}

//     <div className="flex my-3 items-center">
//       <IoLocationOutline size={27} color="red" />
//       <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//         {" "}
//         {technician.buildingName}, {technician.areaName}, {technician.city}, {technician.state}
//       </span>
//     </div>
//     {technician?.description && (
//       <div className="flex items-center">
//         <FaThumbsUp size={22} color="#00B800" className='flex' />
//         <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//           {" "}
//           {technician?.description}
//           {/* Years in Services */}
//         </span>
//       </div>
//     )}

//     <div className="flex gap-4 mt-4 flex-wrap">
//       <div className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
//         <IoCall size={22} className="me-2" />
//         <span> {technician?.phoneNumber}</span>
//       </div>
//       <div className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//         <LuMessageSquareText size={18} className="mr-2" />
//         Message
//       </div>
//       <div className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//         <IoShareSocial size={18} className="mr-2" />
//         Share
//       </div>
//     </div>
//   </div>
// </div> */}

// import React, { useState, useEffect } from 'react';
// import { MdOutlineStar } from 'react-icons/md';
// import { IoCall, IoShareSocial } from 'react-icons/io5';
// import { LuMessageSquareText } from 'react-icons/lu';
// import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';

// const TechnicianProfile = () => {
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [profile, setProfile] = useState({
//     name: '',
//     service: '',
//     location: '',
//     years: '',
//     image: '',
//     phone: '',
//   });
//   const [editProfile, setEditProfile] = useState({ ...profile });

//   useEffect(() => {
//     const id = localStorage.getItem('userId');
//     if (id) {
//       technicianGetProfile(id)
//         .then((data: any) => {
//           if (data?.result) {
//             setProfile({
//               name: data.result.username || '',
//               service: data.result.category || '',
//               location: `${data.result.buildingName || ''}, ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
//               years: data.result.description || '',
//               image: data.result.profileImage || '',
//               phone: data.result.ProfilePhone || '',
//             });
//           }
//         })
//         .catch((err: any) => console.error('Failed to fetch technician profile:', err));
//     }
//   }, []);

//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         setEditProfile((prev) => ({ ...prev, image: ev.target?.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     const id = localStorage.getItem('userId');
//     const formData = new FormData();
//     formData.append('username', editProfile.name);
//     formData.append('technicianId', id || '');
//     formData.append('description', editProfile.years);
//     if (editProfile.image && typeof editProfile.image !== 'string') {
//       formData.append('profileImage', editProfile.image);
//     }
//     await updateTechnicianControl(formData);
//     setProfile(editProfile);
//     setEditModalOpen(false);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Profile Image */}
//         <div className="flex justify-center md:justify-start md:w-1/3">
//           <img
//             src={profile.image}
//             alt="Profile"
//             className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//           />
//         </div>

//         {/* Profile Content */}
//         <div className="flex-1 relative">
//           <h1 className="text-xl md:text-2xl font-bold mb-2">My Profile</h1>
//           <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
//             <Link to="/technician/dashboard" className="hover:underline">Dashboard</Link>
//             <ChevronRight className="w-4 h-4 mx-2" />
//             <span>My Profile</span>
//           </div>

//           <button
//             className="absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
//             onClick={() => {
//               setEditProfile(profile);
//               setEditModalOpen(true);
//             }}
//           >
//             Edit
//           </button>

//           <h2 className="text-lg md:text-xl font-semibold mb-1 break-words">{profile.name}</h2>

//           <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3 flex-wrap">
//             <div className="flex items-center border border-amber-500 px-2 py-1 rounded text-black font-semibold">
//               4.8 <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//             </div>
//             <span className="text-gray-500">84 Ratings</span>
//           </div>

//           <div className="bg-fuchsia-100 px-3 py-1 rounded-xl text-black text-sm inline-block mb-3">
//             {profile.location}
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <div className="flex items-center bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm">
//               <IoCall size={20} className="mr-2" /> {profile.phone}
//             </div>
//             <div className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
//               <LuMessageSquareText size={18} className="mr-2" /> Message
//             </div>
//             <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
//               <IoShareSocial size={18} className="mr-2" /> Share
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
//               onClick={() => setEditModalOpen(false)}
//             >
//               &times;
//             </button>
//             <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium">Profile Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="block w-full mt-1 text-sm border px-2 py-1 rounded"
//                 />
//                 {editProfile.image && (
//                   <img
//                     src={editProfile.image}
//                     alt="Preview"
//                     className="w-20 h-20 rounded-full object-cover mt-2 border"
//                   />
//                 )}
//               </div>
//               <InputField label="Name" name="name" value={editProfile.name} onChange={handleEditChange} />
//               <InputField label="Service" name="service" value={editProfile.service} onChange={handleEditChange} />
//               <InputField label="Location" name="location" value={editProfile.location} onChange={handleEditChange} />
//               <InputField label="Years in Service" name="years" value={editProfile.years} onChange={handleEditChange} />

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//                   onClick={() => setEditModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Reusable InputField Component
// const InputField = ({
//   label,
//   name,
//   value,
//   onChange,
// }: {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <input
//       name={name}
//       type="text"
//       value={value}
//       onChange={onChange}
//       className="block w-full mt-1 border px-2 py-1 rounded text-sm"
//     />
//   </div>
// );

// export default TechnicianProfile;

// import React, { useState, useEffect } from 'react';
// import { MdOutlineStar } from 'react-icons/md';
// import { IoCall, IoShareSocial } from 'react-icons/io5';
// import { LuMessageSquareText } from 'react-icons/lu';
// import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods';
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';

// const TechnicianProfile = () => {
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [profile, setProfile] = useState({
//     name: '',
//     service: '',
//     location: '',
//     years: '',
//     image: '',
//     phone: '',
//   });
//   const [editProfile, setEditProfile] = useState({ ...profile });

//   useEffect(() => {
//     const id = localStorage.getItem('userId');
//     if (id) {
//       technicianGetProfile(id)
//         .then((data: any) => {
//           if (data?.result) {
//             setProfile({
//               name: data.result.username || '',
//               service: data.result.category || '',
//               location: `${data.result.buildingName || ''}, ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
//               years: data.result.description || '',
//               image: data.result.profileImage || '',
//               phone: data.result.ProfilePhone || '',
//             });
//           }
//         })
//         .catch((err: any) => console.error('Failed to fetch technician profile:', err));
//     }
//   }, []);

//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         setEditProfile((prev) => ({ ...prev, image: ev.target?.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     const id = localStorage.getItem('userId');
//     const formData = new FormData();
//     formData.append('username', editProfile.name);
//     formData.append('technicianId', id || '');
//     formData.append('description', editProfile.years);
//     if (editProfile.image && typeof editProfile.image !== 'string') {
//       formData.append('profileImage', editProfile.image);
//     }
//     await updateTechnicianControl(formData);
//     setProfile(editProfile);
//     setEditModalOpen(false);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex flex-col sm:flex-row gap-6">
//         <div className="flex flex-col items-center sm:items-start w-full sm:w-1/3">
//           <img
//             src={profile.image}
//             alt="Profile"
//             className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
//           />
//         </div>

//         <div className="flex-1 relative">
//           <h1 className="text-2xl font-bold mb-2">My Profile</h1>
//           <div className="flex items-center text-sm text-gray-500 mb-4">
//             <Link to="/technician/dashboard" className="hover:underline">Dashboard</Link>
//             <ChevronRight className="w-4 h-4 mx-2" />
//             <span>My Profile</span>
//           </div>

//           <button
//             className="absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
//             onClick={() => {
//               setEditProfile(profile);
//               setEditModalOpen(true);
//             }}
//           >
//             Edit Profile
//           </button>

//           <h2 className="text-xl font-semibold mb-1 truncate">{profile.name}</h2>

//           <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
//             <div className="flex items-center border border-amber-500 px-2 py-1 rounded text-black font-semibold">
//               4.8 <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//             </div>
//             <span className="text-gray-500">84 Ratings</span>
//           </div>

//           <div className="bg-fuchsia-100 px-3 py-1 rounded-xl text-black text-sm inline-block mb-3">
//             {profile.location}
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <div className="flex items-center bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm">
//               <IoCall size={20} className="mr-2" /> {profile.phone}
//             </div>
//             <div className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
//               <LuMessageSquareText size={18} className="mr-2" /> Message
//             </div>
//             <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
//               <IoShareSocial size={18} className="mr-2" /> Share
//             </div>
//           </div>
//         </div>
//       </div>

//       {editModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//               onClick={() => setEditModalOpen(false)}
//             >
//               &times;
//             </button>
//             <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium">Profile Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="block w-full mt-1 text-sm border px-2 py-1 rounded"
//                 />
//                 {editProfile.image && (
//                   <img
//                     src={editProfile.image}
//                     alt="Preview"
//                     className="w-20 h-20 rounded-full object-cover mt-2 border"
//                   />
//                 )}
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Name</label>
//                 <input
//                   name="name"
//                   type="text"
//                   value={editProfile.name}
//                   onChange={handleEditChange}
//                   className="block w-full mt-1 border px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Service</label>
//                 <input
//                   name="service"
//                   type="text"
//                   value={editProfile.service}
//                   onChange={handleEditChange}
//                   className="block w-full mt-1 border px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Location</label>
//                 <input
//                   name="location"
//                   type="text"
//                   value={editProfile.location}
//                   onChange={handleEditChange}
//                   className="block w-full mt-1 border px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Years in Service</label>
//                 <input
//                   name="years"
//                   type="text"
//                   value={editProfile.years}
//                   onChange={handleEditChange}
//                   className="block w-full mt-1 border px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//                   onClick={() => setEditModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicianProfile;
