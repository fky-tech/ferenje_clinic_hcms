import db from '../config/db.js';

class Medication {
    constructor(data = {}) {
        this.medication_id = data.medication_id || null;
        this.visit_id = data.visit_id || null;
        this.drug_name = data.drug_name || null;
        this.dosage = data.dosage || null;
        this.frequency = data.frequency || null;
        this.duration = data.duration || null;
        this.start_date = data.start_date || null;
        this.end_date = data.end_date || null;
        this.instructions = data.instructions || null;
        // From JOIN
        this.visit_date = data.visit_date || null;
    }

    async save() {
        if (this.medication_id) {
            return await Medication.update(this.medication_id, this);
        } else {
            const insertId = await Medication.create(this);
            this.medication_id = insertId;
            return insertId;
        }
    }

    static async create(medicationData) {
        const {
            visit_id, drug_name, dosage, frequency, duration,
            start_date, end_date, instructions
        } = medicationData;

        const [result] = await db.execute(
            `INSERT INTO medication (visit_id, drug_name, dosage, frequency, duration, start_date, end_date, instructions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [visit_id, drug_name, dosage, frequency, duration, start_date, end_date, instructions]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT m.*, pvr.visit_date
            FROM medication m
            JOIN patientvisitrecord pvr ON m.visit_id = pvr.visit_id
        `);
        return rows.map(row => new Medication(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT m.*, pvr.visit_date
            FROM medication m
            JOIN patientvisitrecord pvr ON m.visit_id = pvr.visit_id
            WHERE m.medication_id = ?
        `, [id]);
        return rows[0] ? new Medication(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT m.*, pvr.visit_date
            FROM medication m
            JOIN patientvisitrecord pvr ON m.visit_id = pvr.visit_id
            WHERE m.visit_id = ?
        `, [visitId]);
        return rows.map(row => new Medication(row));
    }

    static async update(id, medicationData) {
        const {
            visit_id, drug_name, dosage, frequency, duration,
            start_date, end_date, instructions
        } = medicationData;

        const [result] = await db.execute(
            `UPDATE medication SET 
       visit_id = ?, drug_name = ?, dosage = ?, frequency = ?, duration = ?, 
       start_date = ?, end_date = ?, instructions = ? 
       WHERE medication_id = ?`,
            [visit_id, drug_name, dosage, frequency, duration, start_date, end_date, instructions, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM medication WHERE medication_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Medication;
