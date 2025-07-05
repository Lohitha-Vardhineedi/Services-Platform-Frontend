import React, { useState, useCallback } from 'react';
import { categories } from '../../data/categoriesData';

interface SignupFormProps {
  defaultRole: 'user' | 'technician';
}

interface FormData {
  name: string;
  mobile: string;
  password: string;
  buildingName: string;
  areaName: string;
  pincode: string;
  category: string;
}

const initialFormState: FormData = {
  name: '',
  mobile: '',
  password: '',
  buildingName: '',
  areaName: '',
  pincode: '',
  category: '',
};

const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    },
    [formData, defaultRole]
  );

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
          Sign Up as {defaultRole}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', label: 'User Name', type: 'text' },
            { id: 'mobile', label: 'Phone Number', type: 'tel', pattern: '[0-9]{10}' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'buildingName', label: 'House/Building Name', type: 'text' },
            { id: 'areaName', label: 'Area/Street Name', type: 'text' },
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
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {defaultRole === 'user' ? 'Are you a technician?' : 'Are you a user?'}{' '}
          <a
            href={`/signup/${defaultRole === 'user' ? 'technician' : 'user'}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignupForm;