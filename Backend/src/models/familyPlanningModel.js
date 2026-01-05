import db from '../config/db.js';

class FamilyPlanning {
    // Family Planning Cards (Master)
    static async createCard(data) {
        const fields = Object.keys(data);
        const placeholders = fields.map(() => '?').join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO family_planning_cards (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await db.execute(query, values);
        return result.insertId;
    }

    static async getCardByCardId(cardId) {
        const [rows] = await db.execute(
            'SELECT * FROM family_planning_cards WHERE card_id = ?',
            [cardId]
        );
        return rows[0];
    }

    static async updateCard(id, data) {
        const fields = Object.keys(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const query = `UPDATE family_planning_cards SET ${setClause} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    }

    // Family Planning Visits
    static async createVisit(data) {
        const fields = Object.keys(data);
        const placeholders = fields.map(() => '?').join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO family_planning_visits (${fields.join(', ')}) VALUES (${placeholders})`;
        const [result] = await db.execute(query, values);
        return result.insertId;
    }

    static async getVisitsByCardId(cardId) {
        const [rows] = await db.execute(
            'SELECT * FROM family_planning_visits WHERE card_id = ? ORDER BY date_of_visit DESC',
            [cardId]
        );
        return rows;
    }

    // Categories
    static async getFieldCategories() {
        const [rows] = await db.execute('SELECT * FROM fp_card_field_categories');
        return rows;
    }
}

export default FamilyPlanning;
