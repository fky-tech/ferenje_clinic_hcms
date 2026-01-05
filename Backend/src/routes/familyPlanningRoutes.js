import express from 'express';
import familyPlanningController from '../controllers/familyPlanningController.js';

const router = express.Router();

router.get('/categories', familyPlanningController.getCategories);
router.get('/cards/:cardId', familyPlanningController.getCard);
router.post('/cards', familyPlanningController.createCard);
router.put('/cards/:id', familyPlanningController.updateCard);
router.get('/visits/:cardId', familyPlanningController.getVisits);
router.post('/visits', familyPlanningController.createVisit);

export default router;
