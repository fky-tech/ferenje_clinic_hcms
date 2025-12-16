import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
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

    useEffect(() => {
        if (isOpen) {
            fetchTests();
            setSelectedTests([]);
        }
    }, [isOpen]);

    const fetchTests = async () => {
        try {
            // Need an endpoint for available lab tests. 
            // Assuming /lab-tests or similar.
            // I'll assume /lab-tests exists based on file list (availableLabTestsRoutes.js)
            const response = await api.get('/available-lab-tests');
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
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                        {availableTests.length === 0 ? <p>No tests available</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {availableTests.map(test => (
                                    <label key={test.test_id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedTests.includes(test.test_id)}
                                            onChange={() => toggleTest(test.test_id)}
                                            className="rounded text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium">{test.test_name}</span>
                                        <span className="text-xs text-gray-500">({test.price} ETB)</span>
                                    </label>
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
