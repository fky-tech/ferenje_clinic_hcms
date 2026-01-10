import db from '../config/db.js';

class AdminController {
    async getDashboardStats(req, res) {
        try {
            const today = new Date().toISOString().slice(0, 10);

            // 1. Total Patients
            const [totalPatientsRows] = await db.execute('SELECT COUNT(*) as count FROM patient');
            const totalPatients = totalPatientsRows[0].count;

            // 2. Today's Patients (Visited Today)
            // We count distinct visit records created today
            const [todaysPatientsRows] = await db.execute(
                'SELECT COUNT(DISTINCT card_id) as count FROM patientvisitrecord WHERE DATE(DateOfVisit) = ?',
                [today]
            );
            const todaysPatients = todaysPatientsRows[0].count;

            // 3. Total Doctors (Regular Doctors)
            const [totalDoctorsRows] = await db.execute('SELECT COUNT(*) as count FROM doctor');
            const totalDoctors = totalDoctorsRows[0].count;

            // 3.5 Total Lab Doctors
            const [totalLabDoctorsRows] = await db.execute("SELECT COUNT(*) as count FROM person WHERE role = 'lab_doctor'");
            const totalLabDoctors = totalLabDoctorsRows[0].count;

            // 4. Total Revenue (Sum of all completed payments TODAY)
            const [totalRevenueRows] = await db.execute(
                "SELECT SUM(amount) as total FROM payment WHERE status = 'paid' AND DATE(billing_date) = ?",
                [today]
            );
            const totalRevenue = totalRevenueRows[0].total || 0;

            res.status(200).json({
                totalPatients,
                todaysPatients,
                totalDoctors,
                totalLabDoctors,
                totalRevenue
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            res.status(500).json({ error: 'Failed to fetch admin stats', details: error.message });
        }
    }
}

export default new AdminController();
