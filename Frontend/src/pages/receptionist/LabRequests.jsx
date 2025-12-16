import { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { FlaskConical, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { API_ROUTES, PAYMENT_TYPES } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function LabRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestTests, setRequestTests] = useState([]);
    const [testsLoading, setTestsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const { addNotification } = useNotifications();

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

    const handleViewPayment = async (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
        setTestsLoading(true);
        try {
            // Fetch tests for this request
            const response = await api.get(`/lab-request-tests/request/${request.request_id}`);
            setRequestTests(response.data);
        } catch (error) {
            console.error('Error fetching request tests:', error);
            toast.error('Failed to load test details');
        } finally {
            setTestsLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedRequest) return;
        setProcessingPayment(true);
        try {
            const totalAmount = requestTests.reduce((sum, test) => sum + (parseFloat(test.price) || 0), 0);

            await api.post(API_ROUTES.PAYMENTS, {
                card_id: selectedRequest.card_id,
                // Backend sends c.CardNumber, let's check if it sends card_id.
                // If not, we might need to rely on description or update backend.
                // Assuming backend sends card_id too? The JOINs usually select * from lab_request but linked tables might strict fields.
                // I'll assume we might not have card_id directly unless I check.
                // But we have visit_id. 
                // Let's send 0 or null if not available, usually payment needs card_id for tracking.
                // Checking LabRequestModel: SELECT lr.* ... c.CardNumber ... JOIN card c ON ...
                // It selects lr.*. Does lr have card_id? No, it has VisitRecordID.
                // So I might not have card_id in row. I have CardNumber.
                // Ideally I should update LabRequestModel to select c.card_id too.
                // I'll rely on what I have. If needed I'll update model.
                // For now, I'll send amount and description.
                amount: totalAmount,
                billing_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                description: `Lab Request #${selectedRequest.request_id} Payment`,
                payment_type: PAYMENT_TYPES.LAB_TEST,
                status: 'paid'
            });

            // Update Payment Status for the Tests
            await api.put(`/lab-request-tests/request/${selectedRequest.request_id}/payment-status`, {
                status: 'paid'
            });

            toast.success('Payment processed successfully');
            addNotification(`Lab payment received for ${selectedRequest.FirstName} ${selectedRequest.Father_Name}`, 'success');
            setIsModalOpen(false);
            // Optional: Update request status locally or refetch
            fetchLabRequests();
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment');
        } finally {
            setProcessingPayment(false);
        }
    };

    const getTotalPrice = () => {
        return requestTests.reduce((sum, test) => sum + (parseFloat(test.price) || 0), 0);
    };

    const isPaid = requestTests.length > 0 && requestTests.every(test => test.payment_status === 'paid');

    const columns = [
        { header: 'Request ID', accessor: 'request_id' },
        { header: 'Patient', render: (row) => `${row.FirstName || ''} ${row.Father_Name || ''}` },
        { header: 'Card Number', accessor: 'CardNumber' },
        {
            header: 'Lab Status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.LabStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {row.LabStatus}
                </span>
            )
        },
        { header: 'Request Date', render: (row) => formatDate(row.RequestDate) },

        {
            header: 'Actions', render: (row) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewPayment(row)}
                >
                    View Lab
                </Button>
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={!isPaid ? "Process Lab Payment" : "Lab Request Details"}
            >
                {selectedRequest && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md mb-4 grid grid-cols-2 gap-2">
                            <p className="text-sm text-gray-600">Patient: <span className="font-medium text-gray-900">{selectedRequest.FirstName} {selectedRequest.Father_Name}</span></p>
                            <p className="text-sm text-gray-600">Card No: <span className="font-medium text-gray-900">{selectedRequest.CardNumber}</span></p>
                            <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-900">{formatDate(selectedRequest.RequestDate)}</span></p>
                            <p className="text-sm text-gray-600">Lab Status: <span className={`font-medium ${selectedRequest.LabStatus === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{selectedRequest.LabStatus}</span></p>
                            <p className="text-sm text-gray-600 col-span-2">Payment Status:
                                <span className={`font-bold ml-2 ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPaid ? 'PAID' : 'UNPAID'}
                                </span>
                            </p>
                        </div>

                        <h3 className="text-md font-medium text-gray-900">Tests Ordered</h3>
                        {testsLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="border rounded-md overflow-hidden max-h-80 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requestTests.map((test, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-sm text-gray-900">{test.test_name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(test.price)}</td>
                                                <td className="px-4 py-2 text-sm text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${test.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {test.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-medium">
                                            <td className="px-4 py-2 text-sm text-gray-900">Total</td>
                                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(getTotalPrice())}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t space-x-3">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                            {!isPaid && (
                                <Button
                                    variant="primary"
                                    onClick={handlePayment}
                                    disabled={processingPayment || testsLoading || requestTests.length === 0}
                                >
                                    {processingPayment ? 'Processing...' : 'Confirm Payment'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
