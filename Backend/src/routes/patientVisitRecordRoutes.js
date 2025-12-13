import express from 'express';
import patientVisitRecordController from '../controllers/patientVisitRecordController.js';

const router = express.Router();

router.post('/', (req, res) => patientVisitRecordController.createRecord(req, res));
router.get('/', (req, res) => patientVisitRecordController.getAllRecords(req, res));
router.get('/:id', (req, res) => patientVisitRecordController.getRecordById(req, res));
router.get('/card/:cardId', (req, res) => patientVisitRecordController.getRecordsByCardId(req, res));
router.put('/:id', (req, res) => patientVisitRecordController.updateRecord(req, res));
router.delete('/:id', (req, res) => patientVisitRecordController.deleteRecord(req, res));

export default router;
