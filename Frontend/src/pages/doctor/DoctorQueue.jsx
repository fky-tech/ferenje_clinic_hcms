import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getStoredUser, formatDateTime } from '../../utils/helpers';

export default function DoctorQueue() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getStoredUser();

    useEffect(() => {
        if (user) fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await api.get(API_ROUTES.QUEUES);
            const myQueue = res.data.filter(q => q.doctor_id == (user.person_id || user.id));
            setQueue(myQueue);
        } catch (error) {
            console.error('Error fetching queue:', error);
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
        { header: 'Card No', accessor: 'CardNumber' },
        { header: 'Arrival Time', render: (row) => formatDateTime(row.date) },
        { header: 'Status', accessor: 'status' },
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
            <Card>
                {queue.length === 0 ? <p>No patients in queue.</p> : (
                    <Table columns={columns} data={queue} />
                )}
            </Card>
        </div>
    );
}
