import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UserPlus,
    Search,
    CreditCard,
    FlaskConical,
    Calendar,
    Users,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { clearStoredUser } from '../utils/helpers';

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/register-patient', icon: UserPlus, label: 'Register Patient' },
    { path: '/search-patient', icon: Search, label: 'Search Patient' },
    { path: '/view-cards', icon: CreditCard, label: 'View Cards' },
    { path: '/lab-requests', icon: FlaskConical, label: 'Lab Requests' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/manage-queue', icon: Users, label: 'Manage Queue' },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        clearStoredUser();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primary-600">Ferenje Clinic</h1>
                <p className="text-sm text-gray-500">Receptionist Portal</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`
                flex items-center px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }
              `}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)}>
                    <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 h-screen sticky top-0">
                <SidebarContent />
            </div>
        </>
    );
}
