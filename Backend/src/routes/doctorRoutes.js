import express from 'express';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.post('/', (req, res) => doctorController.createDoctor(req, res));
router.get('/', (req, res) => doctorController.getAllDoctors(req, res));
router.get('/:id', (req, res) => doctorController.getDoctorById(req, res));
router.put('/:id', (req, res) => doctorController.updateDoctor(req, res));
router.delete('/:id', (req, res) => doctorController.deleteDoctor(req, res));

export default router;
