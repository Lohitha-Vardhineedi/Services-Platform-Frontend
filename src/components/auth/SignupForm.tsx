import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  userRegister,
  technicianRegister,
  getAllCategories,
  getAllPincodes,
  getPlans,
} from "../../api/apiMethods";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TermsConditions from "../footerComponents/TermsConditions";
import { createPortal } from "react-dom";

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

interface Category {
  _id: string;
  category_name: string;
  status: number;
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  originalPrice: number;
  discount: string;
  discountPercentage: number;
  price: number;
  gstPercentage: number;
  gst: number;
  finalPrice: number;
  validity: number | null;
  leads: number | null;
  features: { name: string; included: boolean }[];
  fullFeatures: { text: string }[];
  isPopular: boolean;
  isActive: boolean;
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
  category: string;
  subscriptionId: string;
  profileImage: File | null;
  aadharFront: File | null;
  aadharBack: File | null;
  panCard: File | null;
  voterCard: File | null;
  authorizedPhone1: string;
  auth1Photo: File | null;
  authorizedPhone2: string;
  auth2Photo: File | null;
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
  category?: string;
  subscriptionId?: string;
  profileImage?: string;
  aadharFront?: string;
  aadharBack?: string;
  panCard?: string;
  voterCard?: string;
  authorizedPhone1?: string;
  auth1Photo?: string;
  authorizedPhone2?: string;
  auth2Photo?: string;
  general?: string;
  terms?: string;
}

interface SignupFormProps {
  defaultRole: "user" | "technician";
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
  category: "",
  subscriptionId: "",
  profileImage: null,
  aadharFront: null,
  aadharBack: null,
  panCard: null,
  voterCard: null,
  authorizedPhone1: "",
  auth1Photo: null,
  authorizedPhone2: "",
  auth2Photo: null,
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

const fieldOrderTech: (keyof FormErrors)[] = [
  "name",
  "mobile",
  "password",
  "buildingName",
  "pincode",
  "areaName",
  "subAreaName",
  "city",
  "state",
  "category",
  "subscriptionId",
  "profileImage",
  "aadharFront",
  "aadharBack",
  "panCard",
  "authorizedPhone1",
  "auth1Photo",
  "authorizedPhone2",
  "auth2Photo",
  "terms",
  "general",
];

const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState<boolean>(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

  useEffect(() => {
    if (defaultRole === "technician") {
      setCatLoading(true);
      getAllCategories(null)
        .then((res: any) => {
          if (Array.isArray(res?.data)) setApiCategories(res.data);
          else {
            setApiCategories([]);
            setCatError("Failed to load categories");
          }
        })
        .catch(() => {
          setApiCategories([]);
          setCatError("Failed to load categories");
        })
        .finally(() => setCatLoading(false));

      setPlanLoading(true);
      getPlans({})
        .then((res: any) => {
          if (Array.isArray(res?.data)) {
            const freePlan = res.data.find((plan: SubscriptionPlan) => plan.name === "Free Plan");
            if (freePlan) {
              setSubscriptionPlans([freePlan]);
              setFormData((prev) => ({ ...prev, subscriptionId: freePlan._id }));
            } else {
              setSubscriptionPlans([]);
              setPlanError("Free Plan not available");
            }
          } else {
            setSubscriptionPlans([]);
            setPlanError("Failed to load subscription plans");
          }
        })
        .catch(() => {
          setSubscriptionPlans([]);
          setPlanError("Failed to load subscription plans");
        })
        .finally(() => setPlanLoading(false));
    }
  }, [defaultRole]);

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
      if (name === "mobile" || name === "authorizedPhone1" || name === "authorizedPhone2")
        value = sanitizePhone(value);
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
    if (name === "mobile" || name === "authorizedPhone1" || name === "authorizedPhone2")
      clean = sanitizePhone(pasted);
    if (name === "password") clean = sanitizePassword(pasted);
    e.preventDefault();
    setFormData((prev) => ({ ...prev, [name]: clean }));
  }, []);

  const handleFileChange = useCallback((name: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  }, []);

  const validateCurrentStep = useCallback((): FormErrors => {
    const f = formData;
    const e: FormErrors = {};
    switch (currentStep) {
      case 1:
        if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
        if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
        if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
        break;
      case 2:
        if (!f.buildingName.trim()) e.buildingName = "Building name is required";
        if (!f.pincode) e.pincode = "Pincode is required";
        if (!f.areaName) e.areaName = "Area is required";
        if (!f.subAreaName) e.subAreaName = "Sub Area is required";
        if (!f.city) e.city = "City is required";
        if (!f.state) e.state = "State is required";
        break;
      case 3:
        if (!f.category) e.category = "Service category is required";
        if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
        break;
      case 4:
        if (!f.profileImage) e.profileImage = "Profile image is required";
        if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
        if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
        if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
        if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
        if (!f.auth1Photo) e.auth1Photo = "Photo is required";
        if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
        if (!f.auth2Photo) e.auth2Photo = "Photo is required";
        if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
        break;
    }
    return e;
  }, [formData, currentStep, agreedToTerms]);

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

    if (defaultRole === "technician") {
      if (!f.category) e.category = "Service category is required";
      if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
      if (!f.profileImage) e.profileImage = "Profile image is required";
      if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
      if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
      if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
      if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
      if (!f.auth1Photo) e.auth1Photo = "Photo is required";
      if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
      if (!f.auth2Photo) e.auth2Photo = "Photo is required";
    }
    if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
    return e;
  }, [formData, defaultRole, agreedToTerms]);

  const scrollToFirstError = useCallback((err: FormErrors) => {
    const order = defaultRole === "technician" ? fieldOrderTech : fieldOrderUser;
    const firstKey = order.find((k) => err[k]);
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [defaultRole]);

  const nextStep = useCallback(() => {
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    } else {
      scrollToFirstError(stepErrors);
    }
  }, [validateCurrentStep, scrollToFirstError]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
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
        let response;
        if (defaultRole === "user") {
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
          response = await userRegister(basePayload);
        } else {
          const fd = new FormData();
          fd.append("username", formData.name.trim());
          fd.append("phoneNumber", formData.mobile);
          fd.append("password", formData.password);
          fd.append("buildingName", formData.buildingName.trim());
          fd.append("areaName", formData.areaName);
          fd.append("subAreaName", formData.subAreaName || "-");
          fd.append("city", formData.city);
          fd.append("state", formData.state);
          fd.append("pincode", formData.pincode);
          fd.append("category", formData.category);
          fd.append("subscriptionId", formData.subscriptionId);
          if (formData.profileImage) fd.append("profileImage", formData.profileImage);
          if (formData.aadharFront) fd.append("aadharFront", formData.aadharFront);
          if (formData.aadharBack) fd.append("aadharBack", formData.aadharBack);
          if (formData.panCard) fd.append("panCard", formData.panCard);
          if (formData.voterCard) fd.append("voterCard", formData.voterCard);
          fd.append("authorizedPersons[0][phone]", formData.authorizedPhone1);
          if (formData.auth1Photo) fd.append("auth1Photo", formData.auth1Photo);
          fd.append("authorizedPersons[1][phone]", formData.authorizedPhone2);
          if (formData.auth2Photo) fd.append("auth2Photo", formData.auth2Photo);
          response = await technicianRegister(fd) as any;
        }

        if (response?.success) {
          if (defaultRole === "technician") {
            alert("Thank you for registering. Once your account is verified, you will receive access to log in.");
          }
          navigate(`/login/${defaultRole}`);
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
    [formData, defaultRole, navigate, validateForm, scrollToFirstError]
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

  if (defaultRole === "user") {
    return (
      <>
        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <div className=" rounded w-fit flex">
              <img
                src="https://old.prnvservices.com/uploads/logo/prnvlogo.jpg"
                alt="Prnv Logo"
                className="h-12 w-auto "
              />

            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
              Sign Up as {defaultRole}
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
            <a href="/login/user" className="text-blue-600 hover:underline font-medium ms-1">
              Sign In
            </a>
          </p>
        </main>
        {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      </>
    );
  }

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
            Sign Up as {defaultRole}
          </h2>

          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-center">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errors.general && (
              <div id="general" className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {errors.general}
              </div>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
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
                  {errors.name && <div className="text-red-500 text-xs mt-1" id="name-error">{errors.name}</div>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
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
                    Password <span className="text-red-500">*</span>
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
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
                    House/Building Name <span className="text-red-500">*</span>
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
                    Pincode <span className="text-red-500">*</span>
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
                    Area <span className="text-red-500">*</span>
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
                    Sub Area <span className="text-red-500">*</span>
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
                    City <span className="text-red-500">*</span>
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
                    State <span className="text-red-500">*</span>
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
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Service Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={catLoading}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="" disabled>
                      {catLoading ? "Loading categories..." : "Select a category"}
                    </option>
                    {apiCategories
                      .sort((a, b) =>
                        a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())
                      )
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))}
                  </select>
                  {catError && <div className="text-red-500 text-xs mt-1">{catError}</div>}
                  {errors.category && <div className="text-red-500 text-xs mt-1" id="category-error">{errors.category}</div>}
                </div>

                <div>
                  <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">
                    Subscription Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subscriptionId"
                    name="subscriptionId"
                    value={formData.subscriptionId}
                    onChange={handleChange}
                    disabled={planLoading || subscriptionPlans.length === 0}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="" disabled>
                      {planLoading
                        ? "Loading plans..."
                        : subscriptionPlans.length === 0
                        ? "No plans available"
                        : "Select a plan"}
                    </option>
                    {subscriptionPlans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {planError && <div className="text-red-500 text-xs mt-1">{planError}</div>}
                  {errors.subscriptionId && (
                    <div className="text-red-500 text-xs mt-1" id="subscriptionId-error">
                      {errors.subscriptionId}
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div>
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.profileImage && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.profileImage.name}</p>
                  )}
                  {errors.profileImage && (
                    <div className="text-red-500 text-xs mt-1" id="profileImage-error">
                      {errors.profileImage}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="aadharFront" className="block text-sm font-medium text-gray-700">
                    Aadhar Front <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="aadharFront"
                    name="aadharFront"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("aadharFront", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.aadharFront && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharFront.name}</p>
                  )}
                  {errors.aadharFront && (
                    <div className="text-red-500 text-xs mt-1" id="aadharFront-error">
                      {errors.aadharFront}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="aadharBack" className="block text-sm font-medium text-gray-700">
                    Aadhar Back <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="aadharBack"
                    name="aadharBack"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("aadharBack", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.aadharBack && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharBack.name}</p>
                  )}
                  {errors.aadharBack && (
                    <div className="text-red-500 text-xs mt-1" id="aadharBack-error">
                      {errors.aadharBack}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="panCard" className="block text-sm font-medium text-gray-700">
                    Pan Card (Pan or Voter required) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="panCard"
                    name="panCard"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("panCard", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.panCard && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.panCard.name}</p>
                  )}
                  {errors.panCard && <div className="text-red-500 text-xs mt-1" id="panCard-error">{errors.panCard}</div>}
                </div>

                <div>
                  <label htmlFor="voterCard" className="block text-sm font-medium text-gray-700">
                    Voter Card (Alternative to Pan)
                  </label>
                  <input
                    id="voterCard"
                    name="voterCard"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("voterCard", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.voterCard && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.voterCard.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="authorizedPhone1" className="block text-sm font-medium text-gray-700">
                    Authorized Person 1 Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="authorizedPhone1"
                    name="authorizedPhone1"
                    type="tel"
                    value={formData.authorizedPhone1}
                    onChange={handleChange}
                    {...phoneInputProps}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter 10-digit number"
                  />
                  {errors.authorizedPhone1 && (
                    <div className="text-red-500 text-xs mt-1" id="authorizedPhone1-error">
                      {errors.authorizedPhone1}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="authorizedPhoto1" className="block text-sm font-medium text-gray-700">
                    Authorized Person 1 Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="authorizedPhoto1"
                    name="authorizedPhoto1"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("auth1Photo", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.auth1Photo && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth1Photo.name}</p>
                  )}
                  {errors.auth1Photo && <div className="text-red-500 text-xs mt-1" id="auth1Photo-error">{errors.auth1Photo}</div>}
                </div>

                <div>
                  <label htmlFor="authorizedPhone2" className="block text-sm font-medium text-gray-700">
                    Authorized Person 2 Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="authorizedPhone2"
                    name="authorizedPhone2"
                    type="tel"
                    value={formData.authorizedPhone2}
                    onChange={handleChange}
                    {...phoneInputProps}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter 10-digit number"
                  />
                  {errors.authorizedPhone2 && (
                    <div className="text-red-500 text-xs mt-1" id="authorizedPhone2-error">
                      {errors.authorizedPhone2}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="authorizedPhoto2" className="block text-sm font-medium text-gray-700">
                    Authorized Person 2 Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="authorizedPhoto2"
                    name="authorizedPhoto2"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("auth2Photo", e.target.files?.[0] || null)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {formData.auth2Photo && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth2Photo.name}</p>
                  )}
                  {errors.auth2Photo && <div className="text-red-500 text-xs mt-1" id="auth2Photo-error">{errors.auth2Photo}</div>}
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
              </>
            )}

            <div className="pt-4 flex space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white font-semibold py-2 px-1 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing Up..." : "Register Request"}
                </button>
              )}
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Are you a user?{" "}
            <a href="/signup/user" className="text-blue-600 hover:underline font-medium">
              Sign Up here
            </a>
          </p>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already Sign up?
          <a href="/login/technician" className="text-blue-600 hover:underline font-medium ms-1">
            Sign In
          </a>
        </p>
      </main>
      <TermsModal onClose={() => setShowTermsModal(false)} />
    </>
  );
};

// Note: Add this import at the top of the file for the portal to work
// import ReactDOM from 'react-dom';

export default SignupForm;


// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   userRegister,
//   technicianRegister,
//   getAllCategories,
//   getAllPincodes,
//   getPlans,
// } from "../../api/apiMethods";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import TermsConditions from "../footerComponents/TermsConditions";

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   status: number;
// }

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   originalPrice: number;
//   discount: string;
//   discountPercentage: number;
//   price: number;
//   gstPercentage: number;
//   gst: number;
//   finalPrice: number;
//   validity: number | null;
//   leads: number | null;
//   features: { name: string; included: boolean }[];
//   fullFeatures: { text: string }[];
//   isPopular: boolean;
//   isActive: boolean;
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   category: string;
//   subscriptionId: string;
//   profileImage: File | null;
//   aadharFront: File | null;
//   aadharBack: File | null;
//   panCard: File | null;
//   voterCard: File | null;
//   authorizedPhone1: string;
//   auth1Photo: File | null;
//   authorizedPhone2: string;
//   auth2Photo: File | null;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   subAreaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   category?: string;
//   subscriptionId?: string;
//   profileImage?: string;
//   aadharFront?: string;
//   aadharBack?: string;
//   panCard?: string;
//   voterCard?: string;
//   authorizedPhone1?: string;
//   auth1Photo?: string;
//   authorizedPhone2?: string;
//   auth2Photo?: string;
//   general?: string;
//   terms?: string;
// }

// interface SignupFormProps {
//   defaultRole: "user" | "technician";
// }

// const NAME_REGEX = /^[A-Za-z ]+$/;
// const PHONE_REGEX = /^[0-9]{10}$/;
// const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

// const isCtrlCombo = (e: React.KeyboardEvent<HTMLInputElement>) =>
//   e.ctrlKey || e.metaKey || e.altKey;

// const allowNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (isCtrlCombo(e)) return;
//   const k = e.key;
//   const allowed =
//     /^[A-Za-z ]$/.test(k) ||
//     ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
//   if (!allowed) e.preventDefault();
// };

// const allowDigitKey = (e: React.KeyboardEvent<HTMLInputElement>, maxLen = 10) => {
//   if (isCtrlCombo(e)) return;
//   const k = e.key;
//   const target = e.target as HTMLInputElement;
//   const isNav =
//     ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
//   if (isNav) return;
//   if (!/^[0-9]$/.test(k)) {
//     e.preventDefault();
//     return;
//   }
//   const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
//   if (target.value.length - selection >= maxLen) e.preventDefault();
// };

// const allowPasswordKey = (e: React.KeyboardEvent<HTMLInputElement>, maxLen = 10) => {
//   if (isCtrlCombo(e)) return;
//   const k = e.key;
//   const target = e.target as HTMLInputElement;
//   const isNav =
//     ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(k);
//   if (isNav) return;
//   if (!/^[A-Za-z0-9@_#]$/.test(k)) {
//     e.preventDefault();
//     return;
//   }
//   const selection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0);
//   if (target.value.length - selection >= maxLen) e.preventDefault();
// };

// const sanitizeName = (v: string) => v.replace(/[^A-Za-z ]+/g, "");
// const sanitizePhone = (v: string) => v.replace(/[^0-9]+/g, "").slice(0, 10);
// const sanitizePassword = (v: string) => v.replace(/[^A-Za-z0-9@_#]+/g, "").slice(0, 10);

// const initialFormState: FormData = {
//   name: "",
//   mobile: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   category: "",
//   subscriptionId: "",
//   profileImage: null,
//   aadharFront: null,
//   aadharBack: null,
//   panCard: null,
//   voterCard: null,
//   authorizedPhone1: "",
//   auth1Photo: null,
//   authorizedPhone2: "",
//   auth2Photo: null,
// };

// const fieldOrderUser: (keyof FormErrors)[] = [
//   "name",
//   "mobile",
//   "password",
//   "buildingName",
//   "pincode",
//   "areaName",
//   "subAreaName",
//   "city",
//   "state",
//   "terms",
//   "general",
// ];

// const fieldOrderTech: (keyof FormErrors)[] = [
//   "name",
//   "mobile",
//   "password",
//   "buildingName",
//   "pincode",
//   "areaName",
//   "subAreaName",
//   "city",
//   "state",
//   "category",
//   "subscriptionId",
//   "profileImage",
//   "aadharFront",
//   "aadharBack",
//   "panCard",
//   "authorizedPhone1",
//   "auth1Photo",
//   "authorizedPhone2",
//   "auth2Photo",
//   "terms",
//   "general",
// ];

// const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiCategories, setApiCategories] = useState<Category[]>([]);
//   const [catLoading, setCatLoading] = useState<boolean>(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const [planLoading, setPlanLoading] = useState<boolean>(false);
//   const [planError, setPlanError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
//   const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

//   useEffect(() => {
//     if (defaultRole === "technician") {
//       setCatLoading(true);
//       getAllCategories(null)
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) setApiCategories(res.data);
//           else {
//             setApiCategories([]);
//             setCatError("Failed to load categories");
//           }
//         })
//         .catch(() => {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         })
//         .finally(() => setCatLoading(false));

//       setPlanLoading(true);
//       getPlans({})
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             const freePlan = res.data.find((plan: SubscriptionPlan) => plan.name === "Free Plan");
//             if (freePlan) {
//               setSubscriptionPlans([freePlan]);
//               setFormData((prev) => ({ ...prev, subscriptionId: freePlan._id }));
//             } else {
//               setSubscriptionPlans([]);
//               setPlanError("Free Plan not available");
//             }
//           } else {
//             setSubscriptionPlans([]);
//             setPlanError("Failed to load subscription plans");
//           }
//         })
//         .catch(() => {
//           setSubscriptionPlans([]);
//           setPlanError("Failed to load subscription plans");
//         })
//         .finally(() => setPlanLoading(false));
//     }
//   }, [defaultRole]);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) setPincodeData(res.data);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) setAreaOptions(found.areas);
//       else setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
//       if (found) {
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//         }));
//       }
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) setSubAreaOptions(selectedArea.subAreas);
//       else setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name } = e.target;
//       let value: string = (e.target as HTMLInputElement).value;

//       if (name === "name") value = sanitizeName(value);
//       if (name === "mobile" || name === "authorizedPhone1" || name === "authorizedPhone2")
//         value = sanitizePhone(value);
//       if (name === "password") value = sanitizePassword(value);

//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") setSelectedPincode(value);
//     },
//     []
//   );

//   const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
//     const input = e.target as HTMLInputElement;
//     const name = input.name as keyof FormData;
//     const pasted = e.clipboardData.getData("text");
//     let clean = pasted;
//     if (name === "name") clean = sanitizeName(pasted);
//     if (name === "mobile" || name === "authorizedPhone1" || name === "authorizedPhone2")
//       clean = sanitizePhone(pasted);
//     if (name === "password") clean = sanitizePassword(pasted);
//     e.preventDefault();
//     setFormData((prev) => ({ ...prev, [name]: clean }));
//   }, []);

//   const handleFileChange = useCallback((name: keyof FormData, file: File | null) => {
//     setFormData((prev) => ({ ...prev, [name]: file }));
//   }, []);

//   const validateCurrentStep = useCallback((): FormErrors => {
//     const f = formData;
//     const e: FormErrors = {};
//     switch (currentStep) {
//       case 1:
//         if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
//         if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
//         if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
//         break;
//       case 2:
//         if (!f.buildingName.trim()) e.buildingName = "Building name is required";
//         if (!f.pincode) e.pincode = "Pincode is required";
//         if (!f.areaName) e.areaName = "Area is required";
//         if (!f.subAreaName) e.subAreaName = "Sub Area is required";
//         if (!f.city) e.city = "City is required";
//         if (!f.state) e.state = "State is required";
//         break;
//       case 3:
//         if (!f.category) e.category = "Service category is required";
//         if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
//         break;
//       case 4:
//         if (!f.profileImage) e.profileImage = "Profile image is required";
//         if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
//         if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
//         if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
//         if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
//         if (!f.auth1Photo) e.auth1Photo = "Photo is required";
//         if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
//         if (!f.auth2Photo) e.auth2Photo = "Photo is required";
//         if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
//         break;
//     }
//     return e;
//   }, [formData, currentStep, agreedToTerms]);

//   const validateForm = useCallback((): FormErrors => {
//     const f = formData;
//     const e: FormErrors = {};
//     if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
//     if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
//     if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
//     if (!f.buildingName.trim()) e.buildingName = "Building name is required";
//     if (!f.pincode) e.pincode = "Pincode is required";
//     if (!f.areaName) e.areaName = "Area is required";
//     if (!f.subAreaName) e.subAreaName = "Sub Area is required";
//     if (!f.city) e.city = "City is required";
//     if (!f.state) e.state = "State is required";

//     if (defaultRole === "technician") {
//       if (!f.category) e.category = "Service category is required";
//       if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
//       if (!f.profileImage) e.profileImage = "Profile image is required";
//       if (!f.aadharFront) e.aadharFront = "Aadhar front image is required";
//       if (!f.aadharBack) e.aadharBack = "Aadhar back image is required";
//       if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
//       if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
//       if (!f.auth1Photo) e.auth1Photo = "Photo is required";
//       if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
//       if (!f.auth2Photo) e.auth2Photo = "Photo is required";
//     }
//     if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
//     return e;
//   }, [formData, defaultRole, agreedToTerms]);

//   const scrollToFirstError = useCallback((err: FormErrors) => {
//     const order = defaultRole === "technician" ? fieldOrderTech : fieldOrderUser;
//     const firstKey = order.find((k) => err[k]);
//     if (!firstKey) return;
//     const el = document.getElementById(firstKey);
//     if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }, [defaultRole]);

//   const nextStep = useCallback(() => {
//     const stepErrors = validateCurrentStep();
//     setErrors(stepErrors);
//     if (Object.keys(stepErrors).length === 0) {
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       scrollToFirstError(stepErrors);
//     }
//   }, [validateCurrentStep, scrollToFirstError]);

//   const prevStep = useCallback(() => {
//     setCurrentStep((prev) => prev - 1);
//   }, []);

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       const formErrors = validateForm();
//       setErrors(formErrors);
//       if (Object.keys(formErrors).length > 0) {
//         scrollToFirstError(formErrors);
//         return;
//       }

//       setLoading(true);
//       try {
//         let response;
//         if (defaultRole === "user") {
//           const basePayload = {
//             username: formData.name.trim(),
//             phoneNumber: formData.mobile,
//             password: formData.password,
//             buildingName: formData.buildingName.trim(),
//             areaName: formData.areaName,
//             subAreaName: formData.subAreaName || "-",
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//           };
//           response = await userRegister(basePayload);
//         } else {
//           const fd = new FormData();
//           fd.append("username", formData.name.trim());
//           fd.append("phoneNumber", formData.mobile);
//           fd.append("password", formData.password);
//           fd.append("buildingName", formData.buildingName.trim());
//           fd.append("areaName", formData.areaName);
//           fd.append("subAreaName", formData.subAreaName || "-");
//           fd.append("city", formData.city);
//           fd.append("state", formData.state);
//           fd.append("pincode", formData.pincode);
//           fd.append("category", formData.category);
//           fd.append("subscriptionId", formData.subscriptionId);
//           if (formData.profileImage) fd.append("profileImage", formData.profileImage);
//           if (formData.aadharFront) fd.append("aadharFront", formData.aadharFront);
//           if (formData.aadharBack) fd.append("aadharBack", formData.aadharBack);
//           if (formData.panCard) fd.append("panCard", formData.panCard);
//           if (formData.voterCard) fd.append("voterCard", formData.voterCard);
//           fd.append("authorizedPersons[0][phone]", formData.authorizedPhone1);
//           if (formData.auth1Photo) fd.append("auth1Photo", formData.auth1Photo);
//           fd.append("authorizedPersons[1][phone]", formData.authorizedPhone2);
//           if (formData.auth2Photo) fd.append("auth2Photo", formData.auth2Photo);
//           response = await technicianRegister(fd);
//         }

//         if (response?.success) {
//           if (defaultRole === "technician") {
//             alert("Thank you for registering. Once your account is verified, you will receive access to log in.");
//           }
//           navigate(`/login/${defaultRole}`);
//         }
//       } catch (err: any) {
//         setErrors((prev) => ({
//           ...prev,
//           general: err?.data?.error?.[0] || "Registration failed. Please try again.",
//         }));
//         scrollToFirstError({ general: "Registration failed" });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, defaultRole, navigate, validateForm, scrollToFirstError]
//   );

//   const nameInputProps = {
//     pattern: "[A-Za-z ]+",
//     maxLength: 60,
//     onKeyDown: allowNameKey,
//     onPaste: handlePaste,
//     placeholder: "Enter name",
//   };

//   const phoneInputProps = {
//     inputMode: "numeric" as const,
//     pattern: "[0-9]{10}",
//     maxLength: 10,
//     onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => allowDigitKey(e, 10),
//     onPaste: handlePaste,
//     placeholder: "Enter 10-digit number",
//   };

//   const passwordInputProps = {
//     pattern: "[A-Za-z0-9@_#]{6,10}",
//     minLength: 6,
//     maxLength: 10,
//     onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => allowPasswordKey(e, 10),
//     onPaste: handlePaste,
//     placeholder: "6–10 (A–Z, 0–9, @ _ #)",
//   };

//   if (defaultRole === "user") {
//     return (
//       <>
//         <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center">
//             <div className="bg-blue-900 rounded w-fit flex">
//               <img
//                 src="https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png"
//                 alt="Prnv services Logo"
//                 className="h-10 w-auto rounded-sm"
//               />
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//             <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//               Sign Up as {defaultRole}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//               {errors.general && (
//                 <div id="general" className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                   {errors.general}
//                 </div>
//               )}

//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Name <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   {...nameInputProps}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//                 {errors.name && (
//                   <div className="text-red-500 text-xs mt-1" id="name-error">
//                     {errors.name}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
//                   Phone Number <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   id="mobile"
//                   name="mobile"
//                   type="tel"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   {...phoneInputProps}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//                 {errors.mobile && <div className="text-red-500 text-xs mt-1" id="mobile-error">{errors.mobile}</div>}
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password <span className="text-red-600">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={handleChange}
//                     {...passwordInputProps}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                   />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//                 {errors.password && <div className="text-red-500 text-xs mt-1" id="password-error">{errors.password}</div>}
//               </div>

//               <div>
//                 <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
//                   House/Building Name <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   id="buildingName"
//                   name="buildingName"
//                   type="text"
//                   value={formData.buildingName}
//                   onChange={handleChange}
//                   placeholder="Enter building name"
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//                 {errors.buildingName && (
//                   <div className="text-red-500 text-xs mt-1" id="buildingName-error">
//                     {errors.buildingName}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
//                   Pincode <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   id="pincode"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select pincode</option>
//                   {pincodeData
//                     .sort((a: any, b: any) => Number(a.code) - Number(b.code))
//                     .map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                 </select>
//                 {errors.pincode && <div className="text-red-500 text-xs mt-1" id="pincode-error">{errors.pincode}</div>}
//               </div>

//               <div>
//                 <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
//                   Area <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   id="areaName"
//                   name="areaName"
//                   value={formData.areaName}
//                   onChange={handleChange}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select area</option>
//                   {areaOptions.map((a) => (
//                     <option key={a._id} value={a.name}>
//                       {a.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.areaName && <div className="text-red-500 text-xs mt-1" id="areaName-error">{errors.areaName}</div>}
//               </div>

//               <div>
//                 <label htmlFor="subAreaName" className="block text-sm font-medium text-gray-700">
//                   Sub Area <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   id="subAreaName"
//                   name="subAreaName"
//                   value={formData.subAreaName}
//                   onChange={handleChange}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select sub area</option>
//                   {subAreaOptions
//                     .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                     .map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                 </select>
//                 {errors.subAreaName && (
//                   <div className="text-red-500 text-xs mt-1" id="subAreaName-error">
//                     {errors.subAreaName}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                   City <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   id="city"
//                   name="city"
//                   type="text"
//                   value={formData.city}
//                   readOnly
//                   placeholder="Auto-filled"
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                 />
//                 {errors.city && <div className="text-red-500 text-xs mt-1" id="city-error">{errors.city}</div>}
//               </div>

//               <div>
//                 <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                   State <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   id="state"
//                   name="state"
//                   type="text"
//                   value={formData.state}
//                   readOnly
//                   placeholder="Auto-filled"
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                 />
//                 {errors.state && <div className="text-red-500 text-xs mt-1" id="state-error">{errors.state}</div>}
//               </div>

//               <div>
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={agreedToTerms}
//                     onChange={(e) => setAgreedToTerms(e.target.checked)}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     required
//                   />
//                   <span className="text-sm text-gray-700">
//                     I agree to the{" "}
//                     <button
//                       type="button"
//                       onClick={() => setShowTermsModal(true)}
//                       className="text-blue-600 hover:underline font-medium"
//                     >
//                       Terms & Conditions
//                     </button>
//                     <span className="text-red-600">*</span>
//                   </span>
//                 </label>
//                 {errors.terms && <div className="text-red-500 text-xs mt-1" id="terms-error">{errors.terms}</div>}
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Signing Up..." : "Sign Up"}
//                 </button>
//               </div>
//             </form>

//             <p className="mt-4 text-sm text-center text-gray-600">
//               Are you a technician?{" "}
//               <a href="/signup/technician" className="text-blue-600 hover:underline font-medium">
//                 Sign Up here
//               </a>
//             </p>
//           </div>
//           <p className="mt-4 text-sm text-center text-gray-600">
//             Already Sign up?
//             <a href="/login/user" className="text-blue-600 hover:underline font-medium ms-1">
//               Sign In
//             </a>
//           </p>
//         </main>
//         {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
//       </>
//     );
//   }

//   return (
//     <>
//       <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-center">
//           <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
//             <img
//               src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//               alt="Prnv services Logo"
//               className="h-8 w-auto"
//             />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//             Sign Up as {defaultRole}
//           </h2>

//           <div className="mb-4">
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${(currentStep / steps.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           <h3 className="text-lg font-medium mb-4 text-center">
//             Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
//           </h3>

//           <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//             {errors.general && (
//               <div id="general" className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                 {errors.general}
//               </div>
//             )}

//             {currentStep === 1 && (
//               <>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={handleChange}
//                     {...nameInputProps}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.name && <div className="text-red-500 text-xs mt-1" id="name-error">{errors.name}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
//                     Phone Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="mobile"
//                     name="mobile"
//                     type="tel"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     {...phoneInputProps}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.mobile && <div className="text-red-500 text-xs mt-1" id="mobile-error">{errors.mobile}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       value={formData.password}
//                       onChange={handleChange}
//                       {...passwordInputProps}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                   </div>
//                   {errors.password && <div className="text-red-500 text-xs mt-1" id="password-error">{errors.password}</div>}
//                 </div>
//               </>
//             )}

//             {currentStep === 2 && (
//               <>
//                 <div>
//                   <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
//                     House/Building Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="buildingName"
//                     name="buildingName"
//                     type="text"
//                     value={formData.buildingName}
//                     onChange={handleChange}
//                     placeholder="Enter building name"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.buildingName && (
//                     <div className="text-red-500 text-xs mt-1" id="buildingName-error">
//                       {errors.buildingName}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
//                     Pincode <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="pincode"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select pincode</option>
//                     {pincodeData
//                       .sort((a: any, b: any) => Number(a.code) - Number(b.code))
//                       .map((p) => (
//                         <option key={p._id} value={p.code}>
//                           {p.code}
//                         </option>
//                       ))}
//                   </select>
//                   {errors.pincode && <div className="text-red-500 text-xs mt-1" id="pincode-error">{errors.pincode}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="areaName"
//                     name="areaName"
//                     value={formData.areaName}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select area</option>
//                     {areaOptions.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.areaName && <div className="text-red-500 text-xs mt-1" id="areaName-error">{errors.areaName}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="subAreaName" className="block text-sm font-medium text-gray-700">
//                     Sub Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="subAreaName"
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select sub area</option>
//                     {subAreaOptions
//                       .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                       .map((a) => (
//                         <option key={a._id} value={a.name}>
//                           {a.name}
//                         </option>
//                       ))}
//                   </select>
//                   {errors.subAreaName && (
//                     <div className="text-red-500 text-xs mt-1" id="subAreaName-error">
//                       {errors.subAreaName}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="city"
//                     name="city"
//                     type="text"
//                     value={formData.city}
//                     readOnly
//                     placeholder="Auto-filled"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                   />
//                   {errors.city && <div className="text-red-500 text-xs mt-1" id="city-error">{errors.city}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="state"
//                     name="state"
//                     type="text"
//                     value={formData.state}
//                     readOnly
//                     placeholder="Auto-filled"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                   />
//                   {errors.state && <div className="text-red-500 text-xs mt-1" id="state-error">{errors.state}</div>}
//                 </div>
//               </>
//             )}

//             {currentStep === 3 && (
//               <>
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                     Service Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     disabled={catLoading}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="" disabled>
//                       {catLoading ? "Loading categories..." : "Select a category"}
//                     </option>
//                     {apiCategories
//                       .sort((a, b) =>
//                         a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())
//                       )
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   {catError && <div className="text-red-500 text-xs mt-1">{catError}</div>}
//                   {errors.category && <div className="text-red-500 text-xs mt-1" id="category-error">{errors.category}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">
//                     Subscription Plan <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="subscriptionId"
//                     name="subscriptionId"
//                     value={formData.subscriptionId}
//                     onChange={handleChange}
//                     disabled={planLoading || subscriptionPlans.length === 0}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="" disabled>
//                       {planLoading
//                         ? "Loading plans..."
//                         : subscriptionPlans.length === 0
//                         ? "No plans available"
//                         : "Select a plan"}
//                     </option>
//                     {subscriptionPlans.map((plan) => (
//                       <option key={plan._id} value={plan._id}>
//                         {plan.name}
//                       </option>
//                     ))}
//                   </select>
//                   {planError && <div className="text-red-500 text-xs mt-1">{planError}</div>}
//                   {errors.subscriptionId && (
//                     <div className="text-red-500 text-xs mt-1" id="subscriptionId-error">
//                       {errors.subscriptionId}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {currentStep === 4 && (
//               <>
//                 <div>
//                   <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
//                     Profile Image <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="profileImage"
//                     name="profileImage"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.profileImage && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.profileImage.name}</p>
//                   )}
//                   {errors.profileImage && (
//                     <div className="text-red-500 text-xs mt-1" id="profileImage-error">
//                       {errors.profileImage}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="aadharFront" className="block text-sm font-medium text-gray-700">
//                     Aadhar Front <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="aadharFront"
//                     name="aadharFront"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("aadharFront", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.aadharFront && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharFront.name}</p>
//                   )}
//                   {errors.aadharFront && (
//                     <div className="text-red-500 text-xs mt-1" id="aadharFront-error">
//                       {errors.aadharFront}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="aadharBack" className="block text-sm font-medium text-gray-700">
//                     Aadhar Back <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="aadharBack"
//                     name="aadharBack"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("aadharBack", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.aadharBack && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharBack.name}</p>
//                   )}
//                   {errors.aadharBack && (
//                     <div className="text-red-500 text-xs mt-1" id="aadharBack-error">
//                       {errors.aadharBack}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="panCard" className="block text-sm font-medium text-gray-700">
//                     Pan Card (Pan or Voter required) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="panCard"
//                     name="panCard"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("panCard", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.panCard && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.panCard.name}</p>
//                   )}
//                   {errors.panCard && <div className="text-red-500 text-xs mt-1" id="panCard-error">{errors.panCard}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="voterCard" className="block text-sm font-medium text-gray-700">
//                     Voter Card (Alternative to Pan)
//                   </label>
//                   <input
//                     id="voterCard"
//                     name="voterCard"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("voterCard", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.voterCard && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.voterCard.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="authorizedPhone1" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 1 Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhone1"
//                     name="authorizedPhone1"
//                     type="tel"
//                     value={formData.authorizedPhone1}
//                     onChange={handleChange}
//                     {...phoneInputProps}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     placeholder="Enter 10-digit number"
//                   />
//                   {errors.authorizedPhone1 && (
//                     <div className="text-red-500 text-xs mt-1" id="authorizedPhone1-error">
//                       {errors.authorizedPhone1}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="authorizedPhoto1" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 1 Photo <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhoto1"
//                     name="authorizedPhoto1"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("auth1Photo", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.auth1Photo && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth1Photo.name}</p>
//                   )}
//                   {errors.auth1Photo && <div className="text-red-500 text-xs mt-1" id="auth1Photo-error">{errors.auth1Photo}</div>}
//                 </div>

//                 <div>
//                   <label htmlFor="authorizedPhone2" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 2 Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhone2"
//                     name="authorizedPhone2"
//                     type="tel"
//                     value={formData.authorizedPhone2}
//                     onChange={handleChange}
//                     {...phoneInputProps}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     placeholder="Enter 10-digit number"
//                   />
//                   {errors.authorizedPhone2 && (
//                     <div className="text-red-500 text-xs mt-1" id="authorizedPhone2-error">
//                       {errors.authorizedPhone2}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="authorizedPhoto2" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 2 Photo <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhoto2"
//                     name="authorizedPhoto2"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("auth2Photo", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.auth2Photo && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth2Photo.name}</p>
//                   )}
//                   {errors.auth2Photo && <div className="text-red-500 text-xs mt-1" id="auth2Photo-error">{errors.auth2Photo}</div>}
//                 </div>

//                 <div>
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={agreedToTerms}
//                       onChange={(e) => setAgreedToTerms(e.target.checked)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       required
//                     />
//                     <span className="text-sm text-gray-700">
//                       I agree to the{" "}
//                       <button
//                         type="button"
//                         onClick={() => setShowTermsModal(true)}
//                         className="text-blue-600 hover:underline font-medium"
//                       >
//                         Terms & Conditions
//                       </button>
//                       <span className="text-red-600">*</span>
//                     </span>
//                   </label>
//                   {errors.terms && <div className="text-red-500 text-xs mt-1" id="terms-error">{errors.terms}</div>}
//                 </div>
//               </>
//             )}

//             <div className="pt-4 flex space-x-2">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   disabled={loading}
//                   className="flex-1 bg-gray-500 text-white font-semibold py-2 px-1 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//               )}
//               {currentStep < steps.length ? (
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Signing Up..." : "Register Request"}
//                 </button>
//               )}
//             </div>
//           </form>

//           <p className="mt-4 text-sm text-center text-gray-600">
//             Are you a user?{" "}
//             <a href="/signup/user" className="text-blue-600 hover:underline font-medium">
//               Sign Up here
//             </a>
//           </p>
//         </div>

//         <p className="mt-4 text-sm text-center text-gray-600">
//           Already Sign up?
//           <a href="/login/technician" className="text-blue-600 hover:underline font-medium ms-1">
//             Sign In
//           </a>
//         </p>
//       </main>
//       {showTermsModal && 
//       <>
      
//       </>
//       }
//     </>
//   );
// };

// export default SignupForm;


// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   userRegister,
//   technicianRegister,
//   getAllCategories,
//   getAllPincodes,
//   getPlans,
// } from "../../api/apiMethods";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   status: number;
// }

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   originalPrice: number;
//   discount: string;
//   discountPercentage: number;
//   price: number;
//   gstPercentage: number;
//   gst: number;
//   finalPrice: number;
//   validity: number | null;
//   leads: number | null;
//   features: { name: string; included: boolean }[];
//   fullFeatures: { text: string }[];
//   isPopular: boolean;
//   isActive: boolean;
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   category: string;
//   subscriptionId: string;
//   profileImage: File | null;
//   aadharFront: File | null;
//   aadharBack: File | null;
//   panCard: File | null;
//   voterCard: File | null;
//   authorizedPhone1: string;
//   auth1Photo: File | null;
//   authorizedPhone2: string;
//   auth2Photo: File | null;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   category?: string;
//   subscriptionId?: string;
//   profileImage?: string;
//   aadharFront?: string;
//   aadharBack?: string;
//   panCard?: string;
//   voterCard?: string;
//   authorizedPhone1?: string;
//   auth1Photo?: string;
//   authorizedPhone2?: string;
//   auth2Photo?: string;
//   general?: string;
//   terms?: string;
// }

// interface SignupFormProps {
//   defaultRole: "user" | "technician";
// }

// const initialFormState: FormData = {
//   name: "",
//   mobile: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   category: "",
//   subscriptionId: "",
//   profileImage: null,
//   aadharFront: null,
//   aadharBack: null,
//   panCard: null,
//   voterCard: null,
//   authorizedPhone1: "",
//   auth1Photo: null,
//   authorizedPhone2: "",
//   auth2Photo: null,
// };

// const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiCategories, setApiCategories] = useState<Category[]>([]);
//   const [catLoading, setCatLoading] = useState<boolean>(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const [planLoading, setPlanLoading] = useState<boolean>(false);
//   const [planError, setPlanError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
//   const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

//   useEffect(() => {
//     if (defaultRole === "technician") {
//       setCatLoading(true);
//       getAllCategories(null)
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             setApiCategories(res.data);
//           } else {
//             setApiCategories([]);
//             setCatError("Failed to load categories");
//           }
//         })
//         .catch(() => {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         })
//         .finally(() => setCatLoading(false));

//       setPlanLoading(true);
//       getPlans({})
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             const freePlan = res.data.find((plan: SubscriptionPlan) => plan.name === "Free Plan");
//             if (freePlan) {
//               setSubscriptionPlans([freePlan]);
//               setFormData((prev) => ({ ...prev, subscriptionId: freePlan._id }));
//             } else {
//               setSubscriptionPlans([]);
//               setPlanError("Free Plan not available");
//             }
//           } else {
//             setSubscriptionPlans([]);
//             setPlanError("Failed to load subscription plans");
//           }
//         })
//         .catch(() => {
//           setSubscriptionPlans([]);
//           setPlanError("Failed to load subscription plans");
//         })
//         .finally(() => setPlanLoading(false));
//     }
//   }, [defaultRole]);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
//       if (found) {
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//         }));
//         setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
//       }
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === formData.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.mobile.match(/^[0-9]{10}$/))
//       newErrors.mobile = "Enter a valid 10-digit phone number";
//     if (formData.password.length < 6 || formData.password.length > 10)
//       newErrors.password = "Password must be 6-10 characters";
//     if (!formData.buildingName.trim())
//       newErrors.buildingName = "Building name is required";
//     if (!formData.areaName) newErrors.areaName = "Area is required";
//     if (!formData.city) newErrors.city = "City is required";
//     if (!formData.state) newErrors.state = "State is required";
//     if (!formData.pincode) newErrors.pincode = "Pincode is required";
//     if (defaultRole === "technician") {
//       if (!formData.category)
//         newErrors.category = "Service category is required";
//       if (!formData.subscriptionId)
//         newErrors.subscriptionId = "Subscription plan is required";
//       if (!formData.aadharFront || formData.aadharFront.size === 0)
//         newErrors.aadharFront = "Aadhar front image is required";
//       if (!formData.aadharBack || formData.aadharBack.size === 0)
//         newErrors.aadharBack = "Aadhar back image is required";
//       if (!formData.panCard && !formData.voterCard)
//         newErrors.panCard = "At least one of Pan Card or Voter Card is required";
//       if (!formData.authorizedPhone1.match(/^[0-9]{10}$/))
//         newErrors.authorizedPhone1 = "Enter a valid 10-digit phone for Authorized Person 1";
//       if (!formData.auth1Photo || formData.auth1Photo.size === 0)
//         newErrors.auth1Photo = "Photo for Authorized Person 1 is required";
//       if (!formData.authorizedPhone2.match(/^[0-9]{10}$/))
//         newErrors.authorizedPhone2 = "Enter a valid 10-digit phone for Authorized Person 2";
//       if (!formData.auth2Photo || formData.auth2Photo.size === 0)
//         newErrors.auth2Photo = "Photo for Authorized Person 2 is required";
//     }
//     if (!agreedToTerms) newErrors.terms = "You must agree to the Terms & Conditions";

//     return newErrors;
//   }, [formData, defaultRole, agreedToTerms]);

//   const validateCurrentStep = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};
//     switch (currentStep) {
//       case 1:
//         if (!formData.name.trim()) newErrors.name = "Name is required";
//         if (!formData.mobile.match(/^[0-9]{10}$/))
//           newErrors.mobile = "Enter a valid 10-digit phone number";
//         if (formData.password.length < 6 || formData.password.length > 10)
//           newErrors.password = "Password must be 6-10 characters";
//         break;
//       case 2:
//         if (!formData.buildingName.trim())
//           newErrors.buildingName = "Building name is required";
//         if (!formData.pincode) newErrors.pincode = "Pincode is required";
//         if (!formData.areaName) newErrors.areaName = "Area is required";
//         if (!formData.city) newErrors.city = "City is required";
//         if (!formData.state) newErrors.state = "State is required";
//         break;
//       case 3:
//         if (!formData.category)
//           newErrors.category = "Service category is required";
//         if (!formData.subscriptionId)
//           newErrors.subscriptionId = "Subscription plan is required";
//         break;
//       case 4:
//         if (!formData.aadharFront || formData.aadharFront.size === 0)
//           newErrors.aadharFront = "Aadhar front image is required";
//         if (!formData.aadharBack || formData.aadharBack.size === 0)
//           newErrors.aadharBack = "Aadhar back image is required";
//         if (!formData.panCard && !formData.voterCard)
//           newErrors.panCard = "At least one of Pan Card or Voter Card is required";
//         if (!formData.authorizedPhone1.match(/^[0-9]{10}$/))
//           newErrors.authorizedPhone1 = "Enter a valid 10-digit phone for Authorized Person 1";
//         if (!formData.auth1Photo || formData.auth1Photo.size === 0)
//           newErrors.auth1Photo = "Photo for Authorized Person 1 is required";
//         if (!formData.authorizedPhone2.match(/^[0-9]{10}$/))
//           newErrors.authorizedPhone2 = "Enter a valid 10-digit phone for Authorized Person 2";
//         if (!formData.auth2Photo || formData.auth2Photo.size === 0)
//           newErrors.auth2Photo = "Photo for Authorized Person 2 is required";
//         if (!agreedToTerms) newErrors.terms = "You must agree to the Terms & Conditions";
//         break;
//     }
//     return newErrors;
//   }, [formData, currentStep, defaultRole, agreedToTerms]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleFileChange = useCallback((name: keyof FormData, file: File | null) => {
//     setFormData((prev) => ({ ...prev, [name]: file }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const nextStep = useCallback(() => {
//     const stepErrors = validateCurrentStep();
//     setErrors(stepErrors);
//     if (Object.keys(stepErrors).length === 0) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   }, [validateCurrentStep]);

//   const prevStep = useCallback(() => {
//     setCurrentStep((prev) => prev - 1);
//   }, []);

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       const formErrors = validateForm();

//       if (Object.keys(formErrors).length > 0) {
//         setErrors(formErrors);
//         return;
//       }

//       setLoading(true);

//       try {
//         let response;
//         if (defaultRole === "user") {
//           const basePayload = {
//             username: formData.name,
//             phoneNumber: formData.mobile,
//             password: formData.password,
//             buildingName: formData.buildingName,
//             areaName: formData.areaName,
//             subAreaName: formData.subAreaName || "-",
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//           };
//           response = await userRegister(basePayload);
//         } else {
//           const fd = new FormData();
//           fd.append("username", formData.name);
//           fd.append("phoneNumber", formData.mobile);
//           fd.append("password", formData.password);
//           fd.append("buildingName", formData.buildingName);
//           fd.append("areaName", formData.areaName);
//           fd.append("subAreaName", formData.subAreaName || "-");
//           fd.append("city", formData.city);
//           fd.append("state", formData.state);
//           fd.append("pincode", formData.pincode);
//           fd.append("category", formData.category);
//           fd.append("subscriptionId", formData.subscriptionId);
//           if (formData.profileImage) fd.append("profileImage", formData.profileImage);
//           if (formData.aadharFront) fd.append("aadharFront", formData.aadharFront);
//           if (formData.aadharBack) fd.append("aadharBack", formData.aadharBack);
//           if (formData.panCard) fd.append("panCard", formData.panCard);
//           if (formData.voterCard) fd.append("voterCard", formData.voterCard);
//           fd.append("authorizedPersons[0][phone]", formData.authorizedPhone1);
//           if (formData.auth1Photo) fd.append("auth1Photo", formData.auth1Photo);
//           fd.append("authorizedPersons[1][phone]", formData.authorizedPhone2);
//           if (formData.auth2Photo) fd.append("auth2Photo", formData.auth2Photo);
//           response = await technicianRegister(fd);
//         }

//         if (response.success) {
//           if(defaultRole === "technician"){
//             alert('Thank you for registering. Once your account is verified, you will receive access to log in.');
//           }
//           navigate(`/login/${defaultRole}`);
//         }
//       } catch (err: any) {
//         setErrors({
//           ...errors,
//           general:
//             err?.data?.error?.[0] || "Registration failed. Please try again.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, defaultRole, navigate, errors, validateForm]
//   );

//   const TermsModalContent = () => {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="container max-w-2xl mx-auto px-4 py-8">
          
//           <div className="bg-white rounded-lg shadow-sm border p-8">
//             <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
//               <p className="text-sm text-gray-600 mb-6">
//                 <strong>Last updated:</strong> February 07, 2023
//               </p>
              
//               <p>Welcome to PRNV Services!</p>
              
//               <p>
//                 These terms and conditions outline the rules and regulations for using the PRNV Services Website, located at www.prnvservices.com. We assume that you accept these terms and conditions by accessing this website. Do not continue to use PRNV Services if you do not agree to take all of the terms and conditions stated on this page.
//               </p>

//               <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
//                 <p className="text-base">
//                   The following terminology applies to these Terms & Conditions and Disclaimer Notice and all Agreements: "Customer", "User", "You" and "Your" refers to you, the person who log on this Website and is compliant to the company's terms and conditions. "The Company", "Ourselves", "We" and "Our" refers to our company. "Professionals" (Technician/Service Providers) refers to all the technician's offering services. All terms refer to the offering, acceptance, and payment terms required to start the action of our assistance to you in the most effective manner to satisfy your demands for the provision of the company's stated services in line with and subject to the applicable law of India. Any usage of the terminology mentioned above or other words in the singular, plural, he/she, or they format is understood to be interchangeable and to be referring to the same. So, please read the terms and conditions carefully before availing of services or registering yourself as a professional (technician, service provider) on this Website.
//                 </p>
//               </div>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Changes</h2>
//               <p>
//                 The terms & conditions might change, modify, add, or remove from time to time without any notice. So, it is your responsibility to check for any changes in terms & conditions periodically to be aware of them and ensure that you follow them. By continuing to access or use our site, you agree to be bound by any such revisions and should, therefore, periodically visit this page to review the current Terms & Conditions for both customer & professional (technician/service provider).
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Cookies</h2>
//               <p>
//                 We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the choice of allowing or disallowing optional Cookies. For the proper operation of our Website, a few Cookies are required. Since they always function, these cookies don't need your permission. Please be aware that by allowing necessary Cookies, you also accept third-party Cookies that might be used in conjunction with third-party services that you use on our website, such as a video display window offered by third parties and integrated into our website.
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Terms for Customer:</h2>
//               <div className="space-y-4">
//                 <p>
//                   Your name, phone number, email address, and other personal information will be collected during the Account registration process and while using the PRNV Services website. We collect your login credentials for our website when you directly register yourself as a customer using your Gmail account. When you make a booking for the service on our website, you can provide us with your postal address, phone number, area code, and other contact information. This data will assist us in compiling and providing a list of professionals (technicians/service providers) in your area. We may collect this personal information when you post a comment or provide ratings and reviews on the professional (technician/service provider) profile. We also may collect any conversations you have with us through our blogs, chat boxes, or other message boards on the Website and any comments you make when resolving a dispute with another user of the Website or mobile application.
//                 </p>
                
//                 <div className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="font-semibold text-gray-800 mb-3">Note:</h3>
//                   <ol className="list-decimal list-inside space-y-2 text-sm">
//                     <li>PRNV Services is not involved in any payment between the customer and professional (technician/service provider).</li>
//                     <li>Customer should make payment to the professional (technician/service provider) after work is done.</li>
//                     <li>After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the service profile page. These details will be tracked for different processes like providing 1 week of work guarantee.</li>
//                     <li>The amount paid to a professional (technician/service provider) after work is not refundable.</li>
//                     <li>To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.</li>
//                     <li>Customers don't have to pay GST, as most professionals (technicians/service providers) are under the GST limit.</li>
//                     <li>Customers don't have to pay commissions to the company because PRNV Services follows the principle of No Middlemen – No Commissions.</li>
//                     <li>Customers can choose, contact and fix the timing with the professional (technician/service provider).</li>
//                     <li>Customers will get the lowest price in the market because of the offers & internal competition among professionals (technicians/service providers).</li>
//                     <li>Customers have a weapon of rating & reviews. To achieve this, the professional (technician/service provider) will work politely and professionally by giving his 100% effort.</li>
//                     <li>Customers don't have to pay GST, as most professionals (technicians/service providers) are under the GST limit.</li>
//                     <li>Customers can hire the same professionals (technicians/service providers) several times.</li>
//                     <li>The company won't take any commission for any booking done through PRNV Services from the customer.</li>
//                     <li>For Guest booking, the customer has to provide their name, phone number, pin code, work list category, and other details as required.</li>
//                   </ol>
//                 </div>
//               </div>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Professional (Technician/Service Provider):</h2>
//               <div className="space-y-4">
//                 <p>
//                   We will collect your business name, phone number, permanent and current address, pin code, a description of your services, languages known, first and last name, and email address during the Account registration process. You may also have to submit other information required to be provided to PRNV Services for this registration process. This registration form and document submission may change from time to time for the security and safety of the professional (technician/service provider) and PRNV Services. You can post a short description of your work, work photos, and more on your profile page. We may also request payment information from you, such as credit/debit card, gpay, or other card information. PRNV Services will also keep track of your work earnings to help you improve your services.
//                 </p>

//                 <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Background Verification:</h3>
//                 <p>
//                   The professional (technician/service provider) acknowledges that the company may conduct background checks on the professional (technician/service provider) as part of the onboarding process in order to authenticate, among other things, the authenticity and competency of the professional (technician/service provider). They expressly agree to and acknowledge the following in light of those mentioned above:
//                 </p>
//                 <p>
//                   The professional (technician/service provider) has no objections to PRNV Services sharing their personal information with the customer who is booking their services, including name, mobile number, and other details.
//                 </p>
//                 <p>
//                   The professional (technician/service provider) acknowledges that the digital record of the proprietary information shall be accessible to PRNV Services.
//                 </p>
//                 <p>
//                   The professional (technician/service provider) acknowledges that if they wish to edit and delete their digital record, they can do so under the guidance of PRNV Services. All this edited and old data will be stored as backup data with PRNV Services for future processes.
//                 </p>
//                 <p>
//                   PRNV Services reserves the right to, at its sole discretion, take appropriate action in response to the findings of the background investigation and verification.
//                 </p>
//                 <p>
//                   We may also request and gather additional information from third parties if we determine it is necessary, in our sole and absolute discretion, such as information to verify any identification details you provide during registration or information about your credit from a credit bureau (to the extent permitted by law).
//                 </p>

//                 <div className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="font-semibold text-gray-800 mb-3">Note:</h3>
//                   <ol className="list-decimal list-inside space-y-2 text-sm">
//                     <li>We don't guarantee to provide leads to any professional (technician/service provider), as PRNV Services is purely an advertisement company.</li>
//                     <li>We don't take any commission from the professional (technician/service provider) except for the monthly fee.</li>
//                     <li>PRNV Services will only advertise and boost your professional profile page.</li>
//                     <li>We won't be involved in the conversation between the professional (technician/service provider) & customer.</li>
//                     <li>The professional (technician/service provider) is entirely responsible for any damage during the work. PRNV Services do not take any responsibility for it. PRNV Services do not accept any responsibility for compensation.</li>
//                     <li>The professional (technician/service provider) should give a one-week work guarantee to the customer after the work is done.</li>
//                     <li>After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the professional (technician/service provider) page. These details will be tracked for different processes like providing 1 week of work guarantee.</li>
//                     <li>To get compensation from the professional (technician/service provider) for any damage during work as per the agreement with PRNV Services, the customer should mention the total work amount accepted, work started, work completed, the total amount paid, rating & reviews.</li>
//                     <li>Individual professionals (technicians/service providers) are responsible for GST according to the applicable government rules.</li>
//                     <li>The professional (technician/service provider) profile in the searched category will be displayed based on seniority, like first come, first serve. professionals (technicians/service providers) will lose the seniority benefits if they fail to renew on time.</li>
//                     <li>PRNV services will not provide work training to the professional (technician/service provider) in their related field. But PRNV will provide operational (computer) knowledge.</li>
//                     <li>The professional (technician/service provider) is responsible for submitting the government-verified documents and 2 mobile referral numbers for the authentication, including the team documents. That would be Aadhar Card, Pan Card, and others. The account will be activated within 24 hours.</li>
//                     <li>Professionals (Technicians/Service Providers) have to renew the plan in 30 days. On failing, the profile will not be accessible to the customers. And the next renewal amount may change according to the fares of that time.</li>
//                     <li>Professionals (Technicians/Service Providers) can change the plan only after the completion of an ongoing plan for 30 days. And the base fare may vary according to the new plan you choose.</li>
//                     <li>Professionals (Technicians/Service Providers) have full access to the profile page to make necessary changes.</li>
//                     <li>Professionals (Technicians/Service Providers) can change the pin code during the Time of renewal. He can't change the pincode in the ongoing plan.</li>
//                     <li>Professionals (Technicians/Service Providers) best work videos will be shown on our youtube channel to boost their business.</li>
//                     <li>Professionals (Technicians/Service Providers) have the freedom to discuss the work details with customers and fix the time of service.</li>
//                     <li>Professionals (Technicians/Service Providers) can offer better discounts than other professionals (technicians/service providers) to get the best business.</li>
//                     <li>Professionals (Technicians/Service Providers) can get the total work amount on the spot without any deductions. In other companies, the professional (technician/service provider) will get the payment for work done after 15 - 30 days with TDS & other deductions.</li>
//                     <li>Professionals (Technicians/Service Providers) can independently operate their availability ON/OFF mode for the work.</li>
//                     <li>Professionals (Technicians/Service Providers) can boost their profile by sharing with customers & people in their circle. With this, the professional (technician/service provider) will get their customers and people from other professionals (technicians/service providers) referrals too.</li>
//                     <li>The best work videos of professional (technician/service provider) will be shared on our Youtube channel.</li>
//                   </ol>
//                 </div>
//               </div>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">License:</h2>
//               <p>
//                 Unless otherwise specified, the intellectual property rights of all of the content on PRNV Services belong to PRNV Services and/or its licensors. All rights to intellectual property are reserved. In accordance with the limitations set forth in these terms and conditions, you may access material from PRNV Services for personal use.
//               </p>
//               <p>You must not:</p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>Copy or republish PRNV Services materials.</li>
//                 <li>Sell, rent, or sub-license PRNV Services material.</li>
//                 <li>Reproduce, duplicate, or copy PRNV Services materials.</li>
//                 <li>Republish PRNV Services content.</li>
//               </ol>
//               <p>
//                 This Agreement shall begin on the 7th of February, 2023. Certain sections of this Website allow users to post and exchange opinions and information. PRNV Services does not filter, edit, publish, or review comments before their presence on the Website. Comments do not reflect the views and opinions of PRNV Services, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, PRNV Services shall not be liable for the Comments or any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this Website.
//               </p>
//               <p>
//                 PRNV Services reserves the right to monitor all comments and remove any comments that can be considered inappropriate, offensive, or causes a breach of these Terms and Conditions.
//               </p>
//               <p>You warrant and represent that:</p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>You are entitled to post the comments on our website and have all necessary licenses and consents.</li>
//                 <li>The comments do not invade any intellectual property right, including, without limitation, copyright, patent, or trademark of any third party.</li>
//                 <li>The comments do not contain defamatory, libellous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy.</li>
//                 <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
//               </ol>
//               <p>
//                 You now grant PRNV Services a non-exclusive license to use, reproduce, edit, and authorize others to use, reproduce and edit any of your Comments in any form, format, or media.
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Hyperlinking to our Content:</h2>
//               <p>
//                 The following organizations may link to our website without prior written approval:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>Government agencies;</li>
//                 <li>Search engines;</li>
//                 <li>News organizations;</li>
//                 <li>Online directory distributors may link to our website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
//                 <li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups, which may not hyperlink to our Web site.</li>
//               </ol>
//               <p>
//                 These organizations may link to our home page, to publications, or other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
//               </p>
//               <p>
//                 We may consider and approve other link requests from the following types of organizations:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>commonly-known consumer and/or business information sources;</li>
//                 <li>dot.com community sites;</li>
//                 <li>associations or other groups representing charities;</li>
//                 <li>online directory distributors;</li>
//                 <li>internet portals;</li>
//                 <li>accounting, law, and consulting firms; and</li>
//                 <li>educational institutions and trade associations.</li>
//               </ol>
//               <p>
//                 We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavourably to ourselves or our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of PRNV Services; and (d) the link is in the context of general resource information.
//               </p>
//               <p>
//                 These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
//               </p>
//               <p>
//                 If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to PRNV Services. Please include your name, your organization name, and contact information as well as the URL of your site, a list of any URLs from which you intend to link to our website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
//               </p>
//               <p>Approved organizations may hyperlink to our website as follows:</p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>By use of our corporate name; or</li>
//                 <li>By use of the uniform resource locator being linked to; or</li>
//                 <li>Using any other description of our website being linked to that makes sense within the context and format of content on the linking party's site.</li>
//                 <li>No use of PRNV Services' logo or other artwork will be allowed for linking absent a trademark license agreement.</li>
//               </ol>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Content Liability:</h2>
//               <p>
//                 We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libellous, obscene, or criminal or which infringes, otherwise violates, or advocates the infringement or other violation of any third-party rights.
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Reservation of Rights:</h2>
//               <p>
//                 We reserve the right to request that you remove all links or any particular link to our website. You approve of immediately removing all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our website, you agree to be bound to and follow these linking terms and conditions.
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Removal of links from our website:</h2>
//               <p>
//                 If you find any link on our website offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to or so or to respond to you directly.
//               </p>
//               <p>
//                 We do not ensure that the information on this Website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the Website remains available or that the material on the Website is kept up to date.
//               </p>

//               <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Disclaimer:</h2>
//               <p>
//                 To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this Website. Nothing in this disclaimer will:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 ml-5">
//                 <li>limit or exclude our or your liability for death or personal injury;</li>
//                 <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
//                 <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
//                 <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
//               </ol>
//               <p>
//                 The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
//               </p>
//               <p>
//                 As long as the Website and the information and services on the Website are provided free of charge, we will not be liable for any loss or damage of any nature.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const TermsModal = () => {
//     if (!showTermsModal) return null;
//     return (
//       <>
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 " >
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto relative ">
//             <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
//               <h2 className="text-xl font-bold">Terms & Conditions</h2>
//               <button
//                 onClick={() => setShowTermsModal(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-4">
//               <TermsModalContent />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   if (defaultRole === "user") {
//     return (
//       <>
//         <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center">
//             <div className="bg-blue-900 rounded w-fit flex">
//               <img
//                 src="https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png"
//                 alt="Prnv services Logo"
//                 className="h-10 w-auto rounded-sm"
//               />
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//             <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//               Sign Up as {defaultRole}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {errors.general && (
//                 <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                   {errors.general}
//                 </div>
//               )}

//               {[
//                 { id: "name", label: "Name", type: "text" },
//                 { id: "mobile", label: "Phone Number", type: "tel" },
//                 { id: "password", label: "Password", type: "password" },
//                 { id: "buildingName", label: "House/Building Name", type: "text" },
//                 { id: "pincode", label: "Pincode", type: "text" },
//                 { id: "areaName", label: "Area Name", type: "text" },
//                 {
//                   id: "subAreaName",
//                   label: "Sub Area",
//                   type: "text",
//                   required: false,
//                 },
//                 { id: "city", label: "City", type: "text" },
//                 { id: "state", label: "State", type: "text" },
//               ].map(({ id, label, type, required = true }) => (
//                 <div key={id}>
//                   <label
//                     htmlFor={id}
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     {label} {required && <span className="text-red-600">*</span>}
//                   </label>
//                   {id === "password" ? (
//                     <div className="relative">
//                       <input
//                         id={id}
//                         name={id}
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password (6-10 characters)"
//                         required={required}
//                         value={formData[id as keyof FormData]}
//                         onChange={handleChange}
//                         minLength={6}
//                         maxLength={10}
//                         className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                       />
//                       <span
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                         onClick={() => setShowPassword((prev) => !prev)}
//                       >
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                       </span>
//                     </div>
//                   ) : id === "pincode" ? (
//                     <select
//                       id={id}
//                       name={id}
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       required={required}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     >
//                       <option value="">Select Pincode</option>
//                       {pincodeData
//                         .sort((a: any, b: any) => a.code - b.code)
//                         .map((p) => (
//                           <option key={p._id} value={p.code}>
//                             {p.code}
//                           </option>
//                         ))}
//                     </select>
//                   ) : id === "areaName" ? (
//                     <select
//                       id={id}
//                       name={id}
//                       value={formData.areaName}
//                       onChange={handleChange}
//                       required={required}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     >
//                       <option value="">Select Area</option>
//                       {areaOptions.map((a) => (
//                         <option key={a._id} value={a.name}>
//                           {a.name}
//                         </option>
//                       ))}
//                     </select>
//                   ) : id === "subAreaName" ? (
//                     <select
//                       id={id}
//                       name={id}
//                       value={formData.subAreaName}
//                       onChange={handleChange}
//                       required={required}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     >
//                       <option value="">Select Sub Area</option>
//                       {subAreaOptions
//                         .sort((a, b) =>
//                           a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//                         )
//                         .map((a) => (
//                           <option key={a._id} value={a.name}>
//                             {a.name}
//                           </option>
//                         ))}
//                     </select>
//                   ) : id === "city" || id === "state" ? (
//                     <input
//                       id={id}
//                       name={id}
//                       type="text"
//                       value={formData[id as keyof FormData] || ""}
//                       readOnly
//                       required={required}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                     />
//                   ) : (
//                     <input
//                       id={id}
//                       name={id}
//                       type={type}
//                       placeholder={label}
//                       required={required}
//                       value={formData[id as keyof FormData]}
//                       onChange={handleChange}
//                       maxLength={id === "mobile" ? 10 : 100}
//                       pattern={id === "mobile" ? "[0-9]{10}" : undefined}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     />
//                   )}
//                   {errors[id as keyof FormErrors] && (
//                     <div className="text-red-500 text-xs mt-1">{errors[id as keyof FormErrors]}</div>
//                   )}
//                 </div>
//               ))}

//               <div>
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={agreedToTerms}
//                     onChange={(e) => setAgreedToTerms(e.target.checked)}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     required
//                   />
//                   <span className="text-sm text-gray-700">
//                     I agree to the{" "}
//                     <button
//                       type="button"
//                       onClick={() => setShowTermsModal(true)}
//                       className="text-blue-600 hover:underline font-medium"
//                     >
//                       Terms & Conditions
//                     </button>
//                     <span className="text-red-600">*</span>
//                   </span>
//                 </label>
//                 {errors.terms && <div className="text-red-500 text-xs mt-1">{errors.terms}</div>}
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Signing Up..." : "Sign Up"}
//                 </button>
//               </div>
//             </form>

//             <p className="mt-4 text-sm text-center text-gray-600">
//               Are you a technician?{" "}
//               <a
//                 href="/signup/technician"
//                 className="text-blue-600 hover:underline font-medium"
//               >
//                 Sign Up here
//               </a>
//             </p>
//           </div>
//           <p className="mt-4 text-sm text-center text-gray-600">
//             Already Sign up?
//             <a
//               href="/login/user"
//               className="text-blue-600 hover:underline font-medium ms-1"
//             >
//               Sign In
//             </a>
//           </p>
//         </main>
//         <TermsModal />
//       </>
//     );
//   }

//   // Technician multi-step form
//   return (
//     <>
//       <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-center">
//           <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
//             <img
//               src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//               alt="Prnv services Logo"
//               className="h-8 w-auto"
//             />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//             Sign Up as {defaultRole}
//           </h2>

//           <div className="mb-4">
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${(currentStep / steps.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           <h3 className="text-lg font-medium mb-4 text-center">
//             Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
//           </h3>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {errors.general && (
//               <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//                 {errors.general}
//               </div>
//             )}

//             {currentStep === 1 && (
//               <>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
//                     Phone Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="mobile"
//                     name="mobile"
//                     type="tel"
//                     required
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     maxLength={10}
//                     pattern="[0-9]{10}"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.mobile && <div className="text-red-500 text-xs mt-1">{errors.mobile}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password (6-10 characters)"
//                       required
//                       value={formData.password}
//                       onChange={handleChange}
//                       minLength={6}
//                       maxLength={10}
//                       className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                     />
//                     <span
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                   </div>
//                   {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
//                 </div>
//               </>
//             )}

//             {currentStep === 2 && (
//               <>
//                 <div>
//                   <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
//                     House/Building Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="buildingName"
//                     name="buildingName"
//                     type="text"
//                     required
//                     value={formData.buildingName}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {errors.buildingName && <div className="text-red-500 text-xs mt-1">{errors.buildingName}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
//                     Pincode <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="pincode"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select Pincode</option>
//                     {pincodeData
//                       .sort((a: any, b: any) => a.code - b.code)
//                       .map((p) => (
//                         <option key={p._id} value={p.code}>
//                           {p.code}
//                         </option>
//                       ))}
//                   </select>
//                   {errors.pincode && <div className="text-red-500 text-xs mt-1">{errors.pincode}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
//                     Area Name <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="areaName"
//                     name="areaName"
//                     value={formData.areaName}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select Area</option>
//                     {areaOptions.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.areaName && <div className="text-red-500 text-xs mt-1">{errors.areaName}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="subAreaName" className="block text-sm font-medium text-gray-700">
//                     Sub Area
//                   </label>
//                   <select
//                     id="subAreaName"
//                     name="subAreaName"
//                     value={formData.subAreaName}
//                     onChange={handleChange}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="">Select Sub Area (Optional)</option>
//                     {subAreaOptions
//                       .sort((a, b) =>
//                         a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//                       )
//                       .map((a) => (
//                         <option key={a._id} value={a.name}>
//                           {a.name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="city"
//                     name="city"
//                     type="text"
//                     value={formData.city}
//                     readOnly
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                   />
//                   {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="state"
//                     name="state"
//                     type="text"
//                     value={formData.state}
//                     readOnly
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
//                   />
//                   {errors.state && <div className="text-red-500 text-xs mt-1">{errors.state}</div>}
//                 </div>
//               </>
//             )}

//             {currentStep === 3 && (
//               <>
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                     Service Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     disabled={catLoading}
//                   >
//                     <option value="" disabled>
//                       {catLoading ? "Loading categories..." : "Select a category"}
//                     </option>
//                     {apiCategories
//                       .sort((a, b) =>
//                         a.category_name
//                           .toLowerCase()
//                           .localeCompare(b.category_name.toLowerCase())
//                       )
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   {catError && (
//                     <div className="text-red-500 text-xs mt-1">{catError}</div>
//                   )}
//                   {errors.category && (
//                     <div className="text-red-500 text-xs mt-1">
//                       {errors.category}
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="subscriptionId"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Subscription Plan <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="subscriptionId"
//                     name="subscriptionId"
//                     value={formData.subscriptionId}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     disabled={planLoading || subscriptionPlans.length === 0}
//                   >
//                     <option value="" disabled>
//                       {planLoading
//                         ? "Loading plans..."
//                         : subscriptionPlans.length === 0
//                         ? "No plans available"
//                         : "Select a plan"}
//                     </option>
//                     {subscriptionPlans.map((plan) => (
//                       <option key={plan._id} value={plan._id}>
//                         {plan.name}
//                       </option>
//                     ))}
//                   </select>
//                   {planError && (
//                     <div className="text-red-500 text-xs mt-1">{planError}</div>
//                   )}
//                   {errors.subscriptionId && (
//                     <div className="text-red-500 text-xs mt-1">
//                       {errors.subscriptionId}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {currentStep === 4 && (
//               <>
//                 <div>
//                   <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
//                     Profile Image (Optional)
//                   </label>
//                   <input
//                     id="profileImage"
//                     name="profileImage"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("profileImage", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.profileImage && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.profileImage.name}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="aadharFront" className="block text-sm font-medium text-gray-700">
//                     Aadhar Front <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="aadharFront"
//                     name="aadharFront"
//                     type="file"
//                     accept="image/*"
//                     required
//                     onChange={(e) => handleFileChange("aadharFront", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.aadharFront && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharFront.name}</p>
//                   )}
//                   {errors.aadharFront && <div className="text-red-500 text-xs mt-1">{errors.aadharFront}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="aadharBack" className="block text-sm font-medium text-gray-700">
//                     Aadhar Back <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="aadharBack"
//                     name="aadharBack"
//                     type="file"
//                     accept="image/*"
//                     required
//                     onChange={(e) => handleFileChange("aadharBack", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.aadharBack && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharBack.name}</p>
//                   )}
//                   {errors.aadharBack && <div className="text-red-500 text-xs mt-1">{errors.aadharBack}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="panCard" className="block text-sm font-medium text-gray-700">
//                     Pan Card (At least one of Pan or Voter Card required) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="panCard"
//                     name="panCard"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("panCard", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.panCard && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.panCard.name}</p>
//                   )}
//                   {errors.panCard && <div className="text-red-500 text-xs mt-1">{errors.panCard}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="voterCard" className="block text-sm font-medium text-gray-700">
//                     Voter Card (Alternative to Pan Card)
//                   </label>
//                   <input
//                     id="voterCard"
//                     name="voterCard"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileChange("voterCard", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.voterCard && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.voterCard.name}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="authorizedPhone1" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 1 Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhone1"
//                     name="authorizedPhone1"
//                     type="tel"
//                     value={formData.authorizedPhone1}
//                     onChange={handleChange}
//                     maxLength={10}
//                     pattern="[0-9]{10}"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     placeholder="10-digit phone"
//                   />
//                   {errors.authorizedPhone1 && <div className="text-red-500 text-xs mt-1">{errors.authorizedPhone1}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="authorizedPhoto1" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 1 Photo <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhoto1"
//                     name="authorizedPhoto1"
//                     type="file"
//                     accept="image/*"
//                     required
//                     onChange={(e) => handleFileChange("auth1Photo", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.auth1Photo && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth1Photo.name}</p>
//                   )}
//                   {errors.auth1Photo && <div className="text-red-500 text-xs mt-1">{errors.auth1Photo}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="authorizedPhone2" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 2 Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhone2"
//                     name="authorizedPhone2"
//                     type="tel"
//                     value={formData.authorizedPhone2}
//                     onChange={handleChange}
//                     maxLength={10}
//                     pattern="[0-9]{10}"
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                     placeholder="10-digit phone"
//                   />
//                   {errors.authorizedPhone2 && <div className="text-red-500 text-xs mt-1">{errors.authorizedPhone2}</div>}
//                 </div>
//                 <div>
//                   <label htmlFor="authorizedPhoto2" className="block text-sm font-medium text-gray-700">
//                     Authorized Person 2 Photo <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="authorizedPhoto2"
//                     name="authorizedPhoto2"
//                     type="file"
//                     accept="image/*"
//                     required
//                     onChange={(e) => handleFileChange("auth2Photo", e.target.files?.[0] || null)}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   />
//                   {formData.auth2Photo && (
//                     <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth2Photo.name}</p>
//                   )}
//                   {errors.auth2Photo && <div className="text-red-500 text-xs mt-1">{errors.auth2Photo}</div>}
//                 </div>
//                 <div>
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={agreedToTerms}
//                       onChange={(e) => setAgreedToTerms(e.target.checked)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       required
//                     />
//                     <span className="text-sm text-gray-700">
//                       I agree to the{" "}
//                       <button
//                         type="button"
//                         onClick={() => setShowTermsModal(true)}
//                         className="text-blue-600 hover:underline font-medium"
//                       >
//                         Terms & Conditions
//                       </button>
//                       <span className="text-red-600">*</span>
//                     </span>
//                   </label>
//                   {errors.terms && <div className="text-red-500 text-xs mt-1">{errors.terms}</div>}
//                 </div>
//               </>
//             )}

//             <div className="pt-4 flex space-x-2">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   disabled={loading}
//                   className="flex-1 bg-gray-500 text-white font-semibold py-2 px-1 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//               )}
//               {currentStep < steps.length ? (
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Signing Up..." : defaultRole === "technician" ? "Register Request" : "Sign Up"}
//                 </button>
//               )}
//             </div>
//           </form>

//           <p className="mt-4 text-sm text-center text-gray-600">
//             Are you a user?{" "}
//             <a
//               href="/signup/user"
//               className="text-blue-600 hover:underline font-medium"
//             >
//               Sign Up here
//             </a>
//           </p>
//         </div>
//         <p className="mt-4 text-sm text-center text-gray-600">
//           Already Sign up?
//           <a
//             href="/login/technician"
//             className="text-blue-600 hover:underline font-medium ms-1"
//           >
//             Sign In
//           </a>
//         </p>
//       </main>
//       <TermsModal />
//     </>
//   );
// };

// export default SignupForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   userRegister,
//   technicianRegister,
//   getAllCategories,
//   getAllPincodes,
//   getPlans,
// } from "../../api/apiMethods";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   status: number;
// }

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   originalPrice: number;
//   discount: string;
//   discountPercentage: number;
//   price: number;
//   gstPercentage: number;
//   gst: number;
//   finalPrice: number;
//   validity: number | null;
//   leads: number | null;
//   features: { name: string; included: boolean }[];
//   fullFeatures: { text: string }[];
//   isPopular: boolean;
//   isActive: boolean;
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   category: string;
//   subscriptionId: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   category?: string;
//   subscriptionId?: string;
// }

// interface SignupFormProps {
//   defaultRole: "user" | "technician";
// }

// const initialFormState: FormData = {
//   name: "",
//   mobile: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   category: "",
//   subscriptionId: "",
// };

// const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiCategories, setApiCategories] = useState<Category[]>([]);
//   const [catLoading, setCatLoading] = useState<boolean>(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
//   const [planLoading, setPlanLoading] = useState<boolean>(false);
//   const [planError, setPlanError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (defaultRole === "technician") {
//       setCatLoading(true);
//       getAllCategories(null)
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             setApiCategories(res.data);
//           } else {
//             setApiCategories([]);
//             setCatError("Failed to load categories");
//           }
//         })
//         .catch(() => {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         })
//         .finally(() => setCatLoading(false));

//       setPlanLoading(true);
//       getPlans()
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             const freePlan = res.data.find((plan: SubscriptionPlan) => plan.name === "Free Plan");
//             if (freePlan) {
//               setSubscriptionPlans([freePlan]);
//               setFormData((prev) => ({ ...prev, subscriptionId: freePlan._id }));
//             } else {
//               setSubscriptionPlans([]);
//               setPlanError("Free Plan not available");
//             }
//           } else {
//             setSubscriptionPlans([]);
//             setPlanError("Failed to load subscription plans");
//           }
//         })
//         .catch(() => {
//           setSubscriptionPlans([]);
//           setPlanError("Failed to load subscription plans");
//         })
//         .finally(() => setPlanLoading(false));
//     }
//   }, [defaultRole]);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === formData.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.mobile.match(/^[0-9]{10}$/))
//       newErrors.mobile = "Enter a valid 10-digit phone number";
//     if (formData.password.length < 6 || formData.password.length > 10)
//       newErrors.password = "Password must be 6-10 characters";
//     if (!formData.buildingName.trim())
//       newErrors.buildingName = "Building name is required";
//     if (!formData.areaName) newErrors.areaName = "Area is required";
//     if (!formData.city) newErrors.city = "City is required";
//     if (!formData.state) newErrors.state = "State is required";
//     if (!formData.pincode.match(/^[0-9]{6}$/))
//       newErrors.pincode = "Pincode must be exactly 6 digits";
//     if (defaultRole === "technician" && !formData.category)
//       newErrors.category = "Service category is required";
//     if (defaultRole === "technician" && !formData.subscriptionId)
//       newErrors.subscriptionId = "Subscription plan is required";

//     return newErrors;
//   }, [formData, defaultRole]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       const formErrors = validateForm();

//       if (Object.keys(formErrors).length > 0) {
//         setErrors(formErrors);
//         return;
//       }

//       setLoading(true);

//       try {
//         const basePayload = {
//           username: formData.name,
//           phoneNumber: formData.mobile,
//           password: formData.password,
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           subAreaName: formData.subAreaName || "-",
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//         };

//         let response;
//         if (defaultRole === "user") {
//           response = await userRegister(basePayload);
//         } else {
//           response = await technicianRegister({
//             ...basePayload,
//             category: formData.category,
//             subscriptionId: formData.subscriptionId,
//           });
//         }

//         if (response.success) {
//           navigate(`/login/${defaultRole}`);
//         }
//       } catch (err: any) {
//         setErrors({
//           ...errors,
//           general:
//             err?.data?.error?.[0] || "Registration failed. Please try again.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, defaultRole, navigate, errors]
//   );

//   return (
//     <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-center">
//         <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
//           <img
//             src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//             alt="Justdial Logo"
//             className="h-8 w-auto"
//           />
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//         <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//           Sign Up as {defaultRole}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {errors.general && (
//             <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//               {errors.general}
//             </div>
//           )}

//           {defaultRole === "technician" && (
//             <>
//               <div>
//                 <label
//                   htmlFor="category"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Service Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   disabled={catLoading}
//                 >
//                   <option value="" disabled>
//                     {catLoading ? "Loading categories..." : "Select a category"}
//                   </option>
//                   {apiCategories
//                     .sort((a, b) =>
//                       a.category_name
//                         .toLowerCase()
//                         .localeCompare(b.category_name.toLowerCase())
//                     )
//                     .map((item) => (
//                       <option key={item._id} value={item._id}>
//                         {item.category_name}
//                       </option>
//                     ))}
//                 </select>
//                 {catError && (
//                   <div className="text-red-500 text-xs mt-1">{catError}</div>
//                 )}
//                 {errors.category && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {errors.category}
//                   </div>
//                 )}
//               </div>
              
//             </>
//           )}

//           {[
//             { id: "name", label: "Name", type: "text" },
//             { id: "mobile", label: "Phone Number", type: "tel" },
//             { id: "password", label: "Password", type: "password" },
//             { id: "buildingName", label: "House/Building Name", type: "text" },
//             { id: "pincode", label: "Pincode", type: "text" },
//             { id: "areaName", label: "Area Name", type: "text" },
//             {
//               id: "subAreaName",
//               label: "Sub Area",
//               type: "text",
//               required: false,
//             },
//             { id: "city", label: "City", type: "text" },
//             { id: "state", label: "State", type: "text" },
//           ].map(({ id, label, type, required = true }) => (
//             <div key={id}>
//               <label
//                 htmlFor={id}
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 {label} {required && <span className="text-red-600">*</span>}
//               </label>
//               {id === "password" ? (
//                 <div className="relative">
//                   <input
//                     id={id}
//                     name={id}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password (6-10 characters)"
//                     required={required}
//                     value={formData[id]}
//                     onChange={handleChange}
//                     minLength={6}
//                     maxLength={10}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                   />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               ) : id === "pincode" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Pincode</option>
//                   {pincodeData
//                     .sort((a: any, b: any) => a.code - b.code)
//                     .map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                 </select>
//               ) : id === "city" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.city}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select City</option>
//                   {selectedPincode &&
//                   pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option
//                       value={
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.city
//                       }
//                     >
//                       {
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.city
//                       }
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.city}>
//                         {p.city}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               ) : id === "state" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.state}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select State</option>
//                   {selectedPincode &&
//                   pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option
//                       value={
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.state
//                       }
//                     >
//                       {
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.state
//                       }
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.state}>
//                         {p.state}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               ) : id === "areaName" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.areaName}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Area</option>
//                   {areaOptions.map((a) => (
//                     <option key={a._id} value={a.name}>
//                       {a.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : id === "subAreaName" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.subAreaName}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Sub Area</option>
//                   {subAreaOptions
//                     .sort((a, b) =>
//                       a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//                     )
//                     .map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   placeholder={label}
//                   required={required}
//                   value={formData[id]}
//                   onChange={handleChange}
//                   maxLength={id === "mobile" ? 10 : 100}
//                   pattern={id === "mobile" ? "[0-9]{10}" : undefined}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//               )}
//               {errors[id] && (
//                 <div className="text-red-500 text-xs mt-1">{errors[id]}</div>
//               )}
//             </div>
//           ))}

//           {defaultRole === "technician" && (
//             <div>
//                 <label
//                   htmlFor="subscriptionId"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Subscription Plan <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="subscriptionId"
//                   name="subscriptionId"
//                   value={formData.subscriptionId}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   disabled={planLoading || subscriptionPlans.length === 0}
//                 >
//                   <option value="" disabled>
//                     {planLoading
//                       ? "Loading plans..."
//                       : subscriptionPlans.length === 0
//                       ? "No plans available"
//                       : "Select a plan"}
//                   </option>
//                   {subscriptionPlans.map((plan) => (
//                     <option key={plan._id} value={plan._id}>
//                       {plan.name}
//                     </option>
//                   ))}
//                 </select>
//                 {planError && (
//                   <div className="text-red-500 text-xs mt-1">{planError}</div>
//                 )}
//                 {errors.subscriptionId && (
//                   <div className="text-red-500 text-xs mt-1">
//                     {errors.subscriptionId}
//                   </div>
//                 )}
//               </div>
//           )}

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </div>
//         </form>

//         <p className="mt-4 text-sm text-center text-gray-600">
//           {defaultRole === "user" ? "Are you a technician?" : "Are you a user?"}{" "}
//           <a
//             href={`/signup/${defaultRole === "user" ? "technician" : "user"}`}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign Up here
//           </a>
//         </p>
//       </div>
//       <p className="mt-4 text-sm text-center text-gray-600">
//         Already Sign up?
//         <a
//           href={`/login/${defaultRole === "user" ? "user" : "technician"}`}
//           className="text-blue-600 hover:underline font-medium ms-1"
//         >
//           Sign In
//         </a>
//       </p>
//     </main>
//   );
// };

// export default SignupForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   userRegister,
//   technicianRegister,
//   getAllCategories,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   status: number;
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   category: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   category?: string;
// }

// interface SignupFormProps {
//   defaultRole: "user" | "technician";
// }

// const initialFormState: FormData = {
//   name: "",
//   mobile: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
//   category: "",
// };

// const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiCategories, setApiCategories] = useState<Category[]>([]);
//   const [catLoading, setCatLoading] = useState<boolean>(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (defaultRole === "technician") {
//       setCatLoading(true);
//       getAllCategories(null)
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             setApiCategories(res.data);
//           } else {
//             setApiCategories([]);
//             setCatError("Failed to load categories");
//           }
//         })
//         .catch(() => {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         })
//         .finally(() => setCatLoading(false));
//     }
//   }, [defaultRole]);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find(
//         (a) => a.name === formData.areaName
//       );
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.mobile.match(/^[0-9]{10}$/))
//       newErrors.mobile = "Enter a valid 10-digit phone number";
//     if (formData.password.length < 6 || formData.password.length > 10)
//       newErrors.password = "Password must be 6-10 characters";
//     if (!formData.buildingName.trim())
//       newErrors.buildingName = "Building name is required";
//     if (!formData.areaName) newErrors.areaName = "Area is required";
//     if (!formData.city) newErrors.city = "City is required";
//     if (!formData.state) newErrors.state = "State is required";
//     if (!formData.pincode.match(/^[0-9]{6}$/))
//       newErrors.pincode = "Pincode must be exactly 6 digits";
//     if (defaultRole === "technician" && !formData.category)
//       newErrors.category = "Service category is required";

//     return newErrors;
//   }, [formData, defaultRole]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     },
//     []
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       const formErrors = validateForm();

//       if (Object.keys(formErrors).length > 0) {
//         setErrors(formErrors);
//         return;
//       }

//       setLoading(true);

//       try {
//         const basePayload = {
//           username: formData.name,
//           phoneNumber: formData.mobile,
//           password: formData.password,
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           subAreaName: formData.subAreaName || "-",
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//         };

//         let response;
//         if (defaultRole === "user") {
//           response = await userRegister(basePayload);
//         } else {
//           response = await technicianRegister({
//             ...basePayload,
//             category: formData.category,
//           });
//         }

//         if (response.success) {
//           navigate(`/login/${defaultRole}`);
//         }
//       } catch (err: any) {
//         setErrors({
//           ...errors,
//           general:
//             err?.data?.error?.[0] || "Registration failed. Please try again.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, defaultRole, navigate, errors]
//   );

//   return (
//     <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-center">
//         <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
//           <img
//             src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//             alt="PRNV Logo"
//             className="h-8 w-auto"
//           />
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//         <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//           Sign Up as {defaultRole}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {errors.general && (
//             <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
//               {errors.general}
//             </div>
//           )}

//           {defaultRole === "technician" && (
//             <div>
//               <label
//                 htmlFor="category"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Service Category <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 disabled={catLoading}
//               >
//                 <option value="" disabled>
//                   {catLoading ? "Loading categories..." : "Select a category"}
//                 </option>
//                 {apiCategories
//                   .sort((a, b) =>
//                     a.category_name
//                       .toLowerCase()
//                       .localeCompare(b.category_name.toLowerCase())
//                   )
//                   .map((item) => (
//                     <option key={item._id} value={item._id}>
//                       {item.category_name}
//                     </option>
//                   ))}
//               </select>
//               {catError && (
//                 <div className="text-red-500 text-xs mt-1">{catError}</div>
//               )}
//               {errors.category && (
//                 <div className="text-red-500 text-xs mt-1">
//                   {errors.category}
//                 </div>
//               )}
//             </div>
//           )}

//           {[
//             { id: "name", label: "Name", type: "text" },
//             { id: "mobile", label: "Phone Number", type: "tel" },
//             { id: "password", label: "Password", type: "password" },
//             { id: "buildingName", label: "House/Building Name", type: "text" },
//             { id: "pincode", label: "Pincode", type: "text" },
//             { id: "areaName", label: "Area Name", type: "text" },
//             {
//               id: "subAreaName",
//               label: "Sub Area",
//               type: "text",
//               required: false,
//             },
//             { id: "city", label: "City", type: "text" },
//             { id: "state", label: "State", type: "text" },
//           ].map(({ id, label, type, required = true }) => (
//             <div key={id}>
//               <label
//                 htmlFor={id}
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 {label} {required && <span className="text-red-600">*</span>}
//               </label>
//               {id === "password" ? (
//                 <div className="relative">
//                   <input
//                     id={id}
//                     name={id}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password (6-10 characters)"
//                     required={required}
//                     value={formData[id]}
//                     onChange={handleChange}
//                     minLength={6}
//                     maxLength={10}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                   />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               ) : id === "pincode" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Pincode</option>
//                   {pincodeData
//                     .sort((a: any, b: any) => a.code - b.code)
//                     .map((p) => (
//                       <option key={p._id} value={p.code}>
//                         {p.code}
//                       </option>
//                     ))}
//                 </select>
//               ) : id === "city" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.city}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select City</option>
//                   {selectedPincode &&
//                   pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option
//                       value={
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.city
//                       }
//                     >
//                       {
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.city
//                       }
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.city}>
//                         {p.city}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               ) : id === "state" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.state}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select State</option>
//                   {selectedPincode &&
//                   pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option
//                       value={
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.state
//                       }
//                     >
//                       {
//                         pincodeData.find((p) => p.code === selectedPincode)
//                           ?.state
//                       }
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.state}>
//                         {p.state}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               ) : id === "areaName" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.areaName}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Area</option>
//                   {areaOptions.map((a) => (
//                     <option key={a._id} value={a.name}>
//                       {a.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : id === "subAreaName" ? (
//                 <select
//                   id={id}
//                   name={id}
//                   value={formData.subAreaName}
//                   onChange={handleChange}
//                   required={required}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Sub Area</option>
//                   {subAreaOptions
//                     .sort((a, b) =>
//                       a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//                     )
//                     .map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   placeholder={label}
//                   required={required}
//                   value={formData[id]}
//                   onChange={handleChange}
//                   pattern={id === "mobile" ? "[0-9]{10}" : undefined}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//               )}
//               {errors[id] && (
//                 <div className="text-red-500 text-xs mt-1">{errors[id]}</div>
//               )}
//             </div>
//           ))}

          

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </div>
//         </form>

//         <p className="mt-4 text-sm text-center text-gray-600">
//           {defaultRole === "user" ? "Are you a technician?" : "Are you a user?"}{" "}
//           <a
//             href={`/signup/${defaultRole === "user" ? "technician" : "user"}`}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign Up here
//           </a>
//         </p>
//       </div>
//       <p className="mt-4 text-sm text-center text-gray-600">
//         Already Sign up?
//         <a
//           href={`/login/${defaultRole === "user" ? "user" : "technician"}`}
//           className="text-blue-600 hover:underline font-medium ms-1"
//         >
//           Sign In
//         </a>
//       </p>
//     </main>
//   );
// };

// export default SignupForm;
// import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userRegister, technicianRegister, getAllCategories, getAllPincodes } from '../../api/apiMethods';
// import { categories as categoryList } from '../../data/categoryData';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// interface SignupFormProps {
//   defaultRole: 'user' | 'technician';
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   category: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   city: '',
//   state: '',
//   pincode: '',
//   category: '',
// };

// const SignupForm: React.FC<SignupFormProps> = ({ defaultRole }) => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [apiCategories, setApiCategories] = useState<{ _id: string; category_name: string; status :number }[]>([]);
//   const [catLoading, setCatLoading] = useState(false);
//   const [catError, setCatError] = useState<string | null>(null);
//   const [pincodeData, setPincodeData] = useState<any[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<any[]>([]);
//   const [selectedArea, setSelectedArea] = useState<string>("");
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (defaultRole === 'technician') {
//       setCatLoading(true);
//       getAllCategories(null)
//         .then((res: any) => {
//           if (Array.isArray(res?.data)) {
//             setApiCategories(res.data);
//           } else {
//             setApiCategories([]);
//             setCatError('Failed to load categories');
//           }
//         })
//         .catch(() => {
//           setApiCategories([]);
//           setCatError('Failed to load categories');
//         })
//         .finally(() => setCatLoading(false));
//     }
//   }, [defaultRole]);

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           setPincodeData(res.data);
//           console.log('picode responces', res.data)
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//       } else {
//         setAreaOptions([]);
//       }
//     } else {
//       setAreaOptions([]);
//     }
//   }, [selectedPincode, pincodeData]);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "pincode") {
//         setSelectedPincode(value);
//       }
//       if (name === "areaName") {
//         setSelectedArea(value);
//       }
//     },
//     []
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       setError(null);
//       setLoading(true);

//       try {
//         if (!formData.pincode || formData.pincode.length !== 6) {
//           setError('Pincode must be exactly 6 digits');
//         setLoading(false);
//         return;
//       }

//       let response;

//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       if (defaultRole === 'user') {
//         response = await userRegister(basePayload);
//       } else {
//         if (!formData.category) {
//           setError('Please select a valid category.');
//           setLoading(false);
//           return;
//         }

//         const technicianPayload = {
//           ...basePayload,
//           category: formData.category,
//         };

//         response = await technicianRegister(technicianPayload);
//       }

//       if (response.success) {
//         navigate(`/login/${defaultRole}`);
//       }

//     } catch (err: any) {
//       setError(err?.data?.error?.[0] || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   },
//   [formData, defaultRole, navigate]
// );

// return (
//     <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className='flex justify-center'>
//         <div className="bg-blue-900 rounded px-1 py-1 w-fit flex ">
//           <img
//             src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
//             alt="PRNV Logo"
//             className="h-8 w-auto "
//             />

//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">

//         <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//           Sign Up as {defaultRole}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
//           )}

//           {defaultRole === 'technician' && (
//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                 Service Category <span className='text-red-500'>*</span>
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 disabled={catLoading}
//                 >
//                 <option value="" disabled>
//                   {catLoading ? 'Loading categories...' : 'Select a category'}
//                 </option>
//                 {/* {apiCategories.map((cat, index) => (
//                   <option key={index} value={cat._id}>
//                     {cat.category_name}
//                     </option>
//                     ))} */}

//                  {apiCategories
//                       .filter((category) => category?.status === 1)
//                       .map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.category_name}
//                         </option>
//                       ))}
//               </select>
//               {catError && <div className="text-red-500 text-xs mt-1">{catError}</div>}
//             </div>
//           )}

//           {[
//             { id: 'name', label: 'Name', type: 'text' },
//             { id: 'mobile', label: 'Phone Number', type: 'tel', pattern: '[0-9]{10}' },
//             { id: 'password', label: 'Password', type: 'password', minLength: 6, maxLength: 10 },
//             { id: 'buildingName', label: 'House/Building Name', type: 'text' },
//             { id: 'pincode', label: 'Pincode', type: 'text' },
//             { id: 'areaName', label: 'Area/Street Name', type: 'text' },
//             { id: 'city', label: 'City', type: 'text' },
//             { id: 'state', label: 'State', type: 'text' },

//           ].map(({ id, label, type, pattern }) => (
//             <div key={id}>
//               <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                 {label} <span className='text-red-600'>*</span>
//               </label>
//               {id === 'password' ? (
//                 <div className="relative">
//                   <input
//                     id={id}
//                     name={id}
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder={id === 'password' ? 'Password (6-10 characters)' : label}
//                     required
//                     value={(formData as any)[id]}
//                     onChange={handleChange}
//                     pattern={pattern}
//                     minLength={id === 'password' ? 6 : undefined}
//                     maxLength={id === 'password' ? 10 : undefined}
//                     className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
//                     />
//                   <span
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </span>
//                 </div>
//               ) : id === 'pincode' ? (
//                 <select
//                   id="pincode"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                   >
//                   <option value="">Select Pincode</option>
//                   {pincodeData.map((p) => (
//                     <option key={p._id} value={p.code}>{p.code}</option>
//                   ))}
//                 </select>
//               ) : id === 'city' ? (
//                 <select
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select City</option>
//                   {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option value={pincodeData.find((p) => p.code === selectedPincode)?.city}>
//                       {pincodeData.find((p) => p.code === selectedPincode)?.city}
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.city}>{p.city}</option>
//                     ))
//                   )}
//                 </select>
//               ) : id === 'state' ? (
//                 <select
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select State</option>
//                   {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                     <option value={pincodeData.find((p) => p.code === selectedPincode)?.state}>
//                       {pincodeData.find((p) => p.code === selectedPincode)?.state}
//                     </option>
//                   ) : (
//                     pincodeData.map((p) => (
//                       <option key={p._id} value={p.state}>{p.state}</option>
//                     ))
//                   )}
//                 </select>
//               ) : id === 'areaName' ? (
//                 <select
//                 id="areaName"
//                 name="areaName"
//                 value={formData.areaName}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 >
//                   <option value="">Select Area</option>
//                   {areaOptions.map((a: any) => (
//                     <option key={a._id} value={a.name}>{a.name}</option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   id={id}
//                   name={id}
//                   type={type}
//                   placeholder={id === 'password' ? 'Password (6-10 characters)' : label}
//                   required
//                   value={(formData as any)[id]}
//                   onChange={handleChange}
//                   pattern={pattern}
//                   minLength={id === 'password' ? 6 : undefined}
//                   maxLength={id === 'password' ? 10 : undefined}
//                   className="mt-1 w-full border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             </div>
//           ))}

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Signing Up...' : 'Sign Up'}
//             </button>
//           </div>
//         </form>

//         <p className="mt-4 text-sm text-center text-gray-600">
//           {defaultRole === 'user' ? 'Are you a technician?' : 'Are you a user?'}{' '}
//           <a
//             href={`/signup/${defaultRole === 'user' ? 'technician' : 'user'}`}
//             className="text-blue-600 hover:underline font-medium"
//             >
//             Sign Up here
//           </a>
//         </p>
//       </div>
//       <p className="mt-4 text-sm text-center text-gray-600">
//         Already Sign up?
//         <a
//           href={`/login/${defaultRole === 'user' ? 'user' : 'technician'}`}
//           className="text-blue-600 hover:underline font-medium ms-1"
//         >
//           Sign In
//         </a>
//       </p>
//     </main>
//   );
// };

// export default SignupForm;
// const handleSubmit = useCallback(
//   async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       // Validate pincode
//       if (!formData.pincode || formData.pincode.length !== 6) {
//         setError('Pincode must be exactly 6 digits');
//         setLoading(false);
//         return;
//       }

//       let response;
//       if (defaultRole === 'user') {
//         const payload = {
//           username: formData.name,
//           phoneNumber: formData.mobile,
//           password: formData.password,
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode
//         };
//         response = await userRegister(payload) as any;
//       } else {
//         if (!formData.category) {
//           setError('Please select a category.');
//           setLoading(false);
//           return;
//         }
//         console.log("as", apiCategories[0]._id);
//         const payload = {
//           username: formData.name,
//           phoneNumber: formData.mobile,
//           password: formData.password,
//           buildingName: formData.buildingName,
//           areaName: formData.areaName,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//           category: formData.category
//           // category: apiCategories[0]._id
//         };
//         console.log("----",payload)
//         response = await technicianRegister(payload) as any;
//       }
//       if (response.success) {
//         navigate(`/login/${defaultRole}`);
//       }
//     } catch (err: any) {
//       setError(err.data.error[0] || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   },
//   [formData, defaultRole, navigate]
// );
