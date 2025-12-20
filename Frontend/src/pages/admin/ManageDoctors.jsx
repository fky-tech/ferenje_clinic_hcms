import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import toast from 'react-hot-toast';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        address: '',
        department_id: '',
        office_no: '',
        specialization: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [doctorsRes, deptsRes] = await Promise.all([
                api.get('/doctors'),
                api.get('/departments')
            ]);
            setDoctors(doctorsRes.data);
            setDepartments(deptsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
            setLoading(false);
        }
    };

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setSelectedDoctor(doctor);
            setFormData({
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                email: doctor.email,
                password: '', // Leave empty for edit
                phone_number: doctor.phone_number,
                address: doctor.address || '',
                department_id: doctor.department_id || '',
                office_no: doctor.office_no,
                specialization: doctor.specialization
            });
        } else {
            setSelectedDoctor(null);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone_number: '',
                address: '',
                department_id: '',
                office_no: '',
                specialization: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDeleteClick = (doctor) => {
        setSelectedDoctor(doctor);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Validate required fields
            if (!formData.first_name || !formData.last_name || !formData.email || !formData.department_id) {
                toast.error('Please fill in all basic fields');
                return;
            }
            if (!selectedDoctor && !formData.password) {
                toast.error('Password is required for new doctors');
                return;
            }

            const personData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address,
                department_id: formData.department_id,
                role: 'doctor',
                ...(formData.password && { password: formData.password }) // Only include password if provided
            };

            if (selectedDoctor) {
                // UPDATE
                // 1. Update Person
                await api.put(`/persons/${selectedDoctor.doctor_id}`, personData);
                // 2. Update Doctor Details
                await api.put(`/doctors/${selectedDoctor.doctor_id}`, {
                    office_no: formData.office_no,
                    specialization: formData.specialization
                });
                toast.success('Doctor updated successfully');
            } else {
                // CREATE
                // 1. Create Person
                const personRes = await api.post('/persons', personData);
                const personId = personRes.data.person_id;

                // 2. Create Doctor
                await api.post('/doctors', {
                    doctor_id: personId,
                    office_no: formData.office_no,
                    specialization: formData.specialization
                });
                toast.success('Doctor added successfully');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving doctor:', error);
            toast.error(error.response?.data?.error || 'Failed to save doctor');
        }
    };

    const handleDelete = async () => {
        try {
            // Delete Person (Assuming CASCADE deletes Doctor)
            await api.delete(`/persons/${selectedDoctor.doctor_id}`);
            toast.success('Doctor deleted successfully');
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            toast.error('Failed to delete doctor');
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'Name', render: (row) => `${row.first_name} ${row.last_name}` },
        { header: 'Specialization', accessor: 'specialization' },
        { header: 'Department', render: (row) => row.department_name || 'N/A' },
        { header: 'Office', accessor: 'office_no' },
        { header: 'Phone', accessor: 'phone_number' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(row)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteClick(row)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
                <Button onClick={() => handleOpenModal()} className='bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900 ' icon={Plus}>Add Doctor</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-4 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table columns={columns} data={filteredDoctors} />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                size="lg"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone Number"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        />
                        {!selectedDoctor && (
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required={!selectedDoctor}
                            />
                        )}
                        {selectedDoctor && (
                            <Input
                                label="New Password (Optional)"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Leave blank to keep current"
                            />
                        )}

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.department_id}
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.department_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Office Number"
                            value={formData.office_no}
                            onChange={(e) => setFormData({ ...formData, office_no: e.target.value })}
                        />
                        <Input
                            label="Specialization"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="md:col-span-2"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                        <Button className='bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900 ' type="submit">Save Doctor</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete <strong>{selectedDoctor?.first_name} {selectedDoctor?.last_name}</strong>?</p>
                    <p className="text-sm text-red-500">This action cannot be undone.</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
