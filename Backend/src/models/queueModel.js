import db from '../config/db.js';

class Queue {
    constructor(data = {}) {
        this.queue_id = data.queue_id || null;
        this.card_id = data.card_id || null;
        this.doctor_id = data.doctor_id || null;
        this.status = data.status || 'waiting';
        this.queue_position = data.queue_position || null;
        this.date = data.date || null;
        // From JOIN
        this.CardNumber = data.CardNumber || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.doctor_first_name = data.doctor_first_name || null;
        this.doctor_last_name = data.doctor_last_name || null;
        this.specialization = data.specialization || null;
        this.is_urgent = data.is_urgent || false;
    }

    async save() {
        if (this.queue_id) {
            return await Queue.update(this.queue_id, this);
        } else {
            const insertId = await Queue.create(this);
            this.queue_id = insertId;
            return insertId;
        }
    }

    static async create(queueData) {
        const { card_id, doctor_id, status, queue_position, date } = queueData;
        // Ensure parameters are not undefined. Use null for optional fields if needed, or defaults.
        const safeStatus = status || 'waiting';
        // Ensure date is formatted for MySQL
        const dateObj = date ? new Date(date) : new Date();
        const safeDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

        let finalQueuePosition = queue_position;
        if (finalQueuePosition === undefined || finalQueuePosition === null) {
            // Calculate next position for this doctor on this date
            // Note: safeDate is full datetime, we should filter by day if calculating per day.
            // As a simple fix, find MAX position for doctor.
            const [rows] = await db.execute('SELECT MAX(queue_position) as maxPos FROM queue WHERE doctor_id = ?', [doctor_id]);
            finalQueuePosition = (rows[0].maxPos || 0) + 1;
        }

        const [result] = await db.execute(
            'INSERT INTO queue (card_id, doctor_id, status, queue_position, date) VALUES (?, ?, ?, ?, ?)',
            [card_id, doctor_id, safeStatus, finalQueuePosition, safeDate]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT q.*, 
             c.CardNumber,
             p.FirstName, p.Father_Name, p.is_urgent,
             per.first_name as doctor_first_name, per.last_name as doctor_last_name,
             doc.specialization
      FROM queue q
      LEFT JOIN card c ON q.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      LEFT JOIN doctor doc ON q.doctor_id = doc.doctor_id
      LEFT JOIN person per ON doc.doctor_id = per.person_id
      ORDER BY p.is_urgent DESC, q.date ASC
    `);
        return rows.map(row => new Queue(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT q.*, 
             c.CardNumber,
             p.FirstName, p.Father_Name, p.is_urgent,
             per.first_name as doctor_first_name, per.last_name as doctor_last_name,
             doc.specialization
      FROM queue q
      LEFT JOIN card c ON q.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      LEFT JOIN doctor doc ON q.doctor_id = doc.doctor_id
      LEFT JOIN person per ON doc.doctor_id = per.person_id
      WHERE q.queue_id = ?
    `, [id]);
        return rows[0] ? new Queue(rows[0]) : null;
    }

    static async findByDoctorId(doctorId) {
        const [rows] = await db.execute(`
      SELECT q.*, c.CardNumber, p.FirstName, p.Father_Name, p.is_urgent
      FROM queue q
      LEFT JOIN card c ON q.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      WHERE q.doctor_id = ?
      ORDER BY p.is_urgent DESC, q.date ASC
    `, [doctorId]);
        return rows.map(row => new Queue(row));
    }

    static async update(id, queueData) {
        const { card_id, doctor_id, status, queue_position, date } = queueData;
        const [result] = await db.execute(
            'UPDATE queue SET card_id = ?, doctor_id = ?, status = ?, queue_position = ?, date = ? WHERE queue_id = ?',
            [card_id, doctor_id, status, queue_position, date, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM queue WHERE queue_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Queue;
