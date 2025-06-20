import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, UserRound, ShoppingCart } from "lucide-react";
import logo from "/logo.png";
import UserProfileModal from "./UserProfileModal.jsx";
import AuthModal from "./AuthModal.jsx";
import { auth } from "../../firebase.js";
import { signOut } from "firebase/auth";

const Header = () => {

  const [cartCount, setCartCount] = useState(0);

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleTechniciansClick = () => {
    navigate("/technicians");
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setProfileModal(false);
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log("Auth state changed:", currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {openModal && <AuthModal onClose={() => setOpenModal(false)} />}
      {profileModal && (
        <UserProfileModal
          onClose={() => setProfileModal(false)}
          user={user}
          onLogout={logout}
        />
      )}

      <header className="w-full bg-white shadow-md">
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <img
            src={logo}
            alt="logo"
            className="h-9 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto max-w-full cursor-pointer"
            onClick={handleLogoClick}
          />

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link
              to="/about"
              className="hover:underline hover:text-indigo-600 transition-all"
            >
              About Us
            </Link>
            <span
              onClick={handleTechniciansClick}
              className="hover:underline hover:text-indigo-600 transition-all cursor-pointer"
            >
              For Technicians
            </span>
            <Link
              to="/franchise"
              className="hover:underline hover:text-indigo-600 transition-all"
            >
              Franchise
            </Link>

            {!user ? (
              <span
                className="hover:underline hover:text-indigo-600 transition-all cursor-pointer"
                onClick={() => setOpenModal(true)}
              >
                Login / SignUp
              </span>
            ) : (
              <>
                <Link to="/checkout">
                  <div className="relative">
                    {cartCount > 0 && (
      <div className="absolute -right-1 bottom-3 w-4 h-4 bg-green-600 text-white text-xs flex items-center justify-center rounded-full">
        {cartCount}
      </div>
    )}
                    <ShoppingCart color="#d70000" />
                  </div>
                </Link>

                <span
                  className="cursor-pointer"
                  onClick={() => setProfileModal(true)}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <UserRound className="h-5 w-5 rounded-full bg-gray-400 p-1" />
                  )}
                </span>
              </>
            )}
          </nav>

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium">
            <Link
              to="/about"
              className="block hover:underline hover:text-indigo-600 transition-all"
            >
              About Us
            </Link>
            <button
              onClick={handleTechniciansClick}
              className="block w-full text-left hover:underline hover:text-indigo-600 transition-all"
            >
              For Technicians
            </button>
            <Link
              to="/franchise"
              className="block hover:underline hover:text-indigo-600 transition-all"
            >
              Franchise
            </Link>

            {!user ? (
              <button
                onClick={() => setOpenModal(true)}
                className="block w-full text-left hover:underline hover:text-indigo-600 transition-all"
              >
                Login / SignUp
              </button>
            ) : (
              <>
                <Link
                  to="/checkout"
                  className="block hover:underline hover:text-indigo-600 transition-all"
                >
                  Cart
                </Link>
                <button
                  onClick={() => setProfileModal(true)}
                  className="block w-full text-left hover:underline hover:text-indigo-600 transition-all"
                >
                  Profile
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
