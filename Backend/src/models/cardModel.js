import db from '../config/db.js';

class Card {
    constructor(data = {}) {
        this.card_id = data.card_id || null;
        this.patient_id = data.patient_id || null;
        this.CardNumber = data.CardNumber || null;
        this.status = data.status || 'Active';
        this.issue_date = data.issue_date || null;
        this.expire_date = data.expire_date || null;
        // From JOIN
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.PhoneNo = data.PhoneNo || null;
    }

    async save() {
        if (this.card_id) {
            return await Card.update(this.card_id, this);
        } else {
            const insertId = await Card.create(this);
            this.card_id = insertId;
            return insertId;
        }
    }

    static async create(cardData) {
        const { patient_id, CardNumber, status, issue_date, expire_date } = cardData;
        const [result] = await db.execute(
            'INSERT INTO card (patient_id, CardNumber, status, issue_date, expire_date) VALUES (?, ?, ?, ?, ?)',
            [patient_id, CardNumber, status || 'Active', issue_date, expire_date]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo
      FROM card c
      JOIN patient p ON c.patient_id = p.patient_id
    `);
        return rows.map(row => new Card(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo
      FROM card c
      JOIN patient p ON c.patient_id = p.patient_id
      WHERE c.card_id = ?
    `, [id]);
        return rows[0] ? new Card(rows[0]) : null;
    }

    static async findByCardNumber(cardNumber) {
        const [rows] = await db.execute(`
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo
      FROM card c
      JOIN patient p ON c.patient_id = p.patient_id
      WHERE c.CardNumber = ?
    `, [cardNumber]);
        return rows[0] ? new Card(rows[0]) : null;
    }

    static async findByPatientId(patientId) {
        const [rows] = await db.execute(
            'SELECT * FROM card WHERE patient_id = ?',
            [patientId]
        );
        return rows.map(row => new Card(row));
    }

    static async update(id, cardData) {
        const { patient_id, CardNumber, status, issue_date, expire_date } = cardData;
        const [result] = await db.execute(
            'UPDATE card SET patient_id = ?, CardNumber = ?, status = ?, issue_date = ?, expire_date = ? WHERE card_id = ?',
            [patient_id, CardNumber, status, issue_date, expire_date, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM card WHERE card_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Card;
