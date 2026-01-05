import db from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indicatorsPath = path.join(__dirname, 'seeds', 'indicators.json');
const indicators = JSON.parse(fs.readFileSync(indicatorsPath, 'utf8'));

async function seed() {
    try {
        console.log('Creating tables...');

        await db.query('USE ferenje_clinic_hcms2');

        await db.query(`
            CREATE TABLE IF NOT EXISTS report_indicators (
                indicator_code VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100),
                page_number INT DEFAULT 1,
                PRIMARY KEY (indicator_code)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS patient_report_submissions (
                submission_id INT NOT NULL AUTO_INCREMENT,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                indicator_code VARCHAR(50) NOT NULL,
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                patient_age INT,
                patient_gender VARCHAR(10),
                visit_id INT DEFAULT NULL,
                PRIMARY KEY (submission_id),
                FOREIGN KEY (patient_id) REFERENCES patient (patient_id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctor (doctor_id),
                FOREIGN KEY (indicator_code) REFERENCES report_indicators (indicator_code) ON DELETE CASCADE
            )
        `);

        console.log('Tables created/verified.');
        console.log(`Seeding ${indicators.length} indicators...`);

        // Use REPLACE INTO to update existing or insert new
        // Batch insert for performance
        const batchSize = 100;
        for (let i = 0; i < indicators.length; i += batchSize) {
            const batch = indicators.slice(i, i + batchSize);
            const values = batch.map(ind => [ind.code, ind.description, ind.category, ind.page]);

            if (values.length > 0) {
                await db.query(
                    'REPLACE INTO report_indicators (indicator_code, description, category, page_number) VALUES ?',
                    [values]
                );
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
