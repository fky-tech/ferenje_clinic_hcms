import Doctor from '../models/doctorModel.js';

class DoctorController {
    async createDoctor(req, res) {
        try {
            const { doctor_id, office_no, specialization } = req.body;
            if (!doctor_id || !office_no) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Doctor.create({ doctor_id, office_no, specialization });
            res.status(201).json({ message: 'Doctor created successfully', doctor_id: result });
        } catch (error) {
            console.error('Error creating doctor:', error);
            res.status(500).json({ error: 'Failed to create doctor', details: error.message });
        }
    }

    async getAllDoctors(req, res) {
        try {
            const doctors = await Doctor.findAll();
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
        }
    }

    async getDoctorById(req, res) {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.status(200).json(doctor);
        } catch (error) {
            console.error('Error fetching doctor:', error);
            res.status(500).json({ error: 'Failed to fetch doctor', details: error.message });
        }
    }

    async updateDoctor(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Doctor.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.status(200).json({ message: 'Doctor updated successfully' });
        } catch (error) {
            console.error('Error updating doctor:', error);
            res.status(500).json({ error: 'Failed to update doctor', details: error.message });
        }
    }

    async deleteDoctor(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Doctor.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.status(200).json({ message: 'Doctor deleted successfully' });
        } catch (error) {
            console.error('Error deleting doctor:', error);
            res.status(500).json({ error: 'Failed to delete doctor', details: error.message });
        }
    }
}

export default new DoctorController();
