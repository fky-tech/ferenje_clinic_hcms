import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import { useState, useEffect, useRef } from 'react';
import { getStoredUser, clearStoredUser, setStoredUser } from '../utils/helpers';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Header({ isMobileOpen, setIsMobileOpen }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isAllNotifOpen, setIsAllNotifOpen] = useState(false);
    const [user, setUser] = useState(getStoredUser());
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const notifRef = useRef(null);
    const { notifications: allNotifications, removeNotification, clearAll } = useNotifications();
    const notifications = allNotifications.filter(n =>
        !n.targetRoles || n.targetRoles.length === 0 || n.targetRoles.includes(user?.role)
    );

    // Profile Edit State
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        password: '' // Only if changing
    });

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

    const handleNotificationClick = (id) => {
        // removeNotification(id); // Or mark as read? User previously deleted on click? 
        // Current logic: click -> delete?
        // User's previous code: setNotifications(prev => prev.filter(n => n.id !== id));
        removeNotification(id);
    };

    const handleClearNotifications = () => {
        clearAll();
        setIsNotifOpen(false);
    };

    const handleLogout = () => {
        clearAll(); // Clear notifications so next user doesn't see them
        clearStoredUser();
        navigate('/');
    };

    const handleEditProfile = () => {
        setProfileData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '',
            password: ''
        });
        setIsEditProfileOpen(true);
        setIsProfileOpen(false);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user?.person_id) {
                toast.error("User ID missing");
                return;
            }

            const payload = {
                ...profileData,
            };
            if (!payload.password) delete payload.password;

            await api.put(`/persons/${user.person_id}`, payload);
            toast.success("Profile updated successfully");

            const updatedUser = { ...user, ...profileData };
            delete updatedUser.password;
            setStoredUser(updatedUser);
            setUser(updatedUser);
            setIsEditProfileOpen(false);
        } catch (error) {
            console.error("Profile update error", error);
            toast.error("Failed to update profile");
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    return (
        <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 relative z-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Welcome!</h2>
                    <p className="text-[10px] sm:text-sm text-gray-500">{formatDateTime(currentTime)}</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="w-6 h-6" />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={handleClearNotifications}
                                            className="text-xs text-red-600 hover:text-red-700"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="px-4 py-3 text-sm text-gray-500 text-center">No new notifications</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => handleNotificationClick(notif.id)}
                                                className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                                            >
                                                <p className="text-sm text-gray-800">{notif.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50 rounded-b-lg">
                                    <button
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full"
                                        onClick={() => {
                                            setIsAllNotifOpen(true);
                                            setIsNotifOpen(false);
                                        }}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button - Next to Bell */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* User Info - Hidden on mobile, moved to Sidebar */}
                    <div className="hidden sm:flex relative" ref={profileRef}>
                        <div
                            className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.person_type || user?.role || 'User'}</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                                <User className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                    onClick={handleEditProfile}
                                >
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

            <Modal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                title="Edit My Profile"
            >
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name" name="first_name"
                            value={profileData.first_name} onChange={handleChange} required
                        />
                        <Input
                            label="Last Name" name="last_name"
                            value={profileData.last_name} onChange={handleChange} required
                        />
                    </div>
                    <Input
                        label="Email" name="email" type="email"
                        value={profileData.email} onChange={handleChange} required
                    />
                    <Input
                        label="Phone Number" name="phone_number"
                        value={profileData.phone_number} onChange={handleChange}
                    />
                    <Input
                        label="New Password (Optional)" name="password" type="password"
                        value={profileData.password} onChange={handleChange}
                        placeholder="Leave blank to keep current"
                    />
                    <div className="flex justify-end pt-4 border-t space-x-3">
                        <Button type="button" variant="secondary" onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </form>
            </Modal>
            {/* All Notifications Modal */}
            <Modal
                isOpen={isAllNotifOpen}
                onClose={() => setIsAllNotifOpen(false)}
                title="All Notifications"
            >
                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No notifications found</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className="px-4 py-4 hover:bg-gray-50 transition-colors flex justify-between items-start"
                                >
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">{notif.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                    <button
                                        onClick={() => handleNotificationClick(notif.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Dismiss"
                                    >
                                        <div className="sr-only">Dismiss</div>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                    {notifications.length > 0 && (
                        <Button variant="danger" onClick={handleClearNotifications}>Clear All</Button>
                    )}
                    <Button variant="secondary" onClick={() => setIsAllNotifOpen(false)} className="ml-2">Close</Button>
                </div>
            </Modal>
        </header>
    );
}
