import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SearchPatient() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const response = await api.get(`/cards/search?query=${searchTerm}`);
            setSearchResults(response.data);
            setHasSearched(true);
        } catch (error) {
            console.error('Error searching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Search Patient History</h1>

            <Card>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by Card Number, Phone, or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </form>
            </Card>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.length > 0 ? (
                        searchResults.map((card) => (
                            <Card key={card.card_id} className="hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                                        Card: {card.CardNumber}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{card.FirstName} {card.Father_Name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{card.PhoneNumber}</p>
                                <Button
                                    className="w-full"
                                    onClick={() => navigate(`/lab/patient/${card.card_id}`)}
                                >
                                    View History
                                </Button>
                            </Card>
                        ))
                    ) : (
                        hasSearched && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No patients found matching "{searchTerm}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
