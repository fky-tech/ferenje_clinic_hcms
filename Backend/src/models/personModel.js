import db from '../config/db.js';

class Person {
    constructor(data = {}) {
        this.person_id = data.person_id || null;
        this.first_name = data.first_name || null;
        this.last_name = data.last_name || null;
        this.email = data.email || null;
        this.password = data.password || null;
        this.address = data.address || null;
        this.phone_number = data.phone_number || null;
        this.department_id = data.department_id || null;
        this.role = data.role || null;
    }

    // Instance method to save
    async save() {
        if (this.person_id) {
            return await Person.update(this.person_id, this);
        } else {
            const insertId = await Person.create(this);
            this.person_id = insertId;
            return insertId;
        }
    }

    // Static method - Create
    static async create(personData) {
        const { first_name, last_name, email, password, address, phone_number, department_id, role } = personData;
        const [result] = await db.execute(
            'INSERT INTO person (first_name, last_name, email, password, address, phone_number, department_id, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, password, address, phone_number, department_id, role]
        );
        return result.insertId;
    }

    // Static method - Find all
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM person');
        return rows.map(row => new Person(row));
    }

    // Static method - Find by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM person WHERE person_id = ?',
            [id]
        );
        return rows[0] ? new Person(rows[0]) : null;
    }

    // Static method - Find by email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM person WHERE email = ?',
            [email]
        );
        return rows[0] ? new Person(rows[0]) : null;
    }

    // Static method - Find by role
    static async findByRole(role) {
        const [rows] = await db.execute(
            'SELECT * FROM person WHERE role = ?',
            [role]
        );
        return rows.map(row => new Person(row));
    }

    // Static method - Update
    static async update(id, personData) {
        const { first_name, last_name, email, password, address, phone_number, department_id, role } = personData;
        const [result] = await db.execute(
            'UPDATE person SET first_name = ?, last_name = ?, email = ?, password = ?, address = ?, phone_number = ?, department_id = ?, role = ? WHERE person_id = ?',
            [first_name, last_name, email, password, address, phone_number, department_id, role, id]
        );
        return result.affectedRows;
    }

    // Static method - Delete
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM person WHERE person_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Person;
