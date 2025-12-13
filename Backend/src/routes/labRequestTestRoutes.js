import express from 'express';
import labRequestTestController from '../controllers/labRequestTestController.js';

const router = express.Router();

router.post('/', labRequestTestController.create);
router.get('/request/:requestId', labRequestTestController.getByRequestId);

export default router;
