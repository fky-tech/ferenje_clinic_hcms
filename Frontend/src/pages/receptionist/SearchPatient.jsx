import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, UserPlus, Calendar, Users, Eye, Phone, CreditCard, User } from 'lucide-react';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getFullName, formatPhoneNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SearchPatient() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size for responsive behavior
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

            const results = patients.data
                .filter(patient => {
                    const fullName = getFullName(patient).toLowerCase();
                    const phone = patient.PhoneNo?.toLowerCase() || '';
                    const term = searchTerm.toLowerCase();
                    const patientCard = cards.data.find(c => c.patient_id === patient.patient_id);
                    const cardNumber = patientCard?.CardNumber?.toLowerCase() || '';

                    return (
                        fullName.includes(term) ||
                        phone.includes(term) ||
                        cardNumber.includes(term)
                    );
                })
                .map(patient => {
                    const patientCard = cards.data.find(c => c.patient_id === patient.patient_id);
                    return { ...patient, card: patientCard };
                });

            setSearchResults(results);
            if (results.length === 0) toast.info('No patients found');
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Mobile-friendly columns
    const mobileColumns = [
        {
            header: 'Patient',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate text-sm">{getFullName(row)}</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                                    ID: {row.patient_id}
                                </span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${row.Sex === 'M' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                                    {row.Sex}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <Phone size={10} />
                                <span>{formatPhoneNumber(row.PhoneNo)}</span>
                            </div>
                            {row.card?.CardNumber && (
                                <div className="flex items-center gap-1 mt-1 text-xs">
                                    <CreditCard size={10} className="text-gray-400" />
                                    <span className="font-medium text-gray-700">{row.card.CardNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-1 mt-2 pt-2 border-t border-gray-100">
                        <Button size="xs" variant="ghost" className="text-blue-600 hover:bg-blue-50" title="View Profile" onClick={() => handleAction('view', row)}>
                            <Eye size={14} />
                            <span className="ml-1">View</span>
                        </Button>
                        <Button size="xs" variant="ghost" className="text-gray-600 hover:bg-gray-100" title="Schedule" onClick={() => handleAction('schedule', row)}>
                            <Calendar size={14} />
                            <span className="ml-1">Schedule</span>
                        </Button>
                        <Button size="xs" variant="ghost" className="text-gray-600 hover:bg-gray-100" title="Add to Queue" onClick={() => handleAction('queue', row)}>
                            <Users size={14} />
                            <span className="ml-1">Queue</span>
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    const handleAction = (action, row) => {
        if (!row.card?.CardNumber) {
            toast.error('Patient has no active card');
            return;
        }

        switch (action) {
            case 'view':
                navigate('/receptionist/view-cards', { state: { cardNumber: row.card.CardNumber } });
                break;
            case 'schedule':
                navigate('/receptionist/appointments', { state: { cardId: row.card.card_id } });
                break;
            case 'queue':
                navigate('/receptionist/manage-queue', { state: { cardId: row.card.card_id } });
                break;
            default:
                break;
        }
    };

    // Desktop columns
    const desktopColumns = [
        {
            header: 'Patient Info',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">{getFullName(row)}</span>
                        <span className="text-xs text-gray-500">ID: {row.patient_id}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Card Number',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <CreditCard size={12} className="text-gray-400" />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        {row.card?.CardNumber || 'No Card'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Phone',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />
                    <span className="text-sm">{formatPhoneNumber(row.PhoneNo)}</span>
                </div>
            ),
        },
        {
            header: 'Sex',
            render: (row) => (
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${row.Sex === 'M'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                        }`}
                >
                    {row.Sex}
                </span>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-1">
                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50"
                        title="View Profile"
                        onClick={() => handleAction('view', row)}
                    >
                        <Eye size={14} />
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-100"
                        title="Schedule"
                        onClick={() => handleAction('schedule', row)}
                    >
                        <Calendar size={14} />
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-100"
                        title="Add to Queue"
                        onClick={() => handleAction('queue', row)}
                    >
                        <Users size={14} />
                    </Button>
                </div>
            ),
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                            Patient Registry
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Manage and search patient records efficiently
                        </p>
                    </div>

                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by name, card number, or phone..."
                                    className="w-full pl-9 pr-3 py-2 bg-transparent border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-colors"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-gray-900  to-blue-600 
                        "
                                size="sm"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Searching...</span>
                                    </div>
                                ) : (
                                    'Search'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {searchResults.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-1">
                                <h3 className="font-medium text-gray-700 text-sm">
                                    Search Results
                                </h3>
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs">
                                    {searchResults.length}
                                </span>
                            </div>
                            {!isMobile && (
                                <p className="text-xs text-gray-500">
                                    {searchResults.length} patient{searchResults.length !== 1 ? 's' : ''} found
                                </p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            {isMobile ? (
                                // Mobile list view
                                <div className="divide-y divide-gray-100">
                                    {searchResults.map((patient) => (
                                        <div key={patient.patient_id} className="p-3 hover:bg-gray-50">
                                            <Table columns={mobileColumns} data={[patient]} hideHeader />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Desktop table view
                                <Table
                                    columns={desktopColumns}
                                    data={searchResults}
                                    className="text-sm"
                                    stickyHeader
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-dashed border-gray-200">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
                                <SearchIcon className="text-blue-500" size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">
                                Ready to search
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto px-4">
                                Enter a patient's name, card number, or phone number above to start searching.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                                    <span className="font-medium">Tip:</span> Search by "John" or "555-1234"
                                </div>
                                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                                    <span className="font-medium">Need help?</span>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                        <p className="mt-2 text-sm text-gray-600">Searching patient records...</p>
                    </div>
                )}

                {/* Footer Help Text */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Need help? Contact support or check our documentation for advanced search options.
                    </p>
                </div>
            </div>
        </div>
    );
}