import express from 'express';
import labRequestController from '../controllers/labRequestController.js';

const router = express.Router();

router.post('/', (req, res) => labRequestController.createRequest(req, res));
router.get('/', (req, res) => labRequestController.getAllRequests(req, res));
// Dashboard & Static routes (must be before /:id)
router.get('/dashboard/stats', (req, res) => labRequestController.getDashboardStats(req, res));
router.get('/dashboard/todays-requests', (req, res) => labRequestController.getTodaysRequests(req, res));
router.get('/requests', (req, res) => labRequestController.getRequests(req, res));

// Dynamic routes
router.get('/:id', (req, res) => labRequestController.getRequestById(req, res));
router.get('/visit/:visitId', (req, res) => labRequestController.getRequestsByVisitId(req, res));
router.get('/card/:cardId', (req, res) => labRequestController.getLabRequestsByCardId(req, res));
router.put('/:id', (req, res) => labRequestController.updateRequest(req, res));
router.delete('/:id', (req, res) => labRequestController.deleteRequest(req, res));

export default router;
