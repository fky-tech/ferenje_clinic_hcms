# Backend OOP Refactoring Script

## Purpose
This document provides templates for converting all remaining models and controllers to OOP ES6 class structure.

## Pattern for Models

```javascript
import db from '../config/db.js';

class ModelName {
    constructor(data = {}) {
        // Initialize properties from data
        this.id = data.id || null;
        this.field1 = data.field1 || null;
        // ... all other fields
    }

    // Instance method
    async save() {
        if (this.id) {
            return await ModelName.update(this.id, this);
        } else {
            const insertId = await ModelName.create(this);
            this.id = insertId;
            return insertId;
        }
    }

    // Static CRUD methods
    static async create(data) { ... }
    static async findAll() { return rows.map(row => new ModelName(row)); }
    static async findById(id) { return row ? new ModelName(row) : null; }
    static async update(id, data) { ... }
    static async delete(id) { ... }
}

export default ModelName;
```

## Pattern for Controllers

```javascript
import ModelName from '../models/modelNameModel.js';

class ModelNameController {
    async createModelName(req, res) { ... }
    async getAllModelNames(req, res) { ... }
    async getModelNameById(req, res) { ... }
    async updateModelName(req, res) { ... }
    async deleteModelName(req, res) { ... }
}

export default new ModelNameController();
```

## Pattern for Routes

```javascript
import express from 'express';
import modelNameController from '../controllers/modelNameController.js';

const router = express.Router();

router.post('/', (req, res) => modelNameController.createModelName(req, res));
router.get('/', (req, res) => modelNameController.getAllModelNames(req, res));
// ... etc

export default router;
```

## Completed
- ✅ Department
- ✅ Person

## Remaining (Converting now)
- Doctor, Patient, Card, Appointment, Payment, Queue
- PatientVisitRecord, VisitVitalSigns, VisitPhysicalExam
- AvailableLabTests, LabRequest, LabTestResult, Medication
