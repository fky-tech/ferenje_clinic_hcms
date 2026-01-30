import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, ListPlus } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

export default function UltrasoundResultModal({ isOpen, onClose, request, onSuccess }) {
    const [findings, setFindings] = useState([{ title: '', descriptions: [''] }]);
    const [conclusion, setConclusion] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [requestTests, setRequestTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [editingFindingIndex, setEditingFindingIndex] = useState(null);
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (isOpen && request) {
            fetchInitialData();
            setSelectedTest(null); // Reset selection on open
        }
    }, [isOpen, request]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch tests to know which ultrasound was requested
            const testsRes = await api.get(`/lab-request-tests/request/${request.request_id}`);
            const ultrasoundOnly = testsRes.data.filter(t => t.TestCategory?.toLowerCase() === 'ultrasound');
            setRequestTests(ultrasoundOnly);

            // Fetch existing results if any to show completion status or load data
            const resultsRes = await api.get(`/ultrasound-test-results/request/${request.request_id}`);
            // We'll map results to their test_ids for the list view later
        } catch (error) {
            console.error('Error fetching ultrasound data:', error);
            toast.error("Failed to load initial data");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTest = async (test) => {
        setSelectedTest(test);
        setLoading(true);
        try {
            // Fetch existing results specifically for this test if possible,
            // but the current API findByRequestId returns all.
            const resultsRes = await api.get(`/ultrasound-test-results/request/${request.request_id}`);
            const testResults = resultsRes.data.filter(r => r.test_id === test.test_id);

            if (testResults.length > 0) {
                const loadedFindings = testResults.map(r => ({
                    id: r.id,
                    title: r.title,
                    descriptions: Array.isArray(r.description) ? r.description : [r.description]
                }));
                setFindings(loadedFindings);
                setConclusion(testResults[0].conclusion || '');
                setEditingFindingIndex(null); // Reset editing state when loading new test
            } else {
                setFindings([{ title: '', descriptions: [''] }]);
                setConclusion('');
                setEditingFindingIndex(0); // Automatically start editing the first (new) finding
            }
        } catch (error) {
            console.error('Error loading test results:', error);
        } finally {
            setLoading(false);
        }
    };

    const addFindingBox = () => {
        const newIndex = findings.length;
        setFindings([...findings, { title: '', descriptions: [''] }]);
        setEditingFindingIndex(newIndex);
    };

    const removeFindingBox = (index) => {
        if (findings.length === 1) return;
        const updated = findings.filter((_, i) => i !== index);
        setFindings(updated);
        if (editingFindingIndex === index) {
            setEditingFindingIndex(null); // If the edited box is removed, close editor
        } else if (editingFindingIndex > index) {
            setEditingFindingIndex(editingFindingIndex - 1); // Adjust index if a preceding box was removed
        }
    };

    const handleTitleChange = (index, value) => {
        const updated = [...findings];
        updated[index].title = value;
        setFindings(updated);
    };

    const addBulletPoint = (findingIndex) => {
        const updated = [...findings];
        updated[findingIndex].descriptions.push('');
        setFindings(updated);
    };

    const removeBulletPoint = (findingIndex, bulletIndex) => {
        const updated = [...findings];
        if (updated[findingIndex].descriptions.length === 1) return;
        updated[findingIndex].descriptions = updated[findingIndex].descriptions.filter((_, i) => i !== bulletIndex);
        setFindings(updated);
    };

    const handleDescriptionChange = (findingIndex, bulletIndex, value) => {
        const updated = [...findings];
        updated[findingIndex].descriptions[bulletIndex] = value;
        setFindings(updated);
        // If we are editing a newly created one, we might want to ensure the state reflects it,
        // but setFindings is enough.
    };

    const handleSubmit = async () => {
        if (!selectedTest) return;

        // Validate
        if (findings.some(f => !f.title)) {
            toast.error("Please provide titles for all findings");
            return;
        }

        setSubmitting(true);
        try {
            const testId = selectedTest.test_id;

            const payload = findings.map(f => ({
                request_id: request.request_id,
                test_id: testId,
                title: f.title || '',
                description: f.descriptions || [],
                conclusion: conclusion || ''
            }));

            await api.post('/ultrasound-test-results', payload);

            // Fetch the latest results to check if all tests for this request are completed
            // We use a fresh fetch to be sure (including the one we just saved)
            const updatedResultsRes = await api.get(`/ultrasound-test-results/request/${request.request_id}`);
            const updatedResults = updatedResultsRes.data;

            // Check if every test in requestTests has at least one result
            const allTestsCompleted = requestTests.every(test =>
                updatedResults.some(r => r.test_id === test.test_id)
            );

            if (allTestsCompleted) {
                // Only update main request status to completed if ALL tests have results
                await api.put(`/lab-requests/${request.request_id}`, {
                    ...request,
                    LabStatus: 'completed'
                });
                toast.success("All results saved. Request completed.");
                onSuccess?.();
                onClose();
            } else {
                // If incomplete, just notify saving of this specific result
                const remainingCount = requestTests.length - new Set(updatedResults.map(r => r.test_id)).size;
                toast.success(`${selectedTest.test_name} saved. ${remainingCount} test(s) remaining.`);

                // Return to the list view to allow selecting the next test
                setSelectedTest(null);
                // We do NOT call onSuccess/onClose here (assuming onSuccess means "request finished" for the parent list refresh??)
                // Actually, we should probably trigger a refresh so the parent knows we made progress, but we shouldn't close the modal if the user intends to continue?
                // The user said "not allow to save if all ... not setted".
                // If I keep the modal open, they can proceed.
                // Re-fetching initial data to update the "Enter Results" status indicators in the list would be nice.
                fetchInitialData();
            }
        } catch (error) {
            console.error('Error saving ultrasound results:', error);
            toast.error(error.response?.data?.error || "Failed to save results");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={selectedTest ? `Findings: ${selectedTest.test_name}` : `Ultrasound Studies: ${request?.FirstName}`} size="lg">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg text-sm">
                    <div>
                        <p className="text-blue-700 font-semibold text-xs uppercase">Patient</p>
                        <p className="font-bold">{request?.FirstName} {request?.Father_Name} ({request?.Age} {request?.Sex})</p>
                    </div>
                    <div>
                        <p className="text-blue-700 font-semibold text-xs uppercase">Requested By</p>
                        <p className="font-bold">Dr. {request?.doctor_first_name} {request?.doctor_last_name}</p>
                    </div>
                </div>

                {loading ? <div className="text-center py-10 text-blue-600 font-medium">Loading details...</div> : (
                    <>
                        {!selectedTest ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 font-medium">Select a study to enter findings:</p>
                                <div className="grid gap-3">
                                    {requestTests.map(test => (
                                        <div
                                            key={test.test_id}
                                            onClick={() => handleSelectTest(test)}
                                            className="p-4 border border-blue-100 rounded-xl bg-white hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center shadow-sm"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    <ListPlus className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-800">{test.test_name}</span>
                                            </div>
                                            <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 border-none">Enter Results</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
                                <div className="space-y-6">
                                    <button
                                        onClick={() => setSelectedTest(null)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center mb-2"
                                    >
                                        ← Back to Study List
                                    </button>

                                    {editingFindingIndex === null ? (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 font-medium">Recorded Findings:</p>
                                            <div className="grid gap-3">
                                                {findings.map((finding, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div
                                                            onClick={() => setEditingFindingIndex(idx)}
                                                            className="flex-1 p-4 border border-blue-100 rounded-xl bg-white hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center shadow-sm group"
                                                        >
                                                            <span className="font-bold text-gray-800 group-hover:text-blue-700 uppercase tracking-wide">
                                                                {finding.title || '(Untitled Finding)'}
                                                            </span>
                                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFindingBox(idx)}
                                                            className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100 transition-colors"
                                                            title="Delete Finding"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    onClick={addFindingBox}
                                                    className="w-full flex items-center justify-center px-4 py-4 bg-white border-2 border-dashed border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all font-bold"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" /> Add New Finding
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-blue-100 rounded-xl bg-white shadow-sm p-4 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                                <h4 className="font-bold text-blue-700 uppercase tracking-wider text-sm">
                                                    Editing Finding
                                                </h4>
                                                <Button size="sm" variant="secondary" onClick={() => setEditingFindingIndex(null)}>
                                                    Done / Minimize
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Title / Organ</label>
                                                    <input
                                                        type="text"
                                                        value={findings[editingFindingIndex].title}
                                                        onChange={(e) => handleTitleChange(editingFindingIndex, e.target.value)}
                                                        className="w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                                                        placeholder="e.g. LIVER, GALLBLADDER, PANCREAS"
                                                        autoFocus
                                                    />
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Findings / Description</label>
                                                        <button
                                                            onClick={() => addBulletPoint(editingFindingIndex)}
                                                            className="flex items-center text-[10px] font-bold text-blue-600 hover:text-blue-800"
                                                        >
                                                            <ListPlus className="w-3 h-3 mr-1" /> Add Point
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {findings[editingFindingIndex].descriptions.map((desc, dIndex) => (
                                                            <div key={dIndex} className="flex items-start gap-2 group/bullet">
                                                                <span className="mt-2.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                                                <textarea
                                                                    value={desc}
                                                                    onChange={(e) => handleDescriptionChange(editingFindingIndex, dIndex, e.target.value)}
                                                                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 text-sm resize-none"
                                                                    placeholder="Enter observation..."
                                                                    rows={1}
                                                                />
                                                                <button
                                                                    onClick={() => removeBulletPoint(editingFindingIndex, dIndex)}
                                                                    className="mt-1.5 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/bullet:opacity-100"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Conclusion / Impression</label>
                                        <textarea
                                            value={conclusion}
                                            onChange={(e) => setConclusion(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                                            placeholder="Enter final clinical impression..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    {selectedTest && (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={submitting || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 border-none"
                        >
                            {submitting ? 'Saving Results...' : 'Save & Print Report'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
