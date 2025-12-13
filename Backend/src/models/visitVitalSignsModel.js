import db from '../config/db.js';

class VisitVitalSigns {
    constructor(data = {}) {
        this.vital_sign_id = data.vital_sign_id || null;
        this.visit_id = data.visit_id || null;
        this.bp_systolic = data.bp_systolic || null;
        this.bp_diastolic = data.bp_diastolic || null;
        this.temperature = data.temperature || null;
        this.pulse_rate = data.pulse_rate || null;
        this.respiratory_rate = data.respiratory_rate || null;
        this.oxygen_saturation = data.oxygen_saturation || null;
        this.bmi = data.bmi || null;
        this.weight = data.weight || null;
        this.height = data.height || null;
        // From JOIN
        this.visit_date = data.visit_date || null;
    }

    async save() {
        if (this.vital_sign_id) {
            return await VisitVitalSigns.update(this.vital_sign_id, this);
        } else {
            const insertId = await VisitVitalSigns.create(this);
            this.vital_sign_id = insertId;
            return insertId;
        }
    }

    static async create(vitalData) {
        const {
            visit_id, bp_systolic, bp_diastolic, temperature, pulse_rate,
            respiratory_rate, oxygen_saturation, bmi, weight, height
        } = vitalData;

        const [result] = await db.execute(
            `INSERT INTO visitvitalsigns (visit_id, bp_systolic, bp_diastolic, temperature, pulse_rate, respiratory_rate, oxygen_saturation, bmi, weight, height) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [visit_id, bp_systolic, bp_diastolic, temperature, pulse_rate, respiratory_rate, oxygen_saturation, bmi, weight, height]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.visit_id = pvr.visit_id
        `);
        return rows.map(row => new VisitVitalSigns(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.visit_id = pvr.visit_id
            WHERE vs.vital_sign_id = ?
        `, [id]);
        return rows[0] ? new VisitVitalSigns(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.visit_id = pvr.visit_id
            WHERE vs.visit_id = ?
        `, [visitId]);
        return rows[0] ? new VisitVitalSigns(rows[0]) : null;
    }

    static async update(id, vitalData) {
        const {
            visit_id, bp_systolic, bp_diastolic, temperature, pulse_rate,
            respiratory_rate, oxygen_saturation, bmi, weight, height
        } = vitalData;

        const [result] = await db.execute(
            `UPDATE visitvitalsigns SET 
       visit_id = ?, bp_systolic = ?, bp_diastolic = ?, temperature = ?, pulse_rate = ?, 
       respiratory_rate = ?, oxygen_saturation = ?, bmi = ?, weight = ?, height = ? 
       WHERE vital_sign_id = ?`,
            [visit_id, bp_systolic, bp_diastolic, temperature, pulse_rate, respiratory_rate, oxygen_saturation, bmi, weight, height, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM visitvitalsigns WHERE vital_sign_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default VisitVitalSigns;
