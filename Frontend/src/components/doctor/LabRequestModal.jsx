import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useNotifications } from '../../contexts/NotificationContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants'; // Need to add LAB_TESTS route
import toast from 'react-hot-toast';

export default function LabRequestModal({ isOpen, onClose, cardId, visitId, doctorId, onSuccess }) {
    const [availableTests, setAvailableTests] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]); // Array of IDs
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (isOpen) {
            fetchTests();
            setSelectedTests([]);
        }
    }, [isOpen]);

    const fetchTests = async () => {
        try {
            const response = await api.get(API_ROUTES.AVAILABLE_LAB_TESTS);
            setAvailableTests(response.data);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
            toast.error('Failed to load lab tests');
        } finally {
            setLoading(false);
        }
    };

    const toggleTest = (testId) => {
        setSelectedTests(prev =>
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    const handleSubmit = async () => {
        if (selectedTests.length === 0) {
            toast.error("Please select at least one test");
            return;
        }

        if (!visitId) {
            toast.error("Please save the visit details first before ordering labs.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Create Lab Request Parent
            // Backend endpoint: POST /lab-requests
            // Needs: visit_id (optional?), doctor_id, card_id, priority?
            // Checking LabRequestModel (previous sessions): it has visit_id.

            // Wait, LabRequestController.create usually takes request data.
            // Let's create the request first.
            const requestRes = await api.post(API_ROUTES.LAB_REQUESTS, {
                card_id: cardId,
                doctor_id: doctorId,
                visit_id: visitId,
                RequestDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                status: 'pending',
                LabStatus: 'pending' // Update to match model expectations
            });

            const requestId = requestRes.data.insertId || requestRes.data.request_id;

            // 2. Add Tests to Request
            // Backend: POST /lab-request-tests
            // Needs: request_id, test_id, ...
            // We usually iterate.

            const promises = selectedTests.map(testId => {
                const test = availableTests.find(t => t.test_id === testId);
                return api.post('/lab-request-tests', {
                    request_id: requestId,
                    test_id: testId,
                    test_name: test.test_name, // If model stores name
                    price: test.price,
                    status: 'pending',
                    payment_status: 'unpaid'
                });
            });

            await Promise.all(promises);

            toast.success("Lab request sent successfully");

            // Task 19 & 10: Notify Lab and Receptionist
            addNotification(
                `New Lab Request for Card #${cardId}`,
                'info',
                ['lab_doctor', 'receptionist']
            );

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error sending lab request:', error);
            toast.error("Failed to send lab request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Order Lab Tests">
            {loading ? <LoadingSpinner /> : (
                <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto border rounded-xl p-3 bg-gray-50/30">
                        {availableTests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No tests available</div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(
                                    availableTests.reduce((acc, test) => {
                                        const cat = test.TestCategory || 'General';
                                        if (!acc[cat]) acc[cat] = [];
                                        acc[cat].push(test);
                                        return acc;
                                    }, {})
                                ).map(([category, tests]) => (
                                    <div key={category} className="space-y-2">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {tests.map(test => (
                                                <label
                                                    key={test.test_id}
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedTests.includes(test.test_id)
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                        : 'border-transparent bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTests.includes(test.test_id)}
                                                            onChange={() => toggleTest(test.test_id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                                            {test.test_name}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-sm text-gray-600">{selectedTests.length} tests selected</span>
                        <div className="space-x-2">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={submitting || selectedTests.length === 0}>
                                {submitting ? 'Sending...' : 'Send Request'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
