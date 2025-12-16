import express from 'express';
import visitVitalSignsController from '../controllers/visitVitalSignsController.js';

const router = express.Router();

router.post('/', (req, res) => visitVitalSignsController.createVitalSigns(req, res));
router.get('/', (req, res) => visitVitalSignsController.getAllVitalSigns(req, res));
router.get('/:id', (req, res) => visitVitalSignsController.getVitalSignsById(req, res));
router.get('/visit/:visitId', (req, res) => visitVitalSignsController.getVitalSignsByVisitId(req, res));
router.get('/card/:cardId', (req, res) => visitVitalSignsController.getVitalSignsByCardId(req, res));
router.put('/:id', (req, res) => visitVitalSignsController.updateVitalSigns(req, res));
router.delete('/:id', (req, res) => visitVitalSignsController.deleteVitalSigns(req, res));

export default router;
