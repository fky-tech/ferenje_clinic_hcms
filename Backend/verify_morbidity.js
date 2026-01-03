import db from './src/config/db.js';
import { generateMorbidityReport } from './src/services/morbidityReportGenerator.js';
import fs from 'fs';

async function verifyMorbidity() {
    console.log('Starting Morbidity verification...');

    // 1. Insert Test Data for a Common Disease
    const testCode = 'DA42'; // Peptic ulcer
    const [patients] = await db.query('SELECT patient_id FROM patient LIMIT 1');
    const [doctors] = await db.query('SELECT doctor_id FROM doctor LIMIT 1');

    if (patients.length && doctors.length) {
        const pid = patients[0].patient_id;
        const did = doctors[0].doctor_id;

        console.log(`Inserting test Morbidity submission for P:${pid}, D:${did}, Code:${testCode}`);
        try {
            await db.query(`
                INSERT INTO patient_report_submissions (patient_id, doctor_id, indicator_code, patient_age, patient_gender, submission_date)
                VALUES (?, ?, ?, 35, 'Female', NOW())
            `, [pid, did, testCode]);
        } catch (e) {
            console.error('Insertion failed (duplicate? or foreign key?):', e.message);
        }
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // 2. Verify API Tally Data Logic (Simulated)
    console.log(`Verifying Tally for ${month}/${year}...`);
    try {
        const codes = ['DA42'];
        const query = `
            SELECT 
                ri.indicator_code,
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
        `;
        const [rows] = await db.query(query, [month, year, codes]);
        console.log('Tally Result:', rows);
        const peptic = rows.find(r => r.indicator_code === 'DA42');
        if (peptic && peptic.female_count > 0) {
            console.log('✓ Tally Verification Successful: Found Female count.');
        } else {
            console.error('✗ Tally Verification Failed: Expected Female count > 0');
        }

    } catch (e) {
        console.error('Tally verification error:', e);
    }

    // 3. Generate Word Report
    console.log(`Generating Morbidity Report Document...`);
    try {
        const buffer = await generateMorbidityReport(month, year);
        console.log(`Report generated. Size: ${buffer.length} bytes`);

        if (buffer.length > 0) {
            console.log('✓ Verification Successful: Morbidity Word document buffer created.');
            fs.writeFileSync('test_morbidity_report.docx', buffer);
            console.log('Saved to test_morbidity_report.docx');
        } else {
            console.error('✗ Verification Failed: Empty buffer');
        }

    } catch (e) {
        console.error('✗ Verification Failed:', e);
    }

    process.exit(0);
}

verifyMorbidity();
