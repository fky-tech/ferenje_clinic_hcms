import db from '../config/db.js';

class UltrasoundTestResult {
    constructor(data = {}) {
        this.id = data.id || null;
        this.request_id = data.request_id || null;
        this.test_id = data.test_id || null;
        this.title = data.title || null;
        this.description = data.description || null; // JSON
        this.conclusion = data.conclusion || null;
        this.created_at = data.created_at || null;
    }

    static async create(data) {
        const { request_id, test_id, title, description, conclusion } = data;
        const [result] = await db.execute(
            'INSERT INTO ultrasound_test_results (request_id, test_id, title, description, conclusion) VALUES (?, ?, ?, ?, ?)',
            [request_id, test_id, title, JSON.stringify(description), conclusion]
        );
        return result.insertId;
    }

    static async findByRequestId(requestId) {
        const [rows] = await db.execute(
            `SELECT ur.*, alt.test_name 
             FROM ultrasound_test_results ur 
             LEFT JOIN available_lab_tests alt ON ur.test_id = alt.test_id 
             WHERE ur.request_id = ? 
             ORDER BY ur.id ASC`,
            [requestId]
        );
        return rows.map(row => {
            const result = new UltrasoundTestResult(row);
            // Manually add test_name since it's not in the base model constructor
            result.test_name = row.test_name;
            if (typeof result.description === 'string') {
                try {
                    result.description = JSON.parse(result.description);
                } catch (e) {
                    result.description = [];
                }
            }
            return result;
        });
    }

    static async update(id, data) {
        const { title, description, conclusion } = data;
        const [result] = await db.execute(
            'UPDATE ultrasound_test_results SET title = ?, description = ?, conclusion = ? WHERE id = ?',
            [title, JSON.stringify(description), conclusion, id]
        );
        return result.affectedRows;
    }

    static async deleteByRequestId(requestId) {
        const [result] = await db.execute(
            'DELETE FROM ultrasound_test_results WHERE request_id = ?',
            [requestId]
        );
        return result.affectedRows;
    }

    static async deleteByRequestAndTestId(requestId, testId) {
        const [result] = await db.execute(
            'DELETE FROM ultrasound_test_results WHERE request_id = ? AND test_id = ?',
            [requestId, testId]
        );
        return result.affectedRows;
    }
}

export default UltrasoundTestResult;
