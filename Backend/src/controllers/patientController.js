import Patient from '../models/patientModel.js';

class PatientController {
    async createPatient(req, res) {
        try {
            const { FirstName, DateOfBirth, Sex } = req.body;
            if (!FirstName || !DateOfBirth || !Sex) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Patient.create(req.body);
            res.status(201).json({ message: 'Patient created successfully', patient_id: result });
        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({ error: 'Failed to create patient', details: error.message });
        }
    }

    async getAllPatients(req, res) {
        try {
            const patients = await Patient.findAll();
            res.status(200).json(patients);
        } catch (error) {
            console.error('Error fetching patients:', error);
            res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
        }
    }

    async getPatientById(req, res) {
        try {
            const { id } = req.params;
            const patient = await Patient.findById(id);
            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.status(200).json(patient);
        } catch (error) {
            console.error('Error fetching patient:', error);
            res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
        }
    }

    async updatePatient(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Patient.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.status(200).json({ message: 'Patient updated successfully' });
        } catch (error) {
            console.error('Error updating patient:', error);
            res.status(500).json({ error: 'Failed to update patient', details: error.message });
        }
    }

    async deletePatient(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Patient.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.status(200).json({ message: 'Patient deleted successfully' });
        } catch (error) {
            console.error('Error deleting patient:', error);
            res.status(500).json({ error: 'Failed to delete patient', details: error.message });
        }
    }
}

export default new PatientController();
