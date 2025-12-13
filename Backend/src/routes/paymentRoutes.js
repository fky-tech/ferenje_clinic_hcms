import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', (req, res) => paymentController.createPayment(req, res));
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));

export default router;
