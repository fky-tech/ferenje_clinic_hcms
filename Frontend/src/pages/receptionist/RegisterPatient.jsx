import { useState, useEffect } from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import EthiopianDatePicker from "../../components/common/EthiopianDatePicker";

import {
  UserPlus,
  CreditCard,
  MapPin,
  Calendar,
  Activity,
  Hash,
  DollarSign,
  Save,
  X,
  ChevronRight,
  Phone,
  Home,
  User,
} from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../api/axios";
import {
  API_ROUTES,
  GENDER_OPTIONS,
  PAYMENT_TYPES,
  CARD_STATUS,
} from "../../utils/constants";
import { validatePatientForm, hasErrors } from "../../utils/validators";
import {
  generatePatientId,
  generateCardNumber,
  getCardExpiryDate,
  formatForAPI,
  formatDate,
} from "../../utils/helpers";
import toast from "react-hot-toast";
const CustomInput = ({
  label,
  error,
  icon,
  className = "",
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className={`w-full bg-gray-50 border ${error
            ? "border-red-300 focus:ring-red-200"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            } text-gray-900 text-sm rounded-lg px-3 py-2.5 transition-all
                    placeholder-gray-400 focus:ring-2
                    ${icon ? "pl-9" : ""}
                    ${props.disabled
              ? "opacity-60 cursor-not-allowed bg-gray-100"
              : "bg-white"
            }
                    ${className}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
export default function RegisterPatient() {
  const [formData, setFormData] = useState({
    // Patient fields
    patient_id: generatePatientId(),
    FirstName: "",
    Father_Name: "",
    GrandFather_Name: "",
    DateOfBirth: "",
    Age: "",
    Sex: "",
    Region: "",
    Wereda: "",
    HouseNo: "",
    PhoneNo: "",
    date_registered: formatForAPI(new Date()),
    // Card fields
    CardNumber: generateCardNumber(),
    issue_date: formatForAPI(new Date()),
    expire_date: formatForAPI(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    // Payment
    amount: 100, // Default card fee
    doctor_id: "", // Assigned Doctor
  });
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get(API_ROUTES.DOCTORS);
        setDoctors(response.data);
      } catch (err) {
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-calculate DOB from Age
    if (name === "Age" && value) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(value);
      // Default to Jan 1st of birth year
      const dob = `${birthYear}-01-01`;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        DateOfBirth: dob,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePatientForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // 1. Create patient
      await api.post(API_ROUTES.PATIENTS, {
        patient_id: formData.patient_id,
        FirstName: formData.FirstName,
        Father_Name: formData.Father_Name,
        GrandFather_Name: formData.GrandFather_Name,
        DateOfBirth: formData.DateOfBirth,
        Age: formData.Age ? parseInt(formData.Age) : null,
        Sex: formData.Sex,
        Region: formData.Region,
        Wereda: formData.Wereda,
        HouseNo: formData.HouseNo,
        PhoneNo: formData.PhoneNo,
        date_registered: formData.date_registered,
        doctor_id: formData.doctor_id,
      });

      // 2. Create card
      const cardResponse = await api.post(API_ROUTES.CARDS, {
        patient_id: formData.patient_id,
        CardNumber: formData.CardNumber,
        status: CARD_STATUS.ACTIVE,
        issue_date: formData.issue_date,
        expire_date: formData.expire_date,
      });

      // Capture card_id from response. Assuming backend returns { card_id: ... } or { insertId: ... }
      // If CardController returns { message, card_id }, used that.
      const newCardId = cardResponse.data.card_id || cardResponse.data.insertId;

      // 3. Record payment
      await api.post(API_ROUTES.PAYMENTS, {
        card_id: newCardId,
        amount: formData.amount,
        billing_date: new Date().toISOString().slice(0, 19).replace("T", " "), // MySQL Format
        description: "New patient registration and card fee",
        payment_type: PAYMENT_TYPES.CARD_REGISTRATION,
        status: "paid",
      });

      toast.success("Patient registered successfully!");
      addNotification(
        `New patient registered: ${formData.FirstName} ${formData.Father_Name}`,
        "success",
        ["receptionist", "admin"]
      );

      // Reset form
      setFormData({
        patient_id: generatePatientId(),
        FirstName: "",
        Father_Name: "",
        GrandFather_Name: "",
        DateOfBirth: "",
        Age: "",
        Sex: "",
        Region: "",
        Wereda: "",
        HouseNo: "",
        PhoneNo: "",
        date_registered: formatForAPI(new Date()),
        CardNumber: generateCardNumber(),
        issue_date: formatForAPI(new Date()),
        expire_date: formatForAPI(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
        amount: 100,
        doctor_id: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Use your actual Input component instead of custom one
  const CustomInputs = ({ label, error, icon, className = "", ...props }) => {
    // Ensure all props are passed down properly
    const inputProps = {
      ...props,
      onChange: handleChange,
      value: formData[props.name] ?? "",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            {...inputProps}
            className={`w-full bg-gray-50 border ${error
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              } text-gray-900 text-sm rounded-lg px-3 py-2.5 outline-none transition-all placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${icon ? "pl-9" : ""
              } ${props.disabled
                ? "opacity-60 cursor-not-allowed bg-gray-100"
                : "bg-white"
              } ${className}`}
            autoComplete="off"
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-pulse">{error}</p>
        )}
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-3">
      <Icon size={16} className="text-blue-500" />
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50  flex flex-col mt-[-26px] font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1300px]sm:rounded-2xl sm:border-white overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
      >
        {/* Header - Mobile responsive */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserPlus size={20} className="sm:size-[24px]" />
            </div>
            <div className="flex-1 sm:flex-none">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                Patient Registration
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                New Admission & Card Issuance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 self-end sm:self-center">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              ID
            </span>
            <span className="text-sm font-mono font-bold text-gray-700">
              #{formData.patient_id}
            </span>
          </div>
        </div>

        {/* Main Content Grid - Responsive columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
            {/* COLUMN 1: Personal Identity */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              <SectionHeader icon={User} title="Patient Identity" />
              <div className="space-y-3 sm:space-y-4">
                <CustomInput
                  label="First Name"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  error={errors.FirstName}
                  required
                  placeholder="Abel"
                />
                <CustomInput
                  label="Father's Name"
                  name="Father_Name"
                  value={formData.Father_Name}
                  onChange={handleChange}
                  placeholder="Negus"
                />
                <CustomInput
                  label="Grandfather's Name"
                  name="GrandFather_Name"
                  value={formData.GrandFather_Name}
                  onChange={handleChange}
                  placeholder="Tewelde"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="Sex"
                        value={formData.Sex}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 bg-gray-50 border ${errors.Sex ? "border-red-300" : "border-gray-200"
                          } text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none`}
                      >
                        <option value="">Select</option>
                        {GENDER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    {errors.Sex && (
                      <p className="mt-1 text-xs text-red-500">{errors.Sex}</p>
                    )}
                  </div>
                  <CustomInput
                    label="Age"
                    name="Age"
                    type="number"
                    value={formData.Age}
                    onChange={handleChange}
                    placeholder="Years"
                  />
                </div>
                <EthiopianDatePicker
                  label="Date of Birth"
                  value={formData.DateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, DateOfBirth: e.target.value }))}
                  error={errors.DateOfBirth}
                  required
                />
              </div>
            </div>

            {/* COLUMN 2: Demographics & Contact */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5 lg:border-l lg:border-r border-gray-100 lg:px-6">
              <SectionHeader icon={Home} title="Address & Contact" />
              <div className="space-y-3 sm:space-y-4">
                <CustomInput
                  label="Region"
                  name="Region"
                  value={formData.Region}
                  onChange={handleChange}
                  placeholder="Region "
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomInput
                    label="Wereda"
                    name="Wereda"
                    value={formData.Wereda}
                    onChange={handleChange}
                    placeholder="Sub-city"
                  />
                  <CustomInput
                    label="House No"
                    name="HouseNo"
                    value={formData.HouseNo}
                    onChange={handleChange}
                    placeholder="290"
                  />
                </div>
                <div className="pt-1 sm:pt-2">
                  <CustomInput
                    label="Phone Number"
                    name="PhoneNo"
                    value={formData.PhoneNo}
                    onChange={handleChange}
                    error={errors.PhoneNo}
                    placeholder="09.."
                    icon={<Phone size={14} className="text-gray-400" />}
                  />
                </div>
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Assign Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.doctor_id} value={doc.doctor_id}>
                        Dr. {doc.first_name} {doc.last_name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Card & Payment */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              <SectionHeader icon={CreditCard} title="Card & Payment" />

              {/* Card Preview - Responsive */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-3 sm:p-4 text-white shadow-lg mb-4">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                    Medical Card
                  </div>
                  <Activity className="text-blue-400" size={16} />
                </div>
                <div className="text-base sm:text-lg font-mono tracking-widest mb-1 break-all">
                  {formData.CardNumber}
                </div>
                <div className="text-xs text-gray-400 mb-3 sm:mb-4">
                  Card Number
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <div>
                    <div className="text-gray-500 text-[10px] uppercase">
                      Issued
                    </div>
                    <div className="text-sm">{formatDate(formData.issue_date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-[10px] uppercase">
                      Expires
                    </div>
                    <div className="text-sm">{formatDate(formData.expire_date)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EthiopianDatePicker
                    label="Issue Date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                    className="bg-white text-xs"
                    disabled
                  />
                  <EthiopianDatePicker
                    label="Expiry Date"
                    value={formData.expire_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expire_date: e.target.value }))}
                    className="bg-white text-xs"
                    disabled
                  />
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <CustomInput
                    label="Card Fee (ETB)"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    icon={<DollarSign size={14} className="text-gray-400" />}
                    className="font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Actions - Mobile responsive */}
        <div className="bg-gray-50 px-4  sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center justify-center mt-[-12px] mb-[12px] gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 min-h-[42px] w-full sm:w-auto"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center mt-[-12px] mb-[12px] justify-center gap-2 py-1.5 px-4 rounded-lg text-sm font-semibold 
                        bg-gradient-to-r from-gray-900 via-blue-700 to-blue-600 
                        hover:from-blue-600 hover:via-blue-700 hover:to-gray-900 
                        text-white shadow-md shadow-blue-300 
                        transition-all duration-200 active:scale-95 
                        min-h-[32px] w-full sm:w-auto 
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Save size={16} />
                  Register Patient
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Mobile bottom spacing */}
      <div className="h-4 sm:h-6"></div>
    </div>
  );
}