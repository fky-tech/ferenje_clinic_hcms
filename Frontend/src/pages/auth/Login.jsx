import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateLoginForm, hasErrors } from '../../utils/validators';
import { API_ROUTES } from '../../utils/constants';
import { setStoredUser } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validationErrors = validateLoginForm(formData);
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Get user by email
            const response = await api.get(`${API_ROUTES.LOGIN}/${formData.email}`);
            const user = response.data;

            // Check if user exists
            if (!user) {
                setErrors(prev => ({ ...prev, email: 'Invalid email or password' }));
                return;
            }

            // Check role access
            if (user.role !== 'receptionist' && user.role !== 'doctor' && user.role !== 'lab_doctor' && user.role !== 'admin') {
                toast.error('Access denied. Invalid role.');
                return;
            }

            // Check password (plain text as per requirements)
            if (user.password !== formData.password) {
                setErrors(prev => ({ ...prev, password: 'Invalid email or password' }));
                return;
            }

            // Store user data
            setStoredUser(user);

            toast.success(`Welcome back, ${user.first_name}!`);

            // Role-based navigation
            if (user.role === 'receptionist') {
                navigate('/receptionist/dashboard');
            } else if (user.role === 'doctor') {
                navigate('/doctor/dashboard');
            } else if (user.role === 'lab_doctor') {
                navigate('/lab/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                toast.error('Unknown role');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 404) {
                setErrors(prev => ({ ...prev, email: 'Invalid email or password' }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] font-sans" >
            {/* Left Side: Branding/Illustration Section */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 text-white relative overflow-hidden"  style={{
        backgroundImage: "url('/images/loginbg3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "",
      }}>
             {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Top Branding */}
      <div className="absolute top-6 left-14 z-10 flex items-center gap-1">
        <div className="w-14 h-12  rounded-full overflow-hidden">
          <img
            src="/images/logo.png"
            alt="Ferenjie Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-lg font-semibold tracking-wide">FERENJIE</span>
      </div> 
                {/* <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 0 L100 100 L0 100 Z" fill="currentColor" />
                    </svg>
                </div> */}
                <div className="z-10 max-w-md mt-96 mr-12">
                    {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mb-8 shadow-xl">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div> */}
                <h1 className="text-3xl  font-bold mb-4  leading-tight tracking-tight">FERENJIE HCMS SYSTEM</h1>
                    <p className="text-blue-100 text-sm opacity-90">
                        Manage patient records, appointments, and laboratory results with our comprehensive HCMS portal.
                    </p>
                    <div className="flex gap-2 mt-6">
            <span className="w-6 h-2 rounded-full bg-white/50" />
            <span className="w-8 h-2 rounded-full bg-white/70" />
            <span className="w-20 h-2 rounded-full bg-white/90" />
          </div>
                </div>
                
            </div>

            {/* Right Side: Login Form Section */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10">

                        <h2 className="text-3xl  font-extrabold text-gray-800 mb-2 tracking-tight">Welcome Back To Ferenjie</h2>
                        <p className="text-gray-500  text-sm font-medium">sign in Your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 ">
                        <Input
                            label="Your Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            // icon={Mail}
                            // required
                            placeholder="name@hospital.com"
                            className="bg-white  border-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />

                        <div className="relative group">
                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                // icon={Lock}
                                // required
                                placeholder="••••••••"
                                className="bg-white border-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-1">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md transition-all cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                    Keep me signed in
                                </span>
                            </label>

                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900  text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 font-bold text-base transition-all active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    Sign Into Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            For access issues, please 
                            <a href="#" className="ml-1 text-gray-600 hover:text-gray-700 hover:underline font-bold transition-colors">Contact Admin</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}