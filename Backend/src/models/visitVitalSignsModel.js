import db from '../config/db.js';

class VisitVitalSigns {
    constructor(data = {}) {
        this.vital_sign_id = data.VitalsID || data.vital_sign_id || null;
        this.visit_id = data.VisitRecordID || data.visit_id || null;
        this.bp_systolic = data.SystolicBP || data.bp_systolic || null;
        this.bp_diastolic = data.DiastolicBP || data.bp_diastolic || null;
        this.temperature = data.TemperatureC || data.temperature || null;
        this.pulse_rate = data.PulseRate || data.pulse_rate || null;
        this.respiratory_rate = data.RespiratoryRate || data.respiratory_rate || null;
        this.oxygen_saturation = data.SPO2 || data.oxygen_saturation || null;
        this.bmi = data.bmi || null; // Not in DB table shown, probably handled in frontend or separate
        this.weight = data.WeightKg || data.weight || null;
        this.height = data.height || null; // Not in DB table shown
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
        // Default all fields to null to prevent SQL binding errors
        const visit_id = vitalData.visit_id || null;
        const blood_pressure = vitalData.blood_pressure || vitalData.BloodPressure || null;
        // Parsing removed as we only store the string now
        const temperature = vitalData.temperature || vitalData.TemperatureC || null;
        const pulse_rate = vitalData.pulse_rate || vitalData.PulseRate || null;
        const respiratory_rate = vitalData.respiratory_rate || vitalData.RespiratoryRate || null;
        const oxygen_saturation = vitalData.oxygen_saturation || vitalData.SPO2 || null;
        const weight = vitalData.weight || vitalData.WeightKg || null;

        const [result] = await db.execute(
            `INSERT INTO visitvitalsigns 
            (VisitRecordID, BloodPressure, TemperatureC, PulseRate, RespiratoryRate, SPO2, WeightKg) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [visit_id, blood_pressure, temperature, pulse_rate, respiratory_rate, oxygen_saturation, weight]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.DateOfVisit as visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.VisitRecordID = pvr.VisitRecordID
        `);
        return rows.map(row => new VisitVitalSigns(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.DateOfVisit as visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.VisitRecordID = pvr.VisitRecordID
            WHERE vs.VitalsID = ?
        `, [id]);
        return rows[0] ? new VisitVitalSigns(rows[0]) : null;
    }

    static async findByVisitId(visitId) {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.DateOfVisit as visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.VisitRecordID = pvr.VisitRecordID
            WHERE vs.VisitRecordID = ?
        `, [visitId]);
        return rows[0] ? new VisitVitalSigns(rows[0]) : null;
    }

    static async findByCardId(cardId) {
        const [rows] = await db.execute(`
            SELECT vs.*, pvr.VisitRecordID, pvr.DateOfVisit as visit_date
            FROM visitvitalsigns vs
            JOIN patientvisitrecord pvr ON vs.VisitRecordID = pvr.VisitRecordID
            WHERE pvr.card_id = ?
            ORDER BY pvr.DateOfVisit DESC
        `, [cardId]);
        return rows.map(row => new VisitVitalSigns(row));
    }

    static async update(id, vitalData) {
        // Default all fields to null to prevent SQL binding errors
        const visit_id = vitalData.visit_id || null;
        const blood_pressure = vitalData.blood_pressure || vitalData.BloodPressure || null;
        const temperature = vitalData.temperature || vitalData.TemperatureC || null;
        const pulse_rate = vitalData.pulse_rate || vitalData.PulseRate || null;
        const respiratory_rate = vitalData.respiratory_rate || vitalData.RespiratoryRate || null;
        const oxygen_saturation = vitalData.oxygen_saturation || vitalData.SPO2 || null;
        const weight = vitalData.weight || vitalData.WeightKg || null;

        const [result] = await db.execute(
            `UPDATE visitvitalsigns SET 
            VisitRecordID = ?, BloodPressure = ?, TemperatureC = ?, 
            PulseRate = ?, RespiratoryRate = ?, SPO2 = ?, WeightKg = ?
            WHERE VitalsID = ?`,
            [visit_id, blood_pressure, temperature, pulse_rate, respiratory_rate, oxygen_saturation, weight, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM visitvitalsigns WHERE VitalsID = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default VisitVitalSigns;
