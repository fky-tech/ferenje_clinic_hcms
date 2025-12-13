import express from 'express';
import departmentController from '../controllers/departmentController.js';

const router = express.Router();

// All routes use the controller instance methods
router.post('/', (req, res) => departmentController.createDepartment(req, res));
router.get('/', (req, res) => departmentController.getAllDepartments(req, res));
router.get('/:id', (req, res) => departmentController.getDepartmentById(req, res));
router.put('/:id', (req, res) => departmentController.updateDepartment(req, res));
router.delete('/:id', (req, res) => departmentController.deleteDepartment(req, res));

export default router;
