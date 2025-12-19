import { useState, useEffect } from 'react';
import { CreditCard, Activity, Calendar, RefreshCw, Search } from 'lucide-react';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { API_ROUTES, PAYMENT_TYPES } from '../../utils/constants';
import { formatDate, getCardExpiryDate, formatForAPI } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ViewCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renewLoading, setRenewLoading] = useState(false);
    const [renewalFee, setRenewalFee] = useState(100);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await api.get(API_ROUTES.CARDS);
            setCards(response.data);
        } catch (error) {
            console.error('Error fetching cards:', error);
            toast.error("Failed to load cards");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (card) => {
        setSelectedCard(card);
        setRenewalFee(100);
        setIsModalOpen(true);
    };

    const handleRenew = async () => {
        if (!selectedCard) return;
        setRenewLoading(true);
        try {
            await api.post(API_ROUTES.PAYMENTS, {
                card_id: selectedCard.card_id,
                amount: renewalFee,
                billing_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                description: 'Card Renewal Fee',
                payment_type: PAYMENT_TYPES.CARD_RENEWAL,
                status: 'paid'
            });

            const newExpiry = formatForAPI(getCardExpiryDate());
            await api.put(`${API_ROUTES.CARDS}/${selectedCard.card_id}`, {
                ...selectedCard,
                status: 'Active',
                expire_date: newExpiry,
            });

            toast.success('Card renewed successfully');
            setIsModalOpen(false);
            fetchCards();
        } catch (error) {
            console.error('Error renewing card:', error);
            toast.error('Failed to renew card');
        } finally {
            setRenewLoading(false);
        }
    };

    // Helper to format card number with spaces for better readability
    const formatCardNumber = (num) => {
        return num ? num.toString().replace(/\d{4}(?=.)/g, '$& ') : '**** **** **** ****';
    };

    const filteredCards = cards.filter(card => 
        card.CardNumber?.toString().includes(searchQuery) || 
        card.FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.Father_Name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Cards</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage active and expired patient identification cards
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name or card #..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards Grid - Increased columns and added max-w-sm to make cards smaller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                    <div 
                        key={card.card_id || card.id} 
                        onClick={() => handleViewDetails(card)}
                        className="group relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl select-none"
                    >
                        {/* Main Card Design */}
                        <div className="absolute inset-0 bg-[#ffffff] rounded-xl p-5 flex flex-col justify-between shadow-lg overflow-hidden border border-slate-700/50">
                            
                            {/* Decorative Wave/Pulse */}
                            <div className="absolute right-4 top-2 opacity-70">
                                <Activity className="w-12 h-12 text-blue-900" />
                            </div>

                            {/* Top: Header */}
                            <div className="z-10">
                                <span className="text-slate-600 text-[10px] font-bold tracking-[0.15em] uppercase block mb-4">
                                    Medical Card
                                </span>
                                
                                {/* Card Number */}
                                <div className="font-mono text-lg sm:text-xl text-slate-900 tracking-widest drop-shadow-sm truncate">
                                    {formatCardNumber(card.CardNumber)}
                                </div>
                            </div>

                            {/* Middle: Card Holder Name (Now Visible) */}
                            <div className="z-10 mt-auto mb-3">
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                    Card Holder
                                </div>
                                <div className="text-slate-900 font-medium tracking-wide text-sm sm:text-base truncate uppercase">
                                    {card.FirstName} {card.Father_Name}
                                </div>
                            </div>

                            {/* Bottom: Dates - UPDATED: Using formatDate function */}
                            <div className="flex justify-between items-end z-10 border-t border-white/10 pt-2">
                                <div>
                                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                        Issued
                                    </div>
                                    <div className="text-slate-900 font-mono text-xs">
                                        {formatDate(card.issue_date)} {/* Changed here */}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                        Expires
                                    </div>
                                    <div className="text-slate-900 font-mono text-xs">
                                        {formatDate(card.expire_date)} {/* Changed here */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expired Overlay */}
                        {card.status !== 'Active' && (
                            <div className="absolute inset-0 z-20 rounded-xl bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 border border-white/50">
                                    EXPIRED
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
           <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="Card Details"
    maxWidth="md"
>
    {selectedCard && (
        <div className="space-y-6">
            {/* Card Preview in Modal */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                        selectedCard.status === 'Active' 
                            ? 'bg-blue-100 text-blue-700 border-gray-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                        {selectedCard.status}
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                        selectedCard.status === 'Active' 
                            ? 'bg-gradient-to-br from-blue-500 to-gray-600' 
                            : 'bg-gradient-to-br from-red-500 to-orange-600'
                    }`}>
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{selectedCard.FirstName} {selectedCard.Father_Name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Card Holder</p>
                    </div>
                </div>
                
                <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/90">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                        Card Number
                    </div>
                    <div className="font-mono text-xl text-gray-900 tracking-wider font-bold">
                        {formatCardNumber(selectedCard.CardNumber)}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Issue Date</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="text-sm text-gray-500">Date Issued</div>
                        <div className="text-gray-900 font-semibold mt-1">
                            {formatDate(selectedCard.issue_date)}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className={`w-4 h-4 ${
                            selectedCard.status === 'Expired' ? 'text-red-500' : 'text-blue-500'
                        }`} />
                        <span className="font-medium">Expiry Date</span>
                    </div>
                    <div className={`rounded-lg p-3 border ${
                        selectedCard.status === 'Expired' 
                            ? 'bg-red-50 border-red-100' 
                            : 'bg-blue-50 border-green-100'
                    }`}>
                        <div className={`text-sm ${
                            selectedCard.status === 'Expired' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                            {selectedCard.status === 'Expired' ? 'Expired On' : 'Valid Until'}
                        </div>
                        <div className={`font-semibold mt-1 ${
                            selectedCard.status === 'Expired' ? 'text-red-700' : 'text-blue-700'
                        }`}>
                            {formatDate(selectedCard.expire_date)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Renewal Section */}
            {selectedCard.status === 'Expired' && (
                <div className="rounded-2xl overflow-hidden border border-blue-200">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <RefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">Renew Card</h4>
                                <p className="text-blue-100 text-sm">Reactivate this card by processing the renewal fee</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>Renewal Fee</span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">ETB</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={renewalFee}
                                    onChange={(e) => setRenewalFee(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    min="0"
                                    step="1"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    Birr
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Payment will be recorded and the card will be reactivated immediately
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                >
                    Close
                </Button>
                {selectedCard.status === 'Expired' && (
                    <Button
                        variant="primary"
                        onClick={handleRenew}
                        disabled={renewLoading || !renewalFee}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                    >
                        {renewLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Pay & Renew Now
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    )}
</Modal> 
      </div>
    );
}