import express from 'express';
import patientController from '../controllers/patientController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { validatePatient } from '../middleware/validators/patientValidator.js';

const router = express.Router();

// All patient routes require authentication
// Receptionist, doctor, and admin can access

router.post('/', authenticate, authorize('receptionist', 'doctor', 'admin'), validatePatient, (req, res) => patientController.createPatient(req, res));
router.get('/', authenticate, authorize('receptionist', 'doctor', 'admin', 'lab_doctor'), (req, res) => patientController.getAllPatients(req, res));
router.get('/:id', authenticate, authorize('receptionist', 'doctor', 'admin', 'lab_doctor'), (req, res) => patientController.getPatientById(req, res));
router.put('/:id', authenticate, authorize('receptionist', 'doctor', 'admin'), validatePatient, (req, res) => patientController.updatePatient(req, res));
router.delete('/:id', authenticate, authorize('admin'), (req, res) => patientController.deletePatient(req, res));

export default router;
