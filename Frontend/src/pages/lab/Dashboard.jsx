import { useState, useEffect } from 'react';
import { Activity, ClipboardList, FlaskConical } from 'lucide-react';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';

export default function Dashboard() {
    const [stats, setStats] = useState({
        todayRequests: 0,
        totalRequests: 0,
        totalAvailableTests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/lab-requests/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Lab Portal Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Today's Lab Requests</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayRequests}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Lab Requests</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRequests}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <ClipboardList className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Available Lab Tests</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAvailableTests}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <FlaskConical className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
