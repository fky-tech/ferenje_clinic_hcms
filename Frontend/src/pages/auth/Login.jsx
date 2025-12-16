import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
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

            // Check if user exists and is a receptionist
            if (!user) {
                setErrors(prev => ({ ...prev, email: 'Invalid email or password' }));
                return;
            }

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <LogIn className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">HCMS Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={Mail}
                            required
                            placeholder="your.email@example.com"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={Lock}
                            required
                            placeholder="Enter your password"
                        />

                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Need help? Contact your system administrator
                    </p>
                </div>
            </div>
        </div>
    );
}
