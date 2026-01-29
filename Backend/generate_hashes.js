// Quick script to generate correct bcrypt hashes for all users
import bcrypt from 'bcryptjs';

const passwords = {
    'doctor@clinic.com': 'doctor123',
    'receptionist@clinic.com': 'receptionist123',
    'lab@gmail.com': 'lab123',
    'admin@gmail.com': 'admin123',
    'daniel@gmail.com': '123'
};

async function generateHashes() {
    console.log('-- Generated bcrypt hashes for password migration:\n');

    for (const [email, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`-- Update ${email} (password: ${password})`);
        console.log(`UPDATE person SET password = '${hash}' WHERE email = '${email}';`);
        console.log(`-- Hash length: ${hash.length}\n`);
    }
}

generateHashes().catch(console.error);
