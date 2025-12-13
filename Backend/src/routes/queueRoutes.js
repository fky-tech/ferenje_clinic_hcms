import express from 'express';
import queueController from '../controllers/queueController.js';

const router = express.Router();

router.post('/', (req, res) => queueController.createQueue(req, res));
router.get('/', (req, res) => queueController.getAllQueues(req, res));
router.get('/:id', (req, res) => queueController.getQueueById(req, res));
router.get('/doctor/:doctorId', (req, res) => queueController.getQueuesByDoctorId(req, res));
router.put('/:id', (req, res) => queueController.updateQueue(req, res));
router.delete('/:id', (req, res) => queueController.deleteQueue(req, res));

export default router;
