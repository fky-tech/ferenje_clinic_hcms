import cron from 'node-cron';
import reportController from '../controllers/reportController.js';

const initCronJobs = () => {
    // Run every day at 11:59 PM
    cron.schedule('59 23 * * *', async () => {
        console.log('Starting scheduled daily report generation...');
        await reportController.generateDailyExport();
    });

    console.log('Cron jobs initialized: Daily Export scheduled for 23:59');
};

export default initCronJobs;
