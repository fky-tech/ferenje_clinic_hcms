import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Search, LogOut, Activity } from 'lucide-react';
import { logoutUser, getStoredUser } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function LabSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getStoredUser();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path)
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white';
    };

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold">Lab Portal</h1>
                <p className="text-sm text-gray-400 mt-1">Ferenje Clinic</p>
                {user?.lab_specialty && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-900 text-blue-100 rounded">
                        {user.lab_specialty}
                    </span>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <Link
                    to="/lab/dashboard"
                    className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/lab/dashboard')}`}
                >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                </Link>

                {user?.lab_specialty === 'ultrasound' ? (
                    <Link
                        to="/lab/todays-ultrasounds"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/lab/todays-ultrasounds')}`}
                    >
                        <Activity className="w-5 h-5 mr-3" />
                        Today's Ultrasounds
                    </Link>
                ) : (
                    <Link
                        to="/lab/todays-labs"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/lab/todays-labs')}`}
                    >
                        <ClipboardList className="w-5 h-5 mr-3" />
                        Today's Labs
                    </Link>
                )}

                <Link
                    to="/lab/search-patient"
                    className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/lab/search-patient')}`}
                >
                    <Search className="w-5 h-5 mr-3" />
                    Search Patients
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
