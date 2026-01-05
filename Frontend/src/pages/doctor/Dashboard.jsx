import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Calendar, Clock, FileText, Settings,
    ChevronRight, UserPlus, CheckCircle, AlertCircle,
    UserCheck, UserX, Stethoscope, Bell, MoreVertical
} from 'lucide-react';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getStoredUser, isDateToday, formatDate, formatDateTime } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const user = getStoredUser();
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [stats, setStats] = useState({
        todayPatients: 0,
        todayAppointments: 0,
        queueCount: 0
    });
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [allActivities, setAllActivities] = useState([]);

    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            setCurrentDate(formatDate(now));
        };

        updateDateTime();
        const timeInterval = setInterval(updateDateTime, 30000);

        const fetchDashboardData = async () => {
            const currentUser = getStoredUser();
            if (!currentUser) return;

            try {
                const doctorId = currentUser.person_id || currentUser.id;

                const [apptRes, queueRes] = await Promise.all([
                    api.get(API_ROUTES.APPOINTMENTS),
                    api.get(API_ROUTES.QUEUES)
                ]);

                // Filter by doctor_id and today's date
                const todayAppts = apptRes.data.filter(a =>
                    a.doctor_id == doctorId &&
                    a.status !== 'cancelled' &&
                    isDateToday(a.appointment_date)
                );

                const queueCount = queueRes.data.filter(q =>
                    q.doctor_id == doctorId &&
                    isDateToday(q.date) &&
                    q.status === 'waiting'
                ).length;

                // Generate recent activities
                const activities = generateRecentActivities(apptRes.data.filter(a => a.doctor_id == doctorId), queueRes.data.filter(q => q.doctor_id == doctorId));
                setRecentActivities(activities.slice(0, 5));
                setAllActivities(activities);

                setStats({
                    todayPatients: queueCount + todayAppts.length,
                    todayAppointments: todayAppts.length,
                    queueCount: queueCount
                });

            } catch (error) {
                console.error("Dashboard fetch error:", error);
                // Fallback to sample data if API fails
                setRecentActivities(generateSampleActivities().slice(0, 5));
                setAllActivities(generateSampleActivities());
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        return () => clearInterval(timeInterval);
    }, []);

    const generateRecentActivities = (appointments, queues) => {
        const activities = [];

        // Add appointment activities
        appointments.forEach(appt => {
            activities.push({
                id: `appt-${appt.appointment_id}`,
                type: 'appointment',
                title: `Appointment with ${appt.FirstName} ${appt.Father_Name}`,
                description: `Scheduled for ${formatDate(appt.appointment_date)}`,
                time: appt.appointment_date,
                status: appt.status,
                icon: Calendar,
                color: 'text-purple-600',
                bg: 'bg-purple-100'
            });
        });

        // Add queue activities
        queues.forEach(queue => {
            let status, icon, color, bg;

            switch (queue.status) {
                case 'completed':
                    status = 'completed';
                    icon = CheckCircle;
                    color = 'text-green-600';
                    bg = 'bg-green-100';
                    break;
                case 'in_progress':
                    status = 'in-progress';
                    icon = Clock;
                    color = 'text-blue-600';
                    bg = 'bg-blue-100';
                    break;
                default:
                    status = 'new';
                    icon = Bell;
                    color = 'text-blue-800';
                    bg = 'bg-blue-100';
            }

            activities.push({
                id: `queue-${queue.queue_id}`,
                type: 'queue',
                title: `Patient ${queue.FirstName || ''} ${queue.Father_Name || ''}`,
                description: `Queue ${queue.status.replace('_', ' ')}`,
                time: queue.date,
                status: status,
                icon: icon,
                color: color,
                bg: bg
            });
        });

        return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    };

    const generateSampleActivities = () => [
        {
            id: 1,
            type: 'appointment',
            title: 'Appointment with John Doe',
            description: 'Routine checkup scheduled',
            time: new Date().toISOString(),
            status: 'scheduled',
            icon: Calendar,
            color: 'text-purple-600',
            bg: 'bg-purple-100'
        },
        {
            id: 2,
            type: 'queue',
            title: 'Patient Jane Smith',
            description: 'Consultation completed',
            time: new Date().toISOString(),
            status: 'completed',
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            id: 3,
            type: 'queue',
            title: 'Patient Robert Johnson',
            description: 'Currently in consultation',
            time: new Date().toISOString(),
            status: 'in-progress',
            icon: Clock,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            id: 4,
            type: 'appointment',
            title: 'New patient registration',
            description: 'Emily Chen registered',
            time: new Date().toISOString(),
            status: 'new',
            icon: UserPlus,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        },
        {
            id: 5,
            type: 'queue',
            title: 'Patient waiting',
            description: 'In queue for 15 minutes',
            time: new Date().toISOString(),
            status: 'new',
            icon: Bell,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        }
    ];

    const getStatusBadge = (status) => {
        const config = {
            'completed': { text: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
            'in-progress': { text: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            'scheduled': { text: 'Scheduled', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            'new': { text: 'New', color: 'bg-blue-100 text-blue-800 border-blue-200' }
        };

        const { text, color } = config[status] || config.new;
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>
                {text}
            </span>
        );
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="space-y-4 p-3 md:p-4 pb-16">
            {/* Header Section - Smaller */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 text-xs md:text-xs mt-0.5">{currentDate}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600/70 bg-clip-text text-transparent">
                        {currentTime}
                    </div>
                    <div className="text-xs text-slate-500">
                        Live updating
                    </div>
                </div>
            </div>

            {/* Stats Grid - Smaller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <GradientStatCard
                    title="Patients in Queue"
                    value={stats.queueCount}
                    icon={Clock}
                    gradient="from-blue-500 to-blue-600"
                    hoverGradient="from-blue-600 to-blue-700"
                    onClick={() => navigate('/doctor/queue')}
                    clickable
                />
                <GradientStatCard
                    title="Today's Appointments"
                    value={stats.todayAppointments}
                    icon={Calendar}
                    gradient="from-purple-500 to-purple-600"
                    hoverGradient="from-purple-600 to-purple-700"
                    onClick={() => navigate('/doctor/appointments')}
                    clickable
                />
                <GradientStatCard
                    title="Total Patients Today"
                    value={stats.todayPatients}
                    icon={Users}
                    gradient="from-emerald-500 to-emerald-600"
                    hoverGradient="from-emerald-600 to-emerald-700"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Activity Section - Now takes 2/3 width */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Bell size={18} className="text-blue-800" />
                                Recent Activity
                            </h2>
                            <button
                                onClick={() => setIsActivityModalOpen(true)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                View All
                                <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${activity.bg} ${activity.color}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-slate-800 text-sm truncate">{activity.title}</h3>
                                                <div className="text-xs text-slate-500 font-medium">
                                                    {formatDateTime(activity.time)}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-0.5">{activity.description}</p>
                                            <div className="mt-1.5">
                                                {getStatusBadge(activity.status)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title="Recent Activity History" width="max-w-2xl">
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        {allActivities.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                                    <div className={`p-2 rounded-lg ${activity.bg} ${activity.color}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-slate-800 text-sm">{activity.title}</h3>
                                            <span className="text-xs text-slate-500">{formatDateTime(activity.time)}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">{activity.description}</p>
                                        <div className="mt-1">{getStatusBadge(activity.status)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>

                {/* Quick Actions Section - Smaller */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <QuickActionButton
                                icon={Clock}
                                title="Manage Queue"
                                description="Call next patient"
                                color="text-blue-600"
                                bg="bg-blue-50"
                                hoverBg="hover:bg-blue-100"
                                onClick={() => navigate('/doctor/queue')}
                            />
                            <QuickActionButton
                                icon={Calendar}
                                title="View Schedule"
                                description="Check appointments"
                                color="text-purple-600"
                                bg="bg-purple-50"
                                hoverBg="hover:bg-purple-100"
                                onClick={() => navigate('/doctor/appointments')}
                            />
                            <QuickActionButton
                                icon={Users}
                                title="My Patients"
                                description="Patient records"
                                color="text-emerald-600"
                                bg="bg-emerald-50"
                                hoverBg="hover:bg-emerald-100"
                                onClick={() => navigate('/doctor/patients')}
                            />

                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

// Gradient Stat Card Component - Smaller
function GradientStatCard({ title, value, icon: Icon, gradient, hoverGradient, onClick, clickable }) {
    return (
        <div
            onClick={onClick}
            className={`relative group ${clickable ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative bg-white p-4 rounded-xl shadow border border-slate-100 group-hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                    </div>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                        <Icon size={18} />
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Updated now</span>
                    {clickable && (
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </div>
            </div>
        </div>
    );
}

// Quick Action Button Component - Smaller
function QuickActionButton({ icon: Icon, title, description, color, bg, hoverBg, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${bg} ${hoverBg} border border-slate-100 hover:border-slate-200 transition-colors group active:scale-[0.98]`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-white ${color} shadow-xs`}>
                    <Icon size={16} />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-slate-800 text-sm">{title}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </button>
    );
}

// Helper function for time formatting
function formatTime(date) {
    return formatDateTime(date);
}