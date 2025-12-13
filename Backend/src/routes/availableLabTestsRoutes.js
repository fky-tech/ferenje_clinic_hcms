import express from 'express';
import availableLabTestsController from '../controllers/availableLabTestsController.js';

const router = express.Router();

router.post('/', (req, res) => availableLabTestsController.createTest(req, res));
router.get('/', (req, res) => availableLabTestsController.getAllTests(req, res));
router.get('/:id', (req, res) => availableLabTestsController.getTestById(req, res));
router.get('/category/:category', (req, res) => availableLabTestsController.getTestsByCategory(req, res));
router.put('/:id', (req, res) => availableLabTestsController.updateTest(req, res));
router.delete('/:id', (req, res) => availableLabTestsController.deleteTest(req, res));

export default router;
