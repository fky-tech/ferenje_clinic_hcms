import Person from '../models/personModel.js';
import Doctor from '../models/doctorModel.js';

class PersonController {
    async createPerson(req, res) {
        try {
            const { first_name, last_name, email, password, role, department_id, lab_specialty } = req.body;

            if (!first_name || !last_name || !email || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Validation: Name length
            if (first_name.length < 2 || last_name.length < 2) {
                return res.status(400).json({ error: 'Validation failed', details: "Name and Last Name must be at least 2 characters long" });
            }

            // Validation: Password length
            if (password.length < 6) {
                return res.status(400).json({ error: 'Validation failed', details: 'Password must be at least 6 characters long' });
            }

            // Validation: Email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Validation failed', details: 'Invalid email format' });
            }

            // Check valid role
            const validRoles = ['doctor', 'receptionist', 'admin', 'lab_doctor'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role. Must be doctor, receptionist, admin, or lab_doctor' });
            }

            // Check if email already exists
            const existingPerson = await Person.findByEmail(email);
            if (existingPerson) {
                return res.status(409).json({ error: 'Email already exists' });
            }

            const sanitizedData = {
                ...req.body,
                department_id: department_id || null, // Convert empty string to null
                lab_specialty: role === 'lab_doctor' ? (lab_specialty || null) : null // Convert empty string to null if lab_doctor, otherwise null
            };

            const personId = await Person.create(sanitizedData);

            // Automatically create record in doctor table for doctor roles
            // This prevents foreign key failures when registering patients
            if (role === 'doctor' || role === 'lab_doctor') {
                await Doctor.update(personId, { office_no: null, specialization: null });
            }

            res.status(201).json({
                message: 'Person created successfully',
                person_id: personId
            });
        } catch (error) {
            console.error('Error creating person:', error);
            res.status(500).json({ error: 'Failed to create person', details: error.message });
        }
    }

    async getAllPersons(req, res) {
        try {
            const persons = await Person.findAll();
            res.status(200).json(persons);
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({ error: 'Failed to fetch persons', details: error.message });
        }
    }

    async getPersonById(req, res) {
        try {
            const { id } = req.params;
            const person = await Person.findById(id);

            if (!person) {
                return res.status(404).json({ error: 'Person not found' });
            }

            res.status(200).json(person);
        } catch (error) {
            console.error('Error fetching person:', error);
            res.status(500).json({ error: 'Failed to fetch person', details: error.message });
        }
    }

    async getPersonByEmail(req, res) {
        try {
            const { email } = req.params;
            const person = await Person.findByEmail(email);

            if (!person) {
                return res.status(404).json({ error: 'Person not found' });
            }

            res.status(200).json(person);
        } catch (error) {
            console.error('Error fetching person:', error);
            res.status(500).json({ error: 'Failed to fetch person', details: error.message });
        }
    }

    async getPersonsByRole(req, res) {
        try {
            const { role } = req.params;
            const persons = await Person.findByRole(role);
            res.status(200).json(persons);
        } catch (error) {
            console.error('Error fetching persons by role:', error);
            res.status(500).json({ error: 'Failed to fetch persons', details: error.message });
        }
    }

    async updatePerson(req, res) {
        try {
            const { id } = req.params;

            // 1. Fetch existing person
            const existingPerson = await Person.findById(id);
            if (!existingPerson) {
                return res.status(404).json({ error: 'Person not found' });
            }

            // 2. Merge existing data with updates
            // We use the existing values for any field not present in req.body
            const updatedData = {
                first_name: req.body.first_name || existingPerson.first_name,
                last_name: req.body.last_name || existingPerson.last_name,
                email: req.body.email || existingPerson.email,
                password: req.body.password || existingPerson.password,
                address: req.body.address !== undefined ? req.body.address : existingPerson.address,
                phone_number: req.body.phone_number !== undefined ? req.body.phone_number : existingPerson.phone_number,
                department_id: (req.body.department_id === undefined)
                    ? existingPerson.department_id
                    : (req.body.department_id || null), // Convert empty string to null
                role: req.body.role || existingPerson.role,
                lab_specialty: (req.body.lab_specialty === undefined)
                    ? existingPerson.lab_specialty
                    : (req.body.lab_specialty || null) // Convert empty string to null
            };

            // Validation: If password is being updated
            if (req.body.password && req.body.password.length < 6) {
                return res.status(400).json({ error: 'Validation failed', details: 'Password must be at least 6 characters long' });
            }

            // Validation: If email is being updated
            if (req.body.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(req.body.email)) {
                    return res.status(400).json({ error: 'Validation failed', details: 'Invalid email format' });
                }

                // Check if email is used by someone else
                const otherWithEmail = await Person.findByEmail(req.body.email);
                if (otherWithEmail && String(otherWithEmail.person_id) !== String(id)) {
                    return res.status(409).json({ error: 'Email already exists' });
                }
            }

            // Validation: Name length
            if ((req.body.first_name && req.body.first_name.length < 2) || (req.body.last_name && req.body.last_name.length < 2)) {
                return res.status(400).json({ error: 'Validation failed', details: "Name and Last Name must be at least 2 characters long" });
            }

            // 3. Update
            const affectedRows = await Person.update(id, updatedData);

            // Consistency Check: If role is doctor/lab_doctor, ensure record exists in doctor table
            if (updatedData.role === 'doctor' || updatedData.role === 'lab_doctor') {
                await Doctor.update(id, {
                    office_no: req.body.office_no || null,
                    specialization: req.body.specialization || null
                });
            }

            res.status(200).json({ message: 'Person updated successfully' });
        } catch (error) {
            console.error('Error updating person:', error);
            res.status(500).json({ error: 'Failed to update person', details: error.message });
        }
    }

    async deletePerson(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Person.delete(id);

            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Person not found' });
            }

            res.status(200).json({ message: 'Person deleted successfully' });
        } catch (error) {
            console.error('Error deleting person:', error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({
                    error: 'Deletion failed',
                    details: 'Cannot delete staff member who has associated records (appointments, patients, or queue entries).'
                });
            }
            res.status(500).json({ error: 'Failed to delete person', details: error.message });
        }
    }
}

export default new PersonController();
