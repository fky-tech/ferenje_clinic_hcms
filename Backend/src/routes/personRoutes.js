import express from 'express';
import personController from '../controllers/personController.js';

const router = express.Router();

router.post('/', (req, res) => personController.createPerson(req, res));
router.get('/', (req, res) => personController.getAllPersons(req, res));
router.get('/:id', (req, res) => personController.getPersonById(req, res));
router.get('/email/:email', (req, res) => personController.getPersonByEmail(req, res));
router.get('/role/:role', (req, res) => personController.getPersonsByRole(req, res));
router.put('/:id', (req, res) => personController.updatePerson(req, res));
router.delete('/:id', (req, res) => personController.deletePerson(req, res));

export default router;
