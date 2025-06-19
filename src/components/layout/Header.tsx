import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Menu, X, ShoppingCart, History } from 'lucide-react';
import { useUser } from '../../context/UserContext';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const {user} = useUser();
  const user = {"name": "uday"};

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 overflow-x-auto">
          {/* Logo */}
          <div className="flex-shrink-0 bg-blue-900 rounded px-1 py-0.5">
            <Link to="/"><img
              src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
              alt="Justdial Logo"
              className="h-8 w-auto"
            /></Link>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-4 flex-shrink items-center">
            <div className="flex items-center w-16">
              <div id="google_translate_element" className="w-full" />
            </div>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium flex items-center">About Us</Link>
            <Link to="/subscription" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">Subscriptions</Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">Key Features</Link>
            <Link to="/franchise" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">Franchise</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download App</span>
            </button>
            {user ? (
        <>
          <Link to="/cart" className="relative group">
            <ShoppingCart color='#d70000' className="w-6 h-6 text-gray-700  group-hover:text-blue-600 transition-colors" />
            {/* Optional: Item count badge */}
            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">2</span> */}
          </Link>
          <Link to="/transactions" className="relative group">
              <History className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </Link>
          <span className="text-sm text-gray-700">Hi, {user.name}</span>
        </>
      ) : (
        <>
          <Link
            to="/login/user"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup/user"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}

            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg flex flex-col p-6 relative animate-slide-in">
            <button className="absolute top-4 right-4 text-gray-600" onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center w-16 mb-6 mt-2">
              <div id="google_translate_element_mobile" className="w-full" />
            </div>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium" onClick={() => setMobileOpen(false)}>Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium" onClick={() => setMobileOpen(false)}>About Us</Link>
            <Link to="/subscription" className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium" onClick={() => setMobileOpen(false)}>Subscriptions</Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium" onClick={() => setMobileOpen(false)}>Key Features</Link>
            <Link to="/franchise" className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium" onClick={() => setMobileOpen(false)}>Franchise</Link>
            <button className="mt-6 flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors w-full justify-center">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download App</span>
            </button>
             <Link
              to="/login/user"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup/user"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
