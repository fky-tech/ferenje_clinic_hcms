import FamilyPlanning from '../models/familyPlanningModel.js';

class FamilyPlanningController {
    async getCategories(req, res) {
        try {
            const categories = await FamilyPlanning.getFieldCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching FP categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getCard(req, res) {
        try {
            const { cardId } = req.params;
            const card = await FamilyPlanning.getCardByCardId(cardId);
            res.status(200).json(card || null);
        } catch (error) {
            console.error('Error fetching FP card:', error);
            res.status(500).json({ error: 'Failed to fetch family planning card' });
        }
    }

    async createCard(req, res) {
        try {
            const cardId = await FamilyPlanning.createCard(req.body);
            res.status(201).json({ message: 'Family planning card created', id: cardId });
        } catch (error) {
            console.error('Error creating FP card:', error);
            res.status(500).json({ error: 'Failed to create family planning card', details: error.message });
        }
    }

    async updateCard(req, res) {
        try {
            const { id } = req.params;
            await FamilyPlanning.updateCard(id, req.body);
            res.status(200).json({ message: 'Family planning card updated' });
        } catch (error) {
            console.error('Error updating FP card:', error);
            res.status(500).json({ error: 'Failed to update family planning card' });
        }
    }

    async getVisits(req, res) {
        try {
            const { cardId } = req.params;
            const visits = await FamilyPlanning.getVisitsByCardId(cardId);
            res.status(200).json(visits);
        } catch (error) {
            console.error('Error fetching FP visits:', error);
            res.status(500).json({ error: 'Failed to fetch family planning visits' });
        }
    }

    async createVisit(req, res) {
        try {
            const visitId = await FamilyPlanning.createVisit(req.body);
            res.status(201).json({ message: 'Family planning visit recorded', id: visitId });
        } catch (error) {
            console.error('Error creating FP visit:', error);
            res.status(500).json({ error: 'Failed to record family planning visit', details: error.message });
        }
    }
}

export default new FamilyPlanningController();
