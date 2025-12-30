import express from 'express';
import db from '../config/db.js';
import { generateWordReport } from '../services/reportGenerator.js';
import { generateMorbidityReport } from '../services/morbidityReportGenerator.js';

const router = express.Router();

// GET /api/reports/indicators - Search indicators
router.get('/indicators', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM report_indicators';
        let params = [];

        if (search) {
            query += ' WHERE indicator_code LIKE ? OR description LIKE ? OR category LIKE ?';
            const searchTerm = `%${search}%`;
            params = [searchTerm, searchTerm, searchTerm];
        }

        query += ' ORDER BY page_number, indicator_code LIMIT 50'; // Limit results for performance

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching indicators:', error);
        res.status(500).json({ error: 'Failed to fetch indicators' });
    }
});

// POST /api/reports/submit - Submit a report for a patient
router.post('/submit', async (req, res) => {
    try {
        const { patient_id, doctor_id, indicator_code, patient_age, patient_gender, visit_id } = req.body;

        if (!patient_id || !doctor_id || !indicator_code) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if indicator exists
        const [indRows] = await db.query('SELECT indicator_code FROM report_indicators WHERE indicator_code = ?', [indicator_code]);
        if (indRows.length === 0) {
            return res.status(404).json({ error: 'Indicator not found' });
        }

        // Insert submission
        await db.query(
            'INSERT INTO patient_report_submissions (patient_id, doctor_id, indicator_code, patient_age, patient_gender, visit_id) VALUES (?, ?, ?, ?, ?, ?)',
            [patient_id, doctor_id, indicator_code, patient_age, patient_gender, visit_id || null]
        );

        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// GET /api/reports/tally - Get aggregated monthly data for Admin
router.get('/tally', async (req, res) => {
    try {
        const { month, year } = req.query;

        // Default to current month if not provided
        const now = new Date();
        const currentMonth = month || (now.getMonth() + 1);
        const currentYear = year || now.getFullYear();

        const query = `
            SELECT 
                ri.indicator_code,
                ri.description,
                ri.category,
                ri.page_number,
                COUNT(prs.submission_id) as count
            FROM report_indicators ri
            LEFT JOIN patient_report_submissions prs 
                ON ri.indicator_code = prs.indicator_code 
                AND MONTH(prs.submission_date) = ? 
                AND YEAR(prs.submission_date) = ?
            GROUP BY ri.indicator_code
            ORDER BY ri.page_number, ri.indicator_code
        `;

        const [rows] = await db.query(query, [currentMonth, currentYear]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tally:', error);
        res.status(500).json({ error: 'Failed to fetch report tally' });
    }
});

// GET /api/reports/tally-morbidity - Get aggregated morbidity data for Admin Dashboard
router.get('/tally-morbidity', async (req, res) => {
    try {
        const { month, year } = req.query;
        // Specific codes
        const codes = [
            'DA42', 'CA062', 'CA06', 'CA00', 'CA400', 'CA42', 'CA23',
            'IF41', 'IF40', 'IA36', 'DIA_D_ND', 'IF97', 'GC08', 'GC07',
            'FAZ0', 'IA07', 'IC307', 'HEAD_1', 'AGN_1', 'STI_1'
        ];

        const now = new Date();
        const currentMonth = month || (now.getMonth() + 1);
        const currentYear = year || now.getFullYear();

        const query = `
            SELECT 
                ri.indicator_code,
                ri.description,
                ri.category,
                SUM(CASE WHEN prs.patient_gender = 'Male' THEN 1 ELSE 0 END) as male_count,
                SUM(CASE WHEN prs.patient_gender = 'Female' THEN 1 ELSE 0 END) as female_count,
                COUNT(prs.submission_id) as total_count
            FROM report_indicators ri
            LEFT JOIN patient_report_submissions prs 
                ON ri.indicator_code = prs.indicator_code 
                AND MONTH(prs.submission_date) = ? 
                AND YEAR(prs.submission_date) = ?
            WHERE ri.indicator_code IN (?)
            GROUP BY ri.indicator_code
            ORDER BY ri.page_number, ri.indicator_code
        `;

        const [rows] = await db.query(query, [currentMonth, currentYear, codes]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching morbidity tally:', error);
        res.status(500).json({ error: 'Failed to fetch morbidity tally' });
    }
});

// GET /api/reports/export-word - Download Word Report


router.get('/export-word', async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and Year are required' });
        }

        const buffer = await generateWordReport(month, year);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Report_${year}_${month}.docx`);
        res.send(buffer);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// GET /api/reports/export-morbidity - Download Morbidity Word Report


router.get('/export-morbidity', async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and Year are required' });
        }

        const buffer = await generateMorbidityReport(month, year);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Morbidity_Report_${year}_${month}.docx`);
        res.send(buffer);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

export default router;
