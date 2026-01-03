import express from 'express';
import db from '../config/db.js';
import { generateWordReport } from '../services/reportGenerator.js';
import { generateMorbidityReport } from '../services/morbidityReportGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MORBIDITY_LIST_PATH = path.join(__dirname, '../config/morbidity_list.json');

const router = express.Router();

// Helper to get morbidity list
const getMorbidityList = () => {
    try {
        if (!fs.existsSync(MORBIDITY_LIST_PATH)) {
            return [];
        }
        const data = fs.readFileSync(MORBIDITY_LIST_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading morbidity list:', err);
        return [];
    }
};

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

// GET /api/reports/morbidity-list - Get Common Morbidity List
router.get('/morbidity-list', (req, res) => {
    const list = getMorbidityList();
    res.json(list);
});

// POST /api/reports/morbidity-list - Add to Common Morbidity List
router.post('/morbidity-list', async (req, res) => {
    try {
        const { code, description } = req.body;
        if (!code || !description) {
            return res.status(400).json({ error: 'Code and Description are required' });
        }

        const list = getMorbidityList();

        // Check duplicate
        if (list.find(item => item.code === code)) {
            return res.status(400).json({ error: 'Code already exists in the list' });
        }

        list.push({ code, description });

        fs.writeFileSync(MORBIDITY_LIST_PATH, JSON.stringify(list, null, 4));
        res.status(201).json({ message: 'Added to list', list });
    } catch (error) {
        console.error('Error updating morbidity list:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
});

// DELETE /api/reports/morbidity-list - Remove from Common Morbidity List
router.delete('/morbidity-list', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        let list = getMorbidityList();
        const initialLength = list.length;

        list = list.filter(item => item.code !== code);

        if (list.length === initialLength) {
            return res.status(404).json({ error: 'Code not found in list' });
        }

        fs.writeFileSync(MORBIDITY_LIST_PATH, JSON.stringify(list, null, 4));
        res.json({ message: 'Removed from list', list });
    } catch (error) {
        console.error('Error removing from morbidity list:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
});

// POST /api/reports/submit - Submit a report for a patient
router.post('/submit', async (req, res) => {
    try {
        const { patient_id, doctor_id, indicator_code, patient_age, patient_gender, visit_id } = req.body;

        if (!patient_id || !doctor_id || !indicator_code) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if indicator exists in DB (Global lookup)
        const [indRows] = await db.query('SELECT indicator_code FROM report_indicators WHERE indicator_code = ?', [indicator_code]);
        if (indRows.length === 0) {
            return res.status(404).json({ error: 'Indicator not found in master database' });
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

        // Load Dynamic List
        const list = getMorbidityList();
        const codes = list.map(item => item.code);

        if (codes.length === 0) {
            return res.json([]);
        }

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

// POST /api/reports/reset-tally - Reset data for a month
router.post('/reset-tally', async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and Year are required' });
        }

        const query = `
            DELETE FROM patient_report_submissions 
            WHERE MONTH(submission_date) = ? 
            AND YEAR(submission_date) = ?
        `;

        const [result] = await db.query(query, [month, year]);

        console.log(`Reset tally for ${month}/${year}. Deleted ${result.affectedRows} rows.`);
        res.json({ message: 'Report data reset successfully', deletedRows: result.affectedRows });
    } catch (error) {
        console.error('Error resetting tally:', error);
        res.status(500).json({ error: 'Failed to reset report data' });
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
