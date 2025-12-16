import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';

export default function InvestigationModal({ isOpen, onClose, visitData, onSave, onAddAppointment }) {
    // Local state for the modal form
    const [formData, setFormData] = useState({
        FinalDiagnosis: '',
        Advice: '',
        Treatment: ''
    });

    // Update form when visitData changes
    useEffect(() => {
        if (visitData) {
            setFormData({
                FinalDiagnosis: visitData.FinalDiagnosis || '',
                Advice: visitData.Advice || '',
                Treatment: visitData.Treatment || ''
            });
        }
    }, [visitData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!visitData?.visit_id && !visitData?.VisitRecordID) {
            toast.error("No visit selected");
            return;
        }
        onSave({ ...formData, visitId: visitData.visit_id || visitData.VisitRecordID });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Investigation & Treatment">
            <div className="space-y-4">
                {visitData && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Visit Date:</span> {visitData.visit_date || visitData.DateOfVisit}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Chief Complaint:</span> {visitData.ChiefComplaint || 'N/A'}
                        </p>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Diagnosis</label>
                    <textarea
                        name="FinalDiagnosis"
                        value={formData.FinalDiagnosis}
                        onChange={handleChange}
                        className="input-field"
                        rows={3}
                        placeholder="Enter diagnosis..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Advice (Sick Leave/Certificate)</label>
                    <textarea
                        name="Advice"
                        value={formData.Advice}
                        onChange={handleChange}
                        className="input-field"
                        rows={3}
                        placeholder="Enter advice..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan / Prescription</label>
                    <textarea
                        name="Treatment"
                        value={formData.Treatment}
                        onChange={handleChange}
                        className="input-field"
                        rows={3}
                        placeholder="Enter treatment plan..."
                    />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    {onAddAppointment && (
                        <Button variant="outline" onClick={onAddAppointment}>
                            + Add Appointment
                        </Button>
                    )}
                    <div className="space-x-2 ml-auto">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
