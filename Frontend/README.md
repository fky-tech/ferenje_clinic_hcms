# Ferenje Clinic - Receptionist Portal

A modern, professional receptionist interface for the Ferenje Clinic Healthcare Management System built with React 18.2 and TailwindCSS.

## Features

### ✨ Core Features
- **Dashboard** with real-time statistics
  - Patients registered today
  - Appointments scheduled
  - Queue status
  - Revenue tracking
  - Total patients served
  - Average wait time
  - Recent activity feed

- **Patient Management**
  - Register new patients with comprehensive form
  - Auto-generate patient IDs and card numbers
  - Search patients by name, card number, or phone
  - Quick actions on search results

- **Card Management**
  - View all patient cards
  - Card status tracking (Active/Inactive/Expired)
  - Process payments for existing patients
  - Payment receipt generation
  - Cards expiring soon alerts

- **Lab Requests**
  - View pending lab requests
  - Process lab test payments
  - Track request status

- **Appointments**
  - Schedule new appointments
  - View all appointments
  - Update appointment status
  - Appointment reminders (15 mins before)

- **Queue Management**
  - Add patients to queue
  - Monitor queue status
  - Queue position tracking
  - Low queue alerts

### 🎨 Design Features
- Medical blue color scheme
- Responsive design (mobile, tablet, desktop)
- Modern UI with Lucide React icons
- Smooth transitions and animations
- Professional card-based layout
- Toast notifications for user feedback

## Tech Stack

- **React** 18.2.0
- **React Router DOM** 6.22.0
- **TailwindCSS** 3.4.1
- **Vite** 5.0.11 (build tool)
- **Axios** for API requests
- **date-fns** for date formatting
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Headless UI** for accessible components

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   
   The `.env` file is pre-configured with:
   ```
   VITE_API_URL=http://localhost:7000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
Frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # API configuration
│   ├── components/
│   │   └── common/               # Reusable components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Table.jsx
│   │       ├── SearchBar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx        # Main app layout
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── Header.jsx            # Top header
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx         # Login page
│   │   └── receptionist/
│   │       ├── Dashboard.jsx
│   │       ├── RegisterPatient.jsx
│   │       ├── SearchPatient.jsx
│   │       ├── ViewCards.jsx
│   │       ├── LabRequests.jsx
│   │       ├── Appointments.jsx
│   │       └── ManageQueue.jsx
│   ├── utils/
│   │   ├── constants.js          # App constants
│   │   ├── helpers.js            # Helper functions
│   │   └── validators.js         # Form validators
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
├── .env                          # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Usage

### Login
- Navigate to `/login`
- Enter receptionist email and password
- Only users with role "receptionist" can access

### Dashboard
- View today's statistics
- Quick actions for common tasks
- Recent activity feed

### Register Patient
- Fill in comprehensive patient form
- Card automatically generated
- Payment processed for new registration

### Search Patient
- Search by name, card number, or phone
- View search results in table
-Quick actions: View, Schedule Appointment, Add to Queue

### View Cards
- View all patient cards
- See card status and expiry dates
- Process payments for existing patients

### Lab Requests
- View pending lab test requests
- Process payments for lab tests

### Appointments
- View all scheduled appointments
- Schedule new appointments
- Update appointment status

### Manage Queue
- Add patients to queue
- Monitor queue status
- Track queue positions

## API Integration

All pages integrate with the backend API at `http://localhost:7000/api`:

- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `POST /api/cards` - Create card
- `GET /api/cards` - Get all cards
- `POST /api/payments` - Create payment
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/queues` - Get queue
- `POST /api/queues` - Add to queue
- `GET /api/lab-requests` - Get lab requests
- And more...

## Development Notes

- **No Authentication Tokens:** Plain email/password login as per requirements
- **Plain Text Passwords:** Passwords not hashed as per requirements
- **Protected Routes:** Only receptionists can access the portal
- **Responsive:** Works on mobile, tablet, and desktop
- **Error Handling:** Toast notifications for all errors
- **Loading States:** All async operations show loading indicators

## Color Scheme

- **Primary Blue:** #0066CC (Medical professional)
- **Teal:** #14B8A6 (Secondary)
- **Success Green:** #10B981
- **Warning Amber:** #F59E0B
- **Danger Red:** #EF4444
- **Background:** #F9FAFB

## License

Proprietary - Ferenje Clinic HCMS
