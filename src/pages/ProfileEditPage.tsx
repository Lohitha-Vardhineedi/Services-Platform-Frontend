import React, { useRef, useState } from "react";

const ProfileEdit: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "john_doe",
    password: "",
    building: "Flat 101",
    area: "Green Avenue",
    pincode: "123456",
    phone: "9876543210",
  });

  const [profileImage, setProfileImage] = useState<string>(
    "https://via.placeholder.com/100"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (jpg, png, jpeg)");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", { ...formData, profileImage });
    // send to backend
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              onClick={handleImageClick}
              className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer hover:opacity-80 transition"
            />
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Building / Flat</label>
          <input
            type="text"
            name="building"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.building}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Area</label>
          <input
            type="text"
            name="area"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Pincode</label>
          <input
            type="text"
            name="pincode"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>

        {/* Non-editable phone number */}
        <div className="mb-6">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
