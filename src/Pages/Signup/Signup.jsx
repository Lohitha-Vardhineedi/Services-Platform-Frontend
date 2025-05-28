import { useEffect, useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SuccessSwal, warningSwal } from "../../Utils/Toast";
import { getCategoriesDetails, registerUser } from "../../Services/APIrequests";
import Spinner from "react-bootstrap/Spinner";

const SignupModal = ({ onClose, role }) => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const getCategories = async () => {
    try {
      const response = await getCategoriesDetails();

      setCategory(response?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle Form Submit
  const onSubmit = async (data) => {
    setIsLoading(true);

    console.log("Form Data:", data);
    const { aadhaarName, aadhaarNumber, category, email, mobile, password } =
      data;
    try {
      let requestBody = {
        name: aadhaarName,
        username: aadhaarName,
        email: email,
        mobileno: mobile,
        password: password,
        category: category,
        subcategory: 0,
        country_code: "91",
        currency_code: "INR",
        profile_img: "https://example.com/profiles/alexey.png",
        otp: "123456",
        account_holder_name: "test account",
        account_number: "40817810099910004312",
        account_iban: "RU12345678901234567890",
        bank_name: "indian",
        bank_address: "nampally2",
        sort_code: "044525225",
        routing_number: "048425225",
        account_ifsc: "IBRRRUMMXXX",
        referred_by: "ref14345",
        team_limit: 10,
        video_link: "https://youtu.be/example",
        referral_earn: 150.5,
        pwd: "SecurePass123!",
        usertype: 0,
        type: role,
        is_agree: 1,
        language: "en",
        is_available: true,
        about_me: "",
        bda_id: 42,
        purpose: "saving",
        offer: "percent",
        response_time: "3hr",
        aadhar_number: aadhaarNumber,
      };

      const res = await registerUser(requestBody);
      if (res.status === 201) {
        SuccessSwal("Success", "Register Successfully");
        reset(); // <-- this resets the form fields
        onClose();
      } else {
        Error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      warningSwal("Error", error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="signup-modal animate-popup">
        <button
          className="close-btn"
          style={{ color: "red", marginLeft: "auto", width: "50px" }}
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
          alt="Logo"
          className="modal-logo"
        />
        <h2 className="modal-title">Signup</h2>

        <form className="signup-modal-form" onSubmit={handleSubmit(onSubmit)}>
          <label>Name as per Aadhaar</label>
          <input
            type="text"
            {...register("aadhaarName", { required: "Name is required" })}
            className="form-control"
            placeholder="Enter Aadhaar name"
          />
          {errors.aadhaarName && (
            <span className="error">{errors.aadhaarName.message}</span>
          )}

          <label>Aadhaar Card Number</label>
          <input
            type="text"
            {...register("aadhaarNumber", {
              required: "Aadhaar number is required",
              pattern: {
                value: /^\d{12}$/,
                message: "Aadhaar must be 12 digits",
              },
            })}
            className="form-control"
            placeholder="Enter Aadhaar number"
          />
          {errors.aadhaarNumber && (
            <span className="error">{errors.aadhaarNumber.message}</span>
          )}

          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="form-control"
            placeholder="Enter email"
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}

          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="form-control"
            placeholder="Enter password"
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}

          <label>Mobile Number</label>
          <input
            type="tel"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Invalid mobile number",
              },
            })}
            className="form-control"
            placeholder="Enter mobile number"
          />
          {errors.mobile && (
            <span className="error">{errors.mobile.message}</span>
          )}

          {role === 1 && (
            <div>
              <label>Category</label>
              <select
                className="form-control"
                {...register("category", { required: "Select a category" })}
              >
                <option value="">Select Category</option>
                {category?.map((item) => (
                  <option value={item?.category_name}>
                    {item?.category_name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error">{errors.category.message}</span>
              )}
            </div>
          )}

          <div className="checkbox-container">
            <div>
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You must agree to terms",
                })}
              />
              <label
                htmlFor="terms"
                style={{ color: "black", marginLeft: "10px" }}
              >
                I agree to the <span>Privacy Policy</span> & <span>Terms</span>.
              </label>
            </div>
            {errors.terms && (
              <span className="error">{errors.terms.message}</span>
            )}
          </div>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <Spinner
                  animation="border"
                  variant="primary"
                  style={{ marginRight: "auto" }}
                />
              </div>
            </div>
          ) : (
            <button className="modal-register-btn" type="submit">
              Register
            </button>
          )}
          <p className="login-redirect">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
