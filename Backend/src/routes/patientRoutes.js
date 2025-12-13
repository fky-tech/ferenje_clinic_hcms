import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

router.post('/', (req, res) => patientController.createPatient(req, res));
router.get('/', (req, res) => patientController.getAllPatients(req, res));
router.get('/:id', (req, res) => patientController.getPatientById(req, res));
router.put('/:id', (req, res) => patientController.updatePatient(req, res));
router.delete('/:id', (req, res) => patientController.deletePatient(req, res));

export default router;
