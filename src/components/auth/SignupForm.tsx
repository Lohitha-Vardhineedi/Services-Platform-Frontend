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
}

interface SignupFormProps {
  defaultRole: "user" | "technician";
}

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
  const [subAreaOptions, setSubAreaOptions] = useState<
    { _id: string; name: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const navigate = useNavigate();

  const steps = ["Personal Information", "Address Details", "Service & Subscription", "Documents"];

  useEffect(() => {
    if (defaultRole === "technician") {
      setCatLoading(true);
      getAllCategories(null)
        .then((res: any) => {
          if (Array.isArray(res?.data)) {
            setApiCategories(res.data);
          } else {
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
      getPlans()
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
        if (Array.isArray(res?.data)) {
          setPincodeData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) {
        setAreaOptions(found.areas);
      } else {
        setAreaOptions([]);
      }
      setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
      if (found) {
        setFormData((prev) => ({
          ...prev,
          city: found.city || "",
          state: found.state || "",
        }));
        setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
      }
    }
  }, [selectedPincode, pincodeData]);

  useEffect(() => {
    if (formData.areaName) {
      const selectedArea = areaOptions.find(
        (a) => a.name === formData.areaName
      );
      if (selectedArea && selectedArea.subAreas) {
        setSubAreaOptions(selectedArea.subAreas);
      } else {
        setSubAreaOptions([]);
      }
      setFormData((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [formData.areaName, areaOptions]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.match(/^[0-9]{10}$/))
      newErrors.mobile = "Enter a valid 10-digit phone number";
    if (formData.password.length < 6 || formData.password.length > 10)
      newErrors.password = "Password must be 6-10 characters";
    if (!formData.buildingName.trim())
      newErrors.buildingName = "Building name is required";
    if (!formData.areaName) newErrors.areaName = "Area is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (defaultRole === "technician") {
      if (!formData.category)
        newErrors.category = "Service category is required";
      if (!formData.subscriptionId)
        newErrors.subscriptionId = "Subscription plan is required";
      if (!formData.aadharFront || formData.aadharFront.size === 0)
        newErrors.aadharFront = "Aadhar front image is required";
      if (!formData.aadharBack || formData.aadharBack.size === 0)
        newErrors.aadharBack = "Aadhar back image is required";
      if (!formData.panCard && !formData.voterCard)
        newErrors.panCard = "At least one of Pan Card or Voter Card is required";
      if (!formData.authorizedPhone1.match(/^[0-9]{10}$/))
        newErrors.authorizedPhone1 = "Enter a valid 10-digit phone for Authorized Person 1";
      if (!formData.auth1Photo || formData.auth1Photo.size === 0)
        newErrors.auth1Photo = "Photo for Authorized Person 1 is required";
      if (!formData.authorizedPhone2.match(/^[0-9]{10}$/))
        newErrors.authorizedPhone2 = "Enter a valid 10-digit phone for Authorized Person 2";
      if (!formData.auth2Photo || formData.auth2Photo.size === 0)
        newErrors.auth2Photo = "Photo for Authorized Person 2 is required";
    }

    return newErrors;
  }, [formData, defaultRole]);

  const validateCurrentStep = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.mobile.match(/^[0-9]{10}$/))
          newErrors.mobile = "Enter a valid 10-digit phone number";
        if (formData.password.length < 6 || formData.password.length > 10)
          newErrors.password = "Password must be 6-10 characters";
        break;
      case 2:
        if (!formData.buildingName.trim())
          newErrors.buildingName = "Building name is required";
        if (!formData.pincode) newErrors.pincode = "Pincode is required";
        if (!formData.areaName) newErrors.areaName = "Area is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        break;
      case 3:
        if (!formData.category)
          newErrors.category = "Service category is required";
        if (!formData.subscriptionId)
          newErrors.subscriptionId = "Subscription plan is required";
        break;
      case 4:
        if (!formData.aadharFront || formData.aadharFront.size === 0)
          newErrors.aadharFront = "Aadhar front image is required";
        if (!formData.aadharBack || formData.aadharBack.size === 0)
          newErrors.aadharBack = "Aadhar back image is required";
        if (!formData.panCard && !formData.voterCard)
          newErrors.panCard = "At least one of Pan Card or Voter Card is required";
        if (!formData.authorizedPhone1.match(/^[0-9]{10}$/))
          newErrors.authorizedPhone1 = "Enter a valid 10-digit phone for Authorized Person 1";
        if (!formData.auth1Photo || formData.auth1Photo.size === 0)
          newErrors.auth1Photo = "Photo for Authorized Person 1 is required";
        if (!formData.authorizedPhone2.match(/^[0-9]{10}$/))
          newErrors.authorizedPhone2 = "Enter a valid 10-digit phone for Authorized Person 2";
        if (!formData.auth2Photo || formData.auth2Photo.size === 0)
          newErrors.auth2Photo = "Photo for Authorized Person 2 is required";
        break;
    }
    return newErrors;
  }, [formData, currentStep, defaultRole]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "pincode") {
        setSelectedPincode(value);
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handleFileChange = useCallback((name: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const nextStep = useCallback(() => {
    const stepErrors = validateCurrentStep();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [validateCurrentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formErrors = validateForm();

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      setLoading(true);

      try {
        let response;
        if (defaultRole === "user") {
          const basePayload = {
            username: formData.name,
            phoneNumber: formData.mobile,
            password: formData.password,
            buildingName: formData.buildingName,
            areaName: formData.areaName,
            subAreaName: formData.subAreaName || "-",
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          };
          response = await userRegister(basePayload);
        } else {
          const fd = new FormData();
          fd.append("username", formData.name);
          fd.append("phoneNumber", formData.mobile);
          fd.append("password", formData.password);
          fd.append("buildingName", formData.buildingName);
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
          response = await technicianRegister(fd);
        }

        if (response.success) {
          navigate(`/login/${defaultRole}`);
        }
      } catch (err: any) {
        setErrors({
          ...errors,
          general:
            err?.data?.error?.[0] || "Registration failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, defaultRole, navigate, errors, validateForm]
  );

  if (defaultRole === "user") {
    return (
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
            <img
              src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
              alt="Prnv services Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
            Sign Up as {defaultRole}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {errors.general}
              </div>
            )}

            {[
              { id: "name", label: "Name", type: "text" },
              { id: "mobile", label: "Phone Number", type: "tel" },
              { id: "password", label: "Password", type: "password" },
              { id: "buildingName", label: "House/Building Name", type: "text" },
              { id: "pincode", label: "Pincode", type: "text" },
              { id: "areaName", label: "Area Name", type: "text" },
              {
                id: "subAreaName",
                label: "Sub Area",
                type: "text",
                required: false,
              },
              { id: "city", label: "City", type: "text" },
              { id: "state", label: "State", type: "text" },
            ].map(({ id, label, type, required = true }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {label} {required && <span className="text-red-600">*</span>}
                </label>
                {id === "password" ? (
                  <div className="relative">
                    <input
                      id={id}
                      name={id}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (6-10 characters)"
                      required={required}
                      value={formData[id as keyof FormData]}
                      onChange={handleChange}
                      minLength={6}
                      maxLength={10}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                ) : id === "pincode" ? (
                  <select
                    id={id}
                    name={id}
                    value={formData.pincode}
                    onChange={handleChange}
                    required={required}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Pincode</option>
                    {pincodeData
                      .sort((a: any, b: any) => a.code - b.code)
                      .map((p) => (
                        <option key={p._id} value={p.code}>
                          {p.code}
                        </option>
                      ))}
                  </select>
                ) : id === "areaName" ? (
                  <select
                    id={id}
                    name={id}
                    value={formData.areaName}
                    onChange={handleChange}
                    required={required}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Area</option>
                    {areaOptions.map((a) => (
                      <option key={a._id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                ) : id === "subAreaName" ? (
                  <select
                    id={id}
                    name={id}
                    value={formData.subAreaName}
                    onChange={handleChange}
                    required={required}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Sub Area</option>
                    {subAreaOptions
                      .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                      )
                      .map((a) => (
                        <option key={a._id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                  </select>
                ) : id === "city" || id === "state" ? (
                  <input
                    id={id}
                    name={id}
                    type="text"
                    value={formData[id as keyof FormData] || ""}
                    readOnly
                    required={required}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                  />
                ) : (
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={label}
                    required={required}
                    value={formData[id as keyof FormData]}
                    onChange={handleChange}
                    maxLength={id === "mobile" ? 10 : 100}
                    pattern={id === "mobile" ? "[0-9]{10}" : undefined}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                )}
                {errors[id as keyof FormErrors] && (
                  <div className="text-red-500 text-xs mt-1">{errors[id as keyof FormErrors]}</div>
                )}
              </div>
            ))}

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
            <a
              href="/signup/technician"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up here
            </a>
          </p>
        </div>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already Sign up?
          <a
            href="/login/user"
            className="text-blue-600 hover:underline font-medium ms-1"
          >
            Sign In
          </a>
        </p>
      </main>
    );
  }

  // Technician multi-step form
  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center">
        <div className="bg-blue-900 rounded px-1 py-1 w-fit flex">
          <img
            src="https://prnvservices.com/uploads/logo/1695377568_logo-white.png"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
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
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {errors.mobile && <div className="text-red-500 text-xs mt-1">{errors.mobile}</div>}
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
                    placeholder="Password (6-10 characters)"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={10}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
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
                  required
                  value={formData.buildingName}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {errors.buildingName && <div className="text-red-500 text-xs mt-1">{errors.buildingName}</div>}
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
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Pincode</option>
                  {pincodeData
                    .sort((a: any, b: any) => a.code - b.code)
                    .map((p) => (
                      <option key={p._id} value={p.code}>
                        {p.code}
                      </option>
                    ))}
                </select>
                {errors.pincode && <div className="text-red-500 text-xs mt-1">{errors.pincode}</div>}
              </div>
              <div>
                <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
                  Area Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="areaName"
                  name="areaName"
                  value={formData.areaName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Area</option>
                  {areaOptions.map((a) => (
                    <option key={a._id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
                {errors.areaName && <div className="text-red-500 text-xs mt-1">{errors.areaName}</div>}
              </div>
              <div>
                <label htmlFor="subAreaName" className="block text-sm font-medium text-gray-700">
                  Sub Area
                </label>
                <select
                  id="subAreaName"
                  name="subAreaName"
                  value={formData.subAreaName}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Sub Area (Optional)</option>
                  {subAreaOptions
                    .sort((a, b) =>
                      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    )
                    .map((a) => (
                      <option key={a._id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                </select>
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
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                />
                {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
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
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                />
                {errors.state && <div className="text-red-500 text-xs mt-1">{errors.state}</div>}
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
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  disabled={catLoading}
                >
                  <option value="" disabled>
                    {catLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {apiCategories
                    .sort((a, b) =>
                      a.category_name
                        .toLowerCase()
                        .localeCompare(b.category_name.toLowerCase())
                    )
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.category_name}
                      </option>
                    ))}
                </select>
                {catError && (
                  <div className="text-red-500 text-xs mt-1">{catError}</div>
                )}
                {errors.category && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.category}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="subscriptionId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subscription Plan <span className="text-red-500">*</span>
                </label>
                <select
                  id="subscriptionId"
                  name="subscriptionId"
                  value={formData.subscriptionId}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  disabled={planLoading || subscriptionPlans.length === 0}
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
                {planError && (
                  <div className="text-red-500 text-xs mt-1">{planError}</div>
                )}
                {errors.subscriptionId && (
                  <div className="text-red-500 text-xs mt-1">
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
                  Profile Image (Optional)
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
                  required
                  onChange={(e) => handleFileChange("aadharFront", e.target.files?.[0] || null)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {formData.aadharFront && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharFront.name}</p>
                )}
                {errors.aadharFront && <div className="text-red-500 text-xs mt-1">{errors.aadharFront}</div>}
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
                  required
                  onChange={(e) => handleFileChange("aadharBack", e.target.files?.[0] || null)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {formData.aadharBack && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {formData.aadharBack.name}</p>
                )}
                {errors.aadharBack && <div className="text-red-500 text-xs mt-1">{errors.aadharBack}</div>}
              </div>
              <div>
                <label htmlFor="panCard" className="block text-sm font-medium text-gray-700">
                  Pan Card (At least one of Pan or Voter Card required) <span className="text-red-500">*</span>
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
                {errors.panCard && <div className="text-red-500 text-xs mt-1">{errors.panCard}</div>}
              </div>
              <div>
                <label htmlFor="voterCard" className="block text-sm font-medium text-gray-700">
                  Voter Card (Alternative to Pan Card)
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
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  placeholder="10-digit phone"
                />
                {errors.authorizedPhone1 && <div className="text-red-500 text-xs mt-1">{errors.authorizedPhone1}</div>}
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
                  required
                  onChange={(e) => handleFileChange("auth1Photo", e.target.files?.[0] || null)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {formData.auth1Photo && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth1Photo.name}</p>
                )}
                {errors.auth1Photo && <div className="text-red-500 text-xs mt-1">{errors.auth1Photo}</div>}
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
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  placeholder="10-digit phone"
                />
                {errors.authorizedPhone2 && <div className="text-red-500 text-xs mt-1">{errors.authorizedPhone2}</div>}
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
                  required
                  onChange={(e) => handleFileChange("auth2Photo", e.target.files?.[0] || null)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
                {formData.auth2Photo && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {formData.auth2Photo.name}</p>
                )}
                {errors.auth2Photo && <div className="text-red-500 text-xs mt-1">{errors.auth2Photo}</div>}
              </div>
            </>
          )}

          <div className="pt-4 flex space-x-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="flex-1 bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Are you a user?{" "}
          <a
            href="/signup/user"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up here
          </a>
        </p>
      </div>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already Sign up?
        <a
          href="/login/technician"
          className="text-blue-600 hover:underline font-medium ms-1"
        >
          Sign In
        </a>
      </p>
    </main>
  );
};

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
//             alt="Prnv services Logo"
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
//             alt="Justdial Logo"
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
