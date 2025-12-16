import db from '../config/db.js';

class LabTestResult {
    constructor(data = {}) {
        this.result_id = data.result_id || null;
        this.request_id = data.request_id || null;
        this.test_id = data.test_id || null;
        this.test_result_value = data.test_result_value || null;
        this.interpretation = data.interpretation || null;
        // From JOIN with available_lab_tests
        this.test_name = data.test_name || null;
        this.NormalRange_Male = data.NormalRange_Male || null;
        this.NormalRange_Female = data.NormalRange_Female || null;
        this.UnitOfMeasure = data.UnitOfMeasure || null;
        this.TestCategory = data.TestCategory || null;
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
        const { request_id, test_id, test_result_value, interpretation } = resultData;
        const [result] = await db.execute(
            'INSERT INTO labtestresult (request_id, test_id, test_result_value, interpretation) VALUES (?, ?, ?, ?)',
            [request_id, test_id, test_result_value, interpretation]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.NormalRange_Male, alt.NormalRange_Female, alt.UnitOfMeasure, alt.TestCategory
            FROM labtestresult ltr
            JOIN available_lab_tests alt ON ltr.test_id = alt.test_id
        `);
        return rows.map(row => new LabTestResult(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.NormalRange_Male, alt.NormalRange_Female, alt.UnitOfMeasure, alt.TestCategory
            FROM labtestresult ltr
            JOIN available_lab_tests alt ON ltr.test_id = alt.test_id
            WHERE ltr.result_id = ?
        `, [id]);
        return rows[0] ? new LabTestResult(rows[0]) : null;
    }

    static async findByRequestId(requestId) {
        const [rows] = await db.execute(`
            SELECT ltr.*, alt.test_name, alt.NormalRange_Male, alt.NormalRange_Female, alt.UnitOfMeasure, alt.TestCategory
            FROM labtestresult ltr
            JOIN available_lab_tests alt ON ltr.test_id = alt.test_id
            WHERE ltr.request_id = ?
        `, [requestId]);
        return rows.map(row => new LabTestResult(row)); // Can be multiple results for a request now (multiple tests)
    }

    static async update(id, resultData) {
        const { request_id, test_id, test_result_value, interpretation } = resultData;
        const [result] = await db.execute(
            'UPDATE labtestresult SET request_id = ?, test_id = ?, test_result_value = ?, interpretation = ? WHERE result_id = ?',
            [request_id, test_id, test_result_value, interpretation, id]
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
