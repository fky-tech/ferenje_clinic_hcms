
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, FileText, FlaskConical, Save, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EthiopianDatePicker from '../../components/common/EthiopianDatePicker';
import VitalsForm from '../../components/doctor/VitalsForm';
import PhysicalExamForm from '../../components/doctor/PhysicalExamForm';
import ClinicalNotesForm from '../../components/doctor/ClinicalNotesForm';
import LabRequestModal from '../../components/doctor/LabRequestModal';
import InvestigationModal from '../../components/doctor/InvestigationModal';
import InvestigationHistoryModal from '../../components/doctor/InvestigationHistoryModal';
import AddAppointmentModal from '../../components/doctor/AddAppointmentModal';
import LabResultsModal from '../../components/doctor/LabResultsModal';
import ReportModal from '../../components/doctor/ReportModal';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { getStoredUser, formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { useNotifications } from '../../contexts/NotificationContext';

export default function DoctorPatientDetails() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const user = getStoredUser();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('clinical');
    const [historyDateFilter, setHistoryDateFilter] = useState('');

    const [visitId, setVisitId] = useState(null);
    const [clinicalNotes, setClinicalNotes] = useState({ ChiefComplaint: '', HPI: '', UrgentAttention: false });
    const [vitals, setVitals] = useState({});
    const [physicalExam, setPhysicalExam] = useState({}); // Fixed syntax
    const [investigation, setInvestigation] = useState({ FinalDiagnosis: '', Advice: '', Treatment: '' });

    const [isLabModalOpen, setIsLabModalOpen] = useState(false);
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isInvestigationHistoryModalOpen, setIsInvestigationHistoryModalOpen] = useState(false);
    const [selectedVisitForInvestigation, setSelectedVisitForInvestigation] = useState(null);
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isLabResultsModalOpen, setIsLabResultsModalOpen] = useState(false);
    const [selectedLabRequest, setSelectedLabRequest] = useState(null);
    const [selectedLabResults, setSelectedLabResults] = useState([]);

    const [history, setHistory] = useState([]);
    const [labResults, setLabResults] = useState([]);

    const handleSaveInvestigation = (data) => {
        setInvestigation({
            FinalDiagnosis: data.FinalDiagnosis, // Corrected keys
            Advice: data.Advice,
            Treatment: data.Treatment
        });
        setIsInvestModalOpen(false);
    };

    const handleSelectVisitForInvestigation = (visit) => {
        setSelectedVisitForInvestigation(visit);
        setIsInvestigationHistoryModalOpen(false);
        setIsInvestModalOpen(true);
    };

    const handleSaveInvestigationForPastVisit = async (data) => {
        try {
            // Must include all required fields from the visit to avoid null constraint errors
            const visitDate = selectedVisitForInvestigation.visit_date || selectedVisitForInvestigation.DateOfVisit;
            // Format date to YYYY-MM-DD for MySQL DATE column
            const formattedDate = visitDate ? new Date(visitDate).toISOString().slice(0, 10) : null;

            const updatePayload = {
                card_id: selectedVisitForInvestigation.card_id,
                doctor_id: selectedVisitForInvestigation.doctor_id || selectedVisitForInvestigation.doctorID,
                visit_date: formattedDate,
                ChiefComplaint: selectedVisitForInvestigation.ChiefComplaint,
                HPI: selectedVisitForInvestigation.HPI,
                UrgentAttention: selectedVisitForInvestigation.UrgentAttention ? 1 : 0,
                FinalDiagnosis: data.FinalDiagnosis,
                Advice: data.Advice,
                Treatment: data.Treatment
            };

            await api.put(`/patient-visit-records/${data.visitId}`, updatePayload);
            toast.success("Investigation updated successfully");
            setIsInvestModalOpen(false);
            setSelectedVisitForInvestigation(null);
            fetchPatientData();
        } catch (error) {
            console.error("Error updating investigation:", error);
            toast.error("Failed to update investigation");
        }
    };
    const [expandedVisitId, setExpandedVisitId] = useState(null);
    const [historyData, setHistoryData] = useState({});

    useEffect(() => {
        fetchPatientData();
    }, [cardId]);

    const fetchPatientData = async () => {
        try {
            const cardRes = await api.get(`${API_ROUTES.CARDS}/${cardId}`);
            setCard(cardRes.data);

            const historyRes = await api.get(`/patient-visit-records/card/${cardId}`);
            setHistory(historyRes.data);

            const labRes = await api.get(`${API_ROUTES.LAB_REQUESTS}/card/${cardId}`);
            setLabResults(labRes.data);

        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Failed to load patient data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveVisit = async () => {
        const toastId = toast.loading("Saving visit data...");
        try {
            let currentVisitId = visitId;
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 10);
            const formattedTime = now.toTimeString().slice(0, 8);

            const visitPayload = {
                card_id: cardId,
                doctor_id: user.person_id || user.id,
                visit_date: formattedDate,
                visit_time: formattedTime,
                visit_type: 'OPD',
                // Using PascalCase for new fields to match model expectations
                ChiefComplaint: clinicalNotes.ChiefComplaint || 'Follow-up', // Default to 'Follow-up' if empty? Or just allow null if DB allows.
                HPI: clinicalNotes.HPI || '',
                UrgentAttention: clinicalNotes.UrgentAttention ? 1 : 0,
                FinalDiagnosis: investigation.FinalDiagnosis || '',
                Advice: investigation.Advice || '',
                Treatment: investigation.Treatment || ''
            };

            if (currentVisitId) {
                console.log('Updating visit:', currentVisitId, visitPayload);
                await api.put(`${API_ROUTES.PATIENT_VISIT_RECORDS}/${currentVisitId}`, visitPayload);
            } else {
                console.log('Creating new visit:', visitPayload);
                const res = await api.post(API_ROUTES.PATIENT_VISIT_RECORDS, visitPayload);
                currentVisitId = res.data.insertId || res.data.visit_id;
                console.log('Created visit ID:', currentVisitId);
                setVisitId(currentVisitId);
            }

            const vitalsPayload = { ...vitals, visit_id: currentVisitId };
            console.log('Saving vitals:', vitalsPayload);
            if (vitals.vital_sign_id) {
                await api.put(`/visit-vital-signs/${vitals.vital_sign_id}`, vitalsPayload);
            } else {
                const res = await api.post('/visit-vital-signs', vitalsPayload);
                setVitals(prev => ({ ...prev, vital_sign_id: res.data.insertId }));
            }

            const examPayload = { ...physicalExam, visit_id: currentVisitId };
            console.log('Saving exam:', examPayload);
            if (physicalExam.physical_exam_id) {
                await api.put(`/visit-physical-exams/${physicalExam.physical_exam_id}`, examPayload);
            } else {
                const res = await api.post('/visit-physical-exams', examPayload);
                setPhysicalExam(prev => ({ ...prev, physical_exam_id: res.data.insertId }));
            }

            toast.success("Visit saved successfully", { id: toastId });

            // Post-consultation workflow: Complete appointment and Remove from queue
            try {
                // 1. Handle Appointment
                const apptsRes = await api.get(API_ROUTES.APPOINTMENTS);
                const activeAppt = apptsRes.data.find(a =>
                    a.card_id == cardId &&
                    a.doctor_id == (user.person_id || user.id) &&
                    a.status === 'scheduled'
                );
                if (activeAppt) {
                    await api.put(`${API_ROUTES.APPOINTMENTS}/${activeAppt.appointment_id}`, {
                        ...activeAppt,
                        status: 'completed'
                    });
                }

                // 2. Handle Queue
                const queueRes = await api.get(API_ROUTES.QUEUES);
                const activeQueue = queueRes.data.find(q =>
                    q.card_id == cardId &&
                    q.doctor_id == (user.person_id || user.id) &&
                    q.status !== 'completed'
                );
                if (activeQueue) {
                    // Update to completed or delete? User said "remove from... queue table". 
                    // Usually safer to set status unless explicitly told to HARD delete.
                    // But "remove from... queue table" often implies delete.
                    // However, I'll update it to 'completed' first as it's more standard for audit.
                    // Wait, requirement says "(and queue table)".
                    // I will DELETE it from the queue table as requested.
                    await api.delete(`${API_ROUTES.QUEUES}/${activeQueue.queue_id}`);
                }
            } catch (workflowError) {
                console.error("Workflow update error:", workflowError);
                // Don't block the main success toast as the visit itself was saved
            }

            fetchPatientData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save visit", { id: toastId });
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
            // Fetch test results for this lab request
            const resultsRes = await api.get(`/lab-test-results/request/${labRequest.request_id}`);
            setSelectedLabResults(resultsRes.data);
            setIsLabResultsModalOpen(true);
        } catch (error) {
            console.error('Error fetching lab results:', error);
            toast.error('Failed to load lab results');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!card) return <div>Patient not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="secondary" onClick={() => navigate('/doctor/patients')}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{card.FirstName} {card.Father_Name}</h1>
                        <p className="text-sm text-gray-500">Card: {card.CardNumber} | Age: {card.Age} | Sex: {card.Sex}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {activeTab === 'clinical' && (
                        <>
                            <Button variant="primary" onClick={handleSaveVisit}>
                                <Save className="w-4 h-4 mr-2" /> Save Visit
                            </Button>
                            <Button onClick={() => {
                                if (!visitId) {
                                    toast.error("Please save the current visit first before ordering labs.");
                                    return;
                                }
                                setIsLabModalOpen(true);
                            }}>
                                <FlaskConical className="w-4 h-4 mr-2" /> Order Lab
                            </Button>
                            <Button onClick={() => setIsInvestigationHistoryModalOpen(true)}>
                                <FileText className="w-4 h-4 mr-2" /> Investigation
                            </Button>
                            <Button variant="secondary" onClick={() => setIsReportModalOpen(true)}>
                                <FileText className="w-4 h-4 mr-2" /> Report
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-2">
                    <Card>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('clinical')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'clinical' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Activity className="mr-3 h-5 w-5" /> Clinical Visit
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FileText className="mr-3 h-5 w-5" /> Visit History
                            </button>
                            <button
                                onClick={() => setActiveTab('labs')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'labs' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FlaskConical className="mr-3 h-5 w-5" /> Lab Results
                            </button>
                        </nav>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'clinical' && (
                        <>
                            <div className="flex justify-end -mb-6"></div>

                            <ClinicalNotesForm
                                data={clinicalNotes}
                                onChange={(e) => setClinicalNotes({ ...clinicalNotes, [e.target.name]: e.target.value })}
                            />
                            <VitalsForm
                                data={vitals}
                                onChange={(e) => setVitals({ ...vitals, [e.target.name]: e.target.value })}
                            />
                            <PhysicalExamForm
                                data={physicalExam}
                                onChange={(e) => setPhysicalExam({ ...physicalExam, [e.target.name]: e.target.value })}
                            />
                        </>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="mb-4 w-64">
                                <EthiopianDatePicker
                                    label="Filter by Date"
                                    value={historyDateFilter}
                                    onChange={(e) => setHistoryDateFilter(e.target.value)}
                                />
                            </div>

                            {history.filter(h => {
                                if (!historyDateFilter) return true;
                                // MySQL returns dates as 'YYYY-MM-DD' strings, extract that portion
                                const visitDate = h.visit_date ? String(h.visit_date).split('T')[0] : '';
                                return visitDate === historyDateFilter;
                            }).length === 0 ? <p className="text-gray-500">No previous visits found</p> : (
                                history
                                    .filter(h => {
                                        if (!historyDateFilter) return true;
                                        const visitDate = h.visit_date ? String(h.visit_date).split('T')[0] : '';
                                        return visitDate === historyDateFilter;
                                    })
                                    .map(visit => (
                                        <div key={visit.visit_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => toggleHistoryItem(visit.visit_id)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">{formatDateTime(visit.visit_date)}</div>
                                                    <div className="text-sm text-gray-600">Dr. {visit.doctor_first_name}</div>
                                                    {visit.ChiefComplaint && <div className="text-xs text-gray-500 mt-1">CC: {visit.ChiefComplaint}</div>}
                                                </div>
                                                {expandedVisitId === visit.visit_id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                            </button>

                                            {expandedVisitId === visit.visit_id && (
                                                <div className="p-4 border-t bg-white space-y-6">
                                                    <div>
                                                        <ClinicalNotesForm data={{
                                                            ChiefComplaint: visit.ChiefComplaint,
                                                            HPI: visit.HPI,
                                                            UrgentAttention: visit.UrgentAttention === 1
                                                        }} readOnly />

                                                        {historyData[visit.visit_id]?.vitals && (
                                                            <div className="mt-4">
                                                                <h4 className="font-medium mb-2">Vital Signs</h4>
                                                                <VitalsForm data={{
                                                                    bp_systolic: historyData[visit.visit_id].vitals.bp_systolic,
                                                                    bp_diastolic: historyData[visit.visit_id].vitals.bp_diastolic,
                                                                    temperature: historyData[visit.visit_id].vitals.temperature,
                                                                    pulse_rate: historyData[visit.visit_id].vitals.pulse_rate,
                                                                    respiratory_rate: historyData[visit.visit_id].vitals.respiratory_rate,
                                                                    oxygen_saturation: historyData[visit.visit_id].vitals.oxygen_saturation,
                                                                    weight: historyData[visit.visit_id].vitals.weight,
                                                                }} readOnly />
                                                            </div>
                                                        )}

                                                        {historyData[visit.visit_id]?.physicalExam && (
                                                            <div className="mt-4">
                                                                <h4 className="font-medium mb-2">Physical Examination</h4>
                                                                <PhysicalExamForm data={{
                                                                    general_appearance: historyData[visit.visit_id].physicalExam.general_appearance,
                                                                    heent: historyData[visit.visit_id].physicalExam.heent,
                                                                    respiratory_system: historyData[visit.visit_id].physicalExam.respiratory_system,
                                                                    cvs: historyData[visit.visit_id].physicalExam.cvs,
                                                                    abdominal_exam: historyData[visit.visit_id].physicalExam.abdominal_exam,
                                                                    ns: historyData[visit.visit_id].physicalExam.ns,
                                                                    mss: historyData[visit.visit_id].physicalExam.mss
                                                                }} readOnly />
                                                            </div>
                                                        )}

                                                        <div className="mt-4">
                                                            <h4 className="font-medium">Diagnosis & Plan</h4>
                                                            <p className="text-sm"><strong>Diagnosis:</strong> {visit.FinalDiagnosis || '-'}</p>
                                                            <p className="text-sm"><strong>Advice:</strong> {visit.Advice || '-'}</p>
                                                            <p className="text-sm"><strong>Treatment:</strong> {visit.Treatment || '-'}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Labs</h3>
                                                        <div className="space-y-2">
                                                            {labResults.filter(l => {
                                                                if (!l.RequestDate || !visit.visit_date) return false;
                                                                const labDate = String(l.RequestDate).split('T')[0];
                                                                const visitDate = String(visit.visit_date).split('T')[0];
                                                                return labDate === visitDate;
                                                            }).length > 0 ? (
                                                                labResults.filter(l => {
                                                                    if (!l.RequestDate || !visit.visit_date) return false;
                                                                    const labDate = String(l.RequestDate).split('T')[0];
                                                                    const visitDate = String(visit.visit_date).split('T')[0];
                                                                    return labDate === visitDate;
                                                                }).map(lab => (
                                                                    <div key={lab.request_id} className="text-sm border p-2 rounded">
                                                                        #{lab.request_id} - {lab.LabStatus}
                                                                    </div>
                                                                ))
                                                            ) : <p className="text-sm text-gray-500">No labs for this visit</p>}
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
                        <Card title="Lab Requests History">
                            <div className="space-y-4">
                                {labResults.length === 0 ? <p className="text-gray-500">No lab requests</p> : (
                                    labResults.map(lab => (
                                        <div
                                            key={lab.request_id}
                                            className="border p-3 rounded-md flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleLabResultsClick(lab)}
                                        >
                                            <div>
                                                <p className="font-medium">Request #{lab.request_id}</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(lab.RequestDate)}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${lab.LabStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {lab.LabStatus}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <LabRequestModal
                isOpen={isLabModalOpen}
                onClose={() => setIsLabModalOpen(false)}
                cardId={cardId}
                doctorId={user.person_id || user.id}
                visitId={visitId}
                onSuccess={() => {
                    fetchPatientData();
                    setIsLabModalOpen(false);
                }}
            />


            <InvestigationHistoryModal
                isOpen={isInvestigationHistoryModalOpen}
                onClose={() => setIsInvestigationHistoryModalOpen(false)}
                visitHistory={history}
                onSelectVisit={handleSelectVisitForInvestigation}
            />

            <InvestigationModal
                isOpen={isInvestModalOpen}
                onClose={() => {
                    setIsInvestModalOpen(false);
                    setSelectedVisitForInvestigation(null);
                }}
                visitData={selectedVisitForInvestigation || investigation}
                onSave={selectedVisitForInvestigation ? handleSaveInvestigationForPastVisit : handleSaveInvestigation}
                onAddAppointment={() => {
                    setIsInvestModalOpen(false);
                    setIsApptModalOpen(true);
                }}
            />

            <AddAppointmentModal
                isOpen={isApptModalOpen}
                onClose={() => setIsApptModalOpen(false)}
                cardId={cardId}
                doctorId={user.person_id}
                onSuccess={fetchPatientData}
            />

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

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                patientData={card}
                doctorId={user.person_id || user.id}
                visitId={visitId}
            />
        </div>
    );
}
