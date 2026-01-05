import Appointment from '../models/appointmentModel.js';

class AppointmentController {
    async createAppointment(req, res) {
        try {
            const { card_id, doctor_id, appointment_date } = req.body;
            if (!card_id || !doctor_id || !appointment_date) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Fetch existing appointments for the doctor to check for same-day duplicates for the same patient
            const allAppointments = await Appointment.findAll();

            const isDuplicate = allAppointments.some(appt => {
                if (appt.doctor_id != doctor_id || appt.card_id != card_id || appt.status === 'cancelled') return false;

                // Compare dates (assuming YYYY-MM-DD format)
                const existingDate = appt.appointment_date instanceof Date
                    ? appt.appointment_date.toISOString().split('T')[0]
                    : String(appt.appointment_date).split('T')[0];
                const reqDate = String(appointment_date).split('T')[0];

                return existingDate === reqDate;
            });

            if (isDuplicate) {
                return res.status(409).json({ error: 'Duplicate', message: 'An appointment for this patient with this doctor on this date already exists.' });
            }

            const newAppointmentId = await Appointment.create(req.body);
            res.status(201).json({ message: 'Appointment created successfully', appointment_id: newAppointmentId });
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
