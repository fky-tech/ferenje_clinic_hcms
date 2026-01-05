import { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import EthiopianDatePicker from '../common/EthiopianDatePicker';
import api from '../../api/axios';
import { API_ROUTES } from '../../utils/constants';
import { formatToEthiopian } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function FamilyPlanningModal({ isOpen, onClose, cardId, appointmentId }) {
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [fpCard, setFpCard] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);

    // For visits
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [visitFormData, setVisitFormData] = useState({});
    const [visitHistory, setVisitHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedHistoryVisit, setSelectedHistoryVisit] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, cardRes, visitRes] = await Promise.all([
                api.get(API_ROUTES.FAMILY_PLANNING.CATEGORIES),
                api.get(API_ROUTES.FAMILY_PLANNING.CARD(cardId)),
                api.get(API_ROUTES.FAMILY_PLANNING.VISITS(cardId))
            ]);

            setCategories(catRes.data);
            setFpCard(cardRes.data);
            setVisitHistory(visitRes.data);

            if (cardRes.data) {
                setFormData(cardRes.data);
                setPage(3);
            } else {
                setFormData({ card_id: cardId, appointment_id: appointmentId || 0 });
                setPage(1);
            }
        } catch (error) {
            console.error('Error fetching FP data:', error);
            toast.error('Failed to load family planning data');
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (page < 3) {
            setPage(prev => prev + 1);
            setTimeout(scrollToTop, 100);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
            setTimeout(scrollToTop, 100);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleVisitInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVisitFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const cleanData = (data) => {
        const cleaned = { ...data };
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === '') {
                cleaned[key] = null;
            }
        });
        return cleaned;
    };

    const handleCardSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.card_id) {
            toast.error("Missing Card ID");
            return;
        }

        setSubmitting(true);
        try {
            const payload = cleanData({
                ...formData,
                appointment_id: formData.appointment_id || appointmentId || null
            });

            if (fpCard) {
                await api.put(API_ROUTES.FAMILY_PLANNING.UPDATE_CARD(fpCard.id), payload);
                toast.success('Family planning card updated');
            } else {
                await api.post(API_ROUTES.FAMILY_PLANNING.CREATE_CARD, payload);
                toast.success('Family planning card created');
                const cardRes = await api.get(API_ROUTES.FAMILY_PLANNING.CARD(cardId));
                setFpCard(cardRes.data);
            }
            setPage(3);
        } catch (error) {
            console.error('Error saving FP card:', error);
            toast.error(error.response?.data?.error || 'Failed to save family planning card');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVisitSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = cleanData({
                ...visitFormData,
                card_id: cardId,
                appointment_id: appointmentId || null
            });
            await api.post(API_ROUTES.FAMILY_PLANNING.CREATE_VISIT, payload);
            toast.success('Visit entry saved');
            setIsVisitModalOpen(false);
            setVisitFormData({});
            const visitRes = await api.get(API_ROUTES.FAMILY_PLANNING.VISITS(cardId));
            setVisitHistory(visitRes.data);
        } catch (error) {
            console.error('Error saving FP visit:', error);
            toast.error('Failed to save visit entry');
        } finally {
            setSubmitting(false);
        }
    };

    const groupedFields = categories.reduce((acc, curr) => {
        if (!acc[curr.category_name]) acc[curr.category_name] = [];
        acc[curr.category_name].push(curr.field_name);
        return acc;
    }, {});

    const categoryOrder = [
        'Demographics',
        'Gynecological History',
        'Past Medical / Surgical',
        'Physical Examination',
        'Speculum / Pelvic Exam',
        'Family Planning',
        'SA / PAC',
        'MA',
        'MVA',
        'Post-Procedure Vitals',
        'Post Procedure'
    ];

    const pages = [
        categoryOrder.slice(0, 4),
        categoryOrder.slice(4, 8),
        categoryOrder.slice(8)
    ];

    const renderField = (fieldName, isVisit = false, readOnly = false, customData = null) => {
        let value;
        if (customData) {
            value = customData[fieldName] ?? '';
        } else {
            value = isVisit ? (visitFormData[fieldName] ?? '') : (formData[fieldName] ?? '');
        }

        const onChange = isVisit ? handleVisitInputChange : handleInputChange;

        if (fieldName.includes('date') || fieldName === 'lmp') {
            return (
                <EthiopianDatePicker
                    key={fieldName}
                    label={fieldName.replace(/_/g, ' ').toUpperCase()}
                    value={value || ''}
                    disabled={readOnly}
                    onChange={(e) => !readOnly && onChange({ target: { name: fieldName, value: e.target.value } })}
                />
            );
        }

        if (['gravida', 'para', 'living_children', 'pulse_rate', 'respiratory_rate', 'duration_of_period', 'mva_pain_score'].includes(fieldName) || fieldName.includes('_pr') || fieldName.includes('_rr')) {
            return <Input key={fieldName} type="number" readOnly={readOnly} label={fieldName.replace(/_/g, ' ').toUpperCase()} name={fieldName} value={value || ''} onChange={onChange} />;
        }

        if (['temperature', 'weight'].includes(fieldName) || fieldName.includes('temp')) {
            return <Input key={fieldName} type="number" step="0.1" readOnly={readOnly} label={fieldName.replace(/_/g, ' ').toUpperCase()} name={fieldName} value={value || ''} onChange={onChange} />;
        }

        if (['abortions', 'stillbirths', 'breastfeeding', 'inter_menstrual_bleeding', 'postcoital_bleeding', 'dyspareunia', 'varicose_veins', 'jaundice', 'hypertension', 'diabetes', 'severe_chest_pain', 'severe_headache', 'allergies', 'ever_used_contraception', 'lafp_removal', 'lidocaine_used', 'mva_paracervical_block', 'tissue_inspection_done', 'post_procedure_counseling', 'complications'].includes(fieldName)) {
            return (
                <div key={fieldName} className="flex items-center space-x-2 py-2">
                    <input type="checkbox" disabled={readOnly} name={fieldName} checked={value == 1} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label className="text-sm font-medium text-gray-700">{fieldName.replace(/_/g, ' ').toUpperCase()}</label>
                </div>
            );
        }

        const enumOptions = {
            marital_status: ['single', 'married', 'divorced', 'widowed'],
            menstrual_cycle: ['regular', 'irregular'],
            loss: ['light', 'moderate', 'heavy'],
            discharge: ['normal', 'abnormal'],
            pelvic_discharge: ['normal', 'abnormal'],
            heent: ['normal', 'abnormal'],
            breast: ['normal', 'abnormal'],
            abdomen: ['normal', 'abnormal'],
            lower_limb: ['normal', 'abnormal'],
            vulva: ['normal', 'abnormal'],
            vagina: ['normal', 'abnormal'],
            cervix: ['closed', 'open'],
            uterine_position: ['anteverted', 'retroverted'],
            uterine_mobility: ['mobile', 'not_mobile'],
            adnexa: ['normal', 'abnormal'],
            fp_method: ['Implanon Classic', 'Implanon NXT', 'Jadelle', 'Sino-Implant'],
            implant_insertion_site: ['Right arm', 'Left arm'],
            oral_pills: ['COC', 'POP'],
            condom_type: ['Male', 'Female'],
            sa_service_type: ['MA', 'MVA'],
            sa_reason: ['Rape', 'Incest', 'Maternal condition', 'Fetal deformity', 'Other'],
            pac_reason: ['Incomplete abortion', 'Inevitable', 'Missed', 'Other'],
            finding_sac: ['present', 'absent'],
            finding_villi: ['present', 'absent']
        };

        if (enumOptions[fieldName]) {
            return (
                <div key={fieldName} className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{fieldName.replace(/_/g, ' ')}</label>
                    <select disabled={readOnly} name={fieldName} value={value || ''} onChange={onChange} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:border-blue-500 outline-none">
                        <option value="">Select...</option>
                        {enumOptions[fieldName].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            );
        }

        if (fieldName.includes('note') || fieldName.includes('details') || fieldName.includes('finding') || fieldName.includes('remark') || fieldName.includes('reason') || fieldName === 'other_illness_or_operation' || fieldName === 'complaints_examination_treatment') {
            return (
                <div key={fieldName} className="w-full">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{fieldName.replace(/_/g, ' ')}</label>
                    <textarea readOnly={readOnly} name={fieldName} value={value || ''} onChange={onChange} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:border-blue-500 outline-none h-24" />
                </div>
            );
        }

        return <Input key={fieldName} readOnly={readOnly} label={fieldName.replace(/_/g, ' ').toUpperCase()} name={fieldName} value={value || ''} onChange={onChange} />;
    };

    if (loading) return <Modal isOpen={isOpen} onClose={onClose} title="Family Planning"><div className="p-8"><LoadingSpinner /></div></Modal>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Family Planning" width="max-w-4xl">
            <div className="flex flex-col h-[80vh]">
                <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-blue-800">Card ID: {cardId}</h3>
                        <p className="text-xs text-blue-600">Family Planning History</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="secondary" onClick={() => { setShowHistory(!showHistory); setSelectedHistoryVisit(null); }}>
                            {showHistory ? 'Close History' : 'View History'}
                        </Button>
                        <Button variant="primary" onClick={() => setIsVisitModalOpen(true)}>Add Visit</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
                    {showHistory ? (
                        selectedHistoryVisit ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="font-bold text-gray-900 text-lg">Visit Details ({formatToEthiopian(selectedHistoryVisit.date_of_visit)})</h3>
                                    <Button size="sm" variant="secondary" onClick={() => setSelectedHistoryVisit(null)}>Back to History</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'date_of_visit', 'lmp', 'bp', 'weight',
                                        'contraceptive_method_type', 'contraceptive_quantity',
                                        'batch_no', 'expiry_date', 'client_type_revisit',
                                        'client_type_method_switcher'
                                    ].map(f => renderField(f, true, true, selectedHistoryVisit))}
                                </div>
                                <div className="space-y-4">
                                    {renderField('complaints_examination_treatment', true, true, selectedHistoryVisit)}
                                    {renderField('reason_for_method_switch', true, true, selectedHistoryVisit)}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Visit History</h3>
                                {visitHistory.length === 0 ? <p className="text-gray-500 italic">No previous visits recorded.</p> : (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {visitHistory.map(v => (
                                                    <tr key={v.id}>
                                                        <td className="px-4 py-2 text-sm">{formatToEthiopian(v.date_of_visit)}</td>
                                                        <td className="px-4 py-2 text-sm">{v.contraceptive_method_type} ({v.contraceptive_quantity})</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <Button size="sm" variant="outline" onClick={() => setSelectedHistoryVisit(v)}>View Details</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="space-y-8">
                            {pages[page - 1].map(catName => (
                                <div key={catName} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 border-b pb-1">{catName}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {groupedFields[catName]?.map(field => renderField(field))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-6 border-t mt-8">
                                {page > 1 ? (
                                    <Button variant="secondary" onClick={handlePrev}>Previous</Button>
                                ) : <div />}

                                <div className="flex space-x-2">
                                    {page < 3 ? (
                                        <Button variant="primary" onClick={handleNext}>Next</Button>
                                    ) : (
                                        <Button variant="success" onClick={handleCardSubmit} disabled={submitting}>
                                            {submitting ? 'Saving...' : 'Save FP Card'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isVisitModalOpen} onClose={() => setIsVisitModalOpen(false)} title="Add Family Planning Visit">
                <form onSubmit={handleVisitSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'date_of_visit', 'lmp', 'bp', 'weight',
                            'contraceptive_method_type', 'contraceptive_quantity',
                            'batch_no', 'expiry_date', 'client_type_revisit',
                            'client_type_method_switcher'
                        ].map(f => renderField(f, true))}
                    </div>
                    {renderField('complaints_examination_treatment', true)}
                    {renderField('reason_for_method_switch', true)}

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button variant="secondary" type="button" onClick={() => setIsVisitModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Submit Visit'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </Modal>
    );
}
