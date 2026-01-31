import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Lock,
    ShieldCheck,
    ArrowRight,
    Eye,
    EyeOff
} from 'lucide-react';
import api from '../../api/axios';
import { validateLoginForm, hasErrors } from '../../utils/validators';
import { API_ROUTES } from '../../utils/constants';
import { setStoredUser } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Update time every second for the header
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format date like: "Thursday January 25, 2026, 2:33:39 PM EAT"
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    }).format(currentTime);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateLoginForm(formData);
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Preservation of existing JWT login logic
            const response = await api.post(API_ROUTES.LOGIN, {
                email: formData.email,
                password: formData.password
            });

            const { token, refreshToken, user } = response.data;

            // Store authentication data
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            setStoredUser(user);

            toast.success(`Welcome back, ${user.first_name}!`);

            // Role-based navigation
            const dashboards = {
                receptionist: '/receptionist/dashboard',
                doctor: '/doctor/dashboard',
                lab_doctor: '/lab/dashboard',
                admin: '/admin/dashboard'
            };
            navigate(dashboards[user.role] || '/');

        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setErrors({ email: 'Invalid email or password' });
            } else if (error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setErrors(backendErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 overflow-hidden">

            {/* --- TOP HEADER --- */}
            {/* <header className="h-10 flex bg-white items-center justify-between px-6 z-30 shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-sm font-bold text-gray-700 tracking-tight">Healthcare Management System</h1>
                </div>
                <div className="hidden md:block text-xs text-gray-500 font-medium italic">
                    {formattedDate}
                </div>
            </header> */}

            {/* --- MAIN CONTENT --- */}
            <div
                className="flex-1 relative flex"
                style={{
                    backgroundImage: "url('/images/login.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay to ensure readability */}
                <div className="absolute inset-0 bg-black/10 md:bg-transparent" />

                {/* LOGIN FORM (Floating Card) */}
                <div className="relative z-20 w-full flex items-center justify-center md:justify-end md:pr-[15%] lg:pr-[12%]">
                    <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-[380px] mx-4 border border-white/30">

                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-sm text-gray-600">Please sign in to your portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Username Input */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email / Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm shadow-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm shadow-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] ml-1 font-medium">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            {/* <div className="flex items-center justify-between px-1">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all"
                                    />
                                    <span className="ml-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Keep me signed in</span>
                                </label>
                                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</a>
                            </div> */}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group uppercase tracking-widest"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        SIGN INTO ACCOUNT
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-medium">
                                For access issues, please
                                <a href="#" className="ml-1 text-primary-600 hover:text-primary-700 font-bold hover:underline transition-colors">Contact Administrator</a>
                            </p>
                        </div> */}
                    </div>
                </div>

            </div>
        </div>
    );
}