import db from './src/config/db.js';

const morbidityIndicators = [
    { code: 'DA42', description: 'Peptic ulcer disease', category: 'Common Morbidity', page: 9 },
    { code: 'CA062', description: 'Tonsillitis', category: 'Common Morbidity', page: 9 },
    { code: 'CA06', description: 'Pharyngitis', category: 'Common Morbidity', page: 9 },
    { code: 'CA00', description: 'Nasopharyngitis (flu)', category: 'Common Morbidity', page: 9 },
    { code: 'CA400', description: 'Pneumonia', category: 'Common Morbidity', page: 9 },
    { code: 'CA42', description: 'Acute bronchitis', category: 'Common Morbidity', page: 9 },
    { code: 'CA23', description: 'Bronchial Asthma', category: 'Common Morbidity', page: 9 },
    { code: 'IF41', description: 'Malaria (P.v)', category: 'Common Morbidity', page: 9 },
    { code: 'IF40', description: 'Malaria (P.f)', category: 'Common Morbidity', page: 9 },
    { code: 'IA36', description: 'Amoebic dysentery', category: 'Common Morbidity', page: 9 },
    { code: 'DIA_D_ND', description: 'Diarrhea D no D', category: 'Common Morbidity', page: 9 },
    { code: 'IF97', description: 'Helminthiasis', category: 'Common Morbidity', page: 9 },
    { code: 'GC08', description: 'Urinary tract infection', category: 'Common Morbidity', page: 9 },
    { code: 'GC07', description: 'STI', category: 'Common Morbidity', page: 9 },
    { code: 'FAZ0', description: 'Rheumatoid Arthritis', category: 'Common Morbidity', page: 9 },
    { code: 'IA07', description: 'Typhoid', category: 'Common Morbidity', page: 9 },
    { code: 'IC307', description: 'Typhus', category: 'Common Morbidity', page: 9 },
    { code: 'HEAD_1', description: '1° Headache', category: 'Common Morbidity', page: 9 },
    { code: 'AGN_1', description: 'Acute glomerulonephritis', category: 'Common Morbidity', page: 9 },
    { code: 'STI_1', description: 'Soft tissue injury', category: 'Common Morbidity', page: 9 }
];

async function seedMorbidity() {
    try {
        console.log('Seeding morbidity indicators...');
        await db.query('USE ferenje_clinic_hcms2');

        const values = morbidityIndicators.map(ind => [ind.code, ind.description, ind.category, ind.page]);

        await db.query(
            'INSERT IGNORE INTO report_indicators (indicator_code, description, category, page_number) VALUES ?',
            [values]
        );

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedMorbidity();
