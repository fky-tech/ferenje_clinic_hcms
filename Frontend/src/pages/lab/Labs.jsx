import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Search, ChevronDown, ChevronRight, FlaskConical, Filter } from 'lucide-react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LabResultModal from '../../components/lab/LabResultModal';

export default function Labs() {
    const [searchParams] = useSearchParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(''); // Empty for all
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [expandedCards, setExpandedCards] = useState({});

    useEffect(() => {
        const filterParam = searchParams.get('filter');
        if (filterParam === 'today' || filterParam === 'urgent') {
            setFilterDate(new Date().toISOString().split('T')[0]);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchRequests();
    }, [filterDate]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = { category: 'other' };
            if (filterDate) params.date = filterDate;

            const response = await api.get('/lab-requests/requests', { params });
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResultModal = (request) => {
        setSelectedRequest(request);
        setIsResultModalOpen(true);
    };

    const toggleCard = (cardId) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    // Filter and group requests
    const groupedRequests = requests.reduce((acc, req) => {
        // Show if there are standard tests AND they are not all finished AND paid
        // standard_tests_count should be > 0 and standard_results_count < standard_tests_count
        const hasStandardTests = parseInt(req.standard_tests_count) > 0;
        const standardTestsPending = hasStandardTests && parseInt(req.standard_results_count) < parseInt(req.standard_tests_count);

        if (!standardTestsPending || req.payment_status !== 'paid') return acc;

        const cardId = req.CardNumber;
        if (!acc[cardId]) {
            acc[cardId] = {
                patient: {
                    FirstName: req.FirstName,
                    Father_Name: req.Father_Name,
                    CardNumber: req.CardNumber,
                    Sex: req.Sex,
                    Age: req.Age
                },
                requests: []
            };
        }
        acc[cardId].requests.push(req);
        return acc;
    }, {});

    const filteredGroups = Object.values(groupedRequests).filter(group => {
        const matchesSearch = group.patient.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.patient.Father_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.patient.CardNumber?.includes(searchTerm);

        const isUrgentFilter = searchParams.get('filter') === 'urgent';
        if (isUrgentFilter) {
            // Check if any request in the group is urgent AND has pending lab tests
            const hasUrgent = group.requests.some(r => {
                const isUrgentParams = r.UrgentAttention === 1 || r.LabStatus?.toLowerCase() === 'urgent';
                const hasPendingLab = parseInt(r.standard_tests_count || 0) > parseInt(r.standard_results_count || 0);
                return isUrgentParams && hasPendingLab;
            });
            return matchesSearch && hasUrgent;
        }

        return matchesSearch;
    }).sort((a, b) => {
        // Sort groups: those with urgent requests come first
        const hasUrgentPending = (requests) => requests.some(r => {
            const isUrgentParams = r.UrgentAttention === 1 || r.LabStatus?.toLowerCase() === 'urgent';
            const hasPendingLab = parseInt(r.standard_tests_count || 0) > parseInt(r.standard_results_count || 0);
            return isUrgentParams && hasPendingLab;
        });

        const aUrgent = hasUrgentPending(a.requests);
        const bUrgent = hasUrgentPending(b.requests);

        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        return 0; // Keep original order (by accumulation) or sort by date/name
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Lab Requests</h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Date Filter */}
                    <div className="relative">
                        <input
                            type="date"
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    {filterDate && (
                        <Button variant="secondary" onClick={() => setFilterDate('')}>
                            Clear Date
                        </Button>
                    )}
                </div>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="space-y-4">
                    {filteredGroups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
                            No requests found.
                        </div>
                    ) : (
                        filteredGroups.map((group) => (
                            <div key={group.patient.CardNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div
                                    onClick={() => toggleCard(group.patient.CardNumber)}
                                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                                            <FlaskConical className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {group.patient.FirstName} {group.patient.Father_Name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Card: {group.patient.CardNumber} • {group.patient.Sex} • {group.patient.Age} yrs
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">
                                            {group.requests.length} Request(s)
                                        </span>
                                        {expandedCards[group.patient.CardNumber] ? (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {expandedCards[group.patient.CardNumber] && (
                                    <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
                                        {group.requests.map(request => (
                                            <div
                                                key={request.request_id}
                                                onClick={() => handleOpenResultModal(request)}
                                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center space-x-3 w-full sm:w-auto">
                                                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">
                                                            Requested: {formatDateTime(request.RequestDate)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Dr. {request.doctor_first_name} {request.doctor_last_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between w-full sm:w-auto space-x-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${request.LabStatus === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {request.LabStatus}
                                                    </span>
                                                    <Button size="sm" variant="outline" className="text-xs">
                                                        {request.LabStatus === 'completed' ? 'View/Edit' : 'Enter Results'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedRequest && (
                <LabResultModal
                    isOpen={isResultModalOpen}
                    onClose={() => {
                        setIsResultModalOpen(false);
                        setSelectedRequest(null);
                    }}
                    request={selectedRequest}
                    onSuccess={fetchRequests}
                />
            )}
        </div>
    );
}
