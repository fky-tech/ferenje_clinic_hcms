import db from '../config/db.js';

class AvailableLabTests {
    constructor(data = {}) {
        this.test_id = data.test_id || null;
        this.test_name = data.test_name || null;
        this.test_category = data.test_category || null;
        this.description = data.description || null;
        this.price = data.price || null;
        this.normal_range = data.normal_range || null;
        this.unit = data.unit || null;
    }

    async save() {
        if (this.test_id) {
            return await AvailableLabTests.update(this.test_id, this);
        } else {
            const insertId = await AvailableLabTests.create(this);
            this.test_id = insertId;
            return insertId;
        }
    }

    static async create(testData) {
        const { test_name, test_category, description, price, normal_range, unit } = testData;
        const [result] = await db.execute(
            `INSERT INTO available_lab_tests (test_name, test_category, description, price, normal_range, unit) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [test_name, test_category, description, price, normal_range, unit]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM available_lab_tests');
        return rows.map(row => new AvailableLabTests(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM available_lab_tests WHERE test_id = ?',
            [id]
        );
        return rows[0] ? new AvailableLabTests(rows[0]) : null;
    }

    static async findByName(name) {
        const [rows] = await db.execute(
            'SELECT * FROM available_lab_tests WHERE test_name = ?',
            [name]
        );
        return rows[0] ? new AvailableLabTests(rows[0]) : null;
    }

    static async findByCategory(category) {
        const [rows] = await db.execute(
            'SELECT * FROM available_lab_tests WHERE test_category = ?',
            [category]
        );
        return rows.map(row => new AvailableLabTests(row));
    }

    static async update(id, testData) {
        const { test_name, test_category, description, price, normal_range, unit } = testData;
        const [result] = await db.execute(
            `UPDATE available_lab_tests SET 
       test_name = ?, test_category = ?, description = ?, price = ?, normal_range = ?, unit = ? 
       WHERE test_id = ?`,
            [test_name, test_category, description, price, normal_range, unit, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM available_lab_tests WHERE test_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default AvailableLabTests;
