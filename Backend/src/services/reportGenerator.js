import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, HeadingLevel, PageBreak } from "docx";
import db from "../config/db.js";

export const generateWordReport = async (month, year) => {
    // 1. Fetch Data
    const query = `
        SELECT 
            ri.indicator_code,
            ri.description,
            ri.category,
            ri.page_number,
            COUNT(prs.submission_id) as count
        FROM report_indicators ri
        LEFT JOIN patient_report_submissions prs 
            ON ri.indicator_code = prs.indicator_code 
            AND MONTH(prs.submission_date) = ? 
            AND YEAR(prs.submission_date) = ?
        GROUP BY ri.indicator_code
        ORDER BY ri.page_number, ri.indicator_code
    `;

    const [rows] = await db.query(query, [month, year]);

    // 2. Group by Page
    const pages = {};
    rows.forEach(row => {
        const p = row.page_number || 1;
        if (!pages[p]) pages[p] = [];
        pages[p].push(row);
    });

    // 3. Build Document
    const children = [];

    // Title Page
    children.push(
        new Paragraph({
            text: `Monthly Health Report - ${month}/${year}`,
            heading: HeadingLevel.TITLE,
            alignment: "center",
            spacing: { after: 300 }
        }),
        new Paragraph({
            text: "Ferenje Clinic Healthcare Management System",
            alignment: "center",
            spacing: { after: 500 }
        })
    );

    const pageNumbers = Object.keys(pages).sort((a, b) => a - b);

    for (const pageNum of pageNumbers) {
        if (children.length > 2) {
            children.push(new Paragraph({ children: [new PageBreak()] }));
        }

        children.push(
            new Paragraph({
                text: `Page ${pageNum}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 }
            })
        );

        // Table Header
        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "S.No", stop: "center" })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph("Activity / Description")], width: { size: 70, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph("Value")], width: { size: 15, type: WidthType.PERCENTAGE } }),
                ],
            })
        ];

        // Data Rows
        pages[pageNum].forEach(row => {
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(row.indicator_code)] }),
                        new TableCell({ children: [new Paragraph(row.description)] }),
                        new TableCell({ children: [new Paragraph(String(row.count))] }),
                    ],
                })
            );
        });

        children.push(
            new Table({
                rows: tableRows,
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
        );
    }

    const doc = new Document({
        sections: [{
            children: children,
        }],
    });

    return await Packer.toBuffer(doc);
};
