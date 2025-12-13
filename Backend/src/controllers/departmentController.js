import Department from '../models/departmentModel.js';

class DepartmentController {
    // Create a new department
    async createDepartment(req, res) {
        try {
            const { department_name } = req.body;

            // Validation
            if (!department_name) {
                return res.status(400).json({ error: 'Department name is required' });
            }

            const departmentId = await Department.create({ department_name });
            res.status(201).json({
                message: 'Department created successfully',
                department_id: departmentId
            });
        } catch (error) {
            console.error('Error creating department:', error);
            res.status(500).json({ error: 'Failed to create department', details: error.message });
        }
    }

    // Get all departments
    async getAllDepartments(req, res) {
        try {
            const departments = await Department.findAll();
            res.status(200).json(departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
        }
    }

    // Get department by ID
    async getDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await Department.findById(id);

            if (!department) {
                return res.status(404).json({ error: 'Department not found' });
            }

            res.status(200).json(department);
        } catch (error) {
            console.error('Error fetching department:', error);
            res.status(500).json({ error: 'Failed to fetch department', details: error.message });
        }
    }

    // Update department
    async updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const { department_name } = req.body;

            // Validation
            if (!department_name) {
                return res.status(400).json({ error: 'Department name is required' });
            }

            const affectedRows = await Department.update(id, { department_name });

            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Department not found' });
            }

            res.status(200).json({ message: 'Department updated successfully' });
        } catch (error) {
            console.error('Error updating department:', error);
            res.status(500).json({ error: 'Failed to update department', details: error.message });
        }
    }

    // Delete department
    async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Department.delete(id);

            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Department not found' });
            }

            res.status(200).json({ message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({ error: 'Failed to delete department', details: error.message });
        }
    }
}

// Export a single instance of the controller
export default new DepartmentController();
