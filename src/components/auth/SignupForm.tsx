import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categoriesData';
import { register } from '../../api/apiMethods';

interface SignupFormProps {
  defaultRole: 'user' | 'technician';
}

interface FormData {
  name: string;
  mobile: string;
  password: string;
  buildingName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  category: string;
}

const initialFormState: FormData = {
  name: '',
  mobile: '',
  password: '',
  buildingName: '',
  areaName: '',
  city: '',
  state: '',
  pincode: '',
  category: '',
};

const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const payload: any = {
          username: formData.name,
          phoneNumber: formData.mobile,
          password: formData.password,
          buildingName: formData.buildingName,
          areaName: formData.areaName,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          role: defaultRole
        };
        if (defaultRole === 'technician') {
          payload.category = formData.category;
        }

        const response = await register(payload) as any;

        if (response.success) {
          navigate(`/login/${defaultRole}`);
        } else {
          setError(response.message || 'Registration failed. Please try again.');
        }

      } catch (err: any) {
        setError(err?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [formData, defaultRole, navigate]
  );

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className='flex justify-center'>
        <div className="bg-blue-900 rounded px-1 py-1 w-fit flex ">
          <img
            src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
            alt="Justdial Logo"
            className="h-8 w-auto "
          />

        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">

        <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
          Sign Up as {defaultRole}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
          )}

          {defaultRole === 'technician' && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Service Category <span className='text-red-500'>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {[
            { id: 'name', label: 'Name', type: 'text' },
            { id: 'mobile', label: 'Phone Number', type: 'tel', pattern: '[0-9]{10}' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'buildingName', label: 'House/Building Name', type: 'text' },
            { id: 'areaName', label: 'Area/Street Name', type: 'text' },
            { id: 'city', label: 'City', type: 'text' },
            { id: 'state', label: 'State', type: 'text' },
            { id: 'pincode', label: 'Pincode', type: 'number' },
          ].map(({ id, label, type, pattern }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} <span className='text-red-600'>*</span>
              </label>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={label}
                required
                value={(formData as any)[id]}
                onChange={handleChange}
                pattern={pattern}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {defaultRole === 'user' ? 'Are you a technician?' : 'Are you a user?'}{' '}
          <a
            href={`/signup/${defaultRole === 'user' ? 'technician' : 'user'}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up here
          </a>
        </p>
      </div>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already Sign up?
        <a
          href={`/login/${defaultRole === 'user' ? 'user' : 'technician'}`}
          className="text-blue-600 hover:underline font-medium ms-1"
        >
          Sign In
        </a>
      </p>
    </main>
  );
};

export default SignupForm;