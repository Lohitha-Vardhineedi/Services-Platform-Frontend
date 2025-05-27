import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import { loginUser } from "../../Services/APIrequests";
import { warningSwal } from "../../Utils/Toast";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      debuddger;

      if (response.ok) {
        localStorage.setItem("token", result.token); // store JWT
        navigate("/"); // redirect
      } else {
        console.log(response);
        alert(result.message || "Login failed");
      }
    } catch (err) {
      warningSwal(
        "Error",
        err?.response?.data?.message || "Network error. Please try again."
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-popup">
        <div className="d-flex flex-row align-items-center justify-content-between">
          <img
            src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
            alt="Logo"
            className="logo-image mb-3"
          />
          <Button variant="danger" onClick={onClose}>
            &times;
          </Button>
        </div>

        <h2 className="auth-title">Login</h2>

        <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          <button type="submit" className="form-control mt-4 login-btn">
            Login
          </button>

          <p className="mt-3 text-center">Don't have an account? </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
