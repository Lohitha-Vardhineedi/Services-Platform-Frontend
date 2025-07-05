import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/apiMethods';
import { useUser } from '../../context/UserContext';

interface LoginFormProps {
  defaultRole?: 'user' | 'technician';
}

const LoginForm: React.FC<LoginFormProps> = ({ defaultRole = 'user' }) => {
  const [role, setRole] = useState<'user' | 'technician'>(defaultRole);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

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

  const getfunction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ ...formData, role }) as any;
      if (res.user.token) {
        console.log("Token : ",res.user.token)
        localStorage.setItem('jwt_token', res.token);
      }
     
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      console.log("Called :")
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

        <form className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
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

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">UserName</label>
            <input
              type="username"
              name="username"
              required
              value={formData.username}
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
              onClick={getfunction}
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
