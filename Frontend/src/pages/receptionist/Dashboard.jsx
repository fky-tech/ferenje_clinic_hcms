import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, DollarSign, UserCheck, TrendingUp, Plus, Search, UserPlus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatCurrency, formatDateTime, isDateToday } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Dashboard() {
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
            const appointmentsToday = appointments.data.filter(a => isDateToday(a.appointment_start_time)).length;
            const queueToday = queues.data.filter(q => isDateToday(q.date) && q.status === 'waiting');
            const paymentsToday = payments.data.filter(p => isDateToday(p.billing_date));
            const revenueToday = paymentsToday.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

            setStats({
                patientsToday,
                appointmentsToday,
                queueCount: queueToday.length,
                revenueToday,
                totalPatientsServed: patients.data.length,
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

    const statCards = [
        {
            title: 'Patients Registered Today',
            value: stats.patientsToday,
            icon: Users,
            color: 'bg-blue-100 text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Appointments Today',
            value: stats.appointmentsToday,
            icon: Calendar,
            color: 'bg-green-100 text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Patients in Queue',
            value: stats.queueCount,
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Revenue Today',
            value: formatCurrency(stats.revenueToday),
            icon: DollarSign,
            color: 'bg-purple-100 text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Total Patients Served',
            value: stats.totalPatientsServed,
            icon: UserCheck,
            color: 'bg-indigo-100 text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            title: 'Avg Wait Time',
            value: `${stats.avgWaitTime} min`,
            icon: TrendingUp,
            color: 'bg-pink-100 text-pink-600',
            bgColor: 'bg-pink-50',
        },
    ];

    const quickActions = [
        { label: 'Register Patient', icon: UserPlus, to: '/register-patient', variant: 'primary' },
        { label: 'Schedule Appointment', icon: Calendar, to: '/appointments', variant: 'secondary' },
        { label: 'Search Patient', icon: Search, to: '/search-patient', variant: 'secondary' },
        { label: 'View Cards', icon: CreditCard, to: '/view-cards', variant: 'secondary' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of today's activities</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`stat-card ${stat.bgColor} border-0`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={index} to={action.to}>
                                <Button
                                    variant={action.variant}
                                    size="lg"
                                    icon={Icon}
                                    className="w-full"
                                >
                                    {action.label}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                {recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'registration' ? 'bg-blue-100' : 'bg-green-100'
                                        }`} >
                                        {activity.type === 'registration' ? (
                                            <UserPlus className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{formatDateTime(activity.time)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
