import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, ClipboardList, FlaskConical, Clock, AlertCircle,
    CheckCircle, Hourglass, TrendingUp, ChevronRight, RefreshCw
} from 'lucide-react';
import api from '../../api/axios';
import { getStoredUser } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LabResultModal from '../../components/lab/LabResultModal';
import UltrasoundResultModal from '../../components/lab/UltrasoundResultModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getStoredUser();
    const isUltrasoundUser = user?.username?.toLowerCase().includes('ultra') ||
        user?.role === 'ultrasound_doctor' ||
        user?.lab_specialty?.toLowerCase() === 'ultrasound';

    // Role Access Logic
    const hasBothAccess = user?.role === 'superadmin' || user?.role === 'admin';
    const canViewLab = hasBothAccess || !isUltrasoundUser;
    const canViewUltrasound = hasBothAccess || isUltrasoundUser;

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(isUltrasoundUser ? 'ultrasound' : 'lab');

    const [currentTime, setCurrentTime] = useState('');
    const [stats, setStats] = useState({
        todayRequests: 0,
        totalRequests: 0,
        totalAvailableTests: 0
    });

    // Processed Data
    const [labData, setLabData] = useState({ requests: [], pending: 0, completed: 0, urgent: 0 });
    const [ultrasoundData, setUltrasoundData] = useState({ requests: [], pending: 0, completed: 0, urgent: 0 });

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isUltrasoundModalOpen, setIsUltrasoundModalOpen] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 30000);
        fetchDashboardData();
        return () => clearInterval(timeInterval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, recentRes] = await Promise.all([
                api.get('/lab-requests/dashboard/stats'),
                api.get('/lab-requests/requests')
            ]);
            if (statsRes.data) setStats(statsRes.data);

            if (recentRes.data && Array.isArray(recentRes.data)) {
                const today = new Date().toISOString().split('T')[0];
                const todayRequests = recentRes.data.filter(request => {
                    if (request.RequestDate) {
                        const requestDate = new Date(request.RequestDate).toISOString().split('T')[0];
                        return requestDate === today;
                    }
                    return false;
                });

                // --- PROCESS LAB DATA ---
                const labRequests = todayRequests.filter(r => parseInt(r.standard_tests_count || 0) > 0);
                const labPending = labRequests.filter(r => parseInt(r.standard_results_count || 0) < parseInt(r.standard_tests_count || 0)).length;
                const labCompleted = labRequests.filter(r => parseInt(r.standard_results_count || 0) >= parseInt(r.standard_tests_count || 0)).length;
                const labUrgent = labRequests.filter(r => {
                    const isUrgentParams = r.is_urgent == 1 || r.UrgentAttention == 1 || r.LabStatus?.toLowerCase() === 'urgent';
                    if (!isUrgentParams) return false;
                    return parseInt(r.standard_results_count || 0) < parseInt(r.standard_tests_count || 0);
                }).length;

                setLabData({
                    requests: labRequests.sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate)).slice(0, 5),
                    pending: labPending,
                    completed: labCompleted,
                    urgent: labUrgent
                });

                // --- PROCESS ULTRASOUND DATA ---
                const ultraRequests = todayRequests.filter(r => parseInt(r.ultrasound_tests_count || 0) > 0);
                const ultraPending = ultraRequests.filter(r => parseInt(r.ultrasound_results_count || 0) < parseInt(r.ultrasound_tests_count || 0)).length;
                const ultraCompleted = ultraRequests.filter(r => parseInt(r.ultrasound_results_count || 0) >= parseInt(r.ultrasound_tests_count || 0)).length;
                const ultraUrgent = ultraRequests.filter(r => {
                    const isUrgentParams = r.is_urgent == 1 || r.UrgentAttention == 1 || r.LabStatus?.toLowerCase() === 'urgent';
                    if (!isUrgentParams) return false;
                    return parseInt(r.ultrasound_results_count || 0) < parseInt(r.ultrasound_tests_count || 0);
                }).length;

                setUltrasoundData({
                    requests: ultraRequests.sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate)).slice(0, 5),
                    pending: ultraPending,
                    completed: ultraCompleted,
                    urgent: ultraUrgent
                });


            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-600';
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'urgent': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch { return ''; }
    };

    const handleOpenResultModal = (request, type) => {
        setSelectedRequest(request);
        if (type === 'ultrasound') setIsUltrasoundModalOpen(true);
        else setIsResultModalOpen(true);
    };

    const renderDashboardContent = (data, type) => (
        <div className="space-y-3 animation-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                    <div className="p-1 bg-yellow-50 rounded"><Hourglass size={12} className="text-yellow-600" /></div>
                    <div><p className="text-xs text-gray-500">Pending</p><p className="text-sm font-bold">{data.pending}</p></div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                    <div className="p-1 bg-green-50 rounded"><CheckCircle size={12} className="text-green-600" /></div>
                    <div><p className="text-xs text-gray-500">Completed</p><p className="text-sm font-bold">{data.completed}</p></div>
                </div>
                <div onClick={() => {
                    if (data.urgent === 0) {
                        toast('Nothing to show', { icon: 'ℹ️' });
                    } else {
                        navigate(`/lab/${type === 'lab' ? 'todays-labs' : 'todays-ultrasounds'}?filter=urgent`);
                    }
                }}
                    className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-red-50 transition-colors">
                    <div className="p-1 bg-red-50 rounded"><AlertCircle size={12} className="text-red-600" /></div>
                    <div><p className="text-xs text-gray-500">Urgent</p><p className="text-sm font-bold">{data.urgent}</p></div>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-2 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-800 flex items-center gap-1"><ClipboardList size={14} className="text-blue-600" /> Recent {type === 'lab' ? 'Lab' : 'Ultrasound'} Requests</h3></div>
                <div className="divide-y divide-gray-100">
                    {data.requests.length > 0 ? (
                        data.requests.map((request, index) => (
                            <div key={request.request_id || index} onClick={() => handleOpenResultModal(request, type)} className="p-2 hover:bg-gray-50 cursor-pointer transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${getStatusColor(request.LabStatus)}`}>
                                            {type === 'ultrasound' ? <Activity size={14} /> : <FlaskConical size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{request.FirstName} {request.Father_Name?.charAt(0)}.</p>
                                            <p className="text-[10px] text-gray-500">Card: {request.CardNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 mb-0.5">{formatTime(request.RequestDate)}</div>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getStatusColor(request.LabStatus)}`}>{request.LabStatus?.slice(0, 3) || 'Pnd'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : <div className="p-3 text-center"><p className="text-xs text-gray-400">No requests today</p></div>}
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><LoadingSpinner /></div>;

    return (
        <div className="p-3 space-y-3 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Lab Dashboard</h1>
                    <p className="text-xs text-gray-500">Today's overview</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded flex items-center gap-1">
                        <Clock size={12} />
                        {currentTime}
                    </div>
                    <button onClick={fetchDashboardData} className="p-1.5 hover:bg-gray-100 rounded" title="Refresh"><RefreshCw size={14} className="text-gray-500" /></button>
                </div>
            </div>

            {/* Quick Stats Global */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-gradient-to-r from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div><p className="text-xs text-blue-100 mb-1">Total Requests</p><p className="text-xl font-bold">{stats.totalRequests}</p></div>
                </div>
                <div className="bg-gradient-to-r from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div><p className="text-xs text-purple-100 mb-1">Today's Total</p><p className="text-xl font-bold">{stats.todayRequests}</p></div>
                </div>
                <div className="bg-gradient-to-r from-gray-900 to-blue-700/70 text-white p-3 rounded-lg shadow">
                    <div><p className="text-xs text-emerald-100 mb-1">Available Tests</p><p className="text-xl font-bold">{stats.totalAvailableTests}</p></div>
                </div>
            </div>

            {/* Tabs for Lab vs Ultrasound */}
            <div className="bg-white rounded-lg border border-gray-200 p-2">
                {(canViewLab && canViewUltrasound) ? (
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-3">
                        <button
                            onClick={() => setActiveTab('lab')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'lab' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Laboratory
                        </button>
                        <button
                            onClick={() => setActiveTab('ultrasound')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'ultrasound' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Ultrasound
                        </button>
                    </div>
                ) : (
                    // Header for single view
                    <div className="mb-3 pb-2 border-b border-gray-100 text-sm font-bold text-gray-700 uppercase tracking-wider">
                        {activeTab === 'ultrasound' ? 'Ultrasound Department' : 'Laboratory Department'}
                    </div>
                )}

                {((canViewLab && activeTab === 'lab') || (!canViewUltrasound)) && renderDashboardContent(labData, 'lab')}
                {((canViewUltrasound && activeTab === 'ultrasound') || (!canViewLab)) && renderDashboardContent(ultrasoundData, 'ultrasound')}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button onClick={() => navigate('/lab/search-patient')} className="bg-white p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition text-center">
                        <ClipboardList size={14} className="text-blue-600 mx-auto mb-1" /><span className="text-xs font-medium text-gray-800">Search Patient</span>
                    </button>
                    <button onClick={() => navigate(activeTab === 'lab' ? '/lab/todays-labs' : '/lab/todays-ultrasounds')} className="bg-white p-2 rounded border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition text-center">
                        <FlaskConical size={14} className="text-purple-600 mx-auto mb-1" /><span className="text-xs font-medium text-gray-800">All {activeTab === 'lab' ? 'Labs' : 'Ultrasounds'}</span>
                    </button>
                </div>
            </div>

            {selectedRequest && (
                <LabResultModal
                    isOpen={isResultModalOpen}
                    onClose={() => { setIsResultModalOpen(false); setSelectedRequest(null); }}
                    request={selectedRequest}
                    onSuccess={fetchDashboardData}
                />
            )}
            {selectedRequest && (
                <UltrasoundResultModal
                    isOpen={isUltrasoundModalOpen}
                    onClose={() => {
                        setIsUltrasoundModalOpen(false);
                        setSelectedRequest(null);
                    }}
                    request={selectedRequest}
                    onSuccess={fetchDashboardData}
                />
            )}
        </div>
    );
}

