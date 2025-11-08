import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  userRegister,
  getAllPincodes,
} from "../../api/apiMethods";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import TermsConditions from "../../components/footerComponents/TermsConditions";

interface PincodeArea {
  _id: string;
  name: string;
  subAreas: { _id: string; name: string }[];
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: PincodeArea[];
}

interface FormData {
  name: string;
  mobile: string;
  password: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  password?: string;
  buildingName?: string;
  areaName?: string;
  subAreaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  general?: string;
  terms?: string;
}

interface userRegisterResponse {
    success: boolean,
    message: string,
    result: {
        id: string,
        username: string,
        phoneNumber: string,
        role: string,
        buildingName: string,
        areaName: string
        subAreaName: string,
        city: string,
        state: string,
        pincode: string,
    }
}

const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

const isCtrlCombo = (e: React.KeyboardEvent<HTMLInputElement>) =>
  e.ctrlKey || e.metaKey || e.altKey;

const allowNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const allowed =
    /^[A-Za-z ]$/.test(k) ||
    ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
  if (!allowed) e.preventDefault();
};

const allowDigitKey = (e: React.KeyboardEvent<HTMLInputElement>, maxLen = 10) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const target = e.target as HTMLInputElement;
  const isNav =
    ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
  if (isNav) return;
  if (!/^[0-9]$/.test(k)) {
    e.preventDefault();
    return;
  }
  const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
  if (target.value.length - selection >= maxLen) e.preventDefault();
};

const allowPasswordKey = (e: React.KeyboardEvent<HTMLInputElement>, maxLen = 10) => {
  if (isCtrlCombo(e)) return;
  const k = e.key;
  const target = e.target as HTMLInputElement;
  const isNav =
    ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
  if (isNav) return;
  if (!/^[A-Za-z0-9@_#]$/.test(k)) {
    e.preventDefault();
    return;
  }
  const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
  if (target.value.length - selection >= maxLen) e.preventDefault();
};

const sanitizeName = (v: string) => v.replace(/[^A-Za-z ]+/g, "");
const sanitizePhone = (v: string) => v.replace(/[^0-9]+/g, "").slice(0, 10);
const sanitizePassword = (v: string) => v.replace(/[^A-Za-z0-9@_#]+/g, "").slice(0, 10);

const initialFormState: FormData = {
  name: "",
  mobile: "",
  password: "",
  buildingName: "",
  areaName: "",
  subAreaName: "",
  city: "",
  state: "",
  pincode: "",
};

const fieldOrderUser: (keyof FormErrors)[] = [
  "name",
  "mobile",
  "password",
  "buildingName",
  "pincode",
  "areaName",
  "subAreaName",
  "city",
  "state",
  "terms",
  "general",
];

const UserSignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) setPincodeData(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) setAreaOptions(found.areas);
      else setAreaOptions([]);
      setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
      if (found) {
        setFormData((prev) => ({
          ...prev,
          city: found.city || "",
          state: found.state || "",
        }));
      }
    }
  }, [selectedPincode, pincodeData]);

  useEffect(() => {
    if (formData.areaName) {
      const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
      if (selectedArea && selectedArea.subAreas) setSubAreaOptions(selectedArea.subAreas);
      else setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [formData.areaName, areaOptions]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      let value: string = (e.target as HTMLInputElement).value;

      if (name === "name") value = sanitizeName(value);
      if (name === "mobile") value = sanitizePhone(value);
      if (name === "password") value = sanitizePassword(value);

      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "pincode") setSelectedPincode(value);
    },
    []
  );

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const name = input.name as keyof FormData;
    const pasted = e.clipboardData.getData("text");
    let clean = pasted;
    if (name === "name") clean = sanitizeName(pasted);
    if (name === "mobile") clean = sanitizePhone(pasted);
    if (name === "password") clean = sanitizePassword(pasted);
    e.preventDefault();
    setFormData((prev) => ({ ...prev, [name]: clean }));
  }, []);

  const validateForm = useCallback((): FormErrors => {
    const f = formData;
    const e: FormErrors = {};
    if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
    if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
    if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
    if (!f.buildingName.trim()) e.buildingName = "Building name is required";
    if (!f.pincode) e.pincode = "Pincode is required";
    if (!f.areaName) e.areaName = "Area is required";
    if (!f.subAreaName) e.subAreaName = "Sub Area is required";
    if (!f.city) e.city = "City is required";
    if (!f.state) e.state = "State is required";
    if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
    return e;
  }, [formData, agreedToTerms]);

  const scrollToFirstError = useCallback((err: FormErrors) => {
    const firstKey = fieldOrderUser.find((k) => err[k]);
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formErrors = validateForm();
      setErrors(formErrors);
      if (Object.keys(formErrors).length > 0) {
        scrollToFirstError(formErrors);
        return;
      }

      setLoading(true);
      try {
        const basePayload = {
          username: formData.name.trim(),
          phoneNumber: formData.mobile,
          password: formData.password,
          buildingName: formData.buildingName.trim(),
          areaName: formData.areaName,
          subAreaName: formData.subAreaName || "-",
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };
        const response = await userRegister(basePayload) as userRegisterResponse ;

        if (response?.success) {
          navigate("/login/user");
        }
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: err?.data?.error?.[0] || "Registration failed. Please try again.",
        }));
        scrollToFirstError({ general: "Registration failed" });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, validateForm, scrollToFirstError]
  );

  const nameInputProps = {
    pattern: "[A-Za-z ]+",
    maxLength: 60,
    onKeyDown: allowNameKey,
    onPaste: handlePaste,
    placeholder: "Enter name",
  };

  const phoneInputProps = {
    inputMode: "numeric" as const,
    pattern: "[0-9]{10}",
    maxLength: 10,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => allowDigitKey(e, 10),
    onPaste: handlePaste,
    placeholder: "Enter 10-digit number",
  };

  const passwordInputProps = {
    pattern: "[A-Za-z0-9@_#]{6,10}",
    minLength: 6,
    maxLength: 10,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => allowPasswordKey(e, 10),
    onPaste: handlePaste,
    placeholder: "6–10 (A–Z, 0–9, @ _ #)",
  };

  // Terms Modal Component: Renders TermsConditions inside a modal overlay
  const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    if (!showTermsModal) return null;

    return createPortal(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            ×
          </div>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Terms & Conditions</h2>
          <TermsConditions />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="flex-shrink-0 bg-blue-900 rounded px-1 py-1">
            <img
              src="https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png"
              alt="Prnv services Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
            Sign Up as User
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errors.general && (
              <div id="general" className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                {...nameInputProps}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.name && (
                <div className="text-red-500 text-xs mt-1" id="name-error">
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                {...phoneInputProps}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.mobile && <div className="text-red-500 text-xs mt-1" id="mobile-error">{errors.mobile}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  {...passwordInputProps}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1" id="password-error">{errors.password}</div>}
            </div>

            <div>
              <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
                House/Building Name <span className="text-red-600">*</span>
              </label>
              <input
                id="buildingName"
                name="buildingName"
                type="text"
                value={formData.buildingName}
                onChange={handleChange}
                placeholder="Enter building name"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              {errors.buildingName && (
                <div className="text-red-500 text-xs mt-1" id="buildingName-error">
                  {errors.buildingName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode <span className="text-red-600">*</span>
              </label>
              <select
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select pincode</option>
                {pincodeData
                  .sort((a: any, b: any) => Number(a.code) - Number(b.code))
                  .map((p) => (
                    <option key={p._id} value={p.code}>
                      {p.code}
                    </option>
                  ))}
              </select>
              {errors.pincode && <div className="text-red-500 text-xs mt-1" id="pincode-error">{errors.pincode}</div>}
            </div>

            <div>
              <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
                Area <span className="text-red-600">*</span>
              </label>
              <select
                id="areaName"
                name="areaName"
                value={formData.areaName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select area</option>
                {areaOptions.map((a) => (
                  <option key={a._id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
              {errors.areaName && <div className="text-red-500 text-xs mt-1" id="areaName-error">{errors.areaName}</div>}
            </div>

            <div>
              <label htmlFor="subAreaName" className="block text-sm font-medium text-gray-700">
                Sub Area <span className="text-red-600">*</span>
              </label>
              <select
                id="subAreaName"
                name="subAreaName"
                value={formData.subAreaName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select sub area</option>
                {subAreaOptions
                  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                  .map((a) => (
                    <option key={a._id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
              </select>
              {errors.subAreaName && (
                <div className="text-red-500 text-xs mt-1" id="subAreaName-error">
                  {errors.subAreaName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City <span className="text-red-600">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                readOnly
                placeholder="Auto-filled"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              />
              {errors.city && <div className="text-red-500 text-xs mt-1" id="city-error">{errors.city}</div>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State <span className="text-red-600">*</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                readOnly
                placeholder="Auto-filled"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              />
              {errors.state && <div className="text-red-500 text-xs mt-1" id="state-error">{errors.state}</div>}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Terms & Conditions
                  </button>
                  <span className="text-red-600">*</span>
                </span>
              </label>
              {errors.terms && <div className="text-red-500 text-xs mt-1" id="terms-error">{errors.terms}</div>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Are you a technician?{" "}
            <a href="/signup/technician" className="text-blue-600 hover:underline font-medium">
              Sign Up here
            </a>
          </p>
        </div>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already Sign up?
          <Link to="/login/user" className="text-blue-600 hover:underline font-medium ms-1">
            Sign In
          </Link>
        </p>
      </main>
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
    </>
  );
};

export default UserSignupForm;

// import React from 'react';
// import SignupForm from '../../components/auth/SignupForm';

// const UserSignup: React.FC = () => {
//   return <SignupForm defaultRole="user" />;
// };

// export default UserSignup;

