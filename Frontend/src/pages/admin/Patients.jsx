import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../api/axios';
import Table from '../../components/common/Table';
import toast from 'react-hot-toast';

export default function ViewPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast.error('Failed to load patients');
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient => {
        const term = searchTerm.toLowerCase();
        return (
            patient.FirstName?.toLowerCase().includes(term) ||
            patient.Father_Name?.toLowerCase().includes(term) ||
            patient.PhoneNo?.includes(term)
            // Note: CardNumber is not directly in patient table response based on standard fetch, 
            // usually user searches by name here. 
            // If API returns CardNumber via JOIN, we can search it.
            // PatientController.getAllPatients logic: normally just SELECT * FROM patient.
        );
    });

    const columns = [
        { header: 'First Name', accessor: 'FirstName' },
        { header: 'Father Name', accessor: 'Father_Name' },
        { header: 'Gender', accessor: 'Sex' },
        { header: 'Mobile', accessor: 'PhoneNo' },
        { header: 'Age', accessor: 'Age' },
        { header: 'Woreda', accessor: 'Wereda' },
        { header: 'Region', accessor: 'Region' }
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Clinic Patients</h1>
                <div className="text-sm text-gray-500">
                    Total Patients: {patients.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-4 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table columns={columns} data={filteredPatients} />
            </div>
        </div>
    );
}
