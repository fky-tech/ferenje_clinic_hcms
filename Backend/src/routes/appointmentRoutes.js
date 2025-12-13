import express from 'express';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', (req, res) => appointmentController.createAppointment(req, res));
router.get('/', (req, res) => appointmentController.getAllAppointments(req, res));
router.get('/:id', (req, res) => appointmentController.getAppointmentById(req, res));
router.get('/doctor/:doctorId', (req, res) => appointmentController.getAppointmentsByDoctorId(req, res));
router.put('/:id', (req, res) => appointmentController.updateAppointment(req, res));
router.delete('/:id', (req, res) => appointmentController.deleteAppointment(req, res));

export default router;
