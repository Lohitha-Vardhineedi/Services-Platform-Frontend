import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { userGetProfile, userEditProfile, technicianGetProfile, technicianEditProfile, getAllPincodes } from '../api/apiMethods';
import { FaEye, FaEyeSlash, FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [formData, setFormData] = useState({
        profileImage: '',
        username: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        houseName: '',
        areaName: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pincodeData, setPincodeData] = useState<any[]>([]);
    const [selectedPincode, setSelectedPincode] = useState<string>("");
    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = localStorage.getItem('jwt_token') as string || "";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('User ID not found. Please login again.');
                    return;
                }

                let response = await userGetProfile(userId);
                
                console.log("response : -- ", response)
                if (response) {
                    const userData = (response as any)?.result?.user || (response as any)?.result || response;
                    console.log("Response : ", userData)
                    setFormData({
                        profileImage: '',
                        username: userData.username || '',
                        phoneNumber: userData.phoneNumber || '',
                        password: '',
                        confirmPassword: '',
                        houseName: userData.buildingName || '',
                        areaName: userData.areaName || '',
                        city: userData.city || '',
                        state: userData.state || '',
                        pincode: userData.pincode || ''
                    });
                }
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        getAllPincodes()
            .then((res: any) => {
                if (Array.isArray(res?.data)) {
                    setPincodeData(res.data);
                }
            })
            .catch(() => { });
    }, []);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'profileImage' && 'files' in e.target && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (name === "pincode") {
                setSelectedPincode(value);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
            setError('Password must be between 6 and 10 characters long');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found. Please login again.');
                return;
            }

            const updateData: any = {
                id: userId,
                username: formData.username,
                password: formData.password,
                buildingName: formData.houseName,
                areaName: formData.areaName,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            };

            let response = await userEditProfile(updateData);

            if (response && (response as any).success) {
                setSuccess('Profile updated successfully!');

                const userData = (response as any).result;
                const updatedUser = {
                    ...userData,
                    id: userId,
                    username: userData.username,
                    buildingName: userData.buildingName,
                    phoneNumber: userData.phoneNumber,
                    areaName: userData.areaName,
                    pincode: userData.pincode,
                    state: userData.state,
                    token: token,
                    city: userData.city,
                };

                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                setTimeout(() => {
                    navigate('/');
                }, 4000);
            } else {
                setError((response as any)?.message || 'Failed to update profile.');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <div className="text-gray-600">Loading profile data...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FaEdit className="text-white text-2xl" />
                    </div> */}
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2">
                        Edit Profile
                    </h2>
                    {/* <p className="text-gray-600">Update your personal information</p> */}
                </div>

                {/* Main Form Card */}
                <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-1">
                    <div className="bg-white rounded-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="text-red-500 text-sm font-medium">{error}</div>
                                    </div>
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="text-green-600 text-sm font-medium">{success}</div>
                                    </div>
                                </div>
                            )}

                            {/* Profile Image */}
                            <div className="flex flex-col items-center space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            {formData.profileImage ? (
                                                <img
                                                    src={formData.profileImage}
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
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-100 file:to-cyan-100 file:text-emerald-700 hover:file:bg-gradient-to-r hover:file:from-emerald-200 hover:file:to-cyan-200"
                                />
                            </div>

                            {/* Form Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            maxLength={10}
                                            minLength={6}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 transition-all duration-200"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-emerald-500 transition-colors"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            maxLength={10}
                                            minLength={6}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 transition-all duration-200"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-emerald-500 transition-colors"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">House/Building Name</label>
                                    <input
                                        type="text"
                                        name="houseName"
                                        value={formData.houseName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                        placeholder="Enter house or building name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                    <select
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                    >
                                        <option value="">Select Pincode</option>
                                        {pincodeData.map((p) => (
                                            <option key={p._id} value={p.code}>{p.code}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Area/Street Name</label>
                                    <select
                                        name="areaName"
                                        value={formData.areaName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                    >
                                        <option value="">Select Area</option>
                                        {areaOptions.map((a: any) => (
                                            <option key={a._id} value={a.name}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                    >
                                        <option value="">Select City</option>
                                        {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                                            <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
                                                {pincodeData.find((p) => p.code === selectedPincode)?.city}
                                            </option>
                                        ) : (
                                            pincodeData.map((p) => (
                                                <option key={p._id} value={p.city}>{p.city}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                    >
                                        <option value="">Select State</option>
                                        {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
                                            <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
                                                {pincodeData.find((p) => p.code === selectedPincode)?.state}
                                            </option>
                                        ) : (
                                            pincodeData.map((p) => (
                                                <option key={p._id} value={p.state}>{p.state}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <FaSave className="text-sm" />
                                    Update Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/technicianById')}
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
        </main>
    );
};

export default ProfileEditPage;