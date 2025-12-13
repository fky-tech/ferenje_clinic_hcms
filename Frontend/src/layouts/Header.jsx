import { Bell, User, Settings, LogOut } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import { useState, useEffect, useRef } from 'react';
import { getStoredUser, clearStoredUser } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const user = getStoredUser();
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // Mock Notifications
    const notifications = [
        { id: 1, text: "New patient added to queue", time: "2 mins ago" },
        { id: 2, text: "Dr. Kebede has logged in", time: "10 mins ago" },
        { id: 3, text: "System maintenance at 12:00 AM", time: "1 hour ago" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        clearStoredUser();
        navigate('/');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                    <p className="text-sm text-gray-500">{formatDateTime(currentTime)}</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button 
                            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                            <p className="text-sm text-gray-800">{notif.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 text-center">
                                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        View All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="relative" ref={profileRef}>
                        <div 
                            className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {user ? `${user.first_name} ${user.last_name}` : 'Receptionist'}
                                </p>
                                <p className="text-xs text-gray-500">Receptionist</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                                <User className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                                <button 
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
