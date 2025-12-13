import db from '../config/db.js';

class Department {
    constructor(data = {}) {
        this.department_id = data.department_id || null;
        this.department_name = data.department_name || null;
    }

    // Instance method to save (create or update)
    async save() {
        if (this.department_id) {
            const affectedRows = await Department.update(this.department_id, { department_name: this.department_name });
            return affectedRows;
        } else {
            const insertId = await Department.create({ department_name: this.department_name });
            this.department_id = insertId;
            return insertId;
        }
    }

    // Static method - Create a new department
    static async create(departmentData) {
        const { department_name } = departmentData;
        const [result] = await db.execute(
            'INSERT INTO department (department_name) VALUES (?)',
            [department_name]
        );
        return result.insertId;
    }

    // Static method - Get all departments
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM department');
        return rows.map(row => new Department(row));
    }

    // Static method - Get department by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM department WHERE department_id = ?',
            [id]
        );
        return rows[0] ? new Department(rows[0]) : null;
    }

    // Static method - Update department
    static async update(id, departmentData) {
        const { department_name } = departmentData;
        const [result] = await db.execute(
            'UPDATE department SET department_name = ? WHERE department_id = ?',
            [department_name, id]
        );
        return result.affectedRows;
    }

    // Static method - Delete department
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM department WHERE department_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Department;
