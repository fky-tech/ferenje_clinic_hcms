import Person from '../models/personModel.js';

class PersonController {
    async createPerson(req, res) {
        try {
            const { first_name, last_name, email, password, role } = req.body;

            if (!first_name || !last_name || !email || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check valid role
            const validRoles = ['doctor', 'receptionist', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role. Must be doctor, receptionist, or admin' });
            }

            // Check if email already exists
            const existingPerson = await Person.findByEmail(email);
            if (existingPerson) {
                return res.status(409).json({ error: 'Email already exists' });
            }

            const personId = await Person.create(req.body);
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
                address: req.body.address || existingPerson.address,
                phone_number: req.body.phone_number || existingPerson.phone_number,
                department_id: req.body.department_id || existingPerson.department_id,
                role: req.body.role || existingPerson.role
            };

            // 3. Update
            const affectedRows = await Person.update(id, updatedData);

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
            res.status(500).json({ error: 'Failed to delete person', details: error.message });
        }
    }
}

export default new PersonController();
