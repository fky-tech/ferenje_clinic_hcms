import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function AddAppointmentModal({ isOpen, onClose, cardId, doctorId, onSuccess }) {
    const [formData, setFormData] = useState({
        appointment_date: '',
        appointment_time: '',
        status: 'scheduled'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;
            await api.post(API_ROUTES.APPOINTMENTS, {
                card_id: cardId,
                doctor_id: doctorId,
                appointment_start_time: dateTime,
                appointment_end_time: dateTime, // Default 1 hr or same
                status: 'scheduled'
            });
            toast.success("Follow-up appointment scheduled");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error scheduling:', error);
            toast.error("Failed to schedule appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Follow-up Appointment">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Date"
                    name="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Time"
                    name="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={handleChange}
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
