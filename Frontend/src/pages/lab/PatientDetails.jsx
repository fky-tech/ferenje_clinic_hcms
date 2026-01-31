import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, FileText, FlaskConical, ChevronDown, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LabResultsModal from '../../components/doctor/LabResultsModal';
import UltrasoundViewModal from '../../components/lab/UltrasoundViewModal';
import VitalsForm from '../../components/doctor/VitalsForm';
import PhysicalExamForm from '../../components/doctor/PhysicalExamForm';
import toast from 'react-hot-toast';

export default function PatientDetails() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [history, setHistory] = useState([]);
    const [labHistory, setLabHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('visits');
    const [expandedVisitId, setExpandedVisitId] = useState(null);
    const [historyData, setHistoryData] = useState({});

    // Modal states
    const [isLabResultsModalOpen, setIsLabResultsModalOpen] = useState(false);
    const [isUltrasoundViewModalOpen, setIsUltrasoundViewModalOpen] = useState(false);
    const [selectedLabRequest, setSelectedLabRequest] = useState(null);
    const [selectedLabResults, setSelectedLabResults] = useState([]);

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
            toast.error('Failed to load patient history');
        } finally {
            setLoading(false);
        }
    };

    const toggleHistoryItem = async (visitId) => {
        if (expandedVisitId === visitId) {
            setExpandedVisitId(null);
        } else {
            setExpandedVisitId(visitId);
            if (!historyData[visitId]) {
                try {
                    const vitalsRes = await api.get(`/visit-vital-signs/visit/${visitId}`);
                    const examRes = await api.get(`/visit-physical-exams/visit/${visitId}`);

                    setHistoryData(prev => ({
                        ...prev,
                        [visitId]: {
                            vitals: vitalsRes.data,
                            physicalExam: examRes.data
                        }
                    }));
                } catch (error) {
                    console.error("Error loading history details", error);
                }
            }
        }
    };

    const handleLabResultsClick = async (labRequest) => {
        try {
            setSelectedLabRequest(labRequest);
            if (labRequest.is_ultrasound) {
                setIsUltrasoundViewModalOpen(true);
            } else {
                const resultsRes = await api.get(`/lab-test-results/request/${labRequest.request_id}`);
                setSelectedLabResults(resultsRes.data);
                setIsLabResultsModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching lab results:', error);
            toast.error('Failed to load lab results');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!card) return <div className="p-6 text-center text-gray-500">Patient not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="secondary" onClick={() => navigate('/lab/search-patient')} size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{card.FirstName} {card.Father_Name}</h1>
                    <p className="text-sm text-gray-500">Card: {card.CardNumber} | Age: {card.Age} | Sex: {card.Sex}</p>
                </div>
            </div>

            <div className="flex space-x-4 border-b">
                <button
                    className={`pb-2 px-4 transition-colors ${activeTab === 'visits' ? 'border-b-2 border-primary-500 font-bold text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('visits')}
                >
                    Visit History
                </button>
                <button
                    className={`pb-2 px-4 transition-colors ${activeTab === 'labs' ? 'border-b-2 border-primary-500 font-bold text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('labs')}
                >
                    Lab History
                </button>
            </div>

            {activeTab === 'visits' && (
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <Card className="text-center py-10">
                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No visit history found.</p>
                        </Card>
                    ) : (
                        history.map((visit) => (
                            <div key={visit.visit_id || visit.VisitRecordID} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleHistoryItem(visit.visit_id || visit.VisitRecordID)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4 text-left">
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <Activity className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{formatDateTime(visit.visit_date || visit.DateOfVisit)}</h3>
                                            <p className="text-xs text-gray-500">Dr. {visit.doctor_first_name} {visit.doctor_last_name}</p>
                                        </div>
                                    </div>
                                    {expandedVisitId === (visit.visit_id || visit.VisitRecordID) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                </button>

                                {expandedVisitId === (visit.visit_id || visit.VisitRecordID) && (
                                    <div className="p-4 border-t bg-gray-50/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-md border text-sm">
                                                <p className="font-semibold text-gray-700 mb-1">Chief Complaint:</p>
                                                <p className="text-gray-600">{visit.ChiefComplaint || 'N/A'}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border text-sm">
                                                <p className="font-semibold text-gray-700 mb-1">Diagnosis:</p>
                                                <p className="text-gray-600 font-medium">{visit.FinalDiagnosis || 'N/A'}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border text-sm">
                                                <p className="font-semibold text-gray-700 mb-1">Advice:</p>
                                                <p className="text-gray-600">{visit.Advice || 'N/A'}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border text-sm col-span-full">
                                                <p className="font-semibold text-gray-700 mb-1">Treatment:</p>
                                                <p className="text-gray-600">{visit.Treatment || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Vitals and Physical Exam */}
                                        <div className="space-y-4">
                                            {historyData[visit.visit_id || visit.VisitRecordID]?.vitals && (() => {
                                                const vitals = historyData[visit.visit_id || visit.VisitRecordID].vitals;
                                                const bpParts = (vitals.BloodPressure || '').split('/');
                                                return (
                                                    <div className="mt-4">
                                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                            <Activity className="w-4 h-4 mr-2" /> Vital Signs
                                                        </h4>
                                                        <VitalsForm data={{
                                                            blood_pressure: vitals.BloodPressure,
                                                            bp_systolic: bpParts[0] || '',
                                                            bp_diastolic: bpParts[1] || '',
                                                            temperature: vitals.temperature,
                                                            pulse_rate: vitals.pulse_rate,
                                                            respiratory_rate: vitals.respiratory_rate,
                                                            oxygen_saturation: vitals.oxygen_saturation,
                                                            weight: vitals.weight,
                                                        }} readOnly />
                                                    </div>
                                                );
                                            })()}

                                            {historyData[visit.visit_id || visit.VisitRecordID]?.physicalExam && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                        <User className="w-4 h-4 mr-2" /> Physical Examination
                                                    </h4>
                                                    <PhysicalExamForm data={{
                                                        general_appearance: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.general_appearance,
                                                        heent: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.heent,
                                                        respiratory_system: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.respiratory_system,
                                                        cvs: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.cvs,
                                                        abdominal_exam: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.abdominal_exam,
                                                        ns: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.ns,
                                                        mss: historyData[visit.visit_id || visit.VisitRecordID].physicalExam.mss
                                                    }} readOnly />
                                                </div>
                                            )}
                                        </div>

                                        {/* Linked Lab Requests for this visit */}
                                        <div className="mt-2 text-sm">
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <FlaskConical className="w-4 h-4 mr-2" /> Linked Lab/Ultrasound
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {labHistory.filter(l => l.VisitRecordID === (visit.visit_id || visit.VisitRecordID)).length > 0 ? (
                                                    labHistory.filter(l => l.VisitRecordID === (visit.visit_id || visit.VisitRecordID)).map(lab => (
                                                        <Button
                                                            key={lab.request_id}
                                                            size="sm"
                                                            variant={lab.is_ultrasound ? 'primary' : 'outline'}
                                                            onClick={() => handleLabResultsClick(lab)}
                                                            className="rounded-full shadow-sm"
                                                        >
                                                            <span>{lab.is_ultrasound ? 'View Ultrasound Report' : `Lab Request #${lab.request_id}`}</span>
                                                            <span className={`w-2 h-2 rounded-full ml-2 ${lab.LabStatus === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                                                        </Button>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 italic">No investigations ordered in this visit.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'labs' && (
                <div className="space-y-4">
                    {labHistory.length === 0 ? (
                        <Card className="text-center py-10">
                            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No lab history found.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {labHistory.map((request) => (
                                <Card
                                    key={request.request_id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleLabResultsClick(request)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${request.is_ultrasound ? 'bg-primary-100' : 'bg-primary-100'}`}>
                                                {request.is_ultrasound ? <Activity className="w-5 h-5 text-primary-600" /> : <FlaskConical className="w-5 h-5 text-primary-600" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{request.is_ultrasound ? 'Ultrasound' : 'Lab Request'} #{request.request_id}</h3>
                                                <p className="text-xs text-gray-500">{formatDateTime(request.RequestDate)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${request.LabStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.LabStatus}
                                        </span>
                                    </div>
                                    <div className="text-xs text-primary-600 font-medium flex justify-end items-center group">
                                        {request.is_ultrasound ? 'View Ultrasound Report' : 'View Full Report'} <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Result Modals */}
            <LabResultsModal
                isOpen={isLabResultsModalOpen}
                onClose={() => {
                    setIsLabResultsModalOpen(false);
                    setSelectedLabRequest(null);
                    setSelectedLabResults([]);
                }}
                labRequest={selectedLabRequest}
                labResults={selectedLabResults}
                patientSex={card?.Sex}
            />

            <UltrasoundViewModal
                isOpen={isUltrasoundViewModalOpen}
                onClose={() => {
                    setIsUltrasoundViewModalOpen(false);
                    setSelectedLabRequest(null);
                }}
                request={selectedLabRequest}
            />
        </div>
    );
}
