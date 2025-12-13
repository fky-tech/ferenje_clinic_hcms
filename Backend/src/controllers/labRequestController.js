import LabRequest from '../models/labRequestModel.js';

class LabRequestController {
    async createRequest(req, res) {
        try {
            const { visit_id, test_id, RequestDate } = req.body;
            if (!visit_id || !test_id || !RequestDate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await LabRequest.create(req.body);
            res.status(201).json({ message: 'Lab request created successfully', request_id: result });
        } catch (error) {
            console.error('Error creating lab request:', error);
            res.status(500).json({ error: 'Failed to create lab request', details: error.message });
        }
    }

    async getAllRequests(req, res) {
        try {
            const requests = await LabRequest.findAll();
            res.status(200).json(requests);
        } catch (error) {
            console.error('Error fetching lab requests:', error);
            res.status(500).json({ error: 'Failed to fetch lab requests', details: error.message });
        }
    }

    async getRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await LabRequest.findById(id);
            if (!request) {
                return res.status(404).json({ error: 'Lab request not found' });
            }
            res.status(200).json(request);
        } catch (error) {
            console.error('Error fetching lab request:', error);
            res.status(500).json({ error: 'Failed to fetch lab request', details: error.message });
        }
    }

    async getRequestsByVisitId(req, res) {
        try {
            const { visitId } = req.params;
            const requests = await LabRequest.findByVisitId(visitId);
            res.status(200).json(requests);
        } catch (error) {
            console.error('Error fetching lab requests:', error);
            res.status(500).json({ error: 'Failed to fetch lab requests', details: error.message });
        }
    }

    async updateRequest(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await LabRequest.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab request not found' });
            }
            res.status(200).json({ message: 'Lab request updated successfully' });
        } catch (error) {
            console.error('Error updating lab request:', error);
            res.status(500).json({ error: 'Failed to update lab request', details: error.message });
        }
    }

    async deleteRequest(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await LabRequest.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Lab request not found' });
            }
            res.status(200).json({ message: 'Lab request deleted successfully' });
        } catch (error) {
            console.error('Error deleting lab request:', error);
            res.status(500).json({ error: 'Failed to delete lab request', details: error.message });
        }
    }
}

export default new LabRequestController();
