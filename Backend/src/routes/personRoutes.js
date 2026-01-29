import express from 'express';
import personController from '../controllers/personController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { validateCreatePerson, validateUpdatePerson } from '../middleware/validators/personValidator.js';

const router = express.Router();

// Create person - Admin only
router.post('/', authenticate, authorize('admin'), validateCreatePerson, (req, res) => personController.createPerson(req, res));

// Get all persons - Admin only
router.get('/', authenticate, authorize('admin'), (req, res) => personController.getAllPersons(req, res));

// Get person by ID - Authenticated users
router.get('/:id', authenticate, (req, res) => personController.getPersonById(req, res));

// Get person by email - Authenticated users
router.get('/email/:email', authenticate, (req, res) => personController.getPersonByEmail(req, res));

// Get persons by role - Admin only
router.get('/role/:role', authenticate, authorize('admin'), (req, res) => personController.getPersonsByRole(req, res));

// Update person - Admin only
router.put('/:id', authenticate, authorize('admin'), validateUpdatePerson, (req, res) => personController.updatePerson(req, res));

// Delete person - Admin only
router.delete('/:id', authenticate, authorize('admin'), (req, res) => personController.deletePerson(req, res));

export default router;
