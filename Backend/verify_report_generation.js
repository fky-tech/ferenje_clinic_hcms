import db from './src/config/db.js';
import { generateWordReport } from './src/services/reportGenerator.js';
import fs from 'fs';

async function verify() {
    console.log('Starting verification...');

    // 1. Insert Test Data
    const testCode = 'MAT_ANC1'; // Provided in list? I saw it in parsed files. I'll pick one I know exists or query one.
    // Let's first get a valid indicator
    const [rows] = await db.query('SELECT indicator_code FROM report_indicators LIMIT 1');
    if (rows.length === 0) {
        console.error('No indicators found. Seeding failed?');
        process.exit(1);
    }
    const indicator = rows[0].indicator_code;
    console.log(`Using indicator: ${indicator}`);

    // Need a valid patient and doctor. 
    // I'll query one or insert dummy if needed. 
    // Ideally use existing ones.
    const [patients] = await db.query('SELECT patient_id FROM patient LIMIT 1');
    const [doctors] = await db.query('SELECT doctor_id FROM doctor LIMIT 1');

    if (patients.length === 0 || doctors.length === 0) {
        console.error('No patient or doctor found to link submission.');
        // Can't easily test submission without FKs.
        // I will just test the report generation with empty data or whatever is there.
        // But to verify counts, I need data.
        // I'll skip insertion if no FKs and just try generation.
    } else {
        const pid = patients[0].patient_id;
        const did = doctors[0].doctor_id;

        console.log(`Inserting test submission for P:${pid}, D:${did}`);
        await db.query(`
            INSERT INTO patient_report_submissions (patient_id, doctor_id, indicator_code, patient_age, patient_gender, submission_date)
            VALUES (?, ?, ?, 25, 'Male', NOW())
        `, [pid, did, indicator]);
    }

    // 2. Generate Report
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    console.log(`Generating report for ${month}/${year}...`);
    try {
        const buffer = await generateWordReport(month, year);
        console.log(`Report generated. Size: ${buffer.length} bytes`);

        if (buffer.length > 0) {
            console.log('✓ Verification Successful: Word document buffer created.');
            fs.writeFileSync('test_report.docx', buffer);
            console.log('Saved to test_report.docx');
        } else {
            console.error('✗ Verification Failed: Empty buffer');
        }

    } catch (e) {
        console.error('✗ Verification Failed:', e);
    }

    process.exit(0);
}

verify();
