import { useState, useEffect } from 'react';
import { FlaskConical } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function LabRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLabRequests();
    }, []);

    const fetchLabRequests = async () => {
        try {
            const response = await api.get(API_ROUTES.LAB_REQUESTS);
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching lab requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Request ID', accessor: 'request_id' },
        { header: 'Patient', render: (row) => `${row.FirstName || ''} ${row.Father_Name || ''}` },
        { header: 'Card Number', accessor: 'CardNumber' },
        {
            header: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.LabStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {row.LabStatus}
                </span>
            )
        },
        { header: 'Request Date', render: (row) => formatDate(row.RequestDate) },
        {
            header: 'Actions', render: (row) => row.LabStatus === 'pending' && (
                <Button size="sm" variant="primary">Process Payment</Button>
            )
        },
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Lab Requests</h1>
                <p className="text-gray-500 mt-1">View and process lab test payments</p>
            </div>

            <Card title={`Total Requests: ${requests.length}`} icon={FlaskConical}>
                <Table columns={columns} data={requests} />
            </Card>
        </div>
    );
}
