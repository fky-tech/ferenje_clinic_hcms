import Medication from '../models/medicationModel.js';

class MedicationController {
    async createMedication(req, res) {
        try {
            const { visit_id, drug_name, dosage, frequency, duration, start_date } = req.body;
            if (!visit_id || !drug_name || !dosage || !frequency || !duration || !start_date) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Medication.create(req.body);
            res.status(201).json({ message: 'Medication recorded successfully', medication_id: result });
        } catch (error) {
            console.error('Error recording medication:', error);
            res.status(500).json({ error: 'Failed to record medication', details: error.message });
        }
    }

    async getAllMedications(req, res) {
        try {
            const medications = await Medication.findAll();
            res.status(200).json(medications);
        } catch (error) {
            console.error('Error fetching medications:', error);
            res.status(500).json({ error: 'Failed to fetch medications', details: error.message });
        }
    }

    async getMedicationById(req, res) {
        try {
            const { id } = req.params;
            const medication = await Medication.findById(id);
            if (!medication) {
                return res.status(404).json({ error: 'Medication not found' });
            }
            res.status(200).json(medication);
        } catch (error) {
            console.error('Error fetching medication:', error);
            res.status(500).json({ error: 'Failed to fetch medication', details: error.message });
        }
    }

    async getMedicationsByVisitId(req, res) {
        try {
            const { visitId } = req.params;
            const medications = await Medication.findByVisitId(visitId);
            res.status(200).json(medications);
        } catch (error) {
            console.error('Error fetching medications:', error);
            res.status(500).json({ error: 'Failed to fetch medications', details: error.message });
        }
    }

    async updateMedication(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Medication.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Medication not found' });
            }
            res.status(200).json({ message: 'Medication updated successfully' });
        } catch (error) {
            console.error('Error updating medication:', error);
            res.status(500).json({ error: 'Failed to update medication', details: error.message });
        }
    }

    async deleteMedication(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Medication.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Medication not found' });
            }
            res.status(200).json({ message: 'Medication deleted successfully' });
        } catch (error) {
            console.error('Error deleting medication:', error);
            res.status(500).json({ error: 'Failed to delete medication', details: error.message });
        }
    }
}

export default new MedicationController();
