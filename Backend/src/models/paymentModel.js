import db from '../config/db.js';

class Payment {
    constructor(data = {}) {
        this.payment_id = data.payment_id || null;
        this.card_id = data.card_id || null;
        this.amount = data.amount || null;
        this.billing_date = data.billing_date || null;
        this.description = data.description || null;
        this.payment_type = data.payment_type || null;
        this.status = data.status || 'pending';
        // From JOIN
        this.CardNumber = data.CardNumber || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
    }

    async save() {
        if (this.payment_id) {
            return await Payment.update(this.payment_id, this);
        } else {
            const insertId = await Payment.create(this);
            this.payment_id = insertId;
            return insertId;
        }
    }

    static async create(paymentData) {
        const { card_id, amount, billing_date, description, payment_type, status } = paymentData;
        const [result] = await db.execute(
            'INSERT INTO payment (card_id, amount, billing_date, description, payment_type, status) VALUES (?, ?, ?, ?, ?, ?)',
            [card_id, amount, billing_date, description, payment_type, status || 'pending']
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT pay.*, c.CardNumber, p.FirstName, p.Father_Name
      FROM payment pay
      LEFT JOIN card c ON pay.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
    `);
        return rows.map(row => new Payment(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT pay.*, c.CardNumber, p.FirstName, p.Father_Name
      FROM payment pay
      LEFT JOIN card c ON pay.card_id = c.card_id
      LEFT JOIN patient p ON c.patient_id = p.patient_id
      WHERE pay.payment_id = ?
    `, [id]);
        return rows[0] ? new Payment(rows[0]) : null;
    }

    static async update(id, paymentData) {
        const { card_id, amount, billing_date, description, payment_type, status } = paymentData;
        const [result] = await db.execute(
            'UPDATE payment SET card_id = ?, amount = ?, billing_date = ?, description = ?, payment_type = ?, status = ? WHERE payment_id = ?',
            [card_id, amount, billing_date, description, payment_type, status, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM payment WHERE payment_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Payment;
