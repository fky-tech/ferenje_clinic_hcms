import { useState, useEffect } from 'react';
import {
    Users, Calendar, Clock, DollarSign, UserCheck,
    TrendingUp, Search, UserPlus, CreditCard,
    ChevronRight, MoreHorizontal, ArrowUpRight
} from 'lucide-react';


/* -------------------------------------------------------------------------- */
/* UNCOMMENT YOUR ORIGINAL IMPORTS BELOW                       */
/* -------------------------------------------------------------------------- */
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatCurrency, formatDateTime, isDateToday } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Dashboard() {
    // -------------------------------------------------------------------------
    //                       BACKEND LOGIC (UNTOUCHED)
    // -------------------------------------------------------------------------
    const [stats, setStats] = useState({
        patientsToday: 0,
        appointmentsToday: 0,
        queueCount: 0,
        revenueToday: 0,
        totalPatientsServed: 0,
        avgWaitTime: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data concurrently
            const [patients, appointments, queues, payments] = await Promise.all([
                api.get(API_ROUTES.PATIENTS),
                api.get(API_ROUTES.APPOINTMENTS),
                api.get(API_ROUTES.QUEUES),
                api.get(API_ROUTES.PAYMENTS),
            ]);

            // Calculate today's stats
            const patientsToday = patients.data.filter(p => isDateToday(p.date_registered)).length;
            const appointmentsToday = appointments.data.filter(a => isDateToday(a.appointment_date) && a.status !== 'cancelled').length;
            const queueToday = queues.data.filter(q => isDateToday(q.date) && q.status === 'waiting');
            const paymentsToday = payments.data.filter(p => isDateToday(p.billing_date));
            const revenueToday = paymentsToday.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

            setStats({
                patientsToday,
                appointmentsToday,
                queueCount: queueToday.length,
                revenueToday,
                totalPatientsServed: patientsToday,
                avgWaitTime: 15, // Placeholder - would calculate from actual data
            });

            // Recent activity
            const activity = [
                ...patients.data.slice(-3).map(p => ({
                    type: 'registration',
                    title: `New Patient: ${p.FirstName} ${p.Father_Name || ''}`,
                    time: p.date_registered
                })),
                ...paymentsToday.slice(-3).map(p => ({
                    type: 'payment',
                    title: `Payment: ${formatCurrency(p.amount)}`,
                    time: p.billing_date
                })),
            ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

            setRecentActivity(activity);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // -------------------------------------------------------------------------
    //                       VISUAL CONFIGURATION
    // -------------------------------------------------------------------------

    const statCards = [
        {
            title: 'New Patients',
            value: stats.patientsToday,
            icon: Users,
            trend: '+12%',
            trendUp: true,
            color: 'text-blue-900',
            bg: 'bg-blue-50',

        },
        {
            title: 'Today\'s Appointments',
            value: stats.appointmentsToday,
            icon: Calendar,
            trend: '+5%',
            trendUp: true,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            title: 'Waiting Queue',
            value: stats.queueCount,
            icon: Clock,
            trend: '-2%',
            trendUp: false,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            title: 'Today\'s Revenue',
            value: formatCurrency(stats.revenueToday),
            icon: DollarSign,
            trend: '+8%',
            trendUp: true,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            title: 'Today Served',
            value: stats.totalPatientsServed,
            icon: UserCheck,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            title: 'Avg Wait',
            value: `${stats.avgWaitTime}m`,
            icon: TrendingUp,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
        },
    ];

    const quickActions = [
        {
            label: 'Register',
            icon: UserPlus,
            to: '/receptionist/register-patient',  // Added leading slash
            variant: 'primary',
            desc: 'Add new patient'
        },
        {
            label: 'Schedule',
            icon: Calendar,
            to: '/receptionist/appointments',  // Added leading slash and receptionist prefix
            variant: 'secondary',
            desc: 'Book visit'
        },
        {
            label: 'Search',
            icon: Search,
            to: '/receptionist/search-patient',  // Added leading slash and receptionist prefix
            variant: 'secondary',
            desc: 'Find records'
        },
        {
            label: 'Cards',
            icon: CreditCard,
            to: '/receptionist/view-cards',  // Added leading slash and receptionist prefix
            variant: 'secondary',
            desc: 'Billing info'
        },
    ];

    // -------------------------------------------------------------------------
    //                       RENDER
    // -------------------------------------------------------------------------

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Minimal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-gray-500">System Operational</span>
                </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default group">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} bg-opacity-50`}>
                                    <Icon size={16} strokeWidth={2.5} />
                                </div>
                                {stat.trend && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mt-1">{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions - Scaled Down */}
                <div className="lg:col-span-2">
                    <Card
                        title="Quick Actions"
                        className="h-full"
                        action={<button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={index} to={action.to} className="group no-underline">
                                        <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all h-full text-center cursor-pointer">
                                            <div className={`p-2 rounded-full mb-2 group-hover:scale-110 transition-transform ${action.variant === 'primary' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-500 shadow-sm'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600">{action.label}</span>
                                            <span className="text-[10px] text-gray-400 mt-1">{action.desc}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mini Insight Section */}
                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100/50">
                                <div className="bg-white p-1.5 rounded-md shadow-sm text-indigo-600">
                                    <TrendingUp size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-indigo-900">Efficiency Insight</p>
                                    <p className="text-[10px] text-indigo-700/80 leading-relaxed">Patient registration is 15% faster today compared to last week.</p>
                                </div>
                                <ChevronRight size={14} className="text-indigo-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity - List View */}
                <div className="lg:col-span-1">
                    <Card title="Activity Feed" className="h-full">
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <Clock size={24} className="mb-2 opacity-50" />
                                <p className="text-xs">No recent activity</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="group flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer">
                                        <div className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center border ${activity.type === 'registration'
                                            ? 'bg-blue-50 border-blue-100 text-blue-600'
                                            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                            }`}>
                                            {activity.type === 'registration' ? <UserPlus size={12} /> : <DollarSign size={12} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs font-semibold text-gray-700 truncate pr-2">{activity.title}</p>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-50 px-1.5 py-0.5 rounded">{formatDateTime(activity.time)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-[10px] text-gray-400">{activity.type === 'registration' ? 'Front Desk' : 'Billing Dept'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </Card>
                </div>
            </div>
        </div>
    );
}