import Queue from '../models/queueModel.js';

class QueueController {
    async createQueue(req, res) {
        try {
            const { card_id, doctor_id, queue_position, date } = req.body;
            if (!card_id || !doctor_id) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Queue.create(req.body);
            res.status(201).json({ message: 'Queue entry created successfully', queue_id: result });
        } catch (error) {
            console.error('Error creating queue:', error);
            res.status(500).json({ error: 'Failed to create queue entry', details: error.message });
        }
    }

    async getAllQueues(req, res) {
        try {
            const queues = await Queue.findAll();
            res.status(200).json(queues);
        } catch (error) {
            console.error('Error fetching queues:', error);
            res.status(500).json({ error: 'Failed to fetch queues', details: error.message });
        }
    }

    async getQueueById(req, res) {
        try {
            const { id } = req.params;
            const queue = await Queue.findById(id);
            if (!queue) {
                return res.status(404).json({ error: 'Queue entry not found' });
            }
            res.status(200).json(queue);
        } catch (error) {
            console.error('Error fetching queue:', error);
            res.status(500).json({ error: 'Failed to fetch queue entry', details: error.message });
        }
    }

    async getQueuesByDoctorId(req, res) {
        try {
            const { doctorId } = req.params;
            const queues = await Queue.findByDoctorId(doctorId);
            res.status(200).json(queues);
        } catch (error) {
            console.error('Error fetching queues:', error);
            res.status(500).json({ error: 'Failed to fetch queues', details: error.message });
        }
    }

    async updateQueue(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Queue.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Queue entry not found' });
            }
            res.status(200).json({ message: 'Queue entry updated successfully' });
        } catch (error) {
            console.error('Error updating queue:', error);
            res.status(500).json({ error: 'Failed to update queue entry', details: error.message });
        }
    }

    async deleteQueue(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Queue.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Queue entry not found' });
            }
            res.status(200).json({ message: 'Queue entry deleted successfully' });
        } catch (error) {
            console.error('Error deleting queue:', error);
            res.status(500).json({ error: 'Failed to delete queue entry', details: error.message });
        }
    }
}

export default new QueueController();
