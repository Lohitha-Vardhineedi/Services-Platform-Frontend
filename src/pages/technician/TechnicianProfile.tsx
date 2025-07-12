import React, { useState, useEffect } from 'react';
import { MdOutlineStar } from 'react-icons/md';
import { IoCall, IoShareSocial } from 'react-icons/io5';
import { LuMessageSquareText } from 'react-icons/lu';
import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TechnicianProfile = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    service: '',
    location: '',
    years: '',
    image: '',
    phone: '',
  });
  const [editProfile, setEditProfile] = useState({ ...profile });

  useEffect(() => {
    const id = localStorage.getItem('userId');
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
              phone: data.result.ProfilePhone || '',
            });
          }
        })
        .catch((err: any) => console.error('Failed to fetch technician profile:', err));
    }
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditProfile((prev) => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const id = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('username', editProfile.name);
    formData.append('technicianId', id || '');
    formData.append('description', editProfile.years);
    if (editProfile.image && typeof editProfile.image !== 'string') {
      formData.append('profileImage', editProfile.image);
    }
    await updateTechnicianControl(formData);
    setProfile(editProfile);
    setEditModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-1/3">
          <img
            src={profile.image}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        <div className="flex-1 relative">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/technician/dashboard" className="hover:underline">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>My Profile</span>
          </div>

          <button
            className="absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => {
              setEditProfile(profile);
              setEditModalOpen(true);
            }}
          >
            Edit Profile
          </button>

          <h2 className="text-xl font-semibold mb-1 truncate">{profile.name}</h2>

          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center border border-amber-500 px-2 py-1 rounded text-black font-semibold">
              4.8 <MdOutlineStar size={18} className="ml-1" color="#ffc71b" />
            </div>
            <span className="text-gray-500">84 Ratings</span>
          </div>

          <div className="bg-fuchsia-100 px-3 py-1 rounded-xl text-black text-sm inline-block mb-3">
            {profile.location}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm">
              <IoCall size={20} className="mr-2" /> {profile.phone}
            </div>
            <div className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              <LuMessageSquareText size={18} className="mr-2" /> Message
            </div>
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
              <IoShareSocial size={18} className="mr-2" /> Share
            </div>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setEditModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full mt-1 text-sm border px-2 py-1 rounded"
                />
                {editProfile.image && (
                  <img
                    src={editProfile.image}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2 border"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  name="name"
                  type="text"
                  value={editProfile.name}
                  onChange={handleEditChange}
                  className="block w-full mt-1 border px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Service</label>
                <input
                  name="service"
                  type="text"
                  value={editProfile.service}
                  onChange={handleEditChange}
                  className="block w-full mt-1 border px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  name="location"
                  type="text"
                  value={editProfile.location}
                  onChange={handleEditChange}
                  className="block w-full mt-1 border px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Years in Service</label>
                <input
                  name="years"
                  type="text"
                  value={editProfile.years}
                  onChange={handleEditChange}
                  className="block w-full mt-1 border px-2 py-1 rounded text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianProfile;