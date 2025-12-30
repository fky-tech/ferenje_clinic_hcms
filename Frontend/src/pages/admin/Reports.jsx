import { useState, useEffect } from 'react';
import { Download, Calendar, FileText, CreditCard, Activity, Users } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import EthiopianDatePicker from '../../components/common/EthiopianDatePicker';


export default function Reports() {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(false);

    const downloadCSV = (data, filename) => {
        if (!data || !data.length) {
            toast.error('No data found for the selected date');
            return;
        }

        // Generate headers from first object keys
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const val = row[header];
                return JSON.stringify(val === null || val === undefined ? '' : val);
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleExport = async (type) => {
        setLoading(true);
        const toastId = toast.loading(`Generating ${type} report...`);
        try {
            const response = await api.get('/admin/reports', {
                params: { date, type }
            });

            if (response.data && response.data.length > 0) {
                const filename = `ferenje_${type}_report_${date}.csv`;
                downloadCSV(response.data, filename);
                toast.success('Report downloaded successfully', { id: toastId });
            } else {
                toast.error('No records found for this date', { id: toastId });
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to generate report', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
    const [reportYear, setReportYear] = useState(new Date().getFullYear());
    const [morbidityData, setMorbidityData] = useState([]);

    // Fetch morbidity data when month/year changes
    useEffect(() => {
        const fetchMorbidity = async () => {
            // Don't set global loading here to avoid UI flicker on full page, just local if needed
            try {
                const res = await api.get('/reports/tally-morbidity', {
                    params: { month: reportMonth, year: reportYear }
                });
                setMorbidityData(res.data);
            } catch (error) {
                console.error('Failed to load morbidity tally', error);
            }
        };
        fetchMorbidity();
    }, [reportMonth, reportYear]);
    const handleWordExport = async () => {
        setLoading(true);
        const toastId = toast.loading('Generating Word report...');
        try {
            const response = await api.get('/reports/export-word', {
                params: { month: reportMonth, year: reportYear },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Monthly_Report_${reportYear}_${reportMonth}.docx`;
            link.click();
            toast.success('Word report downloaded', { id: toastId });
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to generate Word report', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleMorbidityExport = async () => {
        setLoading(true);
        const toastId = toast.loading('Generating Morbidity report...');
        try {
            const response = await api.get('/reports/export-morbidity', {
                params: { month: reportMonth, year: reportYear },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Morbidity_Matrix_${reportYear}_${reportMonth}.docx`;
            link.click();
            toast.success('Morbidity report downloaded', { id: toastId });
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to generate Morbidity report', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const ReportCard = ({ title, description, icon: Icon, type, colorClass }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div>
                <div className={`p-3 rounded-lg w-fit ${colorClass} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm mb-6">{description}</p>
            </div>
            <button
                onClick={() => handleExport(type)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
                    <p className="text-gray-500 mt-1">Export clinic data for specific dates</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200 min-w-[300px]">
                    <EthiopianDatePicker
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard
                    title="Financial Report"
                    description="Export all payments, transactions, and revenue details for the selected date."
                    icon={CreditCard}
                    type="payments"
                    colorClass="bg-yellow-500"
                />

                <ReportCard
                    title="Lab Activity"
                    description="Export list of lab requests, test statuses, and result summaries."
                    icon={Activity}
                    type="labs"
                    colorClass="bg-blue-500"
                />

                <ReportCard
                    title="Patient Visits"
                    description="Export record of all patient visits, check-ins, and basic demographics."
                    icon={Users}
                    type="patients"
                    colorClass="bg-purple-500"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Monthly Government Health Report</h3>
                            <p className="text-gray-500 text-sm">Official aggregated report of all disease indicators</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={reportMonth}
                            onChange={(e) => setReportMonth(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select
                            value={reportYear}
                            onChange={(e) => setReportYear(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            {[2023, 2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={handleWordExport}
                                disabled={loading}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Main Report .docx
                            </button>
                            <button
                                onClick={handleMorbidityExport}
                                disabled={loading}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Activity className="w-4 h-4" />
                                Morbidity Tally .docx
                            </button>
                        </div>
                    </div>
                </div>

                {/* Morbidity Dashboard Preview */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h4 className="font-semibold text-gray-700 text-sm">Common Morbidity Tally - {new Date(0, reportMonth - 1).toLocaleString('default', { month: 'long' })} {reportYear}</h4>
                    </div>
                    <div className="overflow-x-auto p-4">
                        {loading ? (
                            <div className="text-center py-4">Loading data...</div>
                        ) : morbidityData.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No morbidity data recorded for this month.</div>
                        ) : (
                            <table className="min-w-full text-sm divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Male</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Female</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {morbidityData.map((row) => (
                                        <tr key={row.indicator_code} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">{row.indicator_code}</td>
                                            <td className="px-3 py-2 text-gray-900">{row.description || row.indicator_code}</td>
                                            <td className="px-3 py-2 text-center text-blue-600 font-medium">{row.male_count}</td>
                                            <td className="px-3 py-2 text-center text-pink-600 font-medium">{row.female_count}</td>
                                            <td className="px-3 py-2 text-center font-bold text-gray-900">{row.total_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">Automated Daily Reports</h3>
                        <p className="text-blue-700 text-sm">
                            The system automatically generates consolidated Excel reports (Summary, Financial, Patient Visits, Lab Activity) every night at 11:59 PM.
                            These files are saved securely on the server in date-specific folders within the <code>/reports</code> directory
                            for archival and audit purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
