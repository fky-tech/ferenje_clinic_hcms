# Ferenje Clinic Healthcare Management System - Backend API

A complete Node.js, Express, and MySQL backend for the Ferenje Clinic Healthcare Management System.

## Features

✅ **No Authentication** - No JWT tokens or sessions (as requested)  
✅ **Plain Text Passwords** - Passwords stored without hashing (as requested)  
✅ **MVC Architecture** - Models, Controllers, and Routes separation  
✅ **MySQL Pool Connection** - Using mysql2 with connection pooling  
✅ **Full CRUD Operations** - Create, Read All, Read by ID, Update, Delete for all tables  
✅ **Async/Await** - Modern JavaScript async patterns  
✅ **Input Validation** - Required field validation before database operations  
✅ **Error Handling** - Comprehensive error handling and user-friendly messages  

## Database Tables Supported (15 tables)

1. **department** - Department management
2. **person** - Staff information (doctors, receptionists, admins)
3. **doctor** - Doctor-specific details
4. **patient** - Patient records
5. **card** - Patient card management
6. **appointment** - Appointment scheduling
7. **payment** - Payment tracking
8. **queue** - Queue management
9. **PatientVisitRecord** - Visit records
10. **VisitVitalSigns** - Vital signs per visit
11. **VisitPhysicalExam** - Physical examination records
12. **available_lab_tests** - Lab test definitions
13. **lab_request** - Lab test requests
14. **LabTestResult** - Lab test results
15. **medication** - Medication prescriptions

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MySQL** - Relational database
- **mysql2** - MySQL client with promise support
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   The `.env` file is already created with:
   ```
   PORT=7000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=fikre
   DB_NAME=ferenje_clinic_hcms
   SESSION_SECRET=supersecretkey
   ```

3. **Create the database:**
   
   Make sure MySQL is running and create the database:
   ```sql
   CREATE DATABASE ferenje_clinic_hcms;
   ```

4. **Run the SQL schema:**
   
   Execute all the CREATE TABLE statements from your schema in the database.

## Running the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:7000`

## API Endpoints

All endpoints follow REST conventions. Base URL: `http://localhost:7000/api`

### Department
- `POST /api/departments` - Create department
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Person
- `POST /api/persons` - Create person
- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get person by ID
- `GET /api/persons/email/:email` - Get person by email
- `GET /api/persons/role/:role` - Get persons by role
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Doctor
- `POST /api/doctors` - Create doctor
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Patient
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Card
- `POST /api/cards` - Create card
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get card by ID
- `GET /api/cards/number/:cardNumber` - Get card by card number
- `GET /api/cards/patient/:patientId` - Get cards by patient ID
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Appointment
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Payment
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Queue
- `POST /api/queues` - Create queue entry
- `GET /api/queues` - Get all queue entries
- `GET /api/queues/:id` - Get queue entry by ID
- `GET /api/queues/doctor/:doctorId` - Get queue by doctor
- `PUT /api/queues/:id` - Update queue entry
- `DELETE /api/queues/:id` - Delete queue entry

### Patient Visit Record
- `POST /api/patient-visit-records` - Create visit record
- `GET /api/patient-visit-records` - Get all visit records
- `GET /api/patient-visit-records/:id` - Get visit record by ID
- `GET /api/patient-visit-records/card/:cardId` - Get records by card
- `PUT /api/patient-visit-records/:id` - Update visit record
- `DELETE /api/patient-visit-records/:id` - Delete visit record

### Visit Vital Signs
- `POST /api/visit-vital-signs` - Create vital signs
- `GET /api/visit-vital-signs` - Get all vital signs
- `GET /api/visit-vital-signs/:id` - Get vital signs by ID
- `GET /api/visit-vital-signs/visit/:visitRecordId` - Get by visit
- `PUT /api/visit-vital-signs/:id` - Update vital signs
- `DELETE /api/visit-vital-signs/:id` - Delete vital signs

### Visit Physical Exam
- `POST /api/visit-physical-exams` - Create physical exam
- `GET /api/visit-physical-exams` - Get all physical exams
- `GET /api/visit-physical-exams/:id` - Get physical exam by ID
- `GET /api/visit-physical-exams/visit/:visitRecordId` - Get by visit
- `PUT /api/visit-physical-exams/:id` - Update physical exam
- `DELETE /api/visit-physical-exams/:id` - Delete physical exam

### Available Lab Tests
- `POST /api/available-lab-tests` - Create lab test
- `GET /api/available-lab-tests` - Get all lab tests
- `GET /api/available-lab-tests/:id` - Get lab test by ID
- `GET /api/available-lab-tests/name/:testName` - Get by test name
- `GET /api/available-lab-tests/category/:category` - Get by category
- `PUT /api/available-lab-tests/:id` - Update lab test
- `DELETE /api/available-lab-tests/:id` - Delete lab test

### Lab Request
- `POST /api/lab-requests` - Create lab request
- `GET /api/lab-requests` - Get all lab requests
- `GET /api/lab-requests/:id` - Get lab request by ID
- `GET /api/lab-requests/visit/:visitRecordId` - Get by visit
- `PUT /api/lab-requests/:id` - Update lab request
- `DELETE /api/lab-requests/:id` - Delete lab request

### Lab Test Result
- `POST /api/lab-test-results` - Create test result
- `GET /api/lab-test-results` - Get all test results
- `GET /api/lab-test-results/:id` - Get test result by ID
- `GET /api/lab-test-results/request/:requestId` - Get by request
- `PUT /api/lab-test-results/:id` - Update test result
- `DELETE /api/lab-test-results/:id` - Delete test result

### Medication
- `POST /api/medications` - Create medication
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get medication by ID
- `GET /api/medications/visit/:visitRecordId` - Get by visit
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection pool
│   ├── controllers/           # Business logic (15 controllers)
│   │   ├── departmentController.js
│   │   ├── personController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   ├── cardController.js
│   │   ├── appointmentController.js
│   │   ├── paymentController.js
│   │   ├── queueController.js
│   │   ├── patientVisitRecordController.js
│   │   ├── visitVitalSignsController.js
│   │   ├── visitPhysicalExamController.js
│   │   ├── availableLabTestsController.js
│   │   ├── labRequestController.js
│   │   ├── labTestResultController.js
│   │   └── medicationController.js
│   ├── models/                # Database models (15 models)
│   │   ├── departmentModel.js
│   │   ├── personModel.js
│   │   ├── doctorModel.js
│   │   ├── patientModel.js
│   │   ├── cardModel.js
│   │   ├── appointmentModel.js
│   │   ├── paymentModel.js
│   │   ├── queueModel.js
│   │   ├── patientVisitRecordModel.js
│   │   ├── visitVitalSignsModel.js
│   │   ├── visitPhysicalExamModel.js
│   │   ├── availableLabTestsModel.js
│   │   ├── labRequestModel.js
│   │   ├── labTestResultModel.js
│   │   └── medicationModel.js
│   ├── routes/                # API routes (15 route files)
│   │   ├── departmentRoutes.js
│   │   ├── personRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── cardRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── queueRoutes.js
│   │   ├── patientVisitRecordRoutes.js
│   │   ├── visitVitalSignsRoutes.js
│   │   ├── visitPhysicalExamRoutes.js
│   │   ├── availableLabTestsRoutes.js
│   │   ├── labRequestRoutes.js
│   │   ├── labTestResultRoutes.js
│   │   └── medicationRoutes.js
│   ├── middleware/            # (Reserved for future use)
│   └── services/              # (Reserved for future use)
├── .env                       # Environment variables
├── server.js                  # Application entry point
├── package.json               # Dependencies
└── README.md                  # This file
```

## Example Requests

### Create a Department
```bash
curl -X POST http://localhost:7000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"department_name": "Cardiology"}'
```

### Get All Patients
```bash
curl http://localhost:7000/api/patients
```

### Update an Appointment
```bash
curl -X PUT http://localhost:7000/api/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "card_id": 1,
    "doctor_id": 5,
    "appointment_start_time": "2025-12-15 10:00:00",
    "appointment_end_time": "2025-12-15 10:30:00",
    "status": "completed"
  }'
```

### Delete a Payment
```bash
curl -X DELETE http://localhost:7000/api/payments/3
```

## Error Responses

All errors return JSON in this format:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Server Error

## Notes

- Passwords are stored in **plain text** as requested (not recommended for production)
- No authentication or authorization implemented (as requested)
- All foreign key relationships are maintained in the database schema
- The API uses proper SQL queries matching your exact table definitions
- Input validation ensures required fields are present

## License

Proprietary - Ferenje Clinic HCMS
