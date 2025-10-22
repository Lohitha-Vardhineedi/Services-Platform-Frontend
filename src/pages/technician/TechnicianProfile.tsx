import React, { useState, useEffect, useMemo, FC } from "react";
import { MdOutlineStar } from "react-icons/md";
import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
import { LuMessageSquareText } from "react-icons/lu";
import {
  technicianGetProfile,
  updateTechnicianControl,
  getAllPincodes,
} from "../../api/apiMethods";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronRight, Pencil } from "lucide-react";
import { FaThumbsUp, FaUser, FaTimes, FaWhatsapp } from "react-icons/fa";
import { Rating } from "../ProfilePage";

interface Profile {
  technicianId: string;
  username: string;
  userId: string;
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
  subscription?: {
    subscriptionId: string;
    subscriptionName: string;
    startDate: string;
    endDate: string | null;
    leads: number;
    ordersCount: number;
  };
}

interface ApiResponse {
  result?: {
    id?: string;
    username?: string;
    category?: string;
    userId?: string;
    categoryName?: string;
    buildingName?: string;
    areaName?: string;
    subAreaName?: string;
    city?: string;
    state?: string;
    pincode?: string;
    description?: string;
    profileImage?: string;
    phoneNumber?: string;
    ratings: Rating[];
    subscription?: Profile["subscription"];
  };
}

const TechnicianProfile: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    technicianId: "",
    username: "",
    userId: "",
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
    subscription: undefined,
  });
  const [editProfile, setEditProfile] = useState<Profile>(profile);
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
              technicianId: id,
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
              profileImage: data.result.profileImage || "",
              userId: data.result.userId || "",
              phoneNumber: data.result.phoneNumber || "",
              rating: data.result.ratings || [],
              subscription: data.result.subscription,
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

  // Initialize edit form when modal opens
  useEffect(() => {
    if (editModalOpen) {
      setEditProfile(profile);
    }
    if (editModalOpen && pincodeData.length > 0) {
      if (profile.pincode) {
        setSelectedPincode(profile.pincode);
        const foundPincode = pincodeData.find(
          (p) => p.code === profile.pincode
        );
        if (foundPincode) {
          setAreaOptions(foundPincode.areas || []);
          const foundArea = foundPincode.areas?.find(
            (a: any) => a.name === profile.areaName
          );
          if (foundArea && foundArea.subAreas) {
            setSubAreaOptions(
              foundArea.subAreas.sort((a: any, b: any) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              )
            );
          } else {
            setSubAreaOptions([]);
          }
          setEditProfile((prev) => ({
            ...prev,
            city: foundPincode.city || "",
            state: foundPincode.state || "",
          }));
        }
      }
    }
  }, [editModalOpen, profile, pincodeData]);

  useEffect(() => {
    if (selectedPincode && !editModalOpen) return; // Skip if not in edit mode, but actually always
    const found = pincodeData.find((p) => p.code === selectedPincode);
    if (found && found.areas) {
      setAreaOptions(found.areas);
      setEditProfile((prev) => ({
        ...prev,
        city: found.city || "",
        state: found.state || "",
      }));
      // Do not clear subAreaOptions here; let areaName effect handle
    } else {
      setAreaOptions([]);
      setSubAreaOptions([]);
    }
  }, [selectedPincode, pincodeData, editModalOpen]);

  useEffect(() => {
    if (editProfile.areaName) {
      const selectedArea = areaOptions.find(
        (a: any) => a.name === editProfile.areaName
      );
      if (selectedArea && selectedArea.subAreas) {
        const newSubAreas = selectedArea.subAreas.sort((a: any, b: any) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setSubAreaOptions(newSubAreas);
        const currentSubAreaName = editProfile.subAreaName;
        const isValidSubArea = newSubAreas.some(
          (sa: any) => sa.name === currentSubAreaName
        );
        if (!currentSubAreaName || !isValidSubArea) {
          setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
        }
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
      const selectedArea = areaOptions.find((a: any) => a.name === value);
      setSubAreaOptions(
        (selectedArea?.subAreas || []).sort((a: any, b: any) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
      );
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
      setProfile({
        ...editProfile,
        technicianId: id || "",
        subscription: profile.subscription,
      });
      setEditModalOpen(false);
      setImageFile(null);
    } catch (err: unknown) {
      setError("Failed to save profile. Please try again.");
      console.error("Failed to update profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const locationStr = [
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

    const shareData = {
      title: "Technician Profile",
      text: `Check out my profile: ${profile.username}, Category: ${profile.categoryName}, Phone: ${profile.phoneNumber}, Location: ${locationStr}`,
      url: `https://prnvservices.com/technicianById/${profile.technicianId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        alert("Profile details copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      alert("Unable to share. Please try copying manually.");
    }
  };

  const getWhatsAppLink = () => {
    const phoneNumber = "+919603558369"; // +91 for India
    const message = 'Hi, I want to connect with the team of PRNV Services.';
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const location = useMemo(() => {
    return [
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
  }, [profile]);

  const averageRating = useMemo(() => {
    if (profile.rating.length === 0) return 0;
    return (
      profile.rating.reduce((sum, r) => sum + (r.rating || 0), 0) /
      profile.rating.length
    );
  }, [profile.rating]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 overflow-auto scrollbar-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            My Profile
          </h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Link
              to="/technician/dashboard"
              className="hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-600">My Profile</span>
          </div>
          <button
            className="flex absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setEditModalOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <>
            {/* Profile Card */}
            <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row relative overflow-hidden shadow-sm bg-white mb-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
                <div className="relative">
                  <img
                    src={
                      profile.profileImage ||
                      "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"
                    }
                    alt={profile.username}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 rounded-full border-2 border-white">
                    <BadgeCheck className="w-6 h-6 text-white"/>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 truncate mb-2">
                  {profile.username}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  ID: {profile.userId}
                </p>

                <div className="flex flex-wrap items-center gap-4 my-4">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    <MdOutlineStar size={16} className="fill-current" />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="text-xs font-normal">
                      ({profile.rating.length})
                    </span>
                  </div>
                  {profile.categoryName && (
                    <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md">
                      {profile.categoryName}
                    </span>
                  )}
                </div>

                {location && (
                  <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-xl">
                    <IoLocationOutline
                      size={24}
                      className="text-red-500 mr-3 flex-shrink-0"
                    />
                    <span className="text-sm md:text-base text-gray-700 font-medium">
                      {location}
                    </span>
                  </div>
                )}

                {profile.description && (
                  <div className="flex items-center mb-6 p-3 bg-emerald-50 rounded-xl">
                    <FaThumbsUp
                      size={20}
                      className="text-emerald-600 mr-3 flex-shrink-0"
                    />
                    <span className="text-sm md:text-base text-gray-700 font-medium">
                      {profile.description} Years of Experience
                    </span>
                  </div>
                )}

                <div className="flex gap-3 mt-6 flex-wrap">
                  <a
                    // href={`tel:${profile.phoneNumber}`}
                    className="flex bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 rounded-xl text-white px-6 py-3 font-bold items-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {/* <IoCall size={20} className="mr-2" /> */}
                    {profile.phoneNumber}
                  </a>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white px-6 py-3 font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaWhatsapp size={22} className="mr-2" />
                    Message
                  </a>
                  <button
                    onClick={handleShare}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white px-6 py-3 font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <IoShareSocial size={18} className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
            <div className="w-full max-w-4xl mx-auto overflow-y-auto max-h-[95vh] scrollbar-hide">
              <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1 animate-in fade-in zoom-in duration-200">
                <div className="bg-white rounded-2xl p-6 md:p-8">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-all duration-200 hover:scale-110"
                    onClick={() => setEditModalOpen(false)}
                  >
                    <FaTimes />
                  </button>
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
                      Edit Your Profile
                    </h2>
                    <p className="text-gray-600">
                      Update your details to get more leads
                    </p>
                  </div>
                  <form className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
                        <div className="text-red-700 text-sm font-medium">
                          {error}
                        </div>
                      </div>
                    )}

                    {/* Profile Image */}
                    <div className="flex flex-col items-center space-y-4 border-b pb-6">
                      <label className="block text-sm font-semibold text-gray-700">
                        Profile Image
                      </label>
                      <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-2 shadow-xl">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {editProfile.profileImage ? (
                              <img
                                src={editProfile.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <FaUser className="text-gray-400 text-3xl md:text-4xl" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={editProfile.username}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editProfile.phoneNumber}
                          readOnly
                          maxLength={10}
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Service Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={editProfile.categoryName}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="description"
                          value={editProfile.description}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="e.g., 5"
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <select
                          name="pincode"
                          value={editProfile.pincode}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          required
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Area *
                        </label>
                        <select
                          name="areaName"
                          value={editProfile.areaName}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          required
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sub Area
                        </label>
                        <select
                          name="subAreaName"
                          value={editProfile.subAreaName}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value="">Select Sub Area</option>
                          {subAreaOptions.map((a) => (
                            <option key={a._id} value={a.name}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editProfile.city}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={editProfile.state}
                          readOnly
                          className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditModalOpen(false)}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
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
// import React, { useState, useEffect, useMemo, FC } from "react";
// import { MdOutlineStar } from "react-icons/md";
// import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import {
//   technicianGetProfile,
//   updateTechnicianControl,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { Link } from "react-router-dom";
// import { ChevronRight, Pencil } from "lucide-react";
// import { FaThumbsUp, FaUser, FaTimes, FaWhatsapp } from "react-icons/fa";
// import { Rating } from "../ProfilePage";

// interface Profile {
//   technicianId: string;
//   username: string;
//   userId: string;
//   category: string;
//   categoryName: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   description: string;
//   profileImage: string;
//   phoneNumber: string;
//   rating: Rating[];
//   subscription?: {
//     subscriptionId: string;
//     subscriptionName: string;
//     startDate: string;
//     endDate: string | null;
//     leads: number;
//     ordersCount: number;
//   };
// }

// interface ApiResponse {
//   result?: {
//     id?: string;
//     username?: string;
//     category?: string;
//     userId?: string;
//     categoryName?: string;
//     buildingName?: string;
//     areaName?: string;
//     subAreaName?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     phoneNumber?: string;
//     ratings: Rating[];
//     subscription?: Profile["subscription"];
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     technicianId: "",
//     username: "",
//     userId: "",
//     category: "",
//     categoryName: "",
//     buildingName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     description: "",
//     profileImage: "",
//     phoneNumber: "",
//     rating: [],
//     subscription: undefined,
//   });
//   const [editProfile, setEditProfile] = useState<Profile>(profile);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem("userId");
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               technicianId: id,
//               username: data.result.username || "",
//               category: data.result.category || "",
//               categoryName: data.result.categoryName || "",
//               buildingName: data.result.buildingName || "",
//               areaName: data.result.areaName || "",
//               subAreaName: data.result.subAreaName || "",
//               city: data.result.city || "",
//               state: data.result.state || "",
//               pincode: data.result.pincode || "",
//               description: data.result.description || "",
//               profileImage: data.result.profileImage || "",
//               userId: data.result.userId || "",
//               phoneNumber: data.result.phoneNumber || "",
//               rating: data.result.ratings || [],
//               subscription: data.result.subscription,
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError("Failed to load profile. Please try again.");
//         console.error("Failed to fetch technician profile:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   // Initialize edit form when modal opens
//   useEffect(() => {
//     if (editModalOpen && pincodeData.length > 0) {
//       setEditProfile(profile);
//       if (profile.pincode) {
//         setSelectedPincode(profile.pincode);
//         const foundPincode = pincodeData.find(
//           (p) => p.code === profile.pincode
//         );
//         if (foundPincode) {
//           setAreaOptions(foundPincode.areas || []);
//           const foundArea = foundPincode.areas?.find(
//             (a: any) => a.name === profile.areaName
//           );
//           if (foundArea && foundArea.subAreas) {
//             setSubAreaOptions(
//               foundArea.subAreas.sort((a: any, b: any) =>
//                 a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//               )
//             );
//           } else {
//             setSubAreaOptions([]);
//           }
//           setEditProfile((prev) => ({
//             ...prev,
//             city: foundPincode.city || "",
//             state: foundPincode.state || "",
//           }));
//         }
//       }
//     }
//   }, [editModalOpen, profile, pincodeData]);

//   useEffect(() => {
//     if (selectedPincode && !editModalOpen) return; // Skip if not in edit mode, but actually always
//     const found = pincodeData.find((p) => p.code === selectedPincode);
//     if (found && found.areas) {
//       setAreaOptions(found.areas);
//       setEditProfile((prev) => ({
//         ...prev,
//         city: found.city || "",
//         state: found.state || "",
//       }));
//       // Do not clear subAreaOptions here; let areaName effect handle
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData, editModalOpen]);

//   useEffect(() => {
//     if (editProfile.areaName) {
//       const selectedArea = areaOptions.find(
//         (a: any) => a.name === editProfile.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         const newSubAreas = selectedArea.subAreas.sort((a: any, b: any) =>
//           a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//         );
//         setSubAreaOptions(newSubAreas);
//         const currentSubAreaName = editProfile.subAreaName;
//         const isValidSubArea = newSubAreas.some(
//           (sa: any) => sa.name === currentSubAreaName
//         );
//         if (!currentSubAreaName || !isValidSubArea) {
//           setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//         }
//       } else {
//         setSubAreaOptions([]);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [editProfile.areaName, areaOptions]);

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//     if (name === "pincode") {
//       setSelectedPincode(value);
//       const found = pincodeData.find((p) => p.code === value);
//       if (found) {
//         setEditProfile((prev) => ({
//           ...prev,
//           pincode: value,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setAreaOptions(found.areas || []);
//         setSubAreaOptions([]);
//       }
//     } else if (name === "areaName") {
//       const selectedArea = areaOptions.find((a: any) => a.name === value);
//       setSubAreaOptions(
//         (selectedArea?.subAreas || []).sort((a: any, b: any) =>
//           a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//         )
//       );
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const id = localStorage.getItem("userId");
//       const formData = new FormData();
//       formData.append("technicianId", id || "");
//       formData.append("username", editProfile.username);
//       formData.append("category", editProfile.category);
//       formData.append("buildingName", editProfile.buildingName);
//       formData.append("areaName", editProfile.areaName);
//       formData.append("subAreaName", editProfile.subAreaName);
//       formData.append("city", editProfile.city);
//       formData.append("state", editProfile.state);
//       formData.append("pincode", editProfile.pincode);
//       formData.append("description", editProfile.description);
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
//       await updateTechnicianControl(formData);
//       setProfile({
//         ...editProfile,
//         technicianId: id || "",
//         subscription: profile.subscription,
//       });
//       setEditModalOpen(false);
//       setImageFile(null);
//     } catch (err: unknown) {
//       setError("Failed to save profile. Please try again.");
//       console.error("Failed to update profile:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const locationStr = [
//       profile.buildingName,
//       profile.subAreaName,
//       profile.areaName,
//       profile.city,
//       profile.state,
//       profile.pincode,
//     ]
//       .filter(Boolean)
//       .join(", ")
//       .replace(/(, )+/g, ", ")
//       .replace(/^, |, $/g, "");

//     const shareData = {
//       title: "Technician Profile",
//       text: `Check out my profile: ${profile.username}, Category: ${profile.categoryName}, Phone: ${profile.phoneNumber}, Location: ${locationStr}`,
//       url: `https://prnvservices.com/technicianById/${profile.technicianId}`,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(
//           `${shareData.text} ${shareData.url}`
//         );
//         alert("Profile details copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Sharing failed:", err);
//       alert("Unable to share. Please try copying manually.");
//     }
//   };

//   const getWhatsAppLink = () => {
//     const phoneNumber = "+919603558369"; // +91 for India
//     const message = 'Hi, I want to connect with the team of PRNV Services.';
//     return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//   };

//   const location = useMemo(() => {
//     return [
//       profile.buildingName,
//       profile.subAreaName,
//       profile.areaName,
//       profile.city,
//       profile.state,
//       profile.pincode,
//     ]
//       .filter(Boolean)
//       .join(", ")
//       .replace(/(, )+/g, ", ")
//       .replace(/^, |, $/g, "");
//   }, [profile]);

//   const averageRating = useMemo(() => {
//     if (profile.rating.length === 0) return 0;
//     return (
//       profile.rating.reduce((sum, r) => sum + (r.rating || 0), 0) /
//       profile.rating.length
//     );
//   }, [profile.rating]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             My Profile
//           </h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link
//               to="/technician/dashboard"
//               className="hover:text-blue-600 transition-colors duration-200 font-medium"
//             >
//               Dashboard
//             </Link>
//             <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
//             <span className="text-gray-600">My Profile</span>
//           </div>
//           <button
//             className="flex absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
//             onClick={() => setEditModalOpen(true)}
//           >
//             <Pencil className="w-4 h-4 mr-2" />
//             Edit Profile
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center py-8">{error}</div>
//         ) : (
//           <>
//             {/* Profile Card */}
//             <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row relative overflow-hidden shadow-sm bg-white mb-6 hover:shadow-md transition-shadow duration-200">
//               <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//                 <div className="relative">
//                   <img
//                     src={
//                       profile.profileImage ||
//                       "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"
//                     }
//                     alt={profile.username}
//                     className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-200"
//                   />
//                   <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 rounded-full border-2 border-white">
//                     <FaThumbsUp className="w-4 h-4 text-white" />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-900 truncate mb-2">
//                   {profile.username}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-4">
//                   ID: {profile.userId}
//                 </p>

//                 <div className="flex flex-wrap items-center gap-4 my-4">
//                   <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
//                     <MdOutlineStar size={16} className="fill-current" />
//                     <span>{averageRating.toFixed(1)}</span>
//                     <span className="text-xs font-normal">
//                       ({profile.rating.length})
//                     </span>
//                   </div>
//                   {profile.categoryName && (
//                     <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md">
//                       {profile.categoryName}
//                     </span>
//                   )}
//                 </div>

//                 {location && (
//                   <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-xl">
//                     <IoLocationOutline
//                       size={24}
//                       className="text-red-500 mr-3 flex-shrink-0"
//                     />
//                     <span className="text-sm md:text-base text-gray-700 font-medium">
//                       {location}
//                     </span>
//                   </div>
//                 )}

//                 {profile.description && (
//                   <div className="flex items-center mb-6 p-3 bg-emerald-50 rounded-xl">
//                     <FaThumbsUp
//                       size={20}
//                       className="text-emerald-600 mr-3 flex-shrink-0"
//                     />
//                     <span className="text-sm md:text-base text-gray-700 font-medium">
//                       {profile.description} Years of Experience
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex gap-3 mt-6 flex-wrap">
//                   <a
//                     // href={`tel:${profile.phoneNumber}`}
//                     className="flex bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 rounded-xl text-white px-6 py-3 font-bold items-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     {/* <IoCall size={20} className="mr-2" /> */}
//                     {profile.phoneNumber}
//                   </a>
//                   <button
//                     onClick={getWhatsAppLink}
//                     className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white px-6 py-3 font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     <FaWhatsapp size={22} className="mr-2" />
//                     Message
//                   </button>
//                   <button
//                     onClick={handleShare}
//                     className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white px-6 py-3 font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     <IoShareSocial size={18} className="mr-2" />
//                     Share
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Edit Modal */}
//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
//             <div className="w-full max-w-4xl mx-auto overflow-y-auto max-h-[95vh] scrollbar-hide">
//               <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1 animate-in fade-in zoom-in duration-200">
//                 <div className="bg-white rounded-2xl p-6 md:p-8">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-all duration-200 hover:scale-110"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                   <div className="text-center mb-6">
//                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
//                       Edit Your Profile
//                     </h2>
//                     <p className="text-gray-600">
//                       Update your details to get more leads
//                     </p>
//                   </div>
//                   <form className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
//                         <div className="text-red-700 text-sm font-medium">
//                           {error}
//                         </div>
//                       </div>
//                     )}

//                     {/* Profile Image */}
//                     <div className="flex flex-col items-center space-y-4 border-b pb-6">
//                       <label className="block text-sm font-semibold text-gray-700">
//                         Profile Image
//                       </label>
//                       <div className="relative">
//                         <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-2 shadow-xl">
//                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                             {editProfile.profileImage ? (
//                               <img
//                                 src={editProfile.profileImage}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover rounded-full"
//                               />
//                             ) : (
//                               <FaUser className="text-gray-400 text-3xl md:text-4xl" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Technician ID
//                         </label>
//                         <input
//                           type="text"
//                           name="technicianId"
//                           value={editProfile.technicianId}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Full Name *
//                         </label>
//                         <input
//                           type="text"
//                           name="username"
//                           value={editProfile.username}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter your full name"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={editProfile.phoneNumber}
//                           readOnly
//                           maxLength={10}
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Service Category
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={editProfile.categoryName}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Years of Experience
//                         </label>
//                         <input
//                           type="number"
//                           name="description"
//                           value={editProfile.description}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="e.g., 5"
//                           min={0}
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           House/Building Name
//                         </label>
//                         <input
//                           type="text"
//                           name="buildingName"
//                           value={editProfile.buildingName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter house or building name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Pincode *
//                         </label>
//                         <select
//                           name="pincode"
//                           value={editProfile.pincode}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           required
//                         >
//                           <option value="">Select Pincode</option>
//                           {pincodeData
//                             .sort((a, b) => Number(a.code) - Number(b.code))
//                             .map((p) => (
//                               <option key={p._id} value={p.code}>
//                                 {p.code}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Area *
//                         </label>
//                         <select
//                           name="areaName"
//                           value={editProfile.areaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           required
//                         >
//                           <option value="">Select Area</option>
//                           {areaOptions.map((a: any) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Sub Area
//                         </label>
//                         <select
//                           name="subAreaName"
//                           value={editProfile.subAreaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Sub Area</option>
//                           {subAreaOptions.map((a) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={editProfile.city}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={editProfile.state}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                       <button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                       >
//                         {isLoading ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                             Saving...
//                           </>
//                         ) : (
//                           "Update Profile"
//                         )}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
//                       >
//                         <FaTimes className="text-sm" />
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianProfile;

// import React, { useState, useEffect } from "react";
// import { MdOutlineStar } from "react-icons/md";
// import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import {
//   technicianGetProfile,
//   updateTechnicianControl,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { Link } from "react-router-dom";
// import { ChevronRight, Pencil } from "lucide-react";
// import { FaThumbsUp, FaUser, FaTimes } from "react-icons/fa";
// import { Rating } from "../ProfilePage";

// interface Profile {
//   technicianId: string;
//   username: string;
//   userId: string;
//   category: string;
//   categoryName: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   description: string;
//   profileImage: string;
//   phoneNumber: string;
//   rating: Rating[];
// }

// interface ApiResponse {
//   result?: {
//     username?: string;
//     category?: string;
//     userId?: string;
//     categoryName?: string;
//     buildingName?: string;
//     areaName?: string;
//     subAreaName?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     phoneNumber?: string;
//     ratings: Rating[];
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     technicianId: "",
//     username: "",
//     userId:"",
//     category: "",
//     categoryName: "",
//     buildingName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     description: "",
//     profileImage: "",
//     phoneNumber: "",
//     rating: [],
//   });
//   const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem("userId");
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               technicianId: id,
//               username: data.result.username || "",
//               category: data.result.category || "",
//               categoryName: data.result.categoryName || "",
//               buildingName: data.result.buildingName || "",
//               areaName: data.result.areaName || "",
//               subAreaName: data.result.subAreaName || "",
//               city: data.result.city || "",
//               state: data.result.state || "",
//               pincode: data.result.pincode || "",
//               description: data.result.description || "",
//               profileImage: data.result.profileImage,
//               userId:data.result.userId,
//               phoneNumber: data.result.phoneNumber || "",
//               rating: data.result.ratings || [],
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError("Failed to load profile. Please try again.");
//         console.error("Failed to fetch technician profile:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (editModalOpen) {
//       setSelectedPincode(editProfile.pincode);
//     }
//   }, [editModalOpen, editProfile.pincode]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setEditProfile((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//         }));
//         setSubAreaOptions([]);
//       } else {
//         setAreaOptions([]);
//         setSubAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (editProfile.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === editProfile.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         const newSubAreas = selectedArea.subAreas;
//         setSubAreaOptions(newSubAreas);
//         const currentSubAreaName = editProfile.subAreaName;
//         const isValidSubArea = newSubAreas.some((sa: any) => sa.name === currentSubAreaName);
//         if (!currentSubAreaName || !isValidSubArea) {
//           setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//         }
//       } else {
//         setSubAreaOptions([]);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [editProfile.areaName, areaOptions]);

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//     if (name === "pincode") {
//       setSelectedPincode(value);
//       const found = pincodeData.find((p) => p.code === value);
//       if (found) {
//         setEditProfile((prev) => ({
//           ...prev,
//           pincode: value,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setAreaOptions(found.areas || []);
//         setSubAreaOptions([]);
//       }
//     } else if (name === "areaName") {
//       const selectedArea = areaOptions.find((a) => a.name === value);
//       setSubAreaOptions(selectedArea?.subAreas || []);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const id = localStorage.getItem("userId");
//       const formData = new FormData();
//       formData.append("technicianId", id || "");
//       formData.append("username", editProfile.username);
//       formData.append("category", editProfile.category);
//       formData.append("buildingName", editProfile.buildingName);
//       formData.append("areaName", editProfile.areaName);
//       formData.append("subAreaName", editProfile.subAreaName);
//       formData.append("city", editProfile.city);
//       formData.append("state", editProfile.state);
//       formData.append("pincode", editProfile.pincode);
//       formData.append("description", editProfile.description);
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
//       await updateTechnicianControl(formData);
//       setProfile({ ...editProfile, technicianId: id || "" });
//       setEditModalOpen(false);
//       setImageFile(null);
//     } catch (err: unknown) {
//       setError("Failed to save profile. Please try again.");
//       console.error("Failed to update profile:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: "Technician Profile",
//       text: `Check out my profile: ${profile.username}, Category: ${profile.categoryName}, Phone: ${profile.phoneNumber}, Location: ${location}`,
//       url: `https://prnvservices.com/technicianById/${profile.technicianId}`,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
//         alert("Profile details copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Sharing failed:", err);
//       alert("Unable to share. Please try copying manually.");
//     }
//   };

//   const location = [
//     profile.buildingName,
//     profile.subAreaName,
//     profile.areaName,
//     profile.city,
//     profile.state,
//     profile.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ")
//     .replace(/(, )+/g, ", ")
//     .replace(/^, |, $/g, "");

//   return (
//     <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//             My Profile
//           </h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link
//               to="/technician/dashboard"
//               className="hover:text-blue-600 transition-colors duration-200"
//               onClick={() => console.log("Navigating to /technician/dashboard")} // Debugging
//             >
//               Dashboard
//             </Link>
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
//             <Pencil className="w-4 h-5 me-2" />
//             Edit Profile
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center">{error}</div>
//         ) : (
//           <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
//             <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//               <img
//                 src={profile.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
//                 alt={profile.username}
//                 className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold truncate">
//                 {profile.username} (ID: {profile.userId})
//               </h2>

//               <div className="flex flex-wrap items-center gap-4 my-3">
//                 <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
//                   {profile.rating ? profile.rating.length : "4"}
//                   <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//                 </div>
//                 <div className="text-gray-600 text-sm font-light">
//                   {profile.rating && profile.rating.length > 0
//                     ? (
//                         profile.rating.reduce((sum, r) => sum + r.rating, 0) /
//                         profile.rating.length
//                       ).toFixed(1)
//                     : "4"}
//                 </div>
//               </div>
//               {profile.categoryName && (
//                 <div className="flex flex-wrap gap-2">
//                   <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
//                     {profile.categoryName}
//                   </span>
//                 </div>
//               )}

//               <div className="flex my-3 items-center">
//                 <IoLocationOutline size={27} color="red" />
//                 <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                   {location}
//                 </span>
//               </div>
//               {profile.description && (
//                 <div className="flex items-center">
//                   <FaThumbsUp size={22} color="#00B800" className="flex" />
//                   <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                     {profile.description} Years in Services
//                   </span>
//                 </div>
//               )}

//               <div className="flex gap-4 mt-4 flex-wrap">
//                 <a
//                   href={`tel:${profile.phoneNumber}`}
//                   className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600"
//                 >
//                   <IoCall size={22} className="me-2" />
//                   <span>{profile.phoneNumber}</span>
//                 </a>
//                 <a
//                   href={`sms:${profile.phoneNumber}`}
//                   className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <LuMessageSquareText size={18} className="mr-2" />
//                   Message
//                 </a>
//                 <div
//                   onClick={handleShare}
//                   className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <IoShareSocial size={18} className="mr-2" />
//                   Share
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
//             <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide">
//               <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
//                 <div className="bg-white rounded-2xl p-8">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                   <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
//                       Edit Profile
//                     </h2>
//                   </div>
//                   <form className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//                         <div className="flex items-center">
//                           <div className="text-red-500 text-sm font-medium">
//                             {error}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex flex-col items-center space-y-4">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Profile Image
//                       </label>
//                       <div className="relative">
//                         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
//                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                             {editProfile.profileImage ? (
//                               <img
//                                 src={editProfile.profileImage}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover rounded-full"
//                               />
//                             ) : (
//                               <FaUser className="text-gray-400 text-2xl" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Technician ID
//                         </label>
//                         <input
//                           type="text"
//                           name="technicianId"
//                           value={editProfile.technicianId}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div> */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Name
//                         </label>
//                         <input
//                           type="text"
//                           name="username"
//                           value={editProfile.username}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter your name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={editProfile.phoneNumber}
//                           readOnly
//                           maxLength={10}
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Category
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={editProfile.category}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-500"
//                           placeholder="Enter service category"
//                           readOnly
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Years in Service
//                         </label>
//                         <input
//                           type="text"
//                           name="description"
//                           value={editProfile.description}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter years in service"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           House/Building Name
//                         </label>
//                         <input
//                           type="text"
//                           name="buildingName"
//                           value={editProfile.buildingName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter house or building name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Pincode
//                         </label>
//                         <select
//                           name="pincode"
//                           value={editProfile.pincode}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Pincode</option>
//                           {pincodeData
//                             .sort((a, b) => Number(a.code) - Number(b.code))
//                             .map((p) => (
//                               <option key={p._id} value={p.code}>
//                                 {p.code}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Area Name
//                         </label>
//                         <select
//                           name="areaName"
//                           value={editProfile.areaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Area</option>
//                           {areaOptions.map((a: any) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Sub Area
//                         </label>
//                         <select
//                           name="subAreaName"
//                           value={editProfile.subAreaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Sub Area</option>
//                           {subAreaOptions
//                             .sort((a, b) =>
//                               a.name
//                                 .toLowerCase()
//                                 .localeCompare(b.name.toLowerCase())
//                             )
//                             .map((a) => (
//                               <option key={a._id} value={a.name}>
//                                 {a.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={editProfile.city}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={editProfile.state}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                       <button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         {isLoading ? "Saving..." : "Update Profile"}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         <FaTimes className="text-sm" />
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianProfile;
// import React, { useState, useEffect } from "react";
// import { MdOutlineStar } from "react-icons/md";
// import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import {
//   technicianGetProfile,
//   updateTechnicianControl,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { Link } from "react-router-dom";
// import { ChevronRight, Pencil } from "lucide-react";
// import { FaThumbsUp, FaUser, FaTimes } from "react-icons/fa";
// import { Rating } from "../ProfilePage";

// interface Profile {
//   technicianId: string;
//   username: string;
//   userId: string;
//   category: string;
//   categoryName: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   description: string;
//   profileImage: string;
//   phoneNumber: string;
//   rating: Rating[];
// }

// interface ApiResponse {
//   result?: {
//     username?: string;
//     category?: string;
//     userId?: string;
//     categoryName?: string;
//     buildingName?: string;
//     areaName?: string;
//     subAreaName?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     phoneNumber?: string;
//     ratings: Rating[];
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     technicianId: "",
//     username: "",
//     userId:"",
//     category: "",
//     categoryName: "",
//     buildingName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     description: "",
//     profileImage: "",
//     phoneNumber: "",
//     rating: [],
//   });
//   const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem("userId");
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               technicianId: id,
//               username: data.result.username || "",
//               category: data.result.category || "",
//               categoryName: data.result.categoryName || "",
//               buildingName: data.result.buildingName || "",
//               areaName: data.result.areaName || "",
//               subAreaName: data.result.subAreaName || "",
//               city: data.result.city || "",
//               state: data.result.state || "",
//               pincode: data.result.pincode || "",
//               description: data.result.description || "",
//               profileImage: data.result.profileImage,
//               userId:data.result.userId,
//               phoneNumber: data.result.phoneNumber || "",
//               rating: data.result.ratings || [],
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError("Failed to load profile. Please try again.");
//         console.error("Failed to fetch technician profile:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (editModalOpen) {
//       setSelectedPincode(editProfile.pincode);
//     }
//   }, [editModalOpen, editProfile.pincode]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setEditProfile((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setSubAreaOptions([]);
//       } else {
//         setAreaOptions([]);
//         setSubAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (editProfile.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === editProfile.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       } else {
//         setSubAreaOptions([]);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [editProfile.areaName, areaOptions]);

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//     if (name === "pincode") {
//       setSelectedPincode(value);
//       const found = pincodeData.find((p) => p.code === value);
//       if (found) {
//         setEditProfile((prev) => ({
//           ...prev,
//           pincode: value,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setAreaOptions(found.areas || []);
//         setSubAreaOptions([]);
//       }
//     } else if (name === "areaName") {
//       const selectedArea = areaOptions.find((a) => a.name === value);
//       setSubAreaOptions(selectedArea?.subAreas || []);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const id = localStorage.getItem("userId");
//       const formData = new FormData();
//       formData.append("technicianId", id || "");
//       formData.append("username", editProfile.username);
//       formData.append("category", editProfile.category);
//       formData.append("buildingName", editProfile.buildingName);
//       formData.append("areaName", editProfile.areaName);
//       formData.append("subAreaName", editProfile.subAreaName);
//       formData.append("city", editProfile.city);
//       formData.append("state", editProfile.state);
//       formData.append("pincode", editProfile.pincode);
//       formData.append("description", editProfile.description);
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
//       await updateTechnicianControl(formData);
//       setProfile({ ...editProfile, technicianId: id || "" });
//       setEditModalOpen(false);
//       setImageFile(null);
//     } catch (err: unknown) {
//       setError("Failed to save profile. Please try again.");
//       console.error("Failed to update profile:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: "Technician Profile",
//       text: `Check out my profile: ${profile.username}, Category: ${profile.categoryName}, Phone: ${profile.phoneNumber}, Location: ${location}`,
//       url: window.location.href,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
//         alert("Profile details copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Sharing failed:", err);
//       alert("Unable to share. Please try copying manually.");
//     }
//   };

//   const location = [
//     profile.buildingName,
//     profile.subAreaName,
//     profile.areaName,
//     profile.city,
//     profile.state,
//     profile.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ")
//     .replace(/(, )+/g, ", ")
//     .replace(/^, |, $/g, "");

//   return (
//     <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//             My Profile
//           </h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link
//               to="/technician/dashboard"
//               className="hover:text-blue-600 transition-colors duration-200"
//               onClick={() => console.log("Navigating to /technician/dashboard")} // Debugging
//             >
//               Dashboard
//             </Link>
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
//             <Pencil className="w-4 h-5 me-2" />
//             Edit Profile
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center">{error}</div>
//         ) : (
//           <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
//             <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//               <img
//                 src={profile.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
//                 alt={profile.username}
//                 className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold truncate">
//                 {profile.username} (ID: {profile.userId})
//               </h2>

//               <div className="flex flex-wrap items-center gap-4 my-3">
//                 <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
//                   {profile.rating ? profile.rating.length : "4"}
//                   <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//                 </div>
//                 <div className="text-gray-600 text-sm font-light">
//                   {profile.rating && profile.rating.length > 0
//                     ? (
//                         profile.rating.reduce((sum, r) => sum + r.rating, 0) /
//                         profile.rating.length
//                       ).toFixed(1)
//                     : "4"}
//                 </div>
//               </div>
//               {profile.categoryName && (
//                 <div className="flex flex-wrap gap-2">
//                   <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
//                     {profile.categoryName}
//                   </span>
//                 </div>
//               )}

//               <div className="flex my-3 items-center">
//                 <IoLocationOutline size={27} color="red" />
//                 <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                   {location}
//                 </span>
//               </div>
//               {profile.description && (
//                 <div className="flex items-center">
//                   <FaThumbsUp size={22} color="#00B800" className="flex" />
//                   <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                     {profile.description} Years in Services
//                   </span>
//                 </div>
//               )}

//               <div className="flex gap-4 mt-4 flex-wrap">
//                 <a
//                   href={`tel:${profile.phoneNumber}`}
//                   className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600"
//                 >
//                   <IoCall size={22} className="me-2" />
//                   <span>{profile.phoneNumber}</span>
//                 </a>
//                 <a
//                   href={`sms:${profile.phoneNumber}`}
//                   className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <LuMessageSquareText size={18} className="mr-2" />
//                   Message
//                 </a>
//                 <div
//                   onClick={handleShare}
//                   className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <IoShareSocial size={18} className="mr-2" />
//                   Share
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
//             <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide">
//               <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
//                 <div className="bg-white rounded-2xl p-8">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                   <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
//                       Edit Profile
//                     </h2>
//                   </div>
//                   <form className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//                         <div className="flex items-center">
//                           <div className="text-red-500 text-sm font-medium">
//                             {error}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex flex-col items-center space-y-4">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Profile Image
//                       </label>
//                       <div className="relative">
//                         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
//                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                             {editProfile.profileImage ? (
//                               <img
//                                 src={editProfile.profileImage}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover rounded-full"
//                               />
//                             ) : (
//                               <FaUser className="text-gray-400 text-2xl" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Technician ID
//                         </label>
//                         <input
//                           type="text"
//                           name="technicianId"
//                           value={editProfile.technicianId}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Name
//                         </label>
//                         <input
//                           type="text"
//                           name="username"
//                           value={editProfile.username}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter your name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={editProfile.phoneNumber}
//                           readOnly
//                           maxLength={10}
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Category
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={editProfile.category}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-500"
//                           placeholder="Enter service category"
//                           readOnly
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Years in Service
//                         </label>
//                         <input
//                           type="text"
//                           name="description"
//                           value={editProfile.description}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter years in service"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           House/Building Name
//                         </label>
//                         <input
//                           type="text"
//                           name="buildingName"
//                           value={editProfile.buildingName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter house or building name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Pincode
//                         </label>
//                         <select
//                           name="pincode"
//                           value={editProfile.pincode}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Pincode</option>
//                           {pincodeData
//                             .sort((a, b) => Number(a.code) - Number(b.code))
//                             .map((p) => (
//                               <option key={p._id} value={p.code}>
//                                 {p.code}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Area Name
//                         </label>
//                         <select
//                           name="areaName"
//                           value={editProfile.areaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Area</option>
//                           {areaOptions.map((a: any) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Sub Area
//                         </label>
//                         <select
//                           name="subAreaName"
//                           value={editProfile.subAreaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Sub Area</option>
//                           {subAreaOptions
//                             .sort((a, b) =>
//                               a.name
//                                 .toLowerCase()
//                                 .localeCompare(b.name.toLowerCase())
//                             )
//                             .map((a) => (
//                               <option key={a._id} value={a.name}>
//                                 {a.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={editProfile.city}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={editProfile.state}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                       <button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         {isLoading ? "Saving..." : "Update Profile"}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         <FaTimes className="text-sm" />
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianProfile;

// import React, { useState, useEffect } from "react";
// import { MdOutlineStar } from "react-icons/md";
// import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import {
//   technicianGetProfile,
//   updateTechnicianControl,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { Link } from "react-router-dom";
// import { ChevronRight, Pencil } from "lucide-react";
// import { FaThumbsUp, FaUser, FaTimes } from "react-icons/fa";
// import { Rating } from "../ProfilePage";

// // Define interfaces for type safety
// interface Profile {
//   technicianId: string; // Added technicianId
//   username: string;
//   category: string;
//   categoryName: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   description: string;
//   profileImage: string;
//   phoneNumber: string;
//   rating: Rating[];
// }

// interface ApiResponse {
//   result?: {
//     username?: string;
//     category?: string;
//     categoryName?: string;
//     buildingName?: string;
//     areaName?: string;
//     subArea?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     phoneNumber?: string;
//     ratings: Rating[];
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     technicianId: "", // Initialize technicianId
//     username: "",
//     category: "",
//     categoryName: "",
//     buildingName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     description: "",
//     profileImage: "",
//     phoneNumber: "",
//     rating: [],
//   });
//   const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem("userId");
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               technicianId: id, // Set technicianId from localStorage
//               username: data.result.username || "",
//               category: data.result.category || "",
//               categoryName: data.result.categoryName || "",
//               buildingName: data.result.buildingName || "",
//               areaName: data.result.areaName || "",
//               subAreaName: data.result.subAreaName || "",
//               city: data.result.city || "",
//               state: data.result.state || "",
//               pincode: data.result.pincode || "",
//               description: data.result.description || "",
//               profileImage: data.result.profileImage,
//               phoneNumber: data.result.phoneNumber || "",
//               rating: data.result.ratings || null,
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError("Failed to load profile. Please try again.");
//         console.error("Failed to fetch technician profile:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (editModalOpen) {
//       setSelectedPincode(editProfile.pincode);
//     }
//   }, [editModalOpen, editProfile.pincode]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setEditProfile((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setSubAreaOptions([]);
//       } else {
//         setAreaOptions([]);
//         setSubAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (editProfile.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === editProfile.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       } else {
//         setSubAreaOptions([]);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [editProfile.areaName, areaOptions]);

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//     if (name === "pincode") {
//       setSelectedPincode(value);
//       const found = pincodeData.find((p) => p.code === value);
//       if (found) {
//         setEditProfile((prev) => ({
//           ...prev,
//           pincode: value,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setAreaOptions(found.areas || []);
//         setSubAreaOptions([]);
//       }
//     } else if (name === "areaName") {
//       const selectedArea = areaOptions.find((a) => a.name === value);
//       setSubAreaOptions(selectedArea?.subAreas || []);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const id = localStorage.getItem("userId");
//       const formData = new FormData();
//       formData.append("technicianId", id || "");
//       formData.append("username", editProfile.username);
//       formData.append("category", editProfile.category);
//       formData.append("buildingName", editProfile.buildingName);
//       formData.append("areaName", editProfile.areaName);
//       formData.append("subAreaName", editProfile.subAreaName);
//       formData.append("city", editProfile.city);
//       formData.append("state", editProfile.state);
//       formData.append("pincode", editProfile.pincode);
//       formData.append("description", editProfile.description);
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
//       await updateTechnicianControl(formData);
//       setProfile({ ...editProfile, technicianId: id || "" }); // Ensure technicianId is preserved
//       setEditModalOpen(false);
//       setImageFile(null);
//     } catch (err: unknown) {
//       setError("Failed to save profile. Please try again.");
//       console.error("Failed to update profile:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: "Technician Profile",
//       text: `Check out my profile: ${profile.username}, Category: ${profile.categoryName}, Phone: ${profile.phoneNumber}, Location: ${location}`,
//       url: window.location.href,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         // Fallback for browsers that don't support Web Share API
//         await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
//         alert("Profile details copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Sharing failed:", err);
//       alert("Unable to share. Please try copying manually.");
//     }
//   };

//   const location = [
//     profile.buildingName,
//     profile.subAreaName,
//     profile.areaName,
//     profile.city,
//     profile.state,
//     profile.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ")
//     .replace(/(, )+/g, ", ")
//     .replace(/^, |, $/g, "");

//   return (
//     <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//             My Profile
//           </h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link
//               to="/technician/dashboard"
//               className="hover:text-blue-600 transition-colors duration-200"
//             >
//               Dashboard
//             </Link>
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
//             <Pencil className="w-4 h-5 me-2" />
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
//             <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//               <img
//                 src={profile.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
//                 alt={profile.username}
//                 className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold truncate">
//                 {profile.username} (ID: {profile.technicianId})
//               </h2>

//               <div className="flex flex-wrap items-center gap-4 my-3">
//                 <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
//                   {profile && profile.rating ? (profile.rating.length) : '4'}
//                   <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//                 </div>
//                 <div className="text-gray-600 text-sm font-light">
//                   {profile.rating && profile.rating.length > 0
//                     ? (
//                         profile.rating.reduce((sum, r) => sum + r.rating, 0) /
//                         profile.rating.length
//                       ).toFixed(1)
//                     : "4"}
//                 </div>
//               </div>
//               {profile.categoryName && (
//                 <div className="flex flex-wrap gap-2">
//                   <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
//                     {profile.categoryName}
//                   </span>
//                 </div>
//               )}

//               <div className="flex my-3 items-center">
//                 <IoLocationOutline size={27} color="red" />
//                 <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                   {location}
//                 </span>
//               </div>
//               {profile.description && (
//                 <div className="flex items-center">
//                   <FaThumbsUp size={22} color="#00B800" className="flex" />
//                   <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                     {profile.description} Years in Services
//                   </span>
//                 </div>
//               )}

//               <div className="flex gap-4 mt-4 flex-wrap">
//                 <a
//                   href={`tel:${profile.phoneNumber}`}
//                   className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600"
//                 >
//                   <IoCall size={22} className="me-2" />
//                   <span>{profile.phoneNumber}</span>
//                 </a>
//                 <a
//                   href={`sms:${profile.phoneNumber}`}
//                   className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <LuMessageSquareText size={18} className="mr-2" />
//                   Message
//                 </a>
//                 <div
//                   onClick={handleShare}
//                   className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer"
//                 >
//                   <IoShareSocial size={18} className="mr-2" />
//                   Share
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
//             <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide">
//               <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
//                 <div className="bg-white rounded-2xl p-8">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                   <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
//                       Edit Profile
//                     </h2>
//                   </div>
//                   <form className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//                         <div className="flex items-center">
//                           <div className="text-red-500 text-sm font-medium">
//                             {error}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Profile Image */}
//                     <div className="flex flex-col items-center space-y-4">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Profile Image
//                       </label>
//                       <div className="relative">
//                         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
//                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                             {editProfile.profileImage ? (
//                               <img
//                                 src={editProfile.profileImage}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover rounded-full"
//                               />
//                             ) : (
//                               <FaUser className="text-gray-400 text-2xl" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
//                       />
//                     </div>

//                     {/* Form Fields Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Technician ID
//                         </label>
//                         <input
//                           type="text"
//                           name="technicianId"
//                           value={editProfile.technicianId}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Name
//                         </label>
//                         <input
//                           type="text"
//                           name="username"
//                           value={editProfile.username}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter your name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={editProfile.phoneNumber}
//                           readOnly
//                           maxLength={10}
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Category
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={editProfile.category}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-500"
//                           placeholder="Enter service category"
//                           readOnly
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Years in Service
//                         </label>
//                         <input
//                           type="text"
//                           name="description"
//                           value={editProfile.description}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter years in service"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           House/Building Name
//                         </label>
//                         <input
//                           type="text"
//                           name="buildingName"
//                           value={editProfile.buildingName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter house or building name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Pincode
//                         </label>
//                         <select
//                           name="pincode"
//                           value={editProfile.pincode}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Pincode</option>
//                           {pincodeData
//                             .sort((a, b) => Number(a.code) - Number(b.code))
//                             .map((p) => (
//                               <option key={p._id} value={p.code}>
//                                 {p.code}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Area Name
//                         </label>
//                         <select
//                           name="areaName"
//                           value={editProfile.areaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Area</option>
//                           {areaOptions.map((a: any) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Sub Area
//                         </label>
//                         <select
//                           name="subAreaName"
//                           value={editProfile.subAreaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Sub Area</option>
//                           {subAreaOptions
//                             .sort((a, b) =>
//                               a.name
//                                 .toLowerCase()
//                                 .localeCompare(b.name.toLowerCase())
//                             )
//                             .map((a) => (
//                               <option key={a._id} value={a.name}>
//                                 {a.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={editProfile.city}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={editProfile.state}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                       <button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         {isLoading ? "Saving..." : "Update Profile"}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         <FaTimes className="text-sm" />
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianProfile;

// import React, { useState, useEffect } from "react";
// import { MdOutlineStar } from "react-icons/md";
// import { IoCall, IoLocationOutline, IoShareSocial } from "react-icons/io5";
// import { LuMessageSquareText } from "react-icons/lu";
// import {
//   technicianGetProfile,
//   updateTechnicianControl,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { Link } from "react-router-dom";
// import { ChevronRight, Pencil } from "lucide-react";
// import { FaThumbsUp, FaUser, FaTimes } from "react-icons/fa";
// import { Rating } from "../ProfilePage";

// // Define interfaces for type safety
// interface Profile {
//   username: string;
//   category: string;
//   categoryName: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   description: string;
//   profileImage: string;
//   phoneNumber: string;
//   rating: Rating[];
// }

// interface ApiResponse {
//   result?: {
//     username?: string;
//     category?: string;
//     categoryName?: string;
//     buildingName?: string;
//     areaName?: string;
//     subArea?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     description?: string;
//     profileImage?: string;
//     phoneNumber?: string;
//     ratings: Rating[];
//   };
// }

// const TechnicianProfile: React.FC = () => {
//   const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<Profile>({
//     username: "",
//     category: "",
//     categoryName: "",
//     buildingName: "",
//     areaName: "",
//     subAreaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     description: "",
//     profileImage: "",
//     phoneNumber: "",
//     rating: [],
//   });
//   const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const id = localStorage.getItem("userId");
//         if (id) {
//           const data: ApiResponse = await technicianGetProfile(id);
//           if (data?.result) {
//             setProfile({
//               username: data.result.username || "",
//               category: data.result.category || "",
//               categoryName: data.result.categoryName || "",
//               buildingName: data.result.buildingName || "",
//               areaName: data.result.areaName || "",
//               subAreaName: data.result.subAreaName || "",
//               city: data.result.city || "",
//               state: data.result.state || "",
//               pincode: data.result.pincode || "",
//               description: data.result.description || "",
//               profileImage: data.result.profileImage,
//               phoneNumber: data.result.phoneNumber || "",
//               rating: data.result.ratings || null,
//             });
//           }
//         }
//       } catch (err: unknown) {
//         setError("Failed to load profile. Please try again.");
//         console.error("Failed to fetch technician profile:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (editModalOpen) {
//       setSelectedPincode(editProfile.pincode);
//     }
//   }, [editModalOpen, editProfile.pincode]);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setEditProfile((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setSubAreaOptions([]);
//       } else {
//         setAreaOptions([]);
//         setSubAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (editProfile.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === editProfile.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       } else {
//         setSubAreaOptions([]);
//         setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//       }
//     } else {
//       setSubAreaOptions([]);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [editProfile.areaName, areaOptions]);

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//     if (name === "pincode") {
//       setSelectedPincode(value);
//       const found = pincodeData.find((p) => p.code === value);
//       if (found) {
//         setEditProfile((prev) => ({
//           ...prev,
//           pincode: value,
//           city: found.city || "",
//           state: found.state || "",
//           areaName: "",
//           subAreaName: "",
//         }));
//         setAreaOptions(found.areas || []);
//         setSubAreaOptions([]);
//       }
//     } else if (name === "areaName") {
//       const selectedArea = areaOptions.find((a) => a.name === value);
//       setSubAreaOptions(selectedArea?.subAreas || []);
//       setEditProfile((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const id = localStorage.getItem("userId");
//       const formData = new FormData();
//       formData.append("technicianId", id || "");
//       formData.append("username", editProfile.username);
//       formData.append("category", editProfile.category);
//       formData.append("buildingName", editProfile.buildingName);
//       formData.append("areaName", editProfile.areaName);
//       formData.append("subAreaName", editProfile.subAreaName);
//       formData.append("city", editProfile.city);
//       formData.append("state", editProfile.state);
//       formData.append("pincode", editProfile.pincode);
//       formData.append("description", editProfile.description);
//       if (imageFile) {
//         formData.append("profileImage", imageFile);
//       }
//       await updateTechnicianControl(formData);
//       setProfile({ ...editProfile, profileImage: editProfile.profileImage });
//       setEditModalOpen(false);
//       setImageFile(null);
//     } catch (err: unknown) {
//       setError("Failed to save profile. Please try again.");
//       console.error("Failed to update profile:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const location = [
//     profile.buildingName,
//     profile.subAreaName,
//     profile.areaName,
//     profile.city,
//     profile.state,
//     profile.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ")
//     .replace(/(, )+/g, ", ")
//     .replace(/^, |, $/g, "");

//   return (
//     <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="relative mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//             My Profile
//           </h1>
//           <div className="flex items-center text-sm text-gray-500 mt-2">
//             <Link
//               to="/technician/dashboard"
//               className="hover:text-blue-600 transition-colors duration-200"
//             >
//               Dashboard
//             </Link>
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
//             <Pencil className="w-4 h-5 me-2" />
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
//             <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">
//               <img
//                 src={profile.profileImage || "https://img-new.cgtrader.com/items/4519471/f444ec0898/large/mechanic-avatar-3d-icon-3d-model-f444ec0898.jpg"}
//                 alt={profile.username}
//                 className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold truncate">
//                 {profile.username}
//               </h2>

//               <div className="flex flex-wrap items-center gap-4 my-3">
//                 <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
//                   {profile && profile.rating ? (profile.rating.length) : '4'}
//                   <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
//                 </div>
//                 <div className="text-gray-600 text-sm font-light">
//                   {profile.rating && profile.rating.length > 0
//                     ? (
//                         profile.rating.reduce((sum, r) => sum + r.rating, 0) /
//                         profile.rating.length
//                       ).toFixed(1)
//                     : "4"}
//                 </div>
//               </div>
//               {profile.categoryName && (
//                 <div className="flex flex-wrap gap-2">
//                   <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
//                     {profile.categoryName}
//                   </span>
//                 </div>
//               )}

//               <div className="flex my-3 items-center">
//                 <IoLocationOutline size={27} color="red" />
//                 <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                   {location}
//                 </span>
//               </div>
//               {profile.description && (
//                 <div className="flex items-center">
//                   <FaThumbsUp size={22} color="#00B800" className="flex" />
//                   <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
//                     {profile.description} Years in Services
//                   </span>
//                 </div>
//               )}

//               <div className="flex gap-4 mt-4 flex-wrap">
//                 <div className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
//                   <IoCall size={22} className="me-2" />
//                   <span>{profile.phoneNumber}</span>
//                 </div>
//                 <div className="flex items-center bg-green-600 hover:bg-green-500 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//                   <LuMessageSquareText size={18} className="mr-2" />
//                   Message
//                 </div>
//                 <div className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 font-bold cursor-pointer">
//                   <IoShareSocial size={18} className="mr-2" />
//                   Share
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {editModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
//             <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] scrollbar-hide">
//               <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
//                 <div className="bg-white rounded-2xl p-8">
//                   <button
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
//                     onClick={() => setEditModalOpen(false)}
//                   >
//                     <FaTimes />
//                   </button>
//                   <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
//                       Edit Profile
//                     </h2>
//                   </div>
//                   <form className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//                         <div className="flex items-center">
//                           <div className="text-red-500 text-sm font-medium">
//                             {error}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Profile Image */}
//                     <div className="flex flex-col items-center space-y-4">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Profile Image
//                       </label>
//                       <div className="relative">
//                         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
//                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
//                             {editProfile.profileImage ? (
//                               <img
//                                 src={editProfile.profileImage}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover rounded-full"
//                               />
//                             ) : (
//                               <FaUser className="text-gray-400 text-2xl" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
//                       />
//                     </div>

//                     {/* Form Fields Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Name
//                         </label>
//                         <input
//                           type="text"
//                           name="username"
//                           value={editProfile.username}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter your name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={editProfile.phoneNumber}
//                           readOnly
//                           maxLength={10}
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Category
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={editProfile.category}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-500"
//                           placeholder="Enter service category"
//                           readOnly
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Years in Service
//                         </label>
//                         <input
//                           type="text"
//                           name="description"
//                           value={editProfile.description}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter years in service"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           House/Building Name
//                         </label>
//                         <input
//                           type="text"
//                           name="buildingName"
//                           value={editProfile.buildingName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                           placeholder="Enter house or building name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Pincode
//                         </label>
//                         <select
//                           name="pincode"
//                           value={editProfile.pincode}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Pincode</option>
//                           {pincodeData
//                             .sort((a, b) => Number(a.code) - Number(b.code))
//                             .map((p) => (
//                               <option key={p._id} value={p.code}>
//                                 {p.code}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Area Name
//                         </label>
//                         <select
//                           name="areaName"
//                           value={editProfile.areaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Area</option>
//                           {areaOptions.map((a: any) => (
//                             <option key={a._id} value={a.name}>
//                               {a.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Sub Area
//                         </label>
//                         <select
//                           name="subAreaName"
//                           value={editProfile.subAreaName}
//                           onChange={handleEditChange}
//                           className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                         >
//                           <option value="">Select Sub Area</option>
//                           {subAreaOptions
//                             .sort((a, b) =>
//                               a.name
//                                 .toLowerCase()
//                                 .localeCompare(b.name.toLowerCase())
//                             )
//                             .map((a) => (
//                               <option key={a._id} value={a.name}>
//                                 {a.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           name="city"
//                           value={editProfile.city}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={editProfile.state}
//                           readOnly
//                           className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                         />
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                       <button
//                         type="button"
//                         onClick={handleSave}
//                         disabled={isLoading}
//                         className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         {isLoading ? "Saving..." : "Update Profile"}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                       >
//                         <FaTimes className="text-sm" />
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicianProfile;
