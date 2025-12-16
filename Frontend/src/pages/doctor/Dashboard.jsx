import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import { Users, Calendar, Clock } from 'lucide-react';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { isDateToday } from '../../utils/helpers';

export default function DoctorDashboard() {
    const [stats, setStats] = useState({
        todayPatients: 0,
        todayAppointments: 0,
        queueCount: 0
    });

    useEffect(() => {
        // Placeholder for fetch logic
        // For now just 0
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Today's Patients" icon={Users} value={stats.todayPatients} color="bg-blue-500" />
                <Card title="Today's Appointments" icon={Calendar} value={stats.todayAppointments} color="bg-purple-500" />
                <Card title="In Queue" icon={Clock} value={stats.queueCount} color="bg-orange-500" />
            </div>
        </div>
    );
}
