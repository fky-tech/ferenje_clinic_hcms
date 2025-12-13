import db from '../config/db.js';

class VisitPhysicalExam {
    constructor(data = {}) {
        this.exam_id = data.exam_id || null;
        this.visit_id = data.visit_id || null;
        this.general_appearance = data.general_appearance || null;
        this.heent = data.heent || null;
        this.respiratory_system = data.respiratory_system || null;
        this.cvs = data.cvs || null;
        this.abdominal_exam = data.abdominal_exam || null;
        this.gus = data.gus || null;
        this.mss = data.mss || null;
        this.ns = data.ns || null;
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
        const {
            visit_id, general_appearance, heent, respiratory_system, cvs,
            abdominal_exam, gus, mss, ns
        } = examData;

        const [result] = await db.execute(
            `INSERT INTO visitphysicalexam (visit_id, general_appearance, heent, respiratory_system, cvs, abdominal_exam, gus, mss, ns) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [visit_id, general_appearance, heent, respiratory_system, cvs, abdominal_exam, gus, mss, ns]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.visit_id = pvr.visit_id
        `);
        return rows.map(row => new VisitPhysicalExam(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.visit_id = pvr.visit_id
            WHERE vpe.exam_id = ?
        `, [id]);
        return rows[0] ? new VisitPhysicalExam(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT vpe.*, pvr.visit_date
            FROM visitphysicalexam vpe
            JOIN patientvisitrecord pvr ON vpe.visit_id = pvr.visit_id
            WHERE vpe.visit_id = ?
        `, [visitId]);
        return rows[0] ? new VisitPhysicalExam(rows[0]) : null;
    }

    static async update(id, examData) {
        const {
            visit_id, general_appearance, heent, respiratory_system, cvs,
            abdominal_exam, gus, mss, ns
        } = examData;

        const [result] = await db.execute(
            `UPDATE visitphysicalexam SET 
       visit_id = ?, general_appearance = ?, heent = ?, respiratory_system = ?, cvs = ?, 
       abdominal_exam = ?, gus = ?, mss = ?, ns = ? 
       WHERE exam_id = ?`,
            [visit_id, general_appearance, heent, respiratory_system, cvs, abdominal_exam, gus, mss, ns, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM visitphysicalexam WHERE exam_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default VisitPhysicalExam;
