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

// Protected Route Component
function ProtectedRoute({ children }) {
    const user = getStoredUser();

    if (!user || user.role !== 'receptionist') {
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

                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="register-patient" element={<RegisterPatient />} />
                    <Route path="search-patient" element={<SearchPatient />} />
                    <Route path="view-cards" element={<ViewCards />} />
                    <Route path="lab-requests" element={<LabRequests />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="manage-queue" element={<ManageQueue />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
