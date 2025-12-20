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
        this.Sex = data.Sex || null;
        this.Age = data.Age || null;
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
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo, p.Sex, p.Age
      FROM card c
      JOIN patient p ON c.patient_id = p.patient_id
    `);
        return rows.map(row => new Card(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo, p.Sex, p.Age
      FROM card c
      JOIN patient p ON c.patient_id = p.patient_id
      WHERE c.card_id = ?
    `, [id]);
        return rows[0] ? new Card(rows[0]) : null;
    }

    static async findByCardNumber(cardNumber) {
        const [rows] = await db.execute(`
      SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo, p.Sex, p.Age
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
    

    // static async update(id, cardData) {
    //     const { patient_id, CardNumber, status, issue_date, expire_date } = cardData;
    //     const [result] = await db.execute(
    //         'UPDATE card SET patient_id = ?, CardNumber = ?, status = ?, issue_date = ?, expire_date = ? WHERE card_id = ?',
    //         [patient_id, CardNumber, status, issue_date, expire_date, id]
    //     );
    //     return result.affectedRows;
    // }

    static async update(id, cardData) {
        const {
            patient_id,
            CardNumber,
            status,
            issue_date,
            expire_date
        } = cardData;

        // Normalize issue_date
        const issueDate =
            issue_date instanceof Date
                ? issue_date.toISOString().slice(0, 19).replace('T', ' ')
                : typeof issue_date === 'string'
                    ? issue_date.includes('T')
                        ? issue_date.slice(0, 19).replace('T', ' ')
                        : issue_date
                    : null;

        // Normalize expire_date
        const expireDate =
            expire_date instanceof Date
                ? expire_date.toISOString().slice(0, 19).replace('T', ' ')
                : typeof expire_date === 'string'
                    ? expire_date.includes('T')
                        ? expire_date.slice(0, 19).replace('T', ' ')
                        : expire_date
                    : null;

        const [result] = await db.execute(
            `UPDATE card
            SET patient_id = ?,
                CardNumber = ?,
                status = ?,
                issue_date = ?,
                expire_date = ?
            WHERE card_id = ?`,
            [
                patient_id,
                CardNumber,
                status,
                issueDate,
                expireDate,
                id
            ]
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

    static async search(query) {
        const searchTerm = `%${query}%`;
        const [rows] = await db.execute(`
            SELECT c.*, p.FirstName, p.Father_Name, p.PhoneNo, p.Sex, p.Age
            FROM card c
            JOIN patient p ON c.patient_id = p.patient_id
            WHERE c.CardNumber LIKE ? 
               OR p.FirstName LIKE ? 
               OR p.Father_Name LIKE ? 
               OR p.PhoneNo LIKE ?
        `, [searchTerm, searchTerm, searchTerm, searchTerm]);
        return rows.map(row => new Card(row));
    }
}

export default Card;
