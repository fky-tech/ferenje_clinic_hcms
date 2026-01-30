import { useState, useEffect } from 'react';
import { Search, FlaskConical, Filter, Eye } from 'lucide-react';
import api from '../../api/axios';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate, formatCurrency } from '../../utils/helpers';
import EthiopianDatePicker from '../../components/common/EthiopianDatePicker';

export default function LabRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(''); // Added missing state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestTests, setRequestTests] = useState([]);
    const [testsLoading, setTestsLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm && requests.length === 0) {
                fetchRequests();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, requests.length]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/lab-requests/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load lab requests');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
        setTestsLoading(true);
        try {
            const response = await api.get(`/lab-request-tests/request/${request.request_id}`);
            setRequestTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
            toast.error('Failed to load tests');
        } finally {
            setTestsLoading(false);
        }
    };

    const filteredRequests = Array.isArray(requests) ? requests.filter(req => {
        if (!req) return false;
        const term = searchTerm.toLowerCase();
        const firstName = req.FirstName?.toLowerCase() || '';
        const fatherName = req.Father_Name?.toLowerCase() || '';
        const cardNumber = req.CardNumber ? req.CardNumber.toString().toLowerCase() : '';
        const phoneNumber = req.PhoneNumber ? req.PhoneNumber.toString() : '';
        const reqId = req.request_id ? req.request_id.toString() : '';

        return (
            firstName.includes(term) ||
            fatherName.includes(term) ||
            cardNumber.includes(term) ||
            phoneNumber.includes(term) ||
            reqId.includes(term)
        );
    }) : [];

    const columns = [
        { header: 'ID', accessor: 'request_id' },
        {
            header: 'Patient',
            render: (row) => row ? `${row.FirstName || ''} ${row.Father_Name || ''}`.trim() || 'Unknown' : 'Unknown'
        },
        { header: 'Card No', accessor: 'CardNumber' },
        {
            header: 'Date',
            render: (row) => row?.RequestDate ? formatDate(row.RequestDate) : '-'
        },
        {
            header: 'Total Price',
            render: (row) => (
                <span className="font-semibold text-blue-600">
                    {formatCurrency(row?.total_price || 0)}
                </span>
            )
        },
        {
            header: 'Payment', render: (row) => (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${(row?.payment_status || 'unpaid') === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {row?.payment_status || 'unpaid'}
                </span>
            )
        },
        {
            header: 'Actions', render: (row) => (
                <Button size="sm" variant="secondary" onClick={() => handleViewDetails(row)}>
                    <Eye size={14} className="mr-1" /> View Tests
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Request Reports</h1>
                    <p className="text-sm text-gray-500">Summary of lab orders and financial totals</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="w-48 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <EthiopianDatePicker
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                    {filterDate && (
                        <Button variant="secondary" onClick={() => setFilterDate('')}>Clear</Button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-4 relative max-w-md flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search patient or request ID..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
                        />
                    </div>
                    <Button onClick={fetchRequests} disabled={loading}>Search</Button>
                </div>
                {loading && requests.length === 0 ? <div className="text-center p-4">Searching...</div> : (
                    <Table columns={columns} data={filteredRequests} emptyMessage="No requests found. Search to view data." />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Lab Request Summary"
            >
                {selectedRequest && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Patient</p>
                                <p className="text-sm font-medium">{selectedRequest.FirstName} {selectedRequest.Father_Name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Card Number</p>
                                <p className="text-sm font-medium">{selectedRequest.CardNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Request Date</p>
                                <p className="text-sm font-medium">{formatDate(selectedRequest.RequestDate)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Total Price</p>
                                <p className="text-sm font-bold text-blue-600">{formatCurrency(selectedRequest.total_price || 0)}</p>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Test Name</th>
                                        <th className="px-4 py-2 text-xs font-bold text-gray-500 uppercase text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {testsLoading ? (
                                        <tr><td colSpan="2" className="p-4 text-center"><LoadingSpinner /></td></tr>
                                    ) : (
                                        requestTests.map((test, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm">{test.test_name}</td>
                                                <td className="px-4 py-2 text-sm text-right">{formatCurrency(test.price)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <FlaskConical className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-[11px] text-blue-700 italic font-medium">
                                Clinical results are restricted from this administrative view for patient privacy.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
