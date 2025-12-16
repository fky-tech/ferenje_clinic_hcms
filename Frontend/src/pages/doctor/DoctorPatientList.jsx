import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function DoctorPatientList() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await api.get(API_ROUTES.CARDS);
            setCards(response.data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (card) => {
        navigate(`/doctor/patient/${card.card_id}`);
    };

    const filteredCards = cards.filter(card => {
        const searchLower = searchTerm.toLowerCase();
        return (
            card.CardNumber?.toLowerCase().includes(searchLower) ||
            card.FirstName?.toLowerCase().includes(searchLower) ||
            card.Father_Name?.toLowerCase().includes(searchLower) ||
            card.PhoneNo?.includes(searchTerm)
        );
    });

    const columns = [
        { header: 'Card No', accessor: 'CardNumber' },
        { header: 'First Name', accessor: 'FirstName' },
        { header: 'Father Name', accessor: 'Father_Name' },
        { header: 'Gender', accessor: 'Sex' },
        { header: 'Age', accessor: 'Age' },
        { header: 'Phone', accessor: 'PhoneNo' },
        {
            header: 'Actions', render: (row) => (
                <Button size="sm" onClick={() => handleViewDetails(row)}>View Details</Button>
            )
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>

            <Card>
                <div className="mb-6">
                    <Input
                        icon={Search}
                        placeholder="Search by Card No, Name or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table columns={columns} data={filteredCards} />
            </Card>
        </div>
    );
}
