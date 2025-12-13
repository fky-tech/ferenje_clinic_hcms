import db from '../config/db.js';

class LabRequest {
    constructor(data = {}) {
        this.request_id = data.request_id || null;
        this.visit_id = data.visit_id || null;
        this.test_id = data.test_id || null;
        this.RequestDate = data.RequestDate || null;
        this.LabStatus = data.LabStatus || 'pending';
        this.priority = data.priority || 'Normal';
        // From JOIN
        this.test_name = data.test_name || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.doctor_first_name = data.doctor_first_name || null;
        this.doctor_last_name = data.doctor_last_name || null;
    }

    async save() {
        if (this.request_id) {
            return await LabRequest.update(this.request_id, this);
        } else {
            const insertId = await LabRequest.create(this);
            this.request_id = insertId;
            return insertId;
        }
    }

    static async create(requestData) {
        const { visit_id, test_id, RequestDate, LabStatus, priority } = requestData;
        const [result] = await db.execute(
            'INSERT INTO lab_request (visit_id, test_id, RequestDate, LabStatus, priority) VALUES (?, ?, ?, ?, ?)',
            [visit_id, test_id, RequestDate, LabStatus || 'pending', priority || 'Normal']
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT lr.*, 
                   alt.test_name, 
                   p.FirstName, p.Father_Name,
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM lab_request lr
            JOIN available_lab_tests alt ON lr.request_id = alt.test_id
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
        `);
        return rows.map(row => new LabRequest(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT lr.*, 
                   alt.test_name, 
                   p.FirstName, p.Father_Name,
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM lab_request lr
            JOIN available_lab_tests alt ON lr.test_id = alt.test_id
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            WHERE lr.request_id = ?
        `, [id]);
        return rows[0] ? new LabRequest(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT lr.*, alt.test_name
            FROM lab_request lr
            JOIN available_lab_tests alt ON lr.test_id = alt.test_id
            WHERE lr.visit_id = ?
        `, [visitId]);
        return rows.map(row => new LabRequest(row));
    }

    static async update(id, requestData) {
        const { visit_id, test_id, RequestDate, LabStatus, priority } = requestData;
        const [result] = await db.execute(
            'UPDATE lab_request SET visit_id = ?, test_id = ?, RequestDate = ?, LabStatus = ?, priority = ? WHERE request_id = ?',
            [visit_id, test_id, RequestDate, LabStatus, priority, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM lab_request WHERE request_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default LabRequest;
