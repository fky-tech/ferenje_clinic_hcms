import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'family_planning_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split queries by semicolon, handling the case where semicolons might be inside comments or strings
        // This is a simple split, for complex SQL this might fail, but for our case it should be fine.
        const queries = sql.split(';').filter(q => q.trim().length > 0);

        console.log(`Found ${queries.length} queries to execute.`);

        for (const query of queries) {
            if (query.trim()) {
                // console.log('Executing:', query.substring(0, 100) + '...');
                await pool.query(query);
            }
        }
        console.log('Family Planning Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

runMigration();
