import { useState, useEffect } from 'react';
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
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        card_id: '',
        doctor_id: '',
        priority: 'Normal'
    });

    useEffect(() => {
        fetchQueues();
        fetchDependencies();
    }, []);

    const fetchQueues = async () => {
        try {
            const response = await api.get(API_ROUTES.QUEUES);
            setQueues(response.data);
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
            doctor_id: '',
            priority: 'Normal' // Priority option?
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(API_ROUTES.QUEUES, {
                card_id: formData.card_id,
                doctor_id: formData.doctor_id,
                // priority? if backend supports. Queue model usually just takes card/doctor.
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
        { header: 'Doctor', render: (row) => `Dr. ${row.doctor_first_name || ''} ${row.doctor_last_name || ''}` },
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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Queue</h1>
                    <p className="text-gray-500 mt-1">Add patients to queue and monitor status</p>
                </div>
                <Button variant="primary" onClick={handleAddToQueue}>Add to Queue</Button>
            </div>

            <Card title={`Patients in Queue: ${queues.filter(q => q.status === 'waiting').length}`} icon={Users}>
                <Table columns={columns} data={queues.filter(q => q.status !== 'completed')} />
            </Card>

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
