import LabRequestTest from '../models/labRequestTestModel.js';

class LabRequestTestController {
    static async create(req, res) {
        try {
            const { request_id, test_id } = req.body;
            if (!request_id || !test_id) {
                return res.status(400).json({ error: 'Missing request_id or test_id' });
            }
            const id = await LabRequestTest.create({ request_id, test_id });
            res.status(201).json({ message: 'Lab request test added', id });
        } catch (error) {
            console.error('Error adding lab request test:', error);
            res.status(500).json({ error: 'Failed to add test', details: error.message });
        }
    }

    static async getTestsByRequestId(req, res) {
        try {
            const { requestId } = req.params;
            const tests = await LabRequestTest.findByRequestId(requestId);
            res.json(tests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updatePaymentStatus(req, res) {
        try {
            const { requestId } = req.params;
            const { status } = req.body; // 'paid', 'unpaid', 'pending'
            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }
            await LabRequestTest.updatePaymentStatusByRequestId(requestId, status);
            res.json({ message: 'Payment status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default LabRequestTestController;
