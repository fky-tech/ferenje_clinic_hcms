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
        this.lab_specialty = data.lab_specialty || null;
        this.department_id = data.department_id || null;
        this.role = data.role || null;
        this.person_id = data.person_id || null;
        this.address = data.address || null;
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
            'INSERT INTO doctor (doctor_id, office_no, specialization) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE office_no = VALUES(office_no), specialization = VALUES(specialization)',
            [doctor_id, office_no, specialization]
        );
        return doctor_id;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT p.*, d.doctor_id, d.office_no, d.specialization, dep.department_name
      FROM person p
      LEFT JOIN doctor d ON p.person_id = d.doctor_id
      LEFT JOIN department dep ON p.department_id = dep.department_id
      WHERE p.role IN ('doctor', 'lab_doctor')
    `);
        return rows.map(row => new Doctor(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT p.*, d.doctor_id, d.office_no, d.specialization, dep.department_name
      FROM person p
      LEFT JOIN doctor d ON p.person_id = d.doctor_id
      LEFT JOIN department dep ON p.department_id = dep.department_id
      WHERE p.person_id = ?
    `, [id]);
        return rows[0] ? new Doctor(rows[0]) : null;
    }

    static async update(id, doctorData) {
        const { office_no, specialization } = doctorData;
        const [result] = await db.execute(
            'INSERT INTO doctor (doctor_id, office_no, specialization) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE office_no = VALUES(office_no), specialization = VALUES(specialization)',
            [id, office_no, specialization]
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
