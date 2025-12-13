import AvailableLabTests from '../models/availableLabTestsModel.js';

class AvailableLabTestsController {
    async createTest(req, res) {
        try {
            const { test_name, price } = req.body;
            if (!test_name || !price) {
                return res.status(400).json({ error: 'Test name and price are required' });
            }
            const result = await AvailableLabTests.create(req.body);
            res.status(201).json({ message: 'Lab test created successfully', test_id: result });
        } catch (error) {
            console.error('Error creating lab test:', error);
            res.status(500).json({ error: 'Failed to create lab test', details: error.message });
        }
    }

    async getAllTests(req, res) {
        try {
            const tests = await AvailableLabTests.findAll();
            res.status(200).json(tests);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
            res.status(500).json({ error: 'Failed to fetch lab tests', details: error.message });
        }
    }

    async getTestById(req, res) {
        try {
            const { id } = req.params;
            const test = await AvailableLabTests.findById(id);
            if (!test) {
                return res.status(404).json({ error: 'Lab test not found' });
            }
            res.status(200).json(test);
        } catch (error) {
            console.error('Error fetching lab test:', error);
            res.status(500).json({ error: 'Failed to fetch lab test', details: error.message });
        }
    }

    async getTestsByCategory(req, res) {
        try {
            const { category } = req.params;
            const tests = await AvailableLabTests.findByCategory(category);
            res.status(200).json(tests);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
            res.status(500).json({ error: 'Failed to fetch lab tests', details: error.message });
        }
    }

    async updateTest(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await AvailableLabTests.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab test not found' });
            }
            res.status(200).json({ message: 'Lab test updated successfully' });
        } catch (error) {
            console.error('Error updating lab test:', error);
            res.status(500).json({ error: 'Failed to update lab test', details: error.message });
        }
    }

    async deleteTest(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await AvailableLabTests.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab test not found' });
            }
            res.status(200).json({ message: 'Lab test deleted successfully' });
        } catch (error) {
            console.error('Error deleting lab test:', error);
            res.status(500).json({ error: 'Failed to delete lab test', details: error.message });
        }
    }
}

export default new AvailableLabTestsController();
