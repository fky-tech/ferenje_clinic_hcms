import express from 'express';
import medicationController from '../controllers/medicationController.js';

const router = express.Router();

router.post('/', (req, res) => medicationController.createMedication(req, res));
router.get('/', (req, res) => medicationController.getAllMedications(req, res));
router.get('/:id', (req, res) => medicationController.getMedicationById(req, res));
router.get('/visit/:visitId', (req, res) => medicationController.getMedicationsByVisitId(req, res));
router.put('/:id', (req, res) => medicationController.updateMedication(req, res));
router.delete('/:id', (req, res) => medicationController.deleteMedication(req, res));

export default router;
