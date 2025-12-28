import db from '../config/db.js';

class AvailableLabTests {
    constructor(data = {}) {
        this.test_id = data.test_id || null;
        this.test_name = data.test_name || null;
        this.TestCategory = data.TestCategory || data.test_category || null;
        this.UnitOfMeasure = data.UnitOfMeasure || data.unit || null;
        this.NormalRange_Male = data.NormalRange_Male || data.normal_range || null;
        this.NormalRange_Female = data.NormalRange_Female || null;
        this.price = data.price || null;
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
        const { test_name, TestCategory, UnitOfMeasure, NormalRange_Male, NormalRange_Female, price } = testData;
        const [result] = await db.execute(
            `INSERT INTO available_lab_tests (test_name, TestCategory, UnitOfMeasure, NormalRange_Male, NormalRange_Female, price) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [test_name, TestCategory, UnitOfMeasure, NormalRange_Male, NormalRange_Female, price]
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
            'SELECT * FROM available_lab_tests WHERE TestCategory = ?',
            [category]
        );
        return rows.map(row => new AvailableLabTests(row));
    }

    static async update(id, testData) {
        const { test_name, TestCategory, UnitOfMeasure, NormalRange_Male, NormalRange_Female, price } = testData;
        const [result] = await db.execute(
            `UPDATE available_lab_tests SET 
       test_name = ?, TestCategory = ?, UnitOfMeasure = ?, NormalRange_Male = ?, NormalRange_Female = ?, price = ? 
       WHERE test_id = ?`,
            [test_name, TestCategory, UnitOfMeasure, NormalRange_Male, NormalRange_Female, price, id]
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
