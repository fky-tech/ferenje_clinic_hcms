import db from '../config/db.js';

class Doctor {
    constructor(data = {}) {
        this.doctor_id = data.doctor_id || null;
        this.office_no = data.office_no || null;
        this.specialization = data.specialization || null;
        // From JOIN
        this.first_name = data.first_name || null;
        this.last_name = data.last_name || null;
        this.email = data.email || null;
        this.phone_number = data.phone_number || null;
        this.department_name = data.department_name || null;
    }

    async save() {
        if (this.doctor_id) {
            return await Doctor.update(this.doctor_id, this);
        } else {
            return await Doctor.create(this);
        }
    }

    static async create(doctorData) {
        const { doctor_id, office_no, specialization } = doctorData;
        const [result] = await db.execute(
            'INSERT INTO doctor (doctor_id, office_no, specialization) VALUES (?, ?, ?)',
            [doctor_id, office_no, specialization]
        );
        return doctor_id;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT d.*, p.first_name, p.last_name, p.email, p.phone_number, dep.department_name
      FROM doctor d
      JOIN person p ON d.doctor_id = p.person_id
      LEFT JOIN department dep ON p.department_id = dep.department_id
    `);
        return rows.map(row => new Doctor(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT d.*, p.first_name, p.last_name, p.email, p.phone_number, dep.department_name
      FROM doctor d
      JOIN person p ON d.doctor_id = p.person_id
      LEFT JOIN department dep ON p.department_id = dep.department_id
      WHERE d.doctor_id = ?
    `, [id]);
        return rows[0] ? new Doctor(rows[0]) : null;
    }

    static async update(id, doctorData) {
        const { office_no, specialization } = doctorData;
        const [result] = await db.execute(
            'UPDATE doctor SET office_no = ?, specialization = ? WHERE doctor_id = ?',
            [office_no, specialization, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM doctor WHERE doctor_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Doctor;
