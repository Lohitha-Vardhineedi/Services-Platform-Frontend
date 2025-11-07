import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  technicianRegister,
  getAllCategories,
  getAllPincodes,
  getPlans,
} from "../../api/apiMethods";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TermsConditions from "../../components/footerComponents/TermsConditions";
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

interface RegistrationResponse {
  success: boolean;
  message: string;
  result: Technician;
}

interface Technician {
  id: string;
  franchiseId: string | null;
  username: string;
  phoneNumber: string;
  role: string;
  category: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  service: string;
  profileImage: string;
  plan: string;
  categoryServices: CategoryService[];
  aadharFront: string;
  aadharBack: string;
  panCard: string;
  voterCard: string | null;
  authorizedPersons: AuthorizedPerson[];
  result: SubscriptionResult;
  status: string;
  franchiseAccount: any | null; // Assuming null or object, adjust as needed
}

interface CategoryService {
  categoryServiceId: string;
  status: boolean;
  _id: string;
}

interface AuthorizedPerson {
  phone: string;
  photo: string;
  _id: string;
}

interface SubscriptionResult {
  subscriptionId: string;
  subscriptionName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  leads: number | null;
  ordersCount: number;
  endUpPrice: number | null;
  earnAmount: number;
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

const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

const fieldLabels = {
  profileImage: "Profile image",
  aadharFront: "Aadhar front",
  aadharBack: "Aadhar back",
  panCard: "Pan card",
  voterCard: "Voter card",
  auth1Photo: "Authorized person 1 photo",
  auth2Photo: "Authorized person 2 photo",
} as const;

const TechnicianSignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
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

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    setCatLoading(true);
    getAllCategories(null)
      .then((res: any) => {
        if (Array.isArray(res?.data)) setApiCategories(res.data);
        else {
          setApiCategories([]);
          setCatError("Failed to load categories");
        }
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        setApiCategories([]);
        setCatError("Failed to load categories. Please check your connection and try refreshing.");
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
      .catch((error) => {
        console.error("Error loading plans:", error);
        setSubscriptionPlans([]);
        setPlanError("Failed to load subscription plans. Please check your connection and try refreshing.");
      })
      .finally(() => setPlanLoading(false));
  }, []);

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) setPincodeData(res.data);
      })
      .catch((error) => {
        console.error("Error loading pincodes:", error);
        // Optionally set a user-facing error if needed
      });
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

  const MAX_FILE_SIZE_MB = 0.5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const validateFile = useCallback((file: File, fieldName: string): string | null => {
    const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext || "")) {
      return `${fieldName} must be JPG, JPEG, PNG, or SVG only`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `${fieldName} must not exceed ${MAX_FILE_SIZE_MB} MB`;
    }
    return null;
  }, []);

  const handleFileChange = useCallback(
    (name: keyof FormData, file: File | null) => {
      const oldUrl = previews[name as string];
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      if (!file) {
        setPreviews((prev) => {
          const newPrev = { ...prev };
          delete newPrev[name as string];
          return newPrev;
        });
        setFormData((prev) => ({ ...prev, [name]: null }));
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr[name];
          return newErr;
        });
        return;
      }

      const label = fieldLabels[name as keyof typeof fieldLabels] || name;
      const error = validateFile(file, label);
      if (error) {
        // Clear the file and preview on validation error
        setFormData((prev) => ({ ...prev, [name]: null }));
        setPreviews((prev) => {
          const newPrev = { ...prev };
          delete newPrev[name as string];
          return newPrev;
        });
        setErrors((prev) => ({ ...prev, [name]: error }));
        // Optional: Show a toast or alert for better UX, but for now, just set error
        return;
      }

      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });

      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name as string]: url }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    },
    [previews, validateFile]
  );

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
        if (!f.profileImage) e.profileImage = `${fieldLabels.profileImage} is required`;
        if (!f.aadharFront) e.aadharFront = `${fieldLabels.aadharFront} image is required`;
        if (!f.aadharBack) e.aadharBack = `${fieldLabels.aadharBack} image is required`;
        if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
        if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
        if (!f.auth1Photo) e.auth1Photo = `${fieldLabels.auth1Photo} is required`;
        if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
        if (!f.auth2Photo) e.auth2Photo = `${fieldLabels.auth2Photo} is required`;
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
    if (!f.category) e.category = "Service category is required";
    if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
    if (!f.profileImage) e.profileImage = `${fieldLabels.profileImage} is required`;
    if (!f.aadharFront) e.aadharFront = `${fieldLabels.aadharFront} image is required`;
    if (!f.aadharBack) e.aadharBack = `${fieldLabels.aadharBack} image is required`;
    if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
    if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
    if (!f.auth1Photo) e.auth1Photo = `${fieldLabels.auth1Photo} is required`;
    if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
    if (!f.auth2Photo) e.auth2Photo = `${fieldLabels.auth2Photo} is required`;
    if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
    return e;
  }, [formData, agreedToTerms]);

  const scrollToFirstError = useCallback((err: FormErrors) => {
    const firstKey = fieldOrderTech.find((k) => err[k]);
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

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
      setErrors((prev) => ({ ...prev, general: "" })); // Clear previous general errors
      try {
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
        const response = await technicianRegister(fd) as RegistrationResponse;
        if (response?.success) {
          alert("Thank you for registering. Once your account is verified, you will receive access to log in.");
          navigate("/login/technician");
        } else {
          throw new Error(response?.message || "Registration failed");
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        const errorMessage = err?.response?.data?.error?.[0] || 
                             err?.message || 
                             "Registration failed. Please check your inputs and try again.";
        setErrors((prev) => ({
          ...prev,
          general: errorMessage,
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

  const renderFileInput = (name: keyof FormData, label: string, required = true) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
        className="mt-1 w-full border border-gray-300 rounded-md p-2"
      />
      {previews[name as string] && (
        <img
          src={previews[name as string]}
          alt={label}
          className="mt-2 w-32 h-32 object-cover rounded border"
        />
      )}
      {formData[name] && !previews[name as string] && (
        <p className="text-sm text-gray-600 mt-1">Selected: {formData[name]?.name}</p>
      )}
      {errors[name] && <div className="text-red-500 text-xs mt-1" id={`${name}-error`}>{errors[name]}</div>}
    </div>
  );

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
            Sign Up as Technician
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
                {renderFileInput("profileImage", fieldLabels.profileImage, true)}
                {renderFileInput("aadharFront", fieldLabels.aadharFront, true)}
                {renderFileInput("aadharBack", fieldLabels.aadharBack, true)}
                {renderFileInput("panCard", fieldLabels.panCard, false)}
                {renderFileInput("voterCard", fieldLabels.voterCard, false)}
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
                {renderFileInput("auth1Photo", fieldLabels.auth1Photo, true)}
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
                {renderFileInput("auth2Photo", fieldLabels.auth2Photo, true)}
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

export default TechnicianSignupForm;
// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   technicianRegister,
//   getAllCategories,
//   getAllPincodes,
//   getPlans,
// } from "../../api/apiMethods";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import TermsConditions from "../../components/footerComponents/TermsConditions";
// import { createPortal } from "react-dom";

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

// const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

// const fieldLabels = {
//   profileImage: "Profile image",
//   aadharFront: "Aadhar front",
//   aadharBack: "Aadhar back",
//   panCard: "Pan card",
//   voterCard: "Voter card",
//   auth1Photo: "Authorized person 1 photo",
//   auth2Photo: "Authorized person 2 photo",
// } as const;

// const TechnicianSignupForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [previews, setPreviews] = useState<{ [key: string]: string }>({});
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

//   useEffect(() => {
//     return () => {
//       Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [previews]);

//   useEffect(() => {
//     setCatLoading(true);
//     getAllCategories(null)
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) setApiCategories(res.data);
//         else {
//           setApiCategories([]);
//           setCatError("Failed to load categories");
//         }
//       })
//       .catch(() => {
//         setApiCategories([]);
//         setCatError("Failed to load categories");
//       })
//       .finally(() => setCatLoading(false));
//     setPlanLoading(true);
//     getPlans({})
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) {
//           const freePlan = res.data.find((plan: SubscriptionPlan) => plan.name === "Free Plan");
//           if (freePlan) {
//             setSubscriptionPlans([freePlan]);
//             setFormData((prev) => ({ ...prev, subscriptionId: freePlan._id }));
//           } else {
//             setSubscriptionPlans([]);
//             setPlanError("Free Plan not available");
//           }
//         } else {
//           setSubscriptionPlans([]);
//           setPlanError("Failed to load subscription plans");
//         }
//       })
//       .catch(() => {
//         setSubscriptionPlans([]);
//         setPlanError("Failed to load subscription plans");
//       })
//       .finally(() => setPlanLoading(false));
//   }, []);

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

//   const validateFile = useCallback((file: File, fieldName: string): string | null => {
//     const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
//     const ext = file.name.split(".").pop()?.toLowerCase();
//     if (!allowedExtensions.includes(ext || "")) {
//       return `${fieldName} must be JPG, PNG, or SVG only`;
//     }
//     if (file.size < 0.5 * 1024 * 1024) {
//       return `${fieldName} must be at least 0.5 MB`;
//     }
//     return null;
//   }, []);

//   const handleFileChange = useCallback(
//     (name: keyof FormData, file: File | null) => {
//       const oldUrl = previews[name as string];
//       if (oldUrl) {
//         URL.revokeObjectURL(oldUrl);
//       }

//       if (!file) {
//         setPreviews((prev) => {
//           const newPrev = { ...prev };
//           delete newPrev[name as string];
//           return newPrev;
//         });
//         setFormData((prev) => ({ ...prev, [name]: null }));
//         setErrors((prev) => {
//           const newErr = { ...prev };
//           delete newErr[name];
//           return newErr;
//         });
//         return;
//       }

//       const label = fieldLabels[name as keyof typeof fieldLabels];
//       const error = validateFile(file, label);
//       if (error) {
//         setErrors((prev) => ({ ...prev, [name]: error }));
//         return;
//       }

//       setErrors((prev) => {
//         const newErr = { ...prev };
//         delete newErr[name];
//         return newErr;
//       });

//       const url = URL.createObjectURL(file);
//       setPreviews((prev) => ({ ...prev, [name as string]: url }));
//       setFormData((prev) => ({ ...prev, [name]: file }));
//     },
//     [previews, validateFile]
//   );

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
//         if (!f.profileImage) e.profileImage = `${fieldLabels.profileImage} is required`;
//         if (!f.aadharFront) e.aadharFront = `${fieldLabels.aadharFront} image is required`;
//         if (!f.aadharBack) e.aadharBack = `${fieldLabels.aadharBack} image is required`;
//         if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
//         if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
//         if (!f.auth1Photo) e.auth1Photo = `${fieldLabels.auth1Photo} is required`;
//         if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
//         if (!f.auth2Photo) e.auth2Photo = `${fieldLabels.auth2Photo} is required`;
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
//     if (!f.category) e.category = "Service category is required";
//     if (!f.subscriptionId) e.subscriptionId = "Subscription plan is required";
//     if (!f.profileImage) e.profileImage = `${fieldLabels.profileImage} is required`;
//     if (!f.aadharFront) e.aadharFront = `${fieldLabels.aadharFront} image is required`;
//     if (!f.aadharBack) e.aadharBack = `${fieldLabels.aadharBack} image is required`;
//     if (!f.panCard && !f.voterCard) e.panCard = "Provide Pan or Voter card";
//     if (!PHONE_REGEX.test(f.authorizedPhone1)) e.authorizedPhone1 = "Enter 10-digit number";
//     if (!f.auth1Photo) e.auth1Photo = `${fieldLabels.auth1Photo} is required`;
//     if (!PHONE_REGEX.test(f.authorizedPhone2)) e.authorizedPhone2 = "Enter 10-digit number";
//     if (!f.auth2Photo) e.auth2Photo = `${fieldLabels.auth2Photo} is required`;
//     if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
//     return e;
//   }, [formData, agreedToTerms]);

//   const scrollToFirstError = useCallback((err: FormErrors) => {
//     const firstKey = fieldOrderTech.find((k) => err[k]);
//     if (!firstKey) return;
//     const el = document.getElementById(firstKey);
//     if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }, []);

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
//         const fd = new FormData();
//         fd.append("username", formData.name.trim());
//         fd.append("phoneNumber", formData.mobile);
//         fd.append("password", formData.password);
//         fd.append("buildingName", formData.buildingName.trim());
//         fd.append("areaName", formData.areaName);
//         fd.append("subAreaName", formData.subAreaName || "-");
//         fd.append("city", formData.city);
//         fd.append("state", formData.state);
//         fd.append("pincode", formData.pincode);
//         fd.append("category", formData.category);
//         fd.append("subscriptionId", formData.subscriptionId);
//         if (formData.profileImage) fd.append("profileImage", formData.profileImage);
//         if (formData.aadharFront) fd.append("aadharFront", formData.aadharFront);
//         if (formData.aadharBack) fd.append("aadharBack", formData.aadharBack);
//         if (formData.panCard) fd.append("panCard", formData.panCard);
//         if (formData.voterCard) fd.append("voterCard", formData.voterCard);
//         fd.append("authorizedPersons[0][phone]", formData.authorizedPhone1);
//         if (formData.auth1Photo) fd.append("auth1Photo", formData.auth1Photo);
//         fd.append("authorizedPersons[1][phone]", formData.authorizedPhone2);
//         if (formData.auth2Photo) fd.append("auth2Photo", formData.auth2Photo);
//         const response = await technicianRegister(fd) as any;
//         if (response?.success) {
//           alert("Thank you for registering. Once your account is verified, you will receive access to log in.");
//           navigate("/login/technician");
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
//     [formData, navigate, validateForm, scrollToFirstError]
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

//   // Terms Modal Component: Renders TermsConditions inside a modal overlay
//   const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//     if (!showTermsModal) return null;
//     return createPortal(
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000,
//         }}
//         onClick={onClose}
//       >
//         <div
//           style={{
//             backgroundColor: 'white',
//             padding: '20px',
//             borderRadius: '8px',
//             maxWidth: '600px',
//             width: '90%',
//             maxHeight: '80%',
//             overflow: 'auto',
//             position: 'relative',
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div
//             style={{
//               position: 'absolute',
//               top: '10px',
//               right: '10px',
//               border: 'none',
//               background: 'none',
//               fontSize: '20px',
//               cursor: 'pointer',
//             }}
//             onClick={onClose}
//           >
//             ×
//           </div>
//           <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Terms & Conditions</h2>
//           <TermsConditions />
//           <div style={{ textAlign: 'center', marginTop: '20px' }}>
//             <button
//               onClick={onClose}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#3b82f6',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>,
//       document.body
//     );
//   };

//   const renderFileInput = (name: keyof FormData, label: string, required = true) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <input
//         id={name}
//         name={name}
//         type="file"
//         accept="image/*"
//         onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
//         className="mt-1 w-full border border-gray-300 rounded-md p-2"
//       />
//       {previews[name as string] && (
//         <img
//           src={previews[name as string]}
//           alt={label}
//           className="mt-2 w-32 h-32 object-cover rounded border"
//         />
//       )}
//       {formData[name] && !previews[name as string] && (
//         <p className="text-sm text-gray-600 mt-1">Selected: {formData[name]?.name}</p>
//       )}
//       {errors[name] && <div className="text-red-500 text-xs mt-1" id={`${name}-error`}>{errors[name]}</div>}
//     </div>
//   );

//   return (
//     <>
//       <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-center">
//           <div className="flex-shrink-0 bg-blue-900 rounded px-1 py-1">
//             <img
//               src="https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png"
//               alt="Prnv services Logo"
//               className="h-8 w-auto"
//             />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
//             Sign Up as Technician
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
//                 {renderFileInput("profileImage", fieldLabels.profileImage, true)}
//                 {renderFileInput("aadharFront", fieldLabels.aadharFront, true)}
//                 {renderFileInput("aadharBack", fieldLabels.aadharBack, true)}
//                 {renderFileInput("panCard", fieldLabels.panCard, false)}
//                 {renderFileInput("voterCard", fieldLabels.voterCard, false)}
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
//                 {renderFileInput("auth1Photo", fieldLabels.auth1Photo, true)}
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
//                 {renderFileInput("auth2Photo", fieldLabels.auth2Photo, true)}
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
//       <TermsModal onClose={() => setShowTermsModal(false)} />
//     </>
//   );
// };

// export default TechnicianSignupForm;
// import React from 'react';
// import SignupForm from '../../components/auth/SignupForm';

// const TechnicianSignup: React.FC = () => {
//   return (
//       <SignupForm defaultRole="technician" />
//   );
// };

// export default TechnicianSignup;
