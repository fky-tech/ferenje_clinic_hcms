import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, FileText } from 'lucide-react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function PatientDetails() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [history, setHistory] = useState([]);
    const [labHistory, setLabHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('visits');

    useEffect(() => {
        fetchPatientData();
    }, [cardId]);

    const fetchPatientData = async () => {
        try {
            const [cardRes, historyRes, labRes] = await Promise.all([
                api.get(`/cards/${cardId}`),
                api.get(`/patient-visit-records/card/${cardId}`),
                api.get(`/lab-requests/card/${cardId}`)
            ]);
            setCard(cardRes.data);
            setHistory(historyRes.data);
            setLabHistory(labRes.data);
        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!card) return <div>Patient not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="secondary" onClick={() => navigate('/lab/search-patient')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{card.FirstName} {card.Father_Name}</h1>
                    <p className="text-sm text-gray-500">Card: {card.CardNumber} | Age: {card.Age} | Sex: {card.Sex}</p>
                </div>
            </div>

            <div className="flex space-x-4 border-b">
                <button
                    className={`pb-2 px-4 ${activeTab === 'visits' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('visits')}
                >
                    Visit History
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'labs' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('labs')}
                >
                    Lab History
                </button>
            </div>

            {activeTab === 'visits' && (
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-gray-500">No visit history found.</p>
                    ) : (
                        history.map((visit) => (
                            <Card key={visit.visit_id || visit.VisitRecordID}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold flex items-center">
                                        <Activity className="w-4 h-4 mr-2 text-blue-500" />
                                        {formatDateTime(visit.visit_date || visit.DateOfVisit)}
                                    </h3>
                                    <span className="text-sm text-gray-500">Dr. {visit.doctor_first_name} {visit.doctor_last_name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                    <div>
                                        <p className="font-medium text-gray-700">Diagnosis:</p>
                                        <p>{visit.FinalDiagnosis || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Treatment:</p>
                                        <p>{visit.Treatment || 'N/A'}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'labs' && (
                <div className="space-y-4">
                    {labHistory.length === 0 ? (
                        <p className="text-gray-500">No lab history found.</p>
                    ) : (
                        labHistory.map((request) => (
                            <Card key={request.request_id}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-purple-500" />
                                        {formatDateTime(request.RequestDate)}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${request.LabStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {request.LabStatus}
                                    </span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
