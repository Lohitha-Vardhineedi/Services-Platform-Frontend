import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginFormProps {
  defaultRole?: 'user' | 'technician';
}

const LoginForm: React.FC<LoginFormProps> = ({ defaultRole = 'user' }) => {
  const [role, setRole] = useState<'user' | 'technician'>(defaultRole);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'user' | 'technician';
    setRole(newRole);

    // Redirect to corresponding login page if not already there
    const currentPath = location.pathname;
    const targetPath = `/login/${newRole}`;
    if (currentPath !== targetPath) {
      navigate(targetPath);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in as:', role, formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Log In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Login As</label>
          <select
            value={role}
            onChange={handleRoleChange}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">User</option>
            <option value="technician">Technician</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
