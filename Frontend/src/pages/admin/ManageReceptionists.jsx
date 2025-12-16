import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import toast from 'react-hot-toast';

export default function ManageReceptionists() {
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        address: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Using /persons endpoint filter by role (needs backend support or fetch all and filter)
            // PersonController has getPersonsByRole logic at /persons/role/:role?
            // Let's check api constants or assumption. Controller HAS getPersonsByRole
            // Route: router.get('/role/:role', (req, res) => personController.getPersonsByRole(req, res));
            // Let's assume standard REST: /persons?role=receptionist OR /persons/role/receptionist
            // Checking PersonRoutes... Step 2376 showed files. Step 2410 server.js showed routes mount at /api/persons
            // I'll try /persons/role/receptionist first. If fails, I'll update.
            const response = await api.get('/persons/role/receptionist');
            setReceptionists(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Fallback: fetch all and filter if route missing
            try {
                const all = await api.get('/persons');
                setReceptionists(all.data.filter(p => p.role === 'receptionist'));
                setLoading(false);
            } catch (err) {
                toast.error('Failed to load data');
                setLoading(false);
            }
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: '',
                phone_number: user.phone_number,
                address: user.address || ''
            });
        } else {
            setSelectedUser(null);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone_number: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (!formData.first_name || !formData.last_name || !formData.email) {
                toast.error('Please fill in all basic fields');
                return;
            }

            const personData = {
                ...formData,
                department_id: null,
                role: 'receptionist'
            };

            if (selectedUser) {
                const updateData = { ...personData };
                if (!updateData.password) delete updateData.password;

                await api.put(`/persons/${selectedUser.person_id}`, updateData);
                toast.success('Receptionist updated successfully');
            } else {
                if (!formData.password) {
                    toast.error('Password is required');
                    return;
                }
                await api.post('/persons', personData);
                toast.success('Receptionist added successfully');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving receptionist:', error);
            toast.error(error.response?.data?.error || 'Failed to save receptionist');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/persons/${selectedUser.person_id}`);
            toast.success('Receptionist deleted successfully');
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting receptionist:', error);
            toast.error('Failed to delete receptionist');
        }
    };

    const filteredList = receptionists.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'Name', render: (row) => `${row.first_name} ${row.last_name}` },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone_number' },
        { header: 'Address', accessor: 'address' },
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
                <h1 className="text-2xl font-bold text-gray-800">Manage Receptionists</h1>
                <Button onClick={() => handleOpenModal()} icon={Plus}>Add Receptionist</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-4 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search receptionists..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table columns={columns} data={filteredList} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Edit Receptionist' : 'Add New Receptionist'}
                size="md"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
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
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        {!selectedUser && (
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        )}
                        {selectedUser && (
                            <Input
                                label="New Password (Optional)"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Leave blank to keep current"
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                        <Button type="submit">Save Receptionist</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete <strong>{selectedUser?.first_name}</strong>?</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
