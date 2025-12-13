import Card from '../models/cardModel.js';

class CardController {
    async createCard(req, res) {
        try {
            const { patient_id, CardNumber } = req.body;
            if (!patient_id || !CardNumber) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await Card.create(req.body);
            res.status(201).json({ message: 'Card created successfully', card_id: result });
        } catch (error) {
            console.error('Error creating card:', error);
            res.status(500).json({ error: 'Failed to create card', details: error.message });
        }
    }

    async getAllCards(req, res) {
        try {
            const cards = await Card.findAll();
            res.status(200).json(cards);
        } catch (error) {
            console.error('Error fetching cards:', error);
            res.status(500).json({ error: 'Failed to fetch cards', details: error.message });
        }
    }

    async getCardById(req, res) {
        try {
            const { id } = req.params;
            const card = await Card.findById(id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.status(200).json(card);
        } catch (error) {
            console.error('Error fetching card:', error);
            res.status(500).json({ error: 'Failed to fetch card', details: error.message });
        }
    }

    async getCardByCardNumber(req, res) {
        try {
            const { cardNumber } = req.params;
            const card = await Card.findByCardNumber(cardNumber);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.status(200).json(card);
        } catch (error) {
            console.error('Error fetching card:', error);
            res.status(500).json({ error: 'Failed to fetch card', details: error.message });
        }
    }

    async getCardsByPatientId(req, res) {
        try {
            const { patientId } = req.params;
            const cards = await Card.findByPatientId(patientId);
            res.status(200).json(cards);
        } catch (error) {
            console.error('Error fetching cards:', error);
            res.status(500).json({ error: 'Failed to fetch cards', details: error.message });
        }
    }

    async updateCard(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Card.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.status(200).json({ message: 'Card updated successfully' });
        } catch (error) {
            console.error('Error updating card:', error);
            res.status(500).json({ error: 'Failed to update card', details: error.message });
        }
    }

    async deleteCard(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Card.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.status(200).json({ message: 'Card deleted successfully' });
        } catch (error) {
            console.error('Error deleting card:', error);
            res.status(500).json({ error: 'Failed to delete card', details: error.message });
        }
    }
}

export default new CardController();
