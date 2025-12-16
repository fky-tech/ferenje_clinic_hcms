import express from 'express';
import labRequestTestController from '../controllers/labRequestTestController.js';

const router = express.Router();

router.post('/', labRequestTestController.create);
router.get('/request/:requestId', labRequestTestController.getTestsByRequestId);
router.put('/request/:requestId/payment-status', labRequestTestController.updatePaymentStatus);

export default router;
