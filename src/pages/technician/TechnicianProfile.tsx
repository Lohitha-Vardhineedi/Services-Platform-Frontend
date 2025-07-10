import React, { useState, useEffect } from 'react'
import { CiStar } from 'react-icons/ci'
import { FaThumbsUp } from 'react-icons/fa6'
import { IoCall, IoLocationOutline, IoShareSocial } from 'react-icons/io5'
import { LuMessageSquareText } from 'react-icons/lu'
import { MdOutlineStar } from 'react-icons/md'
import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods'

const TechnicianProfile = () => {
    const [save, setSave] = useState(false)
    const [role, setRole] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        service: "",
        location: "",
        years: "",
        image: "",
    });
    // For editing
    const [editProfile, setEditProfile] = useState({ ...profile });

    useEffect(() => {

        setRole(localStorage.getItem("role"));
        let id = localStorage.getItem("userId");
        console.log("ID : ",id)

        if (id) {
            technicianGetProfile(id)
                .then((data: any) => {
                    if (data?.result) {
                        setProfile({
                            name: data.result.username || '',
                            service: data.result.category || '',
                            location: `${data.result.buildingName || ''}, ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
                            years: data.result.description || '',
                            image: data.result.profileImage || '',
                        });
                    }
                })
                .catch((err: any) => {
                    console.error('Failed to fetch technician profile:', err);
                });
        }
    }, []);

    const handleEditProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditProfile((prev) => ({
                    ...prev,
                    image: ev.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditProfileSave = async () => {
        const id = localStorage.getItem("userId");
        const formData = new FormData();
        formData.append("username", editProfile.name);
        formData.append("technicianId", id || "");
        formData.append("description", editProfile.years);
        if (editProfile.image && typeof editProfile.image !== 'string') {
            formData.append("profileImage", editProfile.image);
        }
        await updateTechnicianControl(formData);
        setProfile(editProfile);
        setEditModalOpen(false);
    };

    return (
        <div className="border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row relative overflow-hidden">
            {/* Make this container relative for absolute positioning */}
            <div className="flex flex-col items-center md:items-start md:mr-6 mb-4 md:mb-0 relative w-full md:w-auto">

                

                <img
                    src={profile.image}
                    alt="Profile"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
                />
            </div>

            {/* Technician Details */}
            <div className="flex-1 min-w-0">
                {/* Edit Profile Button */}
                {role === "technician" && (
                    <button
                        className="absolute top-0 -z-0 right-0 md:top-4 md:right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium z-10"
                        onClick={() => {
                            setEditProfile(profile);
                            setEditModalOpen(true);
                        }}
                    >
                        Edit Profile
                    </button>
                )}
                <h2 className="text-xl font-semibold truncate">{profile.name}</h2>

                <div className="flex flex-wrap items-center gap-4 my-3">
                    <div className="flex items-center border border-amber-500 rounded-lg px-2 py-1 text-black text-sm font-bold">
                        4.8
                        <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
                    </div>
                    <div className="text-gray-600 text-sm font-light">84 Ratings</div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm font-light">
                        {profile.service}
                    </span>
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                    <div className="flex bg-fuchsia-500 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
                        <IoCall size={22} className="me-2" />
                        <span>{phone}</span>
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

            {/* Rating by User */}
            {role !== "technician" && (
                <div className="flex flex-col justify-start mt-6 md:mt-0 md:ml-8 w-full md:w-auto">
                    <div className="text-sm font-medium mb-2">Click to Rate</div>
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="border border-gray-400 rounded-xl p-1 hover:bg-yellow-100 transition cursor-pointer"
                            >
                                <CiStar size={24} className="text-yellow-500" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                            onClick={() => setEditModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">
                                Profile Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    onChange={handleEditProfileImage}
                                />
                            </label>
                            {editProfile.image && (
                                <img
                                    src={editProfile.image}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-full mt-2 border"
                                />
                            )}
                            <label className="text-sm font-medium">
                                Name
                                <input
                                    type="text"
                                    name="name"
                                    value={editProfile.name}
                                    onChange={handleEditProfileChange}
                                    className="border rounded px-2 py-1 w-full mt-1"
                                />
                            </label>
                            <label className="text-sm font-medium">
                                Service
                                <input
                                    type="text"
                                    name="service"
                                    value={editProfile.service}
                                    onChange={handleEditProfileChange}
                                    className="border rounded px-2 py-1 w-full mt-1"
                                />
                            </label>
                            <label className="text-sm font-medium">
                                Location
                                <input
                                    type="text"
                                    name="location"
                                    value={editProfile.location}
                                    onChange={handleEditProfileChange}
                                    className="border rounded px-2 py-1 w-full mt-1"
                                />
                            </label>
                            <label className="text-sm font-medium">
                                Years in Service
                                <input
                                    type="text"
                                    name="years"
                                    value={editProfile.years}
                                    onChange={handleEditProfileChange}
                                    className="border rounded px-2 py-1 w-full mt-1"
                                />
                            </label>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleEditProfileSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default TechnicianProfile