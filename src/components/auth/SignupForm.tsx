import React, { useState } from 'react';
import { categories } from '../../data/categoriesData';

interface SignupFormProps {
  defaultRole: 'user' | 'technician';
}

const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    dob: '',
    profileImage: '',
    category: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'profileImage' && files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing up with:', { role: defaultRole, ...formData });
    // TODO: Post to API
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sign Up as {defaultRole}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              name="mobile"
              required
              pattern="[0-9]{10}"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Technician-specific category field */}
          {defaultRole === 'technician' && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Service Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              id="profileImage"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full"
              />
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Switch Role Links */}
        {defaultRole === 'user' && (
          <p className="mt-4 text-sm text-center text-gray-600">
            Are you a technician?{' '}
            <a
              href="/signup/technician"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </a>
          </p>
        )}

        {defaultRole === 'technician' && (
          <p className="mt-4 text-sm text-center text-gray-600">
            Are you a user?{' '}
            <a
              href="/signup/user"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </a>
          </p>
        )}
      </div>
    </main>
  );
};

export default SignupForm;
