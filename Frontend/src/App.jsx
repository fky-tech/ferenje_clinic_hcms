import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/receptionist/Dashboard';
import RegisterPatient from './pages/receptionist/RegisterPatient';
import SearchPatient from './pages/receptionist/SearchPatient';
import ViewCards from './pages/receptionist/ViewCards';
import LabRequests from './pages/receptionist/LabRequests';
import Appointments from './pages/receptionist/Appointments';
import ManageQueue from './pages/receptionist/ManageQueue';
import { getStoredUser } from './utils/helpers';
import { NotificationProvider } from './contexts/NotificationContext';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatientList from './pages/doctor/DoctorPatientList';
import DoctorPatientDetails from './pages/doctor/DoctorPatientDetails';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorQueue from './pages/doctor/DoctorQueue';
import LabDashboard from './pages/lab/Dashboard';
import Labs from './pages/lab/Labs';
import LabSearchPatient from './pages/lab/SearchPatient';
import LabPatientDetails from './pages/lab/PatientDetails';
import AdminDashboard from './pages/admin/Dashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageReceptionists from './pages/admin/ManageReceptionists';
import ViewPatients from './pages/admin/Patients';
import Reports from './pages/admin/Reports';
import AdminLabRequests from './pages/admin/LabRequests';

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
                    <Route path="labs" element={<Labs />} />
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
