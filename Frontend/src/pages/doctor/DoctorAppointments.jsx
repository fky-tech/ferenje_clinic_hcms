import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getStoredUser, formatDate, formatDateTime } from '../../utils/helpers';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const user = getStoredUser();

    useEffect(() => {
        if (user) fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get(API_ROUTES.APPOINTMENTS);
            console.log('Appointments API Response:', res.data);
            // Filter by doctor_id
            const myAppts = res.data.filter(a =>
                a.doctor_id == (user.person_id || user.id) &&
                a.status !== 'completed'
            );
            console.log('Filtered appointments:', myAppts);
            // Sort by appointment_id DESC (last added first)
            setAppointments(myAppts.sort((a, b) => b.appointment_id - a.appointment_id));
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Patient',
            render: (row) => {
                const name = `${row.FirstName || ''} ${row.Father_Name || ''}`;
                return name.trim() || 'Unknown';
            }
        },
        { header: 'Date', render: (row) => formatDate(row.appointment_date) },
        { header: 'Status', accessor: 'status' },
    ];

    const filteredAppointments = appointments.filter(a => {
        const name = `${a.FirstName || ''} ${a.Father_Name || ''}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase()) ||
            a.CardNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
                <div className="w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search patient..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <Card>
                {filteredAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No appointments found.</p>
                ) : (
                    <Table columns={columns} data={filteredAppointments} />
                )}
            </Card>
        </div>
    );
}
