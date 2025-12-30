import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, HeadingLevel, TextRun } from "docx";
import db from "../config/db.js";

// Specific code order as requested
const TARGET_CODES = [
    'DA42', 'CA062', 'CA06', 'CA00', 'CA400', 'CA42', 'CA23',
    'IF41', 'IF40', 'IA36', 'DIA_D_ND', 'IF97', 'GC08', 'GC07',
    'FAZ0', 'IA07', 'IC307', 'HEAD_1', 'AGN_1', 'STI_1'
];

export const generateMorbidityReport = async (month, year) => {
    // 1. Fetch Data
    // We need to fetch individual submissions to bucket them by age/gender ourselves, 
    // OR we can do complex SQL. Fetching and JS processing is often easier for matrixes.

    const query = `
        SELECT 
            prs.indicator_code,
            ri.description,
            prs.patient_age,
            prs.patient_gender
        FROM patient_report_submissions prs
        JOIN report_indicators ri ON prs.indicator_code = ri.indicator_code
        WHERE MONTH(prs.submission_date) = ? 
        AND YEAR(prs.submission_date) = ?
        AND prs.indicator_code IN (?)
    `;

    const [rows] = await db.query(query, [month, year, TARGET_CODES]);

    // 2. Initialize Matrix
    // Structure: { code: { '<1F': 0, '<1M': 0, '1-4F': 0, ... } }
    const matrix = {};
    TARGET_CODES.forEach(code => {
        matrix[code] = {
            description: '', // Will fill from rows or lookup
            buckets: {
                '<1yrs': { M: 0, F: 0 },
                '1-4yrs': { M: 0, F: 0 },
                '6-14yrs': { M: 0, F: 0 },
                '15-29yrs': { M: 0, F: 0 },
                '30-64yrs': { M: 0, F: 0 },
                '>=68yrs': { M: 0, F: 0 }
            }
        };
    });

    // Helper to determine bucket
    const getBucket = (age) => {
        if (age < 1) return '<1yrs';
        if (age <= 4) return '1-4yrs';
        if (age <= 14) return '6-14yrs';
        if (age <= 29) return '15-29yrs';
        if (age <= 64) return '30-64yrs';
        return '>=68yrs';
    };

    // 3. Process Data
    rows.forEach(row => {
        if (matrix[row.indicator_code]) {
            matrix[row.indicator_code].description = row.description; // Capture description
            const bucket = getBucket(row.patient_age);
            const gender = row.patient_gender === 'Male' ? 'M' : 'F'; // Normalize
            if (bucket && gender) {
                matrix[row.indicator_code].buckets[bucket][gender]++;
            }
        }
    });

    // Fill descriptions for rows with 0 count from a static map if needed, 
    // but the key is we iterate TARGET_CODES to build the table.

    // 4. Build Document
    const bucketKeys = ['<1yrs', '1-4yrs', '6-14yrs', '15-29yrs', '30-64yrs', '>=68yrs'];

    // Header Rows
    const headerRow1 = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph("Disease")], rowSpan: 2, width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph("Code")], rowSpan: 2, width: { size: 10, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph("Female")], columnSpan: 6, width: { size: 37, type: WidthType.PERCENTAGE } }), // Approx half of remaining
            new TableCell({ children: [new Paragraph("Male")], columnSpan: 6, width: { size: 37, type: WidthType.PERCENTAGE } }),
        ]
    });

    const headerRow2 = new TableRow({
        children: [
            // Female Sub-headers
            ...bucketKeys.map(b => new TableCell({ children: [new Paragraph(b)], width: { size: 6, type: WidthType.PERCENTAGE } })),
            // Male Sub-headers
            ...bucketKeys.map(b => new TableCell({ children: [new Paragraph(b)], width: { size: 6, type: WidthType.PERCENTAGE } }))
        ]
    });

    // Data Rows
    const dataRows = TARGET_CODES.map(code => {
        const data = matrix[code];
        // If description missing (no rows found), we might want a static map.
        // For now using code as fallback or let it be empty? Better to have it.
        // I'll skip fetching description for 0-count rows to save complexity 
        // unless strictly needed. The user knows the codes.

        return new TableRow({
            children: [
                new TableCell({ children: [new Paragraph(data.description || code)] }), // Fallback to code if no description found in data
                new TableCell({ children: [new Paragraph(code)] }),
                // Female Counts
                ...bucketKeys.map(b => new TableCell({ children: [new Paragraph(String(data.buckets[b].F))] })),
                // Male Counts
                ...bucketKeys.map(b => new TableCell({ children: [new Paragraph(String(data.buckets[b].M))] })),
            ]
        });
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    size: {
                        orientation: "landscape", // Matrix is wide
                    },
                },
            },
            children: [
                new Paragraph({
                    text: `Morbidity Tally Sheet - ${month}/${year}`,
                    heading: HeadingLevel.TITLE,
                    alignment: "center",
                    spacing: { after: 300 }
                }),
                new Table({
                    rows: [headerRow1, headerRow2, ...dataRows],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: "single", size: 1 },
                        bottom: { style: "single", size: 1 },
                        left: { style: "single", size: 1 },
                        right: { style: "single", size: 1 },
                        insideHorizontal: { style: "single", size: 1 },
                        insideVertical: { style: "single", size: 1 },
                    }
                })
            ],
        }],
    });

    return await Packer.toBuffer(doc);
};
