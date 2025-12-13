import VisitPhysicalExam from '../models/visitPhysicalExamModel.js';

class VisitPhysicalExamController {
    async createPhysicalExam(req, res) {
        try {
            const { visit_id } = req.body;
            if (!visit_id) {
                return res.status(400).json({ error: 'Visit ID is required' });
            }
            const result = await VisitPhysicalExam.create(req.body);
            res.status(201).json({ message: 'Physical exam recorded successfully', exam_id: result });
        } catch (error) {
            console.error('Error recording physical exam:', error);
            res.status(500).json({ error: 'Failed to record physical exam', details: error.message });
        }
    }

    async getAllPhysicalExams(req, res) {
        try {
            const exams = await VisitPhysicalExam.findAll();
            res.status(200).json(exams);
        } catch (error) {
            console.error('Error fetching physical exams:', error);
            res.status(500).json({ error: 'Failed to fetch physical exams', details: error.message });
        }
    }

    async getPhysicalExamById(req, res) {
        try {
            const { id } = req.params;
            const exam = await VisitPhysicalExam.findById(id);
            if (!exam) {
                return res.status(404).json({ error: 'Physical exam not found' });
            }
            res.status(200).json(exam);
        } catch (error) {
            console.error('Error fetching physical exam:', error);
            res.status(500).json({ error: 'Failed to fetch physical exam', details: error.message });
        }
    }

    async getPhysicalExamByVisitId(req, res) {
        try {
            const { visitId } = req.params;
            const exam = await VisitPhysicalExam.findByVisitId(visitId);
            res.status(200).json(exam);
        } catch (error) {
            console.error('Error fetching physical exam:', error);
            res.status(500).json({ error: 'Failed to fetch physical exam', details: error.message });
        }
    }

    async updatePhysicalExam(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await VisitPhysicalExam.update(id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Physical exam not found' });
            }
            res.status(200).json({ message: 'Physical exam updated successfully' });
        } catch (error) {
            console.error('Error updating physical exam:', error);
            res.status(500).json({ error: 'Failed to update physical exam', details: error.message });
        }
    }

    async deletePhysicalExam(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await VisitPhysicalExam.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Physical exam not found' });
            }
            res.status(200).json({ message: 'Physical exam deleted successfully' });
        } catch (error) {
            console.error('Error deleting physical exam:', error);
            res.status(500).json({ error: 'Failed to delete physical exam', details: error.message });
        }
    }
}

export default new VisitPhysicalExamController();
