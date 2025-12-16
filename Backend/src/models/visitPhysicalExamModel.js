import db from '../config/db.js';

class VisitPhysicalExam {
    constructor(data = {}) {
        this.exam_id = data.ExamID || data.exam_id || null;
        this.visit_id = data.VisitRecordID || data.visit_id || null;
        this.general_appearance = data.GeneralAppearance || data.general_appearance || null;
        this.heent = data.HEENT_Findings || data.heent || null;
        this.respiratory_system = data.Chest_Findings || data.respiratory_system || null;
        this.cvs = data.CVS_Findings || data.cvs || null;
        this.abdominal_exam = data.Abdomen_Findings || data.abdominal_exam || null;
        this.ns = data.CNS_Findings || data.ns || null;
        this.mss = data.MSS_Findings || data.mss || null;
        this.gus = data.gus || null; // Not in displayed SQL, keeping as is
        // From JOIN
        this.visit_date = data.visit_date || null;
    }

    async save() {
        if (this.exam_id) {
            return await VisitPhysicalExam.update(this.exam_id, this);
        } else {
            const insertId = await VisitPhysicalExam.create(this);
            this.exam_id = insertId;
            return insertId;
        }
    }

    static async create(examData) {
        // Default all fields to null to prevent SQL binding errors
        const visit_id = examData.visit_id || null;
        const general_appearance = examData.general_appearance || examData.GeneralAppearance || null;
        const heent = examData.heent || examData.HEENT_Findings || null;
        const respiratory_system = examData.respiratory_system || examData.Chest_Findings || null;
        const cvs = examData.cvs || examData.CVS_Findings || null;
        const abdominal_exam = examData.abdominal_exam || examData.Abdomen_Findings || null;
        const ns = examData.ns || examData.CNS_Findings || null;
        const mss = examData.mss || examData.MSS_Findings || null;

        const [result] = await db.execute(
            `INSERT INTO visitphysicalexam 
            (VisitRecordID, GeneralAppearance, HEENT_Findings, Chest_Findings, CVS_Findings, Abdomen_Findings, CNS_Findings, MSS_Findings) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [visit_id, general_appearance, heent, respiratory_system, cvs, abdominal_exam, ns, mss]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.DateOfVisit as visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.VisitRecordID = pvr.VisitRecordID
        `);
        return rows.map(row => new VisitPhysicalExam(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.DateOfVisit as visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.VisitRecordID = pvr.VisitRecordID
            WHERE vpe.ExamID = ?
        `, [id]);
        return rows[0] ? new VisitPhysicalExam(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.DateOfVisit as visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.VisitRecordID = pvr.VisitRecordID
            WHERE vpe.VisitRecordID = ?
        `, [visitId]);
        return rows[0] ? new VisitPhysicalExam(rows[0]) : null;
    }

    static async findByCardId(cardId) {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.VisitRecordID, pvr.DateOfVisit as visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.VisitRecordID = pvr.VisitRecordID
            WHERE pvr.card_id = ?
            ORDER BY pvr.DateOfVisit DESC
        `, [cardId]);
        return rows.map(row => new VisitPhysicalExam(row));
    }

    static async update(id, examData) {
        // Default all fields to null to prevent SQL binding errors
        const visit_id = examData.visit_id || null;
        const general_appearance = examData.general_appearance || examData.GeneralAppearance || null;
        const heent = examData.heent || examData.HEENT_Findings || null;
        const respiratory_system = examData.respiratory_system || examData.Chest_Findings || null;
        const cvs = examData.cvs || examData.CVS_Findings || null;
        const abdominal_exam = examData.abdominal_exam || examData.Abdomen_Findings || null;
        const ns = examData.ns || examData.CNS_Findings || null;
        const mss = examData.mss || examData.MSS_Findings || null;

        const [result] = await db.execute(
            `UPDATE visitphysicalexam SET 
            VisitRecordID = ?, GeneralAppearance = ?, HEENT_Findings = ?, Chest_Findings = ?, 
            CVS_Findings = ?, Abdomen_Findings = ?, CNS_Findings = ?, MSS_Findings = ?
            WHERE ExamID = ?`,
            [visit_id, general_appearance, heent, respiratory_system, cvs, abdominal_exam, ns, mss, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM visitphysicalexam WHERE ExamID = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default VisitPhysicalExam;
