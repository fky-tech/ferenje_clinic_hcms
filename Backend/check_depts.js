import db from './src/config/db.js';

async function checkDepts() {
    const [rows] = await db.execute('SELECT * FROM department');
    console.log(JSON.stringify(rows));
    process.exit(0);
}

checkDepts();
