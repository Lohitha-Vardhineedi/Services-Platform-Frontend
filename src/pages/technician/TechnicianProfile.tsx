import React, { useState, useEffect } from 'react';
import { MdOutlineStar } from 'react-icons/md';
import { IoCall, IoShareSocial } from 'react-icons/io5';
import { LuMessageSquareText } from 'react-icons/lu';
import { technicianGetProfile, updateTechnicianControl } from '../../api/apiMethods';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Define interfaces for type safety
interface Profile {
  name: string;
  service: string;
  location: string;
  years: string;
  image: string;
  phone: string;
}

interface ApiResponse {
  result?: {
    username?: string;
    category?: string;
    buildingName?: string;
    areaName?: string;
    city?: string;
    state?: string;
    pincode?: string;
    description?: string;
    profileImage?: string;
    ProfilePhone?: string;
  };
}

const TechnicianProfile: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    service: '',
    location: '',
    years: '',
    image: '',
    phone: '',
  });
  const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const id = localStorage.getItem('userId');
        if (id) {
          const data: ApiResponse = await technicianGetProfile(id);
          if (data?.result) {
            setProfile({
              name: data.result.username || '',
              service: data.result.category || '',
              location: `${data.result.buildingName || ''}, ${data.result.areaName || ''}, ${data.result.city || ''}, ${data.result.state || ''}, ${data.result.pincode || ''}`
                .replace(/(, )+/g, ', ')
                .replace(/^, |, $/g, ''),
              years: data.result.description || '',
              image: data.result.profileImage || 'https://via.placeholder.com/150',
              phone: data.result.ProfilePhone || '',
            });
          }
        }
      } catch (err: unknown) {
        setError('Failed to load profile. Please try again.');
        console.error('Failed to fetch technician profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
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
        if (ev.target?.result) {
          setEditProfile((prev) => ({ ...prev, image: ev.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
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
    } catch (err: unknown) {
      setError('Failed to save profile. Please try again.');
      console.error('Failed to update profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8 overflow-auto scrollbar-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">My Profile</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Link to="/technician/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-600">My Profile</span>
          </div>
          <button
            className="absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={() => {
              setEditProfile(profile);
              setEditModalOpen(true);
            }}
          >
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
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">
            {/* Profile Image */}
            <div className="flex justify-center md:justify-start md:w-1/3">
              <img
                src={profile.image}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-100 shadow-md transition-transform duration-200"
              />
            </div>
            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 break-words">{profile.name}</h2>
              <p className="text-lg text-gray-600">{profile.service}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center bg-amber-100 px-3 py-1 rounded-lg text-black font-semibold">
                  4.8 <MdOutlineStar size={20} className="ml-1 text-amber-500" />
                </div>
                <span className="text-gray-500">84 Ratings</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl text-gray-800 text-sm font-medium">
                {profile.location}
              </div>
              <p className="text-sm text-gray-600">Experience: {profile.years} years</p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="flex items-center bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <IoCall size={20} className="mr-2" /> {profile.phone}
                </button>
                <button
                  className="flex items-center bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <LuMessageSquareText size={20} className="mr-2" /> Message
                </button>
                <button
                  className="flex items-center bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <IoShareSocial size={20} className="mr-2" /> Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh] shadow-xl">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                onClick={() => setEditModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full mt-1 text-sm border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  {editProfile.image && (
                    <img
                      src={editProfile.image}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mt-3 border border-gray-200"
                    />
                  )}
                </div>
                <InputField
                  label="Name"
                  name="name"
                  value={editProfile.name}
                  onChange={handleEditChange}
                />
                <InputField
                  label="Service"
                  name="service"
                  value={editProfile.service}
                  onChange={handleEditChange}
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editProfile.location}
                  onChange={handleEditChange}
                />
                <InputField
                  label="Years in Service"
                  name="years"
                  value={editProfile.years}
                  onChange={handleEditChange}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable InputField Component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type="text"
      value={value}
      onChange={onChange}
      className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
    />
  </div>
);

export default TechnicianProfile;
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