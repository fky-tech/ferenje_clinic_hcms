import db from '../config/db.js';

class Appointment {
    constructor(data = {}) {
        this.appointment_id = data.appointment_id || null;
        this.card_id = data.card_id || null;
        this.doctor_id = data.doctor_id || null;
        this.appointment_start_time = data.appointment_start_time || null;
        this.appointment_end_time = data.appointment_end_time || null;
        this.status = data.status || 'scheduled';
        // From JOIN
        this.CardNumber = data.CardNumber || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.specialization = data.specialization || null;
        this.doctor_first_name = data.doctor_first_name || null;
        this.doctor_last_name = data.doctor_last_name || null;
    }

    async save() {
        if (this.appointment_id) {
            return await Appointment.update(this.appointment_id, this);
        } else {
            const insertId = await Appointment.create(this);
            this.appointment_id = insertId;
            return insertId;
        }
    }

    static async create(appointmentData) {
        const { card_id, doctor_id, appointment_start_time, appointment_end_time, status } = appointmentData;
        const [result] = await db.execute(
            'INSERT INTO appointment (card_id, doctor_id, appointment_start_time, appointment_end_time, status) VALUES (?, ?, ?, ?, ?)',
            [card_id, doctor_id, appointment_start_time, appointment_end_time, status || 'scheduled']
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT a.*, 
             c.CardNumber,
             p.FirstName, p.Father_Name,
             doc.specialization,
             per.first_name as doctor_first_name, per.last_name as doctor_last_name
      FROM appointment a
      LEFT JOIN card c ON a.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      LEFT JOIN doctor doc ON a.doctor_id = doc.doctor_id
      LEFT JOIN person per ON doc.doctor_id = per.person_id
    `);
        return rows.map(row => new Appointment(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT a.*, 
             c.CardNumber,
             p.FirstName, p.Father_Name,
             doc.specialization,
             per.first_name as doctor_first_name, per.last_name as doctor_last_name
      FROM appointment a
      LEFT JOIN card c ON a.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      LEFT JOIN doctor doc ON a.doctor_id = doc.doctor_id
      LEFT JOIN person per ON doc.doctor_id = per.person_id
      WHERE a.appointment_id = ?
    `, [id]);
        return rows[0] ? new Appointment(rows[0]) : null;
    }

    static async findByDoctorId(doctorId) {
        const [rows] = await db.execute(`
      SELECT a.*, c.CardNumber, p.FirstName, p.Father_Name
      FROM appointment a
      LEFT JOIN card c ON a.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      WHERE a.doctor_id = ?
    `, [doctorId]);
        return rows.map(row => new Appointment(row));
    }

    static async update(id, appointmentData) {
        const { card_id, doctor_id, appointment_start_time, appointment_end_time, status } = appointmentData;
        const [result] = await db.execute(
            'UPDATE appointment SET card_id = ?, doctor_id = ?, appointment_start_time = ?, appointment_end_time = ?, status = ? WHERE appointment_id = ?',
            [card_id, doctor_id, appointment_start_time, appointment_end_time, status, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM appointment WHERE appointment_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Appointment;
