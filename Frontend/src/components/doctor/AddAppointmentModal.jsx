import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import EthiopianDatePicker from '../common/EthiopianDatePicker';
import api from '../../api/axios';
import { API_ROUTES, APPOINTMENT_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function AddAppointmentModal({ isOpen, onClose, cardId, doctorId, onSuccess }) {
    const [formData, setFormData] = useState({
        appointment_date: new Date().toISOString().split('T')[0], // Default to today ISO
        status: APPOINTMENT_STATUS.SCHEDULED
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Robust fallback if state is empty/cleared
            const dateToUse = formData.appointment_date || new Date().toISOString().split('T')[0];

            if (!dateToUse) {
                toast.error("Please select a date");
                setLoading(false);
                return;
            }

            await api.post(API_ROUTES.APPOINTMENTS, {
                card_id: cardId,
                doctor_id: doctorId,
                appointment_date: dateToUse,
                status: APPOINTMENT_STATUS.SCHEDULED
            });
            toast.success("Follow-up appointment scheduled");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error scheduling:', error);
            toast.error(error.response?.data?.message || "Failed to schedule appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Follow-up Appointment">
            <form onSubmit={handleSubmit} className="space-y-4">
                <EthiopianDatePicker
                    label="Date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                    required
                />
                <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Scheduling...' : 'Schedule'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
