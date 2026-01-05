import db from '../config/db.js';

class LabRequestTest {
    constructor(data = {}) {
        this.id = data.id || null;
        this.request_id = data.request_id || null;
        this.test_id = data.test_id || null;
        // From JOIN
        this.test_name = data.test_name || null;
        this.price = data.price || null;
        this.UnitOfMeasure = data.UnitOfMeasure || null;
        this.NormalRange_Male = data.NormalRange_Male || null;
        this.NormalRange_Female = data.NormalRange_Female || null;
        this.TestCategory = data.TestCategory || null;
        this.payment_status = data.payment_status || 'unpaid';
    }

    async save() {
        if (this.id) {
            return 0;
        } else {
            const insertId = await LabRequestTest.create(this);
            this.id = insertId;
            return insertId;
        }
    }

    static async create(data) {
        const { request_id, test_id } = data;
        const [result] = await db.execute(
            'INSERT INTO lab_request_tests (request_id, test_id) VALUES (?, ?)',
            [request_id, test_id]
        );
        return result.insertId;
    }

    static async findByRequestId(requestId) {
        const [rows] = await db.execute(`
            SELECT lrt.*, alt.test_name, alt.price, alt.UnitOfMeasure, alt.NormalRange_Male, alt.NormalRange_Female, alt.TestCategory, lrt.payment_status
            FROM lab_request_tests lrt
            JOIN available_lab_tests alt ON lrt.test_id = alt.test_id
            WHERE lrt.request_id = ?
        `, [requestId]);
        return rows.map(row => new LabRequestTest({ ...row, payment_status: row.payment_status || 'unpaid' }));
    }

    // Check if tests exist for a request
    static async countByRequestId(requestId) {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM lab_request_tests WHERE request_id = ?', [requestId]);
        return rows[0].count;
    }

    // Update payment status for all tests in a request
    static async updatePaymentStatusByRequestId(requestId, status) {
        const [result] = await db.execute(
            'UPDATE lab_request_tests SET payment_status = ? WHERE request_id = ?',
            [status, requestId]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM lab_request_tests WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

export default LabRequestTest;
