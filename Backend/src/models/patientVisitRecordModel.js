import db from '../config/db.js';

class PatientVisitRecord {
    constructor(data = {}) {
        this.visit_id = data.visit_id || null;
        this.card_id = data.card_id || null;
        this.doctor_id = data.doctor_id || null;
        this.visit_date = data.visit_date || null;
        this.visit_time = data.visit_time || null;
        this.visit_type = data.visit_type || null;
        this.notes = data.notes || null;
        // From JOIN
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.CardNumber = data.CardNumber || null;
        this.doctor_first_name = data.doctor_first_name || null;
        this.doctor_last_name = data.doctor_last_name || null;
    }

    async save() {
        if (this.visit_id) {
            return await PatientVisitRecord.update(this.visit_id, this);
        } else {
            const insertId = await PatientVisitRecord.create(this);
            this.visit_id = insertId;
            return insertId;
        }
    }

    static async create(visitData) {
        const { card_id, doctor_id, visit_date, visit_time, visit_type, notes } = visitData;
        const [result] = await db.execute(
            'INSERT INTO patientvisitrecord (card_id, doctor_id, visit_date, visit_time, visit_type, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [card_id, doctor_id, visit_date, visit_time, visit_type, notes]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT pvr.*, 
                   p.FirstName, p.Father_Name, 
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM patientvisitrecord pvr
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
        `);
        return rows.map(row => new PatientVisitRecord(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT pvr.*, 
                   p.FirstName, p.Father_Name, 
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM patientvisitrecord pvr
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            WHERE pvr.visit_id = ?
        `, [id]);
        return rows[0] ? new PatientVisitRecord(rows[0]) : null;
    }

    static async findByCardId(cardId) {
        const [rows] = await db.execute(`
            SELECT pvr.*, 
                   p.FirstName, p.Father_Name, 
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM patientvisitrecord pvr
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            WHERE pvr.card_id = ?
        `, [cardId]);
        return rows.map(row => new PatientVisitRecord(row));
    }

    static async update(id, visitData) {
        const { card_id, doctor_id, visit_date, visit_time, visit_type, notes } = visitData;
        const [result] = await db.execute(
            'UPDATE patientvisitrecord SET card_id = ?, doctor_id = ?, visit_date = ?, visit_time = ?, visit_type = ?, notes = ? WHERE visit_id = ?',
            [card_id, doctor_id, visit_date, visit_time, visit_type, notes, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM patientvisitrecord WHERE visit_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default PatientVisitRecord;
