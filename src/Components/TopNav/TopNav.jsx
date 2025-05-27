import { useState } from "react";
import "./topnav.css";
import { MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import SignupModal from "../../Pages/Signup/Signup";
import Login from "../../Pages/Login/Login";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const handleSelect = (key) => {
    if (key === "user") {
      setShowUserModal(true);
    } else if (key === "professional") {
      setShowProfessionalModal(true);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="nav-container">
      <Link to="/" className="link">
        <ul className="nav-image-ul">
          <li>
            <img
              src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
              alt="logo"
              className="logo-image"
            />
          </li>
        </ul>
      </Link>
      <ul className="d-flex nav-image-ul align-items-center gap-5 mobile-view">
        <Link to="/all-categories" className="link">
          <li className="nav-items">CATEGORIES</li>
        </Link>
        <li className="nav-items">ABOUT US</li>

        <Link to="/subscription-plans" className="link">
          <li className="nav-items">SUBSCRIPTIONS</li>
        </Link>
        <li className="nav-items">KEY FEATURES</li>
      </ul>
      <ul className="d-flex flex-row align-items-center gap-3  nav-image-ul mobile-view">
        <li>
          <>
            <button
              className="form-control login-button"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
          </>
        </li>
        <li>
          {" "}
          <>
            <DropdownButton
              id="dropdown-basic-button"
              variant="danger"
              title="Register"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="user">Become a User</Dropdown.Item>
              <Dropdown.Item eventKey="professional">
                Become a Professional
              </Dropdown.Item>
            </DropdownButton>

            {showUserModal && (
              <SignupModal onClose={() => setShowUserModal(false)} role={1} />
            )}

            {showProfessionalModal && (
              <SignupModal
                onClose={() => setShowProfessionalModal(false)}
                role={2}
              />
            )}
          </>
          {/* <>
            <button
              className="form-control login-button"
              onClick={() => setShowSignup(true)}
            >
              Register
            </button>
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
          </> */}
        </li>
      </ul>
      <ul className="nav-image-ul nav-icon">
        <li>
          <button className="toggle-btn" onClick={toggleMenu}>
            <MdOutlineMenu size={34} className="nav-icon" />
          </button>
        </li>
      </ul>
      <div className={`overlay-menu ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          ×
        </button>
        <ul className="d-flex flex-column nav-image-ul align-items-center ">
          <li className="nav-items">CATEGORIES</li>
          <li className="nav-items">ABOUT US</li>

          <li className="nav-items">SUBSCRIPTIONS</li>
          <li className="nav-items">KEY FEATURES</li>
        </ul>
        <ul className="d-flex flex-row justify-content-around align-items-center   nav-image-ul ">
          <li>
            <>
              <button
                className="form-control login-button"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              {showLogin && <Login onClose={() => setShowLogin(false)} />}
            </>
          </li>
          <li>
            {" "}
            <>
              <DropdownButton
                id="dropdown-basic-button"
                variant="danger"
                title="Register"
                onSelect={handleSelect}
              >
                <Dropdown.Item eventKey="user">Become a User</Dropdown.Item>
                <Dropdown.Item eventKey="professional">
                  Become a Professional
                </Dropdown.Item>
              </DropdownButton>

              {showUserModal && (
                <SignupModal onClose={() => setShowUserModal(false)} role={2} />
              )}

              {showProfessionalModal && (
                <SignupModal
                  onClose={() => setShowProfessionalModal(false)}
                  role={1}
                />
              )}
            </>
            {/* <>
            <button
              className="form-control login-button"
              onClick={() => setShowSignup(true)}
            >
              Register
            </button>
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
          </> */}
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default TopNav;
