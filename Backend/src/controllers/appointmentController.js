import Appointment from '../models/appointmentModel.js';

class AppointmentController {
    async createAppointment(req, res) {
        try {
            const { card_id, doctor_id, appointment_start_time, appointment_end_time } = req.body;
            if (!card_id || !doctor_id || !appointment_start_time || !appointment_end_time) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Appointment.create(req.body);
            res.status(201).json({ message: 'Appointment created successfully', appointment_id: result });
        } catch (error) {
            console.error('Error creating appointment:', error);
            res.status(500).json({ error: 'Failed to create appointment', details: error.message });
        }
    }

    async getAllAppointments(req, res) {
        try {
            const appointments = await Appointment.findAll();
            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
        }
    }

    async getAppointmentById(req, res) {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findById(id);
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.status(200).json(appointment);
        } catch (error) {
            console.error('Error fetching appointment:', error);
            res.status(500).json({ error: 'Failed to fetch appointment', details: error.message });
        }
    }

    async getAppointmentsByDoctorId(req, res) {
        try {
            const { doctorId } = req.params;
            const appointments = await Appointment.findByDoctorId(doctorId);
            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
        }
    }

    async updateAppointment(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Appointment.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.status(200).json({ message: 'Appointment updated successfully' });
        } catch (error) {
            console.error('Error updating appointment:', error);
            res.status(500).json({ error: 'Failed to update appointment', details: error.message });
        }
    }

    async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Appointment.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.status(200).json({ message: 'Appointment deleted successfully' });
        } catch (error) {
            console.error('Error deleting appointment:', error);
            res.status(500).json({ error: 'Failed to delete appointment', details: error.message });
        }
    }
}

export default new AppointmentController();
