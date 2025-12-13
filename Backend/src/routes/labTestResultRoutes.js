import express from 'express';
import labTestResultController from '../controllers/labTestResultController.js';

const router = express.Router();

router.post('/', (req, res) => labTestResultController.createResult(req, res));
router.get('/', (req, res) => labTestResultController.getAllResults(req, res));
router.get('/:id', (req, res) => labTestResultController.getResultById(req, res));
router.get('/request/:requestId', (req, res) => labTestResultController.getResultByRequestId(req, res));
router.put('/:id', (req, res) => labTestResultController.updateResult(req, res));
router.delete('/:id', (req, res) => labTestResultController.deleteResult(req, res));

export default router;
