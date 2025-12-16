import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReportController {
    // 1. Manual Export API - Returns JSON data for frontend to convert to CSV
    async getDailyReport(req, res) {
        try {
            const { date, type } = req.query; // type: 'payments', 'labs', 'patients'
            const reportDate = date || new Date().toISOString().slice(0, 10);

            let data = [];

            if (type === 'payments') {
                const [rows] = await db.execute(`
                    SELECT p.payment_id, c.CardNumber, pat.FirstName, pat.Father_Name, p.amount, p.payment_type, p.status, p.billing_date
                    FROM payment p
                    JOIN card c ON p.card_id = c.card_id
                    JOIN patient pat ON c.patient_id = pat.patient_id
                    WHERE DATE(p.billing_date) = ?
                `, [reportDate]);
                data = rows;
            } else if (type === 'labs') {
                const [rows] = await db.execute(`
                    SELECT lr.request_id, lr.LabStatus, lr.RequestDate, c.CardNumber, pat.FirstName, pat.Father_Name
                    FROM lab_request lr
                    JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
                    JOIN card c ON pvr.card_id = c.card_id
                    JOIN patient pat ON c.patient_id = pat.patient_id
                    WHERE DATE(lr.RequestDate) = ?
                `, [reportDate]);
                data = rows;
            } else if (type === 'patients') {
                const [rows] = await db.execute(`
                    SELECT pvr.VisitRecordID, pvr.DateOfVisit, c.CardNumber, pat.FirstName, pat.Father_Name, pat.PhoneNo, pat.Wereda, pat.Region
                    FROM patientvisitrecord pvr
                    JOIN card c ON pvr.card_id = c.card_id
                    JOIN patient pat ON c.patient_id = pat.patient_id
                    WHERE DATE(pvr.DateOfVisit) = ?
                `, [reportDate]);
                data = rows;
            } else {
                return res.status(400).json({ error: 'Invalid report type' });
            }

            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({ error: 'Failed to fetch report', details: error.message });
        }
    }

    // 2. Cron Job Function - Saves Excel file to disk
    async generateDailyExport() {
        console.log('Running daily export cron job (Excel)...');
        try {
            const today = new Date().toISOString().slice(0, 10);
            const reportsDir = path.join(__dirname, '../../reports');

            // Ensure directory exists
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ferenje Clinic HCMS';
            workbook.created = new Date();

            // --- 1. Fetch Data ---
            // Financials
            const [payments] = await db.execute(`
                SELECT p.payment_id, c.CardNumber, CONCAT(pat.FirstName, ' ', pat.Father_Name) as PatientName, p.amount, p.payment_type, p.status, p.billing_date
                FROM payment p
                JOIN card c ON p.card_id = c.card_id
                JOIN patient pat ON c.patient_id = pat.patient_id
                WHERE DATE(p.billing_date) = ?
            `, [today]);

            // Lab Activity
            const [labs] = await db.execute(`
                SELECT lr.request_id, lr.LabStatus, lr.RequestDate, c.CardNumber, CONCAT(pat.FirstName, ' ', pat.Father_Name) as PatientName
                FROM lab_request lr
                JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
                JOIN card c ON pvr.card_id = c.card_id
                JOIN patient pat ON c.patient_id = pat.patient_id
                WHERE DATE(lr.RequestDate) = ?
            `, [today]);

            // Patient Visits
            const [visits] = await db.execute(`
                SELECT pvr.VisitRecordID, pvr.DateOfVisit, c.CardNumber, CONCAT(pat.FirstName, ' ', pat.Father_Name) as PatientName, pat.PhoneNo
                FROM patientvisitrecord pvr
                JOIN card c ON pvr.card_id = c.card_id
                JOIN patient pat ON c.patient_id = pat.patient_id
                WHERE DATE(pvr.DateOfVisit) = ?
            `, [today]);

            // --- 2. Create Sheets ---

            // Sheet 1: Summary
            const summarySheet = workbook.addWorksheet('Summary');
            summarySheet.columns = [
                { header: 'Metric', key: 'metric', width: 30 },
                { header: 'Value', key: 'value', width: 20 }
            ];
            summarySheet.addRows([
                { metric: 'Report Date', value: today },
                { metric: 'Total Revenue', value: payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) },
                { metric: 'Total Patient Visits', value: visits.length },
                { metric: 'Total Lab Requests', value: labs.length }
            ]);
            summarySheet.getRow(1).font = { bold: true };

            // Sheet 2: Financial Report
            const finSheet = workbook.addWorksheet('Financial Report');
            finSheet.columns = [
                { header: 'Payment ID', key: 'payment_id', width: 15 },
                { header: 'Card No', key: 'CardNumber', width: 15 },
                { header: 'Patient Name', key: 'PatientName', width: 25 },
                { header: 'Amount', key: 'amount', width: 15 },
                { header: 'Type', key: 'payment_type', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Date', key: 'billing_date', width: 20 }
            ];
            finSheet.addRows(payments);
            finSheet.getRow(1).font = { bold: true };

            // Sheet 3: Patient Visits
            const visitSheet = workbook.addWorksheet('Patient Visits');
            visitSheet.columns = [
                { header: 'Visit ID', key: 'VisitRecordID', width: 15 },
                { header: 'Card No', key: 'CardNumber', width: 15 },
                { header: 'Patient Name', key: 'PatientName', width: 25 },
                { header: 'Phone', key: 'PhoneNo', width: 15 },
                { header: 'Visit Date', key: 'DateOfVisit', width: 20 }
            ];
            visitSheet.addRows(visits);
            visitSheet.getRow(1).font = { bold: true };

            // Sheet 4: Lab Activity
            const labSheet = workbook.addWorksheet('Lab Activity');
            labSheet.columns = [
                { header: 'Request ID', key: 'request_id', width: 15 },
                { header: 'Card No', key: 'CardNumber', width: 15 },
                { header: 'Patient Name', key: 'PatientName', width: 25 },
                { header: 'Status', key: 'LabStatus', width: 15 },
                { header: 'Request Date', key: 'RequestDate', width: 20 }
            ];
            labSheet.addRows(labs);
            labSheet.getRow(1).font = { bold: true };

            // --- 3. Save File ---
            const filePath = path.join(reportsDir, `daily_report_${today}.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            console.log(`Daily Excel report saved to ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error generating daily export:', error);
            return false;
        }
    }
}

export default new ReportController();
