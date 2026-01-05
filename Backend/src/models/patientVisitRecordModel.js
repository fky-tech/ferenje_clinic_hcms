import db from '../config/db.js';

class PatientVisitRecord {
    constructor(data = {}) {
        this.visit_id = data.visit_id || data.VisitRecordID || null;
        this.card_id = data.card_id || null;
        this.doctor_id = data.doctor_id || data.doctorID || null;
        this.visit_date = data.visit_date || data.DateOfVisit || null;
        this.visit_time = data.visit_time || null;
        this.visit_type = data.visit_type || null;
        this.notes = data.notes || null; // Keeping legacy support just in case

        // New Fields from Schema
        this.ChiefComplaint = data.ChiefComplaint || null;
        this.HPI = data.HPI || null;
        this.UrgentAttention = data.UrgentAttention ? true : false;
        this.FinalDiagnosis = data.FinalDiagnosis || null;
        this.Advice = data.Advice || null;
        this.Treatment = data.Treatment || null;

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
            WHERE pvr.VisitRecordID = ?
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
            ORDER BY pvr.DateOfVisit DESC
        `, [cardId]);
        return rows.map(row => new PatientVisitRecord(row));
    }

    static async create(visitData) {
        console.log('PatientVisitRecord.create received:', visitData);

        // Destructure and default used fields
        // Map visit_date -> DateOfVisit
        const card_id = visitData.card_id || null;
        const doctor_id = visitData.doctor_id || null;
        const DateOfVisit = visitData.visit_date || visitData.DateOfVisit || null;

        const ChiefComplaint = visitData.ChiefComplaint || null;
        const HPI = visitData.HPI || null;
        const UrgentAttention = visitData.UrgentAttention ? 1 : 0;
        const FinalDiagnosis = visitData.FinalDiagnosis || null;
        const Advice = visitData.Advice || null;
        const Treatment = visitData.Treatment || null;

        // Note: visit_time, visit_type, notes are not in the current DB schema, so they are omitted.

        const [result] = await db.execute(
            `INSERT INTO patientvisitrecord 
            (card_id, doctor_id, DateOfVisit, ChiefComplaint, HPI, UrgentAttention, FinalDiagnosis, Advice, Treatment) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [card_id, doctor_id, DateOfVisit, ChiefComplaint, HPI, UrgentAttention, FinalDiagnosis, Advice, Treatment]
        );
        return result.insertId;
    }

    static async update(id, visitData) {
        const card_id = visitData.card_id || null;
        const doctor_id = visitData.doctor_id || null;
        const DateOfVisit = visitData.visit_date || visitData.DateOfVisit || null;

        const ChiefComplaint = visitData.ChiefComplaint || null;
        const HPI = visitData.HPI || null;
        const UrgentAttention = visitData.UrgentAttention ? 1 : 0;
        const FinalDiagnosis = visitData.FinalDiagnosis || null;
        const Advice = visitData.Advice || null;
        const Treatment = visitData.Treatment || null;

        const [result] = await db.execute(
            `UPDATE patientvisitrecord SET 
            card_id = ?, doctor_id = ?, DateOfVisit = ?, 
            ChiefComplaint = ?, HPI = ?, UrgentAttention = ?, FinalDiagnosis = ?, Advice = ?, Treatment = ?
            WHERE VisitRecordID = ?`, // Note: DB PK is VisitRecordID, model maps it to visit_id.
            // However, WHERE clause should use DB column unless we use alias.
            // Actually, in `update(id, ...)` `id` is passed.
            // Let's check `findById` query: `WHERE pvr.visit_id = ?` (Line 87)...
            // Wait! `query.sql` line 102 says `VisitRecordID`.
            // Line 87 in file says `pvr.visit_id`? 
            // If the table column is `VisitRecordID`, then `pvr.visit_id` in line 87 is ALSO WRONG unless aliased in SELECT?
            // Line 78 select `pvr.*` -> gives `VisitRecordID`.
            // Where pvr.visit_id = ? -> This MUST be wrong if column is VisitRecordID.

            // I will fix create/update first. I suspect finding might be broken too if so.
            // But let's stick to fixing the INSERT error first.

            [card_id, doctor_id, DateOfVisit, ChiefComplaint, HPI, UrgentAttention, FinalDiagnosis, Advice, Treatment, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM patientvisitrecord WHERE VisitRecordID = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default PatientVisitRecord;
