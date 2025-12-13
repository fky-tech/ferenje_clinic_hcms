import { useState, useEffect } from 'react';
import { CreditCard, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatDate, getFullName, formatCurrency } from '../../utils/helpers';

export default function ViewCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const columns = [
        { header: 'Card Number', accessor: 'CardNumber' },
        { header: 'Patient Name', render: (row) => `${row.FirstName || ''} ${row.Father_Name || ''}` },
        {
            header: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' :
                    row.status === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Issue Date', render: (row) => formatDate(row.issue_date) },
        { header: 'Expiry Date', render: (row) => formatDate(row.expire_date) },
        {
            header: 'Actions', render: (row) => (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleViewDetails(row)}
                >
                    View Details
                </Button>
            )
        },
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">View Cards</h1>
                <p className="text-gray-500 mt-1">Manage patient cards and payments</p>
            </div>

            <Card title={`Total Cards: ${cards.length}`} icon={CreditCard}>
                <Table columns={columns} data={cards} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Card Details"
            >
                {selectedCard && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedCard.FirstName} {selectedCard.Father_Name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Card Number</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedCard.CardNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Status</label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCard.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    selectedCard.status === 'Expired' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {selectedCard.status}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Issue Date</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCard.issue_date)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Expiry Date</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCard.expire_date)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
