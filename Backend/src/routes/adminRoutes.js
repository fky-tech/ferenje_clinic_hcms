import express from 'express';
import adminController from '../controllers/adminController.js';
import reportController from '../controllers/reportController.js';

const router = express.Router();

// Dashboard Stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Reports
router.get('/reports', reportController.getDailyReport);

// Manual trigger for export (optional, for testing)
router.post('/reports/generate', async (req, res) => {
    const success = await reportController.generateDailyExport();
    if (success) {
        res.status(200).json({ message: 'Report generated successfully' });
    } else {
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

export default router;
