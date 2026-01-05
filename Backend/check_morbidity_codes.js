import db from './src/config/db.js';

const codesToCheck = [
    'DA42', 'CA062', 'CA06', 'CA00', 'CA400', 'CA42', 'CA23',
    'IF41', 'IF40', 'IA36', 'IF97', 'GC08', 'GC07', 'FAZ0',
    'IA07', 'IC307'
];

async function checkCodes() {
    try {
        const [rows] = await db.query('SELECT indicator_code FROM report_indicators WHERE indicator_code IN (?)', [codesToCheck]);
        const foundCodes = rows.map(r => r.indicator_code);
        const missingCodes = codesToCheck.filter(c => !foundCodes.includes(c));

        console.log('Found codes:', foundCodes);
        console.log('Missing codes:', missingCodes);
        process.exit(0);
    } catch (error) {
        console.error('Error checking codes:', error);
        process.exit(1);
    }
}

checkCodes();
