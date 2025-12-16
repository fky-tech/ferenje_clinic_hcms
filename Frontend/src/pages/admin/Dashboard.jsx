import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    CreditCard,
    Activity,
    TrendingUp,
    Calendar
} from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todaysPatients: 0,
        totalDoctors: 0,
        totalLabDoctors: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-400">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    );

    const QuickAction = ({ title, description, icon: Icon, onClick, colorClass }) => (
        <button
            onClick={onClick}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center group"
        >
            <div className={`p-4 rounded-full ${colorClass} group-hover:scale-110 transition-transform duration-200 mb-4`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </button>
    );

    if (loading) {
        return <div className="p-8 flex justify-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of clinic performance and resources</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Today's Visits"
                    value={stats.todaysPatients}
                    icon={Activity}
                    color="bg-green-500"
                />
                <StatCard
                    title="Doctors"
                    value={stats.totalDoctors}
                    icon={UserPlus}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Lab Doctors"
                    value={stats.totalLabDoctors}
                    icon={Users}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    color="bg-yellow-500"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickAction
                        title="Manage Doctors"
                        description="Add, update, or remove doctor profiles"
                        icon={UserPlus}
                        colorClass="bg-purple-500"
                        onClick={() => navigate('/admin/doctors')}
                    />
                    <QuickAction
                        title="Manage Receptionists"
                        description="Handle receptionist accounts and access"
                        icon={Users}
                        colorClass="bg-blue-500"
                        onClick={() => navigate('/admin/receptionists')}
                    />
                    <QuickAction
                        title="Generate Reports"
                        description="Export daily financial and medical reports"
                        icon={Calendar}
                        colorClass="bg-teal-500"
                        onClick={() => navigate('/admin/reports')}
                    />
                </div>
            </div>
        </div>
    );
}
