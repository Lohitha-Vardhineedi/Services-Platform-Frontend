import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Menu, X, ShoppingCart, History } from 'lucide-react';
// import { useUser } from '../../context/UserContext';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // const { user } = useUser();
  const user = { name: 'uday' };

  useEffect(() => {
    const updateCartCount = () => {
      const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(storedItems?.length);
    };

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("focus", updateCartCount);

    updateCartCount();

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("focus", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setShowModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 overflow-x-auto">
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

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-4 flex-shrink items-center">
            <div className="flex items-center w-16">
              <div id="google_translate_element" className="w-full" />
            </div>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium">About Us</Link>
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
                <Link to="/cart">
                  <div className="relative">
                    {cartCount > 0 && (
                      <div className="absolute -right-1 bottom-3 w-4 h-4 bg-green-600 text-white text-xs flex items-center justify-center rounded-full z-10">
                        {cartCount}
                      </div>
                    )}
                    <ShoppingCart color='#d70000' className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>

                <Link to="/transactions" className="relative group">
                  <History className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowModal((prev) => !prev)}
                    className="text-sm text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    Hi, {user.name}
                  </button>

                  {showModal && (
                    <div className="absolute right-0 mt-2 w-48 bg-red-600 border border-gray-200 rounded-lg shadow-lg animate-fade-in">
                      <Link
                        to="/transactions"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowModal(false)}
                      >
                        Transactions
                      </Link>
                      <Link
                        to="/profile/edit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowModal(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          console.log("Logout clicked");
                          // Clear session/logout logic here
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
