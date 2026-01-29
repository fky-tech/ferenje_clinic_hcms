import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, ClipboardList, FlaskConical, Clock, AlertCircle,
    CheckCircle, Hourglass, TrendingUp, ChevronRight, RefreshCw
} from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LabResultModal from '../../components/lab/LabResultModal';
import UltrasoundResultModal from '../../components/lab/UltrasoundResultModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [stats, setStats] = useState({
        todayRequests: 0,
        totalRequests: 0,
        totalAvailableTests: 0
    });
    const [recentRequests, setRecentRequests] = useState([]);
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
                const sortedRequests = todayRequests
                    .sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate))
                    .slice(0, 3);
                setRecentRequests(sortedRequests);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAdditionalStats = () => {
        const pendingRequests = recentRequests.filter(r =>
            r.LabStatus && r.LabStatus.toLowerCase() === 'pending'
        ).length;
        const completedRequests = recentRequests.filter(r =>
            r.LabStatus && r.LabStatus.toLowerCase() === 'completed'
        ).length;
        const urgentRequests = recentRequests.filter(r =>
            r.UrgentAttention === 1 || (r.LabStatus && r.LabStatus.toLowerCase() === 'urgent')
        ).length;
        return { pendingRequests, completedRequests, urgentRequests };
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

    const getStatusIcon = (status) => {
        if (!status) return <Hourglass size={14} />;
        switch (status.toLowerCase()) {
            case 'completed': return <CheckCircle size={14} />;
            case 'pending': return <Hourglass size={14} />;
            case 'urgent': return <AlertCircle size={14} />;
            default: return <Hourglass size={14} />;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return '';
        }
    };

    const handleOpenResultModal = (request) => {
        setSelectedRequest(request);
        if (request.ultrasound_tests_count > 0 && request.standard_tests_count === 0) {
            setIsUltrasoundModalOpen(true);
        } else if (request.ultrasound_tests_count > 0 && request.standard_tests_count > 0) {
            // Mixed request: Logic to choose? Defaulting to LabResultModal or asking user?
            // For now, assuming distinct request types or favoring Ultrasound if strictly ultrasound.
            // If mixed, LabResultModal might handle standard, but we might need a way to see both.
            // Let's bias towards Ultrasound if it has it, or check the specific "Todays Ultrasound" behavior.

            // Re-reading user request: "like it gets me in Todays ultrasound page".
            // If I am an ultrasound tech, I want Ultrasound modal.
            setIsUltrasoundModalOpen(true);
        } else {
            setIsResultModalOpen(true);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[40vh]"><LoadingSpinner /></div>;
    }

    const additionalStats = calculateAdditionalStats();

    return (
        <div className="p-3 space-y-3 max-w-6xl mx-auto">
            {/* Header - Ultra Compact */}
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
                    <button onClick={fetchDashboardData} className="p-1.5 hover:bg-gray-100 rounded" title="Refresh">
                        <RefreshCw size={14} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Stats Grid - Very Compact */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900  text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-100 mb-1">Today</p>
                            <p className="text-xl font-bold">{stats.todayRequests}</p>
                        </div>
                        <Activity size={16} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900  text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-100 mb-1">Total</p>
                            <p className="text-xl font-bold">{stats.totalRequests}</p>
                        </div>
                        <ClipboardList size={16} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900  to-blue-700/70 
                        hover:from-blue-600  hover:to-gray-900  text-white p-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-emerald-100 mb-1">Tests</p>
                            <p className="text-xl font-bold">{stats.totalAvailableTests}</p>
                        </div>
                        <FlaskConical size={16} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Status Indicators - Tiny */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                    <div className="p-1 bg-yellow-50 rounded">
                        <Hourglass size={12} className="text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="text-sm font-bold">{additionalStats.pendingRequests}</p>
                    </div>
                </div>

                <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                    <div className="p-1 bg-green-50 rounded">
                        <CheckCircle size={12} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="text-sm font-bold">{additionalStats.completedRequests}</p>
                    </div>
                </div>

                <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
                    <div className="p-1 bg-red-50 rounded">
                        <AlertCircle size={12} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Urgent</p>
                        <p className="text-sm font-bold">{additionalStats.urgentRequests}</p>
                    </div>
                </div>
            </div>

            {/* Recent Requests - Compact */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        <ClipboardList size={14} className="text-blue-600" />
                        Today's Requests
                    </h3>
                    <button
                        onClick={() => navigate('/lab/todays-labs?filter=today')}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                        All <ChevronRight size={12} />
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentRequests.length > 0 ? (
                        recentRequests.slice(0, 3).map((request, index) => (
                            <div
                                key={request.request_id || index}
                                onClick={() => handleOpenResultModal(request)}
                                className="p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${getStatusColor(request.LabStatus)}`}>
                                            {request.ultrasound_tests_count > 0
                                                ? <Activity size={14} />
                                                : getStatusIcon(request.LabStatus)
                                            }
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">
                                                {request.FirstName} {request.Father_Name?.charAt(0)}.
                                            </p>
                                            <p className="text-[10px] text-gray-500">Card: {request.CardNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 mb-0.5">
                                            {formatTime(request.RequestDate)}
                                        </div>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getStatusColor(request.LabStatus)}`}>
                                            {request.LabStatus?.slice(0, 3) || 'Pnd'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center">
                            <p className="text-xs text-gray-400">No requests today</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions - Mini */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        onClick={() => navigate('/lab/search-patient')}
                        className="bg-white p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition text-center"
                    >
                        <ClipboardList size={14} className="text-blue-600 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-800">Search Patient</span>
                    </button>

                    <button
                        onClick={() => navigate('/lab/todays-labs')}
                        className="bg-white p-2 rounded border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition text-center"
                    >
                        <FlaskConical size={14} className="text-purple-600 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-800">All Labs</span>
                    </button>

                    {/* <button
                        onClick={() => navigate('/lab/results')}
                        className="bg-white p-2 rounded border border-gray-200 hover:bg-green-50 hover:border-green-200 transition text-center"
                    >
                        <CheckCircle size={14} className="text-green-600 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-800">Results</span>
                    </button> */}

                    {/* <button
                        onClick={() => navigate('/lab/reports')}
                        className="bg-white p-2 rounded border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition text-center"
                    >
                        <TrendingUp size={14} className="text-orange-600 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-800">Reports</span>
                    </button> */}
                </div>
            </div>
            {selectedRequest && (
                <LabResultModal
                    isOpen={isResultModalOpen}
                    onClose={() => {
                        setIsResultModalOpen(false);
                        setSelectedRequest(null);
                    }}
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