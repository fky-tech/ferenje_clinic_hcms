import Payment from '../models/paymentModel.js';

class PaymentController {
    async createPayment(req, res) {
        try {
            const { card_id, amount, billing_date } = req.body;
            if (!card_id || amount === undefined || amount === null || !billing_date) {
                const missing = [];
                if (!card_id) missing.push('card_id');
                if (amount === undefined || amount === null) missing.push('amount');
                if (!billing_date) missing.push('billing_date');
                return res.status(400).json({ error: 'Missing required fields', missing, received: req.body });
            }
            const result = await Payment.create(req.body);
            res.status(201).json({ message: 'Payment created successfully', payment_id: result });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ error: 'Failed to create payment', details: error.message });
        }
    }

    async getAllPayments(req, res) {
        try {
            const payments = await Payment.findAll();
            res.status(200).json(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
        }
    }

    async getPaymentById(req, res) {
        try {
            const { id } = req.params;
            const payment = await Payment.findById(id);
            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(200).json(payment);
        } catch (error) {
            console.error('Error fetching payment:', error);
            res.status(500).json({ error: 'Failed to fetch payment', details: error.message });
        }
    }

    async updatePayment(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Payment.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(200).json({ message: 'Payment updated successfully' });
        } catch (error) {
            console.error('Error updating payment:', error);
            res.status(500).json({ error: 'Failed to update payment', details: error.message });
        }
    }

    async deletePayment(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Payment.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(200).json({ message: 'Payment deleted successfully' });
        } catch (error) {
            console.error('Error deleting payment:', error);
            res.status(500).json({ error: 'Failed to delete payment', details: error.message });
        }
    }
}

export default new PaymentController();
