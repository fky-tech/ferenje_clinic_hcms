import db from '../config/db.js';

class Patient {
    constructor(data = {}) {
        this.patient_id = data.patient_id || null;
        this.FirstName = data.FirstName || null;
        this.Father_Name = data.Father_Name || null;
        this.GrandFather_Name = data.GrandFather_Name || null;
        this.DateOfBirth = data.DateOfBirth || null;
        this.Age = data.Age || null;
        this.Sex = data.Sex || null;
        this.Region = data.Region || null;
        this.Wereda = data.Wereda || null;
        this.HouseNo = data.HouseNo || null;
        this.PhoneNo = data.PhoneNo || null;
        this.date_registered = data.date_registered || null;
    }

    async save() {
        if (this.patient_id) {
            return await Patient.update(this.patient_id, this);
        } else {
            return await Patient.create(this);
        }
    }

    static async create(patientData) {
        const {
            patient_id, FirstName, Father_Name, GrandFather_Name, DateOfBirth,
            Age, Sex, Region, Wereda, HouseNo, PhoneNo, date_registered
        } = patientData;

        const [result] = await db.execute(
            `INSERT INTO patient (patient_id, FirstName, Father_Name, GrandFather_Name, DateOfBirth, Age, Sex, Region, Wereda, HouseNo, PhoneNo, date_registered) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [patient_id, FirstName, Father_Name, GrandFather_Name, DateOfBirth, Age, Sex, Region, Wereda, HouseNo, PhoneNo, date_registered]
        );
        return patient_id;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM patient');
        return rows.map(row => new Patient(row));
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM patient WHERE patient_id = ?',
            [id]
        );
        return rows[0] ? new Patient(rows[0]) : null;
    }

    static async update(id, patientData) {
        const {
            FirstName, Father_Name, GrandFather_Name, DateOfBirth,
            Age, Sex, Region, Wereda, HouseNo, PhoneNo, date_registered
        } = patientData;

        const [result] = await db.execute(
            `UPDATE patient SET FirstName = ?, Father_Name = ?, GrandFather_Name = ?, DateOfBirth = ?, 
       Age = ?, Sex = ?, Region = ?, Wereda = ?, HouseNo = ?, PhoneNo = ?, date_registered = ? 
       WHERE patient_id = ?`,
            [FirstName, Father_Name, GrandFather_Name, DateOfBirth, Age, Sex, Region, Wereda, HouseNo, PhoneNo, date_registered, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM patient WHERE patient_id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

export default Patient;
