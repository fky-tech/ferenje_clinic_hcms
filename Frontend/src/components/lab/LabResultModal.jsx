import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../utils/helpers';

export default function LabResultModal({ isOpen, onClose, request, onSuccess }) {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && request) {
            fetchRequestTests();
        }
    }, [isOpen, request]);

    const fetchRequestTests = async () => {
        setLoading(true);
        try {
            // Fetch tests for this request (what was ordered)
            const testsResponse = await api.get(`/lab-request-tests/request/${request.request_id}`);

            // Fetch existing results (what has been entered)
            const resultsResponse = await api.get(`/lab-test-results/request/${request.request_id}`);
            const existingResults = resultsResponse.data;

            // Merge them
            const merged = testsResponse.data.map(test => {
                const result = existingResults.find(r => r.test_id === test.test_id);
                return {
                    ...test,
                    result_id: result?.result_id || null,
                    result_value: result?.test_result_value || '',
                    interpretation: result?.interpretation || ''
                };
            });
            setTests(merged);
        } catch (error) {
            console.error('Error fetching tests:', error);
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    const handleResultChange = (index, field, value) => {
        const updatedTests = [...tests];
        updatedTests[index] = { ...updatedTests[index], [field]: value };
        setTests(updatedTests);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const promises = tests.map(test => {
                // If value is empty, maybe skip? no, let's assume if they open modal they want to save.
                // Or only save if value is present.
                if (!test.result_value) return Promise.resolve();

                const payload = {
                    request_id: request.request_id,
                    test_id: test.test_id,
                    test_result_value: test.result_value,
                    interpretation: test.interpretation || null
                };

                if (test.result_id) {
                    return api.put(`/lab-test-results/${test.result_id}`, payload);
                } else {
                    return api.post('/lab-test-results', payload);
                }
            });

            await Promise.all(promises);

            // Update main request status to completed
            await api.put(`/lab-requests/${request.request_id}`, {
                ...request,
                LabStatus: 'completed'
            });

            toast.success("Results saved successfully");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error saving results:', error);
            toast.error("Failed to save results");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Enter Lab Results - ${request?.FirstName} ${request?.Father_Name}`}>
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Request Date:</span> {request && formatDateTime(request.RequestDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Doctor:</span> Dr. {request?.doctor_first_name} {request?.doctor_last_name}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-4">Loading tests...</div>
                ) : (
                    <div className="space-y-6">
                        {tests.map((test, index) => (
                            <div key={test.id} className="border-b pb-4 last:border-b-0 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-900">{test.test_name}</h4>
                                    <label className="flex items-center space-x-2 text-sm text-red-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={test.is_abnormal}
                                            onChange={(e) => handleResultChange(index, 'is_abnormal', e.target.checked)}
                                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                        <span>Abnormal</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Result Value / Reading</label>
                                    <input
                                        type="text"
                                        value={test.result_value}
                                        onChange={(e) => handleResultChange(index, 'result_value', e.target.value)}
                                        className="input-field"
                                        placeholder="Enter result..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Remarks</label>
                                    <input
                                        type="text"
                                        value={test.notes}
                                        onChange={(e) => handleResultChange(index, 'notes', e.target.value)}
                                        className="input-field"
                                        placeholder="Optional notes"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={submitting || loading}>
                        {submitting ? 'Saving...' : 'Save Results'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
