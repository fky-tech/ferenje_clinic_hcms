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
    const [searchTerm, setSearchTerm] = useState('');
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
        { header: 'Arrival Time', render: (row) => new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { header: 'Status', accessor: 'status' },
    ];

    if (loading) return <LoadingSpinner />;

    const filteredQueue = queue.filter(q =>
    (q.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.Father_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.CardNumber?.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
                <div className="relative">
                    {/* Search Input handled locally since list is small, or use state if needed */}
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                <input
                    type="text"
                    placeholder="Search patient name or card no..."
                    value={searchTerm}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card>
                {filteredQueue.length === 0 ? <p className="text-gray-500 text-center py-4">No patients found within queue.</p> : (
                    <Table columns={columns} data={filteredQueue} />
                )}
            </Card>
        </div>
    );
}
