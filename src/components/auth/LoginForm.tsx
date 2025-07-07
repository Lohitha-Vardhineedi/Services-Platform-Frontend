import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { technicianLogin, userLogin } from '../../api/apiMethods';

type UserRole = 'user' | 'technician';

interface LoginFormProps {
  defaultRole?: UserRole;
}

interface LoginData {
  phoneNumber: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ defaultRole = 'user' }) => {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [formData, setFormData] = useState<LoginData>({ phoneNumber: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    const selectedRole = e.target.value as UserRole;
    if (selectedRole !== role) {
      navigate(`/login/${selectedRole}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (role === 'technician') {
        response = await technicianLogin({ ...formData }) as any;
      } else {
        response = await userLogin({ ...formData }) as any;
      }
      console.log("asdasdsad", response.result.token)
      if (response?.result?.token) {
        console.log('Done')
        localStorage.setItem('jwt_token', response.result.token);
        localStorage.setItem('user', JSON.stringify(response.result));
        localStorage.setItem('userId', response.result.id);

        if (role === 'technician') {
          navigate('/technician');
        } else {
          navigate('/')
        }
      } else {
        throw new Error('Invalid credentials or server error');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-900 rounded px-2 py-1 flex items-center">
          <img
            src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
            alt="Justdial Logo"
            className="h-8 w-auto"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login As <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?
        <a
          href={`/signup/${role}`}
          className="text-blue-600 hover:underline font-medium ms-1"
        >
          Sign Up
        </a>
      </p>
    </main>
  );
};

export default LoginForm;


// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { login } from '../../api/apiMethods';

// interface LoginFormProps {
//   defaultRole?: 'user' | 'technician';
// }

// const LoginForm: React.FC<LoginFormProps> = ({ defaultRole = 'user' }) => {
//   const [role, setRole] = useState<'user' | 'technician'>(defaultRole);
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (location.pathname.includes('/login/technician')) {
//       setRole('technician');
//     } else {
//       setRole('user');
//     }
//   }, [location.pathname]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRole = e.target.value as 'user' | 'technician';
//     if (selectedRole !== role) {
//       navigate(`/login/${selectedRole}`);
//     }
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Logging in as:', role, formData);

//     try {
//       const res = await login({ ...formData, role }) as any;
//       if (res.user && res.user.token) {
//         localStorage.setItem('jwt_token', res.user.token);
//       }
//       if (res.user) {
//         setUser(res.user);
//         localStorage.setItem('user', JSON.stringify(res.user));
//         console.log("ID : ", res.user.id)
//         localStorage.setItem('userId', res.user.id);
//       }
//       navigate('/');
//     } catch (err: any) {
//       setError(err?.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className='flex justify-center'>
//         <div className="bg-blue-900 rounded px-1 py-1 w-fit flex ">
//           <img
//             src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//             alt="Justdial Logo"
//             className="h-8 w-auto "
//           />

//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

//         <form className="space-y-4">
//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Login As <span className='text-red-500'>*</span></label>
//             <select
//               value={role}
//               onChange={handleRoleChange}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="user">User</option>
//               <option value="technician">Technician</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name <span className='text-red-500'>*</span></label>
//             <input
//               type="text"
//               name="username"
//               required
//               value={formData.username}
//               onChange={handleChange}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password <span className='text-red-500'>*</span></label>
//             <input
//               type="password"
//               name="password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
//             >
//               Sign In
//             </button>
//           </div>
//         </form>
//       </div>
//       <p className="mt-4 text-sm text-center text-gray-600">
//         Don't have an account?
//         <a
//           href={`/signup/${defaultRole === 'user' ? 'user' : 'technician'}`}
//           className="text-blue-600 hover:underline font-medium ms-1"
//         >
//           sign Up
//         </a>
//       </p>
//     </main>
//   );
// };

// export default LoginForm;
