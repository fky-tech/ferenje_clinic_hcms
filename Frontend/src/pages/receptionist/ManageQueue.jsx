import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ManageQueue() {
    const location = useLocation();
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const [formData, setFormData] = useState({
        card_id: '',
        doctor_id: '',
        priority: 'Normal'
    });

    useEffect(() => {
        fetchQueues();
        fetchDependencies();

        // Check if cardId passed from search
        if (location.state?.cardId) {
            setFormData(prev => ({ ...prev, card_id: location.state.cardId }));
            setIsModalOpen(true);
        }
    }, [location.state]);

    const fetchQueues = async () => {
        try {
            const response = await api.get(API_ROUTES.QUEUES);
            // Filter only today's queue
            const todayQueue = response.data.filter(q => {
                const qDate = new Date(q.date?.replace(' ', 'T') || new Date());
                const today = new Date();
                return qDate.getDate() === today.getDate() &&
                    qDate.getMonth() === today.getMonth() &&
                    qDate.getFullYear() === today.getFullYear();
            });
            setQueues(todayQueue);
        } catch (error) {
            console.error('Error fetching queues:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const cardsRes = await api.get(API_ROUTES.CARDS);
            setCards(cardsRes.data);
            const doctorsRes = await api.get(API_ROUTES.DOCTORS);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const handleAddToQueue = () => {
        setFormData({
            card_id: '',
            doctor_id: selectedDoctorId || '',
            priority: 'Normal'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(API_ROUTES.QUEUES, {
                card_id: formData.card_id,
                doctor_id: formData.doctor_id,
            });
            toast.success('Patient added to queue');
            setIsModalOpen(false);
            fetchQueues();
        } catch (error) {
            console.error('Error adding to queue:', error);
            toast.error('Failed to add to queue');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const columns = [
        { header: 'Position', accessor: 'queue_position' },
        { header: 'Patient', render: (row) => `${row.FirstName || ''} ${row.Father_Name || ''}` },
        { header: 'Card Number', accessor: 'CardNumber' },
        {
            header: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'in_consultation' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {row.status.replace('_', ' ')}
                </span>
            )
        },
        { header: 'Time', render: (row) => formatDateTime(row.date) },
    ];

    const filteredQueues = selectedDoctorId
        ? queues.filter(q => q.doctor_id == selectedDoctorId)
        : [];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Queue</h1>
                    <p className="text-gray-500 mt-1">Select a doctor to view their specific queue</p>
                </div>
                <Button variant="primary" onClick={handleAddToQueue}>Add to Queue</Button>
            </div>

            {/* Doctor Selection Tabs/Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {doctors.map(doc => (
                    <div
                        key={doc.doctor_id}
                        onClick={() => setSelectedDoctorId(doc.doctor_id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDoctorId === doc.doctor_id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                            }`}
                    >
                        <p className="font-bold text-gray-900">Dr. {doc.first_name} {doc.last_name}</p>
                        <p className="text-xs text-gray-500">{doc.specialization}</p>
                        <div className="mt-2 flex justify-between items-center text-xs">
                            <span className="text-gray-400">Waiting:</span>
                            <span className="font-bold text-blue-600">
                                {queues.filter(q => q.doctor_id === doc.doctor_id && q.status === 'waiting').length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDoctorId ? (
                <Card
                    title={`Queue for Dr. ${doctors.find(d => d.doctor_id === selectedDoctorId)?.last_name}`}
                    icon={Users}
                >
                    <Table columns={columns} data={filteredQueues.filter(q => q.status !== 'completed')} />
                </Card>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500">
                    Select a doctor above to see the queue
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add to Queue"
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
                            {cards.map(c => (
                                <option key={c.card_id} value={c.card_id}>
                                    {c.CardNumber} - {c.FirstName} {c.Father_Name}
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
                    <div className="flex justify-end pt-4 border-t space-x-3">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Add</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
