import express from 'express';
import visitPhysicalExamController from '../controllers/visitPhysicalExamController.js';

const router = express.Router();

router.post('/', (req, res) => visitPhysicalExamController.createPhysicalExam(req, res));
router.get('/', (req, res) => visitPhysicalExamController.getAllPhysicalExams(req, res));
router.get('/:id', (req, res) => visitPhysicalExamController.getPhysicalExamById(req, res));
router.get('/visit/:visitId', (req, res) => visitPhysicalExamController.getPhysicalExamByVisitId(req, res));
router.get('/card/:cardId', (req, res) => visitPhysicalExamController.getPhysicalExamsByCardId(req, res));
router.put('/:id', (req, res) => visitPhysicalExamController.updatePhysicalExam(req, res));
router.delete('/:id', (req, res) => visitPhysicalExamController.deletePhysicalExam(req, res));

export default router;
