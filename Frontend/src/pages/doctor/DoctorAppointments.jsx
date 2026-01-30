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
            setAppointments(myAppts);
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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
            <Card>
                {appointments.length === 0 ? <p>No appointments scheduled.</p> : (
                    <Table columns={columns} data={appointments} />
                )}
            </Card>
        </div>
    );
}
