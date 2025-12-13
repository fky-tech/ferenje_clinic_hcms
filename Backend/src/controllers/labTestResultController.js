import LabTestResult from '../models/labTestResultModel.js';

class LabTestResultController {
    async createResult(req, res) {
        try {
            const { request_id, result_value, result_date } = req.body;
            if (!request_id || !result_value || !result_date) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await LabTestResult.create(req.body);
            res.status(201).json({ message: 'Lab result recorded successfully', result_id: result });
        } catch (error) {
            console.error('Error recording lab result:', error);
            res.status(500).json({ error: 'Failed to record lab result', details: error.message });
        }
    }

    async getAllResults(req, res) {
        try {
            const results = await LabTestResult.findAll();
            res.status(200).json(results);
        } catch (error) {
            console.error('Error fetching lab results:', error);
            res.status(500).json({ error: 'Failed to fetch lab results', details: error.message });
        }
    }

    async getResultById(req, res) {
        try {
            const { id } = req.params;
            const result = await LabTestResult.findById(id);
            if (!result) {
                return res.status(404).json({ error: 'Lab result not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching lab result:', error);
            res.status(500).json({ error: 'Failed to fetch lab result', details: error.message });
        }
    }

    async getResultByRequestId(req, res) {
        try {
            const { requestId } = req.params;
            const result = await LabTestResult.findByRequestId(requestId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching lab result:', error);
            res.status(500).json({ error: 'Failed to fetch lab result', details: error.message });
        }
    }

    async updateResult(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await LabTestResult.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab result not found' });
            }
            res.status(200).json({ message: 'Lab result updated successfully' });
        } catch (error) {
            console.error('Error updating lab result:', error);
            res.status(500).json({ error: 'Failed to update lab result', details: error.message });
        }
    }

    async deleteResult(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await LabTestResult.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab result not found' });
            }
            res.status(200).json({ message: 'Lab result deleted successfully' });
        } catch (error) {
            console.error('Error deleting lab result:', error);
            res.status(500).json({ error: 'Failed to delete lab result', details: error.message });
        }
    }
}

export default new LabTestResultController();
