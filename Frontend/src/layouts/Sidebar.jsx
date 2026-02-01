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
    X,
    Clock,
    FileText,
    Activity,
    User,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { clearStoredUser, getStoredUser } from '../utils/helpers';

const receptionistMenuItems = [
    { path: '/receptionist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/receptionist/register-patient', icon: UserPlus, label: 'Register Patient' },
    { path: '/receptionist/search-patient', icon: Search, label: 'Search Patient' },
    { path: '/receptionist/view-cards', icon: CreditCard, label: 'View Cards' },
    { path: '/receptionist/lab-requests', icon: FlaskConical, label: 'Lab Requests' },
    { path: '/receptionist/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/receptionist/manage-queue', icon: Users, label: 'Queues' },
];

const doctorMenuItems = [
    { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor/patients', icon: Users, label: 'My Patients' }, // Placeholder path
    { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor/queue', icon: Clock, label: 'Queue' }, // Using Clock for Queue if Users is taken
];

const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/doctors', icon: UserPlus, label: 'Manage Doctors' },
    { path: '/admin/receptionists', icon: Users, label: 'Manage Receptionists' },
    { path: '/admin/patients', icon: Search, label: 'View Patients' },
    { path: '/admin/lab-requests', icon: FlaskConical, label: 'Lab Reports' },
    { path: '/admin/reports', icon: FileText, label: 'Generate Reports' },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Get User Role
    const user = getStoredUser();
    const role = user?.role || 'receptionist';

    let menuItems = receptionistMenuItems;
    if (role === 'doctor') menuItems = doctorMenuItems;
    if (role === 'lab_doctor') {
        const isUltrasound = user?.lab_specialty === 'ultrasound';
        menuItems = [
            { path: '/lab/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            {
                path: isUltrasound ? '/lab/todays-ultrasounds' : '/lab/todays-labs',
                icon: isUltrasound ? Activity : FlaskConical,
                label: isUltrasound ? "Ultrasounds" : "Labs"
            },
            { path: '/lab/search-patient', icon: Search, label: 'Search Patients' },
        ];
    }
    if (role === 'admin') menuItems = adminMenuItems;

    // Get portal name from person_type
    const getPortalName = () => {
        if (!user || (!user.person_type && !user.role)) return 'Portal';
        const userRole = (user.person_type || user.role).toLowerCase();
        if (userRole === 'doctor') return 'Doctor Portal';
        if (userRole === 'receptionist') return 'Receptionist Portal';
        if (userRole === 'lab_doctor') return 'Lab Portal';
        if (userRole === 'admin') return 'Admin Portal';
        return 'HCMS Portal';
    };
    const portalName = getPortalName();

    const handleLogout = () => {
        clearStoredUser();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300">
            <div className={`h-20 flex items-center border-b border-gray-200 ${isCollapsed ? 'lg:justify-center px-2' : 'justify-between px-6'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-1">
                        <div className="w-14 h-14  rounded-full overflow-hidden">
                            <img
                                src="/images/logo.png"
                                alt="Ferenjie Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="overflow-hidden whitespace-nowrap">

                            <h1 className="text-lg font-bold text-primary-600 truncate">Ferenje Clinic</h1>
                            {/* <p className="text-xs text-gray-500 truncate">{portalName}</p> */}
                        </div>
                    </div>
                )}
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`hidden lg:block p-2 rounded-lg hover:bg-gray-100 text-gray-500 ${isCollapsed ? '' : 'ml-2'}`}
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    aria-label="Close Menu"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 p-3 space-y-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Match path start to handle nested routes or exact matches
                    // Or simple check
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <div key={item.path} className="relative group">
                            <Link
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)} // Keep this for mobile drawer closing
                                className={`
                                    flex items-center rounded-lg transition-all duration-200
                                    ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
                                    ${isActive
                                        ? 'bg-gradient-to-r from-gray-900 to-blue-700/70 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${!isCollapsed && 'mr-3'}`} />
                                {!isCollapsed && <span className=" text-sm whitespace-nowrap">{item.label}</span>}
                            </Link>

                            {/* Hover Tooltip (Collapsed Only) */}
                            {isCollapsed && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile - Mobile Only */}
            <div className="lg:hidden p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                    </div>
                </div>
                {/* Mobile specific profile actions could go here if needed, 
                    but keep it simple for now to avoid duplicating Header too much */}
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut className={`w-4 h-4 ${!isCollapsed && 'mr-3'}`} />
                    {!isCollapsed && <span className="font-medium text-sm " >Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar (Drawer) */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)}>
                    <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <SidebarContent />
            </div>
        </>
    );
}
