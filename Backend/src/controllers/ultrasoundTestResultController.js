import UltrasoundTestResult from '../models/ultrasoundTestResultModel.js';

class UltrasoundTestResultController {
    async createResults(req, res) {
        try {
            const results = req.body; // Expecting an array of results for a request
            if (!Array.isArray(results) || results.length === 0) {
                return res.status(400).json({ error: 'Results must be a non-empty array' });
            }

            const requestId = results[0].request_id;

            // Get unique test IDs being updated in this payload
            const testIds = [...new Set(results.map(r => r.test_id))];

            // Delete existing results ONLY for the specific tests we are updating
            for (const testId of testIds) {
                await UltrasoundTestResult.deleteByRequestAndTestId(requestId, testId);
            }

            const promises = results.map(resData => UltrasoundTestResult.create(resData));
            await Promise.all(promises);

            res.status(201).json({ message: 'Ultrasound results saved successfully' });
        } catch (error) {
            console.error('Error saving ultrasound results:', error);
            res.status(500).json({ error: 'Failed to save results', details: error.message });
        }
    }

    async getResultsByRequestId(req, res) {
        try {
            const { requestId } = req.params;
            const results = await UltrasoundTestResult.findByRequestId(requestId);
            res.status(200).json(results);
        } catch (error) {
            console.error('Error fetching ultrasound results:', error);
            res.status(500).json({ error: 'Failed to fetch results', details: error.message });
        }
    }
}

export default new UltrasoundTestResultController();
