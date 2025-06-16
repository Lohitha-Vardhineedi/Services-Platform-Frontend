import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginFormProps {
  defaultRole?: 'user' | 'technician';
}

const LoginForm: React.FC<LoginFormProps> = ({ defaultRole = 'user' }) => {
  const [role, setRole] = useState<'user' | 'technician'>(defaultRole);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect based on URL if applicable
  useEffect(() => {
    if (location.pathname.includes('/login/technician')) {
      setRole('technician');
    } else {
      setRole('user');
    }
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as 'user' | 'technician';
    if (selectedRole !== role) {
      navigate(`/login/${selectedRole}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with API call
    console.log('Logging in as:', role, formData);

    // Simulate login success
    // navigate(role === 'technician' ? '/technician/dashboard' : '/user/dashboard');
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Submit Button */}
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
    </main>
  );
};

export default LoginForm;
