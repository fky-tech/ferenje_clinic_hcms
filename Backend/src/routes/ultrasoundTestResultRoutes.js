import express from 'express';
import UltrasoundTestResultController from '../controllers/ultrasoundTestResultController.js';

const router = express.Router();

router.post('/', UltrasoundTestResultController.createResults);
router.get('/request/:requestId', UltrasoundTestResultController.getResultsByRequestId);

export default router;
