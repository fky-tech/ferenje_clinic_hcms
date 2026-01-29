import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredUser, isDateToday } from '../../utils/helpers';

export default function DoctorPatientList() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState(null);
    const [todayPatientIds, setTodayPatientIds] = useState(new Set());

    useEffect(() => {
        if (location.state?.filter === 'today') {
            setActiveFilter('today');
        }
    }, [location.state]);

    useEffect(() => {
        fetchData();
    }, [activeFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const doctorId = getStoredUser()?.person_id;
            const promises = [api.get(API_ROUTES.CARDS)];

            if (activeFilter === 'today') {
                promises.push(api.get(API_ROUTES.APPOINTMENTS));
                promises.push(api.get(API_ROUTES.QUEUES));
            }

            const results = await Promise.all(promises);
            setCards(results[0].data);

            if (activeFilter === 'today') {
                const appointments = results[1].data;
                const queues = results[2].data;
                const today = new Date(); // Fallback if isDateToday checks strict equal types

                const relevantIds = new Set();

                // Filter appointments
                appointments.forEach(appt => {
                    if (appt.doctor_id == doctorId && isDateToday(appt.appointment_date)) {
                        relevantIds.add(String(appt.card_id)); // Ensure string for consistency
                    }
                });

                // Filter queues
                queues.forEach(q => {
                    if (q.doctor_id == doctorId && isDateToday(q.date)) {
                        // Queue usually has card_id attached or we might need to match via patient
                        // Check queue data structure from Dashboard or ManageQueue
                        if (q.card_id) relevantIds.add(String(q.card_id));
                    }
                });

                setTodayPatientIds(relevantIds);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (card) => {
        navigate(`/doctor/patient/${card.card_id}`);
    };

    const clearFilter = () => {
        setActiveFilter(null);
        navigate(location.pathname, { replace: true, state: {} });
    };

    const doctorId = getStoredUser()?.person_id;

    const filteredCards = cards.filter(card => {
        const matchesDoctor = card.doctor_id == doctorId;
        const isActive = card.status === 'Active';
        if (!matchesDoctor || !isActive) return false;

        // Apply Today Filter
        if (activeFilter === 'today') {
            if (!todayPatientIds.has(String(card.card_id))) return false;
        }

        const searchLower = searchTerm.toLowerCase();
        return (
            card.CardNumber?.toLowerCase().includes(searchLower) ||
            card.FirstName?.toLowerCase().includes(searchLower) ||
            card.Father_Name?.toLowerCase().includes(searchLower) ||
            card.PhoneNo?.includes(searchTerm)
        );
    }).sort((a, b) => b.card_id - a.card_id);

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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {activeFilter === 'today' ? "Today's Patients" : "My Patients"}
                </h1>
                {activeFilter === 'today' && (
                    <Button variant="secondary" onClick={clearFilter} className="flex items-center gap-2">
                        <X size={16} /> Clear Filter
                    </Button>
                )}
            </div>

            <Card>
                <div className="mb-6">
                    <Input
                        icon={Search}
                        placeholder="Search by Card No, Name or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filteredCards.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {activeFilter === 'today'
                            ? "No patients found for today."
                            : "No patients found matching your search."}
                    </div>
                ) : (
                    <Table columns={columns} data={filteredCards} />
                )}
            </Card>
        </div>
    );
}
