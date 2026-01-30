import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Receptionist/Dashboard';
import RegisterPatient from './pages/Receptionist/RegisterPatient';
import SearchPatient from './pages/Receptionist/SearchPatient';
import ViewCards from './pages/Receptionist/ViewCards';
import LabRequests from './pages/Receptionist/LabRequests';
import Appointments from './pages/Receptionist/Appointments';
import ManageQueue from './pages/Receptionist/ManageQueue';
import { getStoredUser } from './utils/helpers';
import { NotificationProvider } from './contexts/NotificationContext';
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorPatientList from './pages/Doctor/DoctorPatientList';
import DoctorPatientDetails from './pages/Doctor/DoctorPatientDetails';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorQueue from './pages/Doctor/DoctorQueue';
import LabDashboard from './pages/Lab/Dashboard';
import Labs from './pages/Lab/Labs';
import Ultrasounds from './pages/Lab/Ultrasounds';
import LabSearchPatient from './pages/Lab/SearchPatient';
import LabPatientDetails from './pages/Lab/PatientDetails';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageReceptionists from './pages/Admin/ManageReceptionists';
import ViewPatients from './pages/Admin/Patients';
import Reports from './pages/Admin/Reports';
import AdminLabRequests from './pages/Admin/LabRequests';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
    const user = getStoredUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard if they try to access unauthorized route
        if (user.role === 'receptionist') return <Navigate to="/receptionist/dashboard" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
        if (user.role === 'lab_doctor') return <Navigate to="/lab/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        icon: '✅',
                    },
                    error: {
                        duration: 4000,
                        icon: '❌',
                    },
                }}
            />
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Receptionist Routes */}
                <Route path="/receptionist" element={
                    <ProtectedRoute allowedRoles={['receptionist']}>
                        <NotificationProvider>
                            <MainLayout />
                        </NotificationProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="register-patient" element={<RegisterPatient />} />
                    <Route path="search-patient" element={<SearchPatient />} />
                    <Route path="view-cards" element={<ViewCards />} />
                    <Route path="lab-requests" element={<LabRequests />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="manage-queue" element={<ManageQueue />} />
                </Route>

                {/* Doctor Routes */}
                <Route path="/doctor" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <NotificationProvider>
                            <MainLayout />
                        </NotificationProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="patients" element={<DoctorPatientList />} />
                    <Route path="patient/:cardId" element={<DoctorPatientDetails />} />
                    <Route path="appointments" element={<DoctorAppointments />} />
                    <Route path="queue" element={<DoctorQueue />} />
                </Route>

                <Route path="/lab" element={
                    <ProtectedRoute allowedRoles={['lab_doctor']}>
                        <NotificationProvider>
                            <MainLayout />
                        </NotificationProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<LabDashboard />} />
                    <Route path="todays-labs" element={<Labs />} />
                    <Route path="todays-ultrasounds" element={<Ultrasounds />} />
                    <Route path="search-patient" element={<LabSearchPatient />} />
                    <Route path="patient/:cardId" element={<LabPatientDetails />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <NotificationProvider>
                            <MainLayout />
                        </NotificationProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="doctors" element={<ManageDoctors />} />
                    <Route path="receptionists" element={<ManageReceptionists />} />
                    <Route path="patients" element={<ViewPatients />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="lab-requests" element={<AdminLabRequests />} />
                </Route>

                {/* Root Redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
