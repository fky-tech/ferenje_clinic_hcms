import express from 'express';
import cardController from '../controllers/cardController.js';

const router = express.Router();

router.post('/', (req, res) => cardController.createCard(req, res));
router.get('/', (req, res) => cardController.getAllCards(req, res));
router.get('/search', (req, res) => cardController.searchCards(req, res));
router.get('/:id', (req, res) => cardController.getCardById(req, res));
router.get('/number/:cardNumber', (req, res) => cardController.getCardByCardNumber(req, res));
router.get('/patient/:patientId', (req, res) => cardController.getCardsByPatientId(req, res));
router.put('/:id', (req, res) => cardController.updateCard(req, res));
router.delete('/:id', (req, res) => cardController.deleteCard(req, res));

export default router;
