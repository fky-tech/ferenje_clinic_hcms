import { useState } from 'react';
import { Download, Calendar, FileText, CreditCard, Activity, Users } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

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

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-400 ml-2" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="outline-none text-gray-700 font-medium bg-transparent"
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

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">Automated Daily Reports</h3>
                        <p className="text-blue-700 text-sm">
                            The system automatically generates a consolidated JSON report every night at 11:59 PM.
                            These files are saved securely on the server in the <code>/reports</code> directory
                            for archival and audit purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
