import PatientVisitRecord from '../models/patientVisitRecordModel.js';

class PatientVisitRecordController {
    async createRecord(req, res) {
        try {
            const { card_id, doctor_id, visit_date, visit_time, visit_type } = req.body;
            if (!card_id || !doctor_id || !visit_date || !visit_time || !visit_type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await PatientVisitRecord.create(req.body);
            res.status(201).json({ message: 'Visit record created successfully', visit_id: result });
        } catch (error) {
            console.error('Error creating visit record:', error);
            res.status(500).json({ error: 'Failed to create visit record', details: error.message });
        }
    }

    async getAllRecords(req, res) {
        try {
            const records = await PatientVisitRecord.findAll();
            res.status(200).json(records);
        } catch (error) {
            console.error('Error fetching visit records:', error);
            res.status(500).json({ error: 'Failed to fetch visit records', details: error.message });
        }
    }

    async getRecordById(req, res) {
        try {
            const { id } = req.params;
            const record = await PatientVisitRecord.findById(id);
            if (!record) {
                return res.status(404).json({ error: 'Visit record not found' });
            }
            res.status(200).json(record);
        } catch (error) {
            console.error('Error fetching visit record:', error);
            res.status(500).json({ error: 'Failed to fetch visit record', details: error.message });
        }
    }

    async getRecordsByCardId(req, res) {
        try {
            const { cardId } = req.params;
            const records = await PatientVisitRecord.findByCardId(cardId);
            res.status(200).json(records);
        } catch (error) {
            console.error('Error fetching visit records:', error);
            res.status(500).json({ error: 'Failed to fetch visit records', details: error.message });
        }
    }

    async updateRecord(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await PatientVisitRecord.update(id, req.body);
            // affectedRows will be 0 if data is identical, so we shouldn't return 404 unless we're sure ID is invalid.
            // For now, assuming success if no error thrown.
            res.status(200).json({ message: 'Visit record updated successfully' });
        } catch (error) {
            console.error('Error updating visit record:', error);
            res.status(500).json({ error: 'Failed to update visit record', details: error.message });
        }
    }

    async deleteRecord(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await PatientVisitRecord.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Visit record not found' });
            }
            res.status(200).json({ message: 'Visit record deleted successfully' });
        } catch (error) {
            console.error('Error deleting visit record:', error);
            res.status(500).json({ error: 'Failed to delete visit record', details: error.message });
        }
    }
}

export default new PatientVisitRecordController();
