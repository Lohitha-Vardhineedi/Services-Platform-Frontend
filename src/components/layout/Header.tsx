import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Menu, X, ShoppingCart, History } from 'lucide-react';
import { useUser } from '../../context/UserContext';
// import { useUser } from '../../context/UserContext';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Mock user data for demonstration
  // const user = { name: 'uday' };

  useEffect(() => {
    const updateCartCount = () => {
      const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(storedItems.length);
    };

  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  };

  window.addEventListener("storage", updateCartCount);
  window.addEventListener("focus", updateCartCount);
  window.addEventListener("userChanged", updateUser); // Listen for custom event

  updateCartCount();
  updateUser();

  return () => {
    window.removeEventListener("storage", updateCartCount);
    window.removeEventListener("focus", updateCartCount);
    window.removeEventListener("userChanged", updateUser); // Clean up
  };
}, []);


  // const [mobileOpen, setMobileOpen] = useState(false);
  // const {user} = useUser();
  // const user = {"name": "uday"};

  return (
    <header className="bg-white shadow-sm border-b z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 bg-blue-900 rounded px-1 py-0.5">
            <Link to="/">
              <img
                src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
                alt="Justdial Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4 flex-shrink items-center">
            <div className="flex items-center w-16">
              <div id="google_translate_element" className="w-full" />
            </div>
            {[
              ['categories', 'Categories'],
              ['about', 'About Us'],
              ['subscription', 'Subscriptions'],
              ['features', 'Key Features'],
              ['franchise', 'Franchise'],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={`/${path}`}
                className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4 relative">
            <button className="hidden md:flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download App</span>
            </button>

            {user ? (
              <>
                <Link to="/cart">
                  <div className="relative">
                    {cartCount > 0 && (
                      <div className="absolute -right-1 bottom-3 w-4 h-4 bg-green-600 text-white text-xs flex items-center justify-center rounded-full z-10">
                        {cartCount}
                      </div>
                    )}
                    <ShoppingCart color="#d70000" className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>

                {/* <Link to="/transactions" className="relative group">
                  <History className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </Link> */}

                {/* Profile Dropdown */}

                <div className="relative">
                  <button
                    onClick={() => setShowModal(!showModal)}
                    className="text-sm text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    Hi, {user?.username || 'User'}
                  </button>

                  {showModal && (
                    <div
                      ref={modalRef}
                      className="fixed right-60 top-16 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in"
                    >
                      <Link
                        to="/profile/edit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowModal(false)}
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/transactions"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowModal(false)}
                      >
                        Transactions
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          console.log("Logout clicked");
                          localStorage.removeItem('user');
                          localStorage.removeItem('token') // Clear user token
                          // Optionally, redirect to home or login page
                          setUser(null);
                          window.location.href = '/'; // Redirect to home page

                          // logout logic here
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg flex flex-col p-6 relative animate-slide-in">
            <button className="absolute top-4 right-4 text-gray-600" onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center w-16 mb-6 mt-2">
              <div id="google_translate_element_mobile" className="w-full" />
            </div>

            {[
              ['categories', 'Categories'],
              ['about', 'About Us'],
              ['subscription', 'Subscriptions'],
              ['features', 'Key Features'],
              ['franchise', 'Franchise'],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={`/${path}`}
                className="text-gray-700 hover:text-blue-600 py-2 text-base font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}

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
