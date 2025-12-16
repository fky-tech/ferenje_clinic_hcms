import VisitVitalSigns from '../models/visitVitalSignsModel.js';

class VisitVitalSignsController {
    async createVitalSigns(req, res) {
        try {
            const { visit_id } = req.body;
            if (!visit_id) {
                return res.status(400).json({ error: 'Visit ID is required' });
            }
            const result = await VisitVitalSigns.create(req.body);
            res.status(201).json({ message: 'Vital signs recorded successfully', vital_sign_id: result });
        } catch (error) {
            console.error('Error recording vital signs:', error);
            res.status(500).json({ error: 'Failed to record vital signs', details: error.message });
        }
    }

    async getAllVitalSigns(req, res) {
        try {
            const vitals = await VisitVitalSigns.findAll();
            res.status(200).json(vitals);
        } catch (error) {
            console.error('Error fetching vital signs:', error);
            res.status(500).json({ error: 'Failed to fetch vital signs', details: error.message });
        }
    }

    async getVitalSignsById(req, res) {
        try {
            const { id } = req.params;
            const vital = await VisitVitalSigns.findById(id);
            if (!vital) {
                return res.status(404).json({ error: 'Vital signs not found' });
            }
            res.status(200).json(vital);
        } catch (error) {
            console.error('Error fetching vital signs:', error);
            res.status(500).json({ error: 'Failed to fetch vital signs', details: error.message });
        }
    }

    async getVitalSignsByVisitId(req, res) {
        try {
            const { visitId } = req.params;
            const vital = await VisitVitalSigns.findByVisitId(visitId);
            res.status(200).json(vital);
        } catch (error) {
            console.error('Error fetching vital signs:', error);
            res.status(500).json({ error: 'Failed to fetch vital signs', details: error.message });
        }
    }

    async updateVitalSigns(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await VisitVitalSigns.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Vital signs not found' });
            }
            res.status(200).json({ message: 'Vital signs updated successfully' });
        } catch (error) {
            console.error('Error updating vital signs:', error);
            res.status(500).json({ error: 'Failed to update vital signs', details: error.message });
        }
    }

    async getVitalSignsByCardId(req, res) {
        try {
            const { cardId } = req.params;
            const vitals = await VisitVitalSigns.findByCardId(cardId);
            res.status(200).json(vitals);
        } catch (error) {
            console.error('Error fetching vital signs by card:', error);
            res.status(500).json({ error: 'Failed to fetch vital signs by card', details: error.message });
        }
    }

    async deleteVitalSigns(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await VisitVitalSigns.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Vital signs not found' });
            }
            res.status(200).json({ message: 'Vital signs deleted successfully' });
        } catch (error) {
            console.error('Error deleting vital signs:', error);
            res.status(500).json({ error: 'Failed to delete vital signs', details: error.message });
        }
    }
}

export default new VisitVitalSignsController();
