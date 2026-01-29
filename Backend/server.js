import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import database connection
import db from './src/config/db.js';

// Import routes
import departmentRoutes from './src/routes/departmentRoutes.js';
import personRoutes from './src/routes/personRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import cardRoutes from './src/routes/cardRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import queueRoutes from './src/routes/queueRoutes.js';
import patientVisitRecordRoutes from './src/routes/patientVisitRecordRoutes.js';
import visitVitalSignsRoutes from './src/routes/visitVitalSignsRoutes.js';
import visitPhysicalExamRoutes from './src/routes/visitPhysicalExamRoutes.js';
import availableLabTestsRoutes from './src/routes/availableLabTestsRoutes.js';
import labRequestRoutes from './src/routes/labRequestRoutes.js';
import labRequestTestRoutes from './src/routes/labRequestTestRoutes.js';
import labTestResultRoutes from './src/routes/labTestResultRoutes.js';
import ultrasoundTestResultRoutes from './src/routes/ultrasoundTestResultRoutes.js';
import medicationRoutes from './src/routes/medicationRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import familyPlanningRoutes from './src/routes/familyPlanningRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import initCronJobs from './src/services/cronService.js';

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
// Authentication routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/departments', departmentRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/patient-visit-records', patientVisitRecordRoutes);
app.use('/api/visit-vital-signs', visitVitalSignsRoutes);
app.use('/api/visit-physical-exams', visitPhysicalExamRoutes);
app.use('/api/available-lab-tests', availableLabTestsRoutes);
app.use('/api/lab-requests', labRequestRoutes);
app.use('/api/lab-request-tests', labRequestTestRoutes);
app.use('/api/lab-test-results', labTestResultRoutes);
app.use('/api/ultrasound-test-results', ultrasoundTestResultRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/family-planning', familyPlanningRoutes);
app.use('/api/reports', reportRoutes);

// Health check route (moved under /api/health)
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Ferenje Clinic Healthcare Management System API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Initialize Cron Jobs
initCronJobs();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Serve frontend from Vite's dist folder (must be last)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});