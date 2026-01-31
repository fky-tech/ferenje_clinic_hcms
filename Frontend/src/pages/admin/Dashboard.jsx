
import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    CreditCard,
    Activity,
    TrendingUp,
    Calendar,
    FlaskConical,
    Clock,
    DollarSign,
    UserCheck,
    FileText,
    ChevronRight,
    Settings,
    Shield,
    BarChart3,
    HeartPulse
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
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 30000);

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
        return () => clearInterval(timeInterval);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow transition cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                {trend && (
                    <div className={`text-xs px-1.5 py-0.5 rounded ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{value}</h3>
            <p className="text-xs text-gray-500 truncate">{title}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-gray-400 text-sm">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-3 space-y-3 max-w-6xl mx-auto">
            {/* Header - Compact */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-xs text-gray-500">Clinic performance overview</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-50 text-gray-700 text-xs px-3 py-1 rounded flex items-center gap-1">
                        <Clock size={12} />
                        {currentTime}
                    </div>
                </div>
            </div>

            {/* Stats Grid - Ultra Compact */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="bg-gradient-to-br from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-100 mb-1">Total Patients</p>
                            <p className="text-lg font-bold">{stats.totalPatients}</p>
                        </div>
                        <Users size={14} className="opacity-80" />
                    </div>
                </div>

                {/* Removed Today's Patients Card as requested */}

                <div className="bg-gradient-to-br  from-gray-900 to-primary-700/70 text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-primary-100 mb-1">Doctors</p>
                            <p className="text-lg font-bold">{stats.totalDoctors}</p>
                        </div>
                        <UserPlus size={14} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br  from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-indigo-100 mb-1">Lab Doctors</p>
                            <p className="text-lg font-bold">{stats.totalLabDoctors}</p>
                        </div>
                        <FlaskConical size={14} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br  from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-100 mb-1">Revenue</p>
                            <p className="text-lg font-bold">Birr {stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <DollarSign size={14} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown - Compact */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        <DollarSign size={14} className="text-blue-600" />
                        Revenue Overview
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                        Birr {stats.totalRevenue.toLocaleString()}
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Monthly Average</span>
                        <span className="text-xs font-medium text-gray-800">
                            Birr {(stats.totalRevenue / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-900 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg ml-4 font-bold text-gray-800 flex  gap-2">

                    Quick Management
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Doctors Card */}
                    <div
                        onClick={() => navigate('/admin/doctors')}
                        className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >

                        <div className="flex items-center gap-3">
                            <div className="relative">


                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">Manage Doctors</h4>
                                <p className="text-xs text-gray-600 mt-0.5">Add, update, or remove doctor profiles</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-primary-100 rounded text-xs text-primary-700 font-medium">
                                    {stats.totalDoctors} active
                                </div>
                                <div className="text-[10px] text-gray-500">• Profiles</div>
                            </div>
                        </div>
                    </div>

                    {/* Receptionists Card */}
                    <div
                        onClick={() => navigate('/admin/receptionists')}
                        className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={16} className="text-blue-400" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">

                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">Manage Receptionists</h4>
                                <p className="text-xs text-gray-600 mt-0.5">Handle accounts and access permissions</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-blue-100 rounded text-xs text-blue-700 font-medium">
                                    Front desk
                                </div>
                                <div className="text-[10px] text-gray-500">• Access control</div>
                            </div>
                        </div>
                    </div>

                    {/* Reports Card */}
                    <div
                        onClick={() => navigate('/admin/reports')}
                        className="group relative overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={16} className="text-teal-400" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">

                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">Generate Reports</h4>
                                <p className="text-xs text-gray-600 mt-0.5">Export financial and medical analytics</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-teal-100 rounded text-xs text-teal-700 font-medium">
                                    Analytics
                                </div>
                                <div className="text-[10px] text-gray-500">• Daily • Monthly</div>
                            </div>
                        </div>
                    </div>

                    {/* Patients Card */}
                    <div
                        onClick={() => navigate('/admin/patients')}
                        className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-lime-50 border border-green-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={16} className="text-green-400" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">

                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">Patient Records</h4>
                                <p className="text-xs text-gray-600 mt-0.5">View and manage patient database</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-green-100 rounded text-xs text-green-700 font-medium">
                                    {stats.totalPatients} records
                                </div>
                                <div className="text-[10px] text-gray-500">• Database • History</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
