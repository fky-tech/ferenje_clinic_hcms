import db from '../config/db.js';

class LabRequest {
    constructor(data = {}) {
        this.request_id = data.request_id || null;
        this.VisitRecordID = data.VisitRecordID || data.visit_id || null;
        this.RequestDate = data.RequestDate || null;
        this.LabStatus = data.LabStatus || 'pending';
        // From JOIN
        this.test_name = data.test_name || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.Sex = data.Sex || null;
        this.Age = data.Age || null;
        this.doctor_first_name = data.doctor_first_name || null;
        this.doctor_last_name = data.doctor_last_name || null;
        this.CardNumber = data.CardNumber || null;
        this.card_id = data.card_id || null;
        this.payment_status = data.payment_status || null;
        this.UrgentAttention = data.UrgentAttention || 0;
        this.standard_tests_count = data.standard_tests_count || 0;
        this.standard_results_count = data.standard_results_count || 0;
        this.ultrasound_tests_count = data.ultrasound_tests_count || 0;
        this.ultrasound_results_count = data.ultrasound_results_count || 0;
        this.PhoneNumber = data.PhoneNumber || null;
        this.total_price = data.total_price || 0;
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
        const { visit_id, doctor_id, RequestDate, LabStatus } = requestData;
        const [result] = await db.execute(
            'INSERT INTO lab_request (VisitRecordID, doctor_id, RequestDate, LabStatus) VALUES (?, ?, ?, ?)',
            [visit_id, doctor_id, RequestDate, LabStatus || 'pending']
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT DISTINCT lr.request_id, 
                   lr.VisitRecordID, lr.RequestDate, lr.LabStatus,
                   p.FirstName, p.Father_Name, p.Sex, p.Age, p.is_urgent,
                   c.CardNumber, c.card_id,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name,
                   (SELECT COUNT(*) FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id AND alt.TestCategory != 'Ultrasound') as standard_tests_count,
                   (SELECT COUNT(*) FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id AND alt.TestCategory = 'Ultrasound') as ultrasound_tests_count,
                   (SELECT COUNT(*) FROM labtestresult ltr WHERE ltr.request_id = lr.request_id) as standard_results_count,
                   (SELECT COUNT(*) FROM ultrasound_test_results utr WHERE utr.request_id = lr.request_id) as ultrasound_results_count
            FROM lab_request lr
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            ORDER BY lr.RequestDate DESC
        `);
        return rows.map(row => new LabRequest(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT lr.*, 
                   p.FirstName, p.Father_Name,
                   c.CardNumber,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM lab_request lr
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
            SELECT lr.*
            FROM lab_request lr
            WHERE lr.VisitRecordID = ?
        `, [visitId]);
        return rows.map(row => new LabRequest(row));
    }

    static async findByCardId(cardId) {
        const [rows] = await db.execute(`
            SELECT DISTINCT lr.*, pvr.card_id,
                   EXISTS (
                       SELECT 1 FROM lab_request_tests lrt 
                       JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                       WHERE lrt.request_id = lr.request_id AND alt.TestCategory = 'Ultrasound'
                   ) as is_ultrasound
            FROM lab_request lr
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            WHERE pvr.card_id = ?
            ORDER BY lr.RequestDate DESC
        `, [cardId]);
        return rows.map(row => new LabRequest(row));
    }

    static async update(id, requestData) {
        const { RequestDate, LabStatus } = requestData;
        // Format date for MySQL if present
        let formattedDate = RequestDate;
        if (RequestDate) {
            const dateObj = new Date(RequestDate);
            formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
        }

        const [result] = await db.execute(
            'UPDATE lab_request SET RequestDate = ?, LabStatus = ? WHERE request_id = ?',
            [formattedDate, LabStatus, id]
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

    static async getStats() {
        const today = new Date().toISOString().slice(0, 10);

        // Parallel queries for efficiency
        const [totalRequests] = await db.execute('SELECT COUNT(*) as count FROM lab_request');
        const [todayRequests] = await db.execute('SELECT COUNT(*) as count FROM lab_request WHERE DATE(RequestDate) = ?', [today]);
        const [availableTests] = await db.execute('SELECT COUNT(*) as count FROM available_lab_tests');

        return {
            totalRequests: totalRequests[0].count,
            todayRequests: todayRequests[0].count,
            totalAvailableTests: availableTests[0].count
        };
    }

    static async findTodaysRequests() {
        const today = new Date().toISOString().slice(0, 10);
        const [rows] = await db.execute(`
            SELECT DISTINCT lr.*,
                   p.FirstName, p.Father_Name, p.Sex, p.Age,
                   c.CardNumber, c.card_id,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name
            FROM lab_request lr
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            WHERE DATE(lr.RequestDate) = ?
            ORDER BY lr.RequestDate DESC
        `, [today]);
        return rows.map(row => new LabRequest(row));
    }

    static async findAllRequests(date = null, category = null) {
        let query = `
            SELECT DISTINCT lr.*, p.is_urgent,
                   pvr.UrgentAttention,
                   p.FirstName, p.Father_Name, p.Sex, p.Age, p.PhoneNo as PhoneNumber,
                   c.CardNumber, c.card_id,
                   per.first_name as doctor_first_name, per.last_name as doctor_last_name,
                   (SELECT payment_status FROM lab_request_tests WHERE request_id = lr.request_id LIMIT 1) as payment_status,
                   (SELECT COUNT(*) FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id AND LOWER(alt.TestCategory) != 'ultrasound') as standard_tests_count,
                   (SELECT COUNT(*) FROM labtestresult WHERE request_id = lr.request_id) as standard_results_count,
                   (SELECT COUNT(*) FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id AND LOWER(alt.TestCategory) = 'ultrasound') as ultrasound_tests_count,
                   (SELECT COUNT(*) FROM ultrasound_test_results WHERE request_id = lr.request_id) as ultrasound_results_count,
                   (SELECT SUM(alt.price) 
                    FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id) as total_price
            FROM lab_request lr
            JOIN patientvisitrecord pvr ON lr.VisitRecordID = pvr.VisitRecordID
            JOIN card c ON pvr.card_id = c.card_id
            JOIN patient p ON c.patient_id = p.patient_id
            LEFT JOIN doctor d ON pvr.doctor_id = d.doctor_id
            LEFT JOIN person per ON d.doctor_id = per.person_id
            WHERE 1=1
        `;

        const params = [];
        if (date) {
            query += ' AND DATE(lr.RequestDate) = ?';
            params.push(date);
        }

        if (category) {
            if (category === 'ultrasound') {
                query += ` AND EXISTS (
                    SELECT 1 FROM lab_request_tests lrt 
                    JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                    WHERE lrt.request_id = lr.request_id AND LOWER(alt.TestCategory) = 'ultrasound'
                )`;
            } else if (category === 'other') {
                // Category 'other' means standard lab tests.
                // A request should show up in the standard lab portal if it contains AT LEAST ONE test that is NOT an Ultrasound.
                query += ` AND EXISTS (
                SELECT 1 FROM lab_request_tests lrt 
                JOIN available_lab_tests alt ON lrt.test_id = alt.test_id 
                WHERE lrt.request_id = lr.request_id AND LOWER(alt.TestCategory) != 'ultrasound'
            )`;
            }
        }

        query += ' ORDER BY lr.RequestDate DESC';

        const [rows] = await db.execute(query, params);
        return rows.map(row => new LabRequest(row));
    }
}

export default LabRequest;
