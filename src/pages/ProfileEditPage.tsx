import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { userGetProfile, userEditProfile, technicianGetProfile, technicianEditProfile, getAllPincodes } from '../api/apiMethods';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

    const role = (user && (user as any).role) || localStorage.getItem('role') || 'user'; // adjust as needed
    const token = localStorage.getItem('jwt_token') as string || ""; 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log("role",role)
                const userId = localStorage.getItem('userId');
                console.log("User ID : ",userId)
                if (!userId) {
                    setError('User ID not found. Please login again.');
                    return;
                }

                let response;
                console.log("ID : ",userId)
                if (role === 'technician') {
                    response = await technicianGetProfile(userId);
                } else {
                    response = await userGetProfile(userId);
                }
                console.log("response : -- ",response)
                if (response) {
                    const userData = (response as any)?.result?.user || (response as any)?.result || response;
                    console.log("Response : ",userData)
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
            .catch(() => {});
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

        let response;
        if (role === 'technician') {
            response = await technicianEditProfile(updateData);
        } else {
            response = await userEditProfile(updateData);
        }

        if (response && (response as any).success) {
            setSuccess('Profile updated successfully!');

            

            // Extract relevant fields from response
            const userData = (response as any).result;
            const updatedUser = {...userData,
                id: userId,
                username: userData.username,
                buildingName: userData.buildingName ,
                phoneNumber: userData.phoneNumber,
                areaName: userData.areaName,
                pincode: userData.pincode,
                state: userData.state,
                role: userData.role,
                token: token,
                city: userData.city,
            };
            
            
            // Update local storage with only username and address
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Optionally update the user context if needed
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

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError(null);
    //     setSuccess(null);

    //     if (formData.password !== formData.confirmPassword) {
    //         setError('Passwords do not match');
    //         return;
    //     }

    //     if (formData.password && (formData.password.length < 6 || formData.password.length > 10)) {
    //         setError('Password must be between 6 and 10 characters long');
    //         return;
    //     }

    //     try {
    //         const userId = localStorage.getItem('userId');
    //         if (!userId) {
    //             setError('User ID not found. Please login again.');
    //             return;
    //         }

    //         const updateData: any = {
    //             id: userId,
    //             username: formData.username,
    //             password: formData.password,
    //             buildingName: formData.houseName,
    //             areaName: formData.areaName,
    //             city: formData.city,
    //             state: formData.state,
    //             pincode: formData.pincode
    //         };

    //         let response;
    //         if (role === 'technician') {
    //             response = await technicianEditProfile(updateData);
    //         } else {
    //             response = await userEditProfile(updateData);
    //         }

    //         if (response && (response as any).success) {
    //             setSuccess('Profile updated successfully!');

    //             setTimeout(() => {
    //                 navigate('/');
    //             }, 2000);
    //         } else {
    //             setError((response as any)?.message || 'Failed to update profile.');
    //         }
    //     } catch (err: any) {
    //         setError(err?.message || 'Failed to update profile. Please try again.');
    //     }
    // };

    if (loading) {
        return (
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <div className="text-center">Loading profile data...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{success}</div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-2xl">👤</div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleChange}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            readOnly
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                maxLength={10}
                                minLength={6}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="New Password"
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                maxLength={10}
                                minLength={6}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Confirm New Password"
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">House/Building Name</label>
                        <input
                            type="text"
                            name="houseName"
                            value={formData.houseName}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter house or building name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pincode</label>
                        <select
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Pincode</option>
                            {pincodeData.map((p) => (
                                <option key={p._id} value={p.code}>{p.code}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Area/Street Name</label>
                        <select
                            name="areaName"
                            value={formData.areaName}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Area</option>
                            {areaOptions.map((a: any) => (
                                <option key={a._id} value={a.name}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Update Profile
                        </button>
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/technicianById')}
                            className="w-full bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ProfileEditPage; 