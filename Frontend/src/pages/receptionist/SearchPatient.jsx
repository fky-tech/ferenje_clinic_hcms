import { useState } from 'react';
import { Search as SearchIcon, UserPlus, Calendar, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getFullName, formatPhoneNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SearchPatient() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        setLoading(true);
        try {
            const [patients, cards] = await Promise.all([
                api.get(API_ROUTES.PATIENTS),
                api.get(API_ROUTES.CARDS),
            ]);

            const results = patients.data.filter(patient => {
                const fullName = getFullName(patient).toLowerCase();
                const phone = patient.PhoneNo?.toLowerCase() || '';
                const term = searchTerm.toLowerCase();

                // Find patient's card
                const patientCard = cards.data.find(c => c.patient_id === patient.patient_id);
                const cardNumber = patientCard?.CardNumber?.toLowerCase() || '';

                return fullName.includes(term) || phone.includes(term) || cardNumber.includes(term);
            }).map(patient => {
                const patientCard = cards.data.find(c => c.patient_id === patient.patient_id);
                return { ...patient, card: patientCard };
            });

            setSearchResults(results);
            if (results.length === 0) {
                toast.info('No patients found');
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Patient ID', accessor: 'patient_id' },
        { header: 'Name', render: (row) => getFullName(row) },
        { header: 'Card Number', render: (row) => row.card?.CardNumber || 'N/A' },
        { header: 'Phone', render: (row) => formatPhoneNumber(row.PhoneNo) },
        { header: 'Sex', accessor: 'Sex' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="primary">View</Button>
                    <Button size="sm" variant="secondary" icon={Calendar}>Appointment</Button>
                    <Button size="sm" variant="secondary" icon={Users}>Queue</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Patient</h1>
                <p className="text-gray-500 mt-1">Search by name, card number, or phone number</p>
            </div>

            <Card icon={SearchIcon} title="Search">
                <div className="flex space-x-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={handleSearch}
                        placeholder="Enter patient name, card number, or phone..."
                        className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </Card>

            {searchResults.length > 0 && (
                <Card title={`Search Results (${searchResults.length})`}>
                    <Table columns={columns} data={searchResults} />
                </Card>
            )}
        </div>
    );
}
