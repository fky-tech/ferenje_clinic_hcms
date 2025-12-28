import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (text, type = 'info', targetRoles = []) => {
        const newNotif = {
            id: Date.now(),
            text,
            time: 'Just now',
            timestamp: new Date().toISOString(),
            type,
            targetRoles, // Array of roles that should see this: ['doctor', 'receptionist', etc]
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            removeNotification,
            clearAll,
            unreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
