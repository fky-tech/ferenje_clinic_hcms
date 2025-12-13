import LabRequestTest from '../models/labRequestTestModel.js';

class LabRequestTestController {
    async create(req, res) {
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

    async getByRequestId(req, res) {
        try {
            const { requestId } = req.params;
            const tests = await LabRequestTest.findByRequestId(requestId);
            res.status(200).json(tests);
        } catch (error) {
            console.error('Error fetching lab request tests:', error);
            res.status(500).json({ error: 'Failed to fetch tests', details: error.message });
        }
    }
}

export default new LabRequestTestController();
