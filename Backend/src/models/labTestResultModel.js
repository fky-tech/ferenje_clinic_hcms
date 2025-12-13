import db from '../config/db.js';

class LabTestResult {
    constructor(data = {}) {
        this.result_id = data.result_id || null;
        this.request_id = data.request_id || null;
        this.result_value = data.result_value || null;
        this.result_date = data.result_date || null;
        this.technician_remarks = data.technician_remarks || null;
        // From JOIN
        this.test_name = data.test_name || null;
        this.normal_range = data.normal_range || null;
        this.unit = data.unit || null;
    }

    async save() {
        if (this.result_id) {
            return await LabTestResult.update(this.result_id, this);
        } else {
            const insertId = await LabTestResult.create(this);
            this.result_id = insertId;
            return insertId;
        }
    }

    static async create(resultData) {
        const { request_id, result_value, result_date, technician_remarks } = resultData;
        const [result] = await db.execute(
            'INSERT INTO labtestresult (request_id, result_value, result_date, technician_remarks) VALUES (?, ?, ?, ?)',
            [request_id, result_value, result_date, technician_remarks]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.normal_range, alt.unit
            FROM labtestresult ltr
            JOIN lab_request lr ON ltr.request_id = lr.request_id
            JOIN available_lab_tests alt ON lr.test_id = alt.test_id
        `);
        return rows.map(row => new LabTestResult(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.normal_range, alt.unit
            FROM labtestresult ltr
            JOIN lab_request lr ON ltr.request_id = lr.request_id
            JOIN available_lab_tests alt ON lr.test_id = alt.test_id
            WHERE ltr.result_id = ?
        `, [id]);
        return rows[0] ? new LabTestResult(rows[0]) : null;
    }

    static async findByRequestId(requestId) {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.normal_range, alt.unit
            FROM labtestresult ltr
            JOIN lab_request lr ON ltr.request_id = lr.request_id
            JOIN available_lab_tests alt ON lr.test_id = alt.test_id
            WHERE ltr.request_id = ?
        `, [requestId]);
        return rows[0] ? new LabTestResult(rows[0]) : null;
    }

    static async update(id, resultData) {
        const { request_id, result_value, result_date, technician_remarks } = resultData;
        const [result] = await db.execute(
            'UPDATE labtestresult SET request_id = ?, result_value = ?, result_date = ?, technician_remarks = ? WHERE result_id = ?',
            [request_id, result_value, result_date, technician_remarks, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM labtestresult WHERE result_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default LabTestResult;
