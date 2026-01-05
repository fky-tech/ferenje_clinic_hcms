import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import EthiopianDatePicker from '../../components/common/EthiopianDatePicker';

import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatDateTime, formatDate, formatForAPI } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Appointments() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    card_id: '',
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    reason: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatientsAndDoctors();

    // Check if cardId passed from search
    if (location.state?.cardId) {
      setFormData(prev => ({ ...prev, card_id: location.state.cardId }));
      setIsModalOpen(true);
    }
  }, [location.state]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(API_ROUTES.APPOINTMENTS);
      setAppointments(response.data.filter(a => a.status !== 'completed'));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsAndDoctors = async () => {
    try {
      // Assuming these endpoints exist or using alternative ways
      // For patients, we might need to search, but for now let's try fetching all if not too many, 
      // or just cards. Usually appointments start with a Card or Patient.
      // Using Cards for selection as it links patient.
      const cardsRes = await api.get(API_ROUTES.CARDS);
      setPatients(cardsRes.data);

      const doctorsRes = await api.get(`${API_ROUTES.DOCTORS}`);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('Error fetching dependencies:', error);
    }
  };

  const handleScheduleNew = () => {
    setCurrentAppointment(null);
    setFormData({
      card_id: '',
      doctor_id: '',
      appointment_date: new Date().toISOString().split('T')[0],
      reason: '',
      status: 'scheduled'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      card_id: appointment.card_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date ? String(appointment.appointment_date).split('T')[0] : '',
      reason: appointment.reason || '',
      status: appointment.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        card_id: formData.card_id,
        doctor_id: formData.doctor_id,
        appointment_date: formData.appointment_date,
        reason: formData.reason,
        status: formData.status
      };

      if (currentAppointment) {
        await api.put(`${API_ROUTES.APPOINTMENTS}/${currentAppointment.appointment_id}`, payload);
        toast.success('Appointment updated successfully');
      } else {
        await api.post(API_ROUTES.APPOINTMENTS, payload);
        toast.success('Appointment scheduled successfully');
        addNotification(`New appointment scheduled for Dr. ${doctors.find(d => d.doctor_id == formData.doctor_id)?.last_name || 'Doctor'}`, 'success', ['receptionist', 'doctor', 'admin']);
      }

      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to save appointment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { header: 'ID', accessor: 'appointment_id' },
    { header: 'Patient', render: (row) => `${row.FirstName || ''} ${row.Father_Name || ''}` },
    { header: 'Doctor', render: (row) => `Dr. ${row.doctor_first_name || ''} ${row.doctor_last_name || ''}` },
    { header: 'Date', render: (row) => formatDate(row.appointment_date) },
    {
      header: 'Status', render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          row.status === 'completed' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions', render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
      )
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Schedule and manage appointments</p>
        </div>
        <Button variant="primary" onClick={handleScheduleNew}>Schedule New</Button>
      </div>

      <Card title={`Total Appointments: ${appointments.length}`} icon={CalendarIcon}>
        <Table columns={columns} data={appointments} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAppointment ? 'Edit Appointment' : 'Schedule Appointment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient (Card)</label>
            <select
              name="card_id"
              value={formData.card_id}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.card_id} value={p.card_id}>
                  {p.CardNumber} - {p.FirstName} {p.Father_Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  Dr. {d.first_name} {d.last_name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <EthiopianDatePicker
              label="Date"
              value={formData.appointment_date}
              onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="scheduled">Scheduled</option>
              {/* <option value="completed">Completed</option> */}
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
