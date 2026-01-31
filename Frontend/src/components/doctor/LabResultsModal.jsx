import { X, Activity } from 'lucide-react';
import Button from '../common/Button';
import { useState } from 'react';
import UltrasoundViewModal from '../lab/UltrasoundViewModal';

export default function LabResultsModal({ isOpen, onClose, labRequest, labResults, patientSex }) {
    const [isUltrasoundViewModalOpen, setIsUltrasoundViewModalOpen] = useState(false);
    if (!isOpen) return null;

    const hasUltrasound = labResults?.some(r => r.TestCategory === 'Ultrasound');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        Lab Results - Request #{labRequest?.request_id}
                        <span className="text-sm font-normal text-gray-600 ml-2">(Patient: {patientSex || 'Unknown'})</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Request Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Request Date</p>
                                <p className="font-medium">
                                    {labRequest?.RequestDate ? new Date(labRequest.RequestDate).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${labRequest?.LabStatus === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {labRequest?.LabStatus || 'pending'}
                                </span>
                            </div>
                            {labRequest?.ReportDate && (
                                <div>
                                    <p className="text-sm text-gray-600">Report Date</p>
                                    <p className="font-medium">
                                        {new Date(labRequest.ReportDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {labRequest?.OptionalNote && (
                                <div className="col-span-2 mt-2">
                                    <p className="text-sm text-gray-600">Lab Note</p>
                                    <p className="font-medium text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                                        "{labRequest.OptionalNote}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ultrasound Report Shortcut */}
                    {hasUltrasound && (
                        <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-primary-700">
                                <Activity className="w-6 h-6" />
                                <div>
                                    <p className="font-bold">Ultrasound Imaging Report Available</p>
                                    <p className="text-xs text-primary-600">This request contains ultrasound studies.</p>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => setIsUltrasoundViewModalOpen(true)}
                                className="shadow-sm"
                            >
                                View Ultrasound Report
                            </Button>
                        </div>
                    )}

                    {/* Test Results */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                        {!labResults || labResults.filter(r => r.TestCategory !== 'Ultrasound').length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No test results available yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {labResults.filter(r => r.TestCategory !== 'Ultrasound').map((result, index) => {
                                    // Debug: Log all values
                                    console.log('=== Lab Result Debug ===');
                                    console.log('Test:', result.test_name);
                                    console.log('Raw Value:', result.test_result_value, typeof result.test_result_value);
                                    console.log('Patient Sex:', patientSex);
                                    console.log('NormalRange_Male:', result.NormalRange_Male);
                                    console.log('NormalRange_Female:', result.NormalRange_Female);

                                    // Check if value is abnormal based on patient sex
                                    const value = parseFloat(result.test_result_value);
                                    let isAbnormal = false;
                                    let normalRange = '';
                                    let debugInfo = '';

                                    if (!isNaN(value) && patientSex) {
                                        // Use the correct normal range based on patient sex
                                        normalRange = patientSex === 'Male' || patientSex === 'M'
                                            ? (result.NormalRange_Male || result.NormalRange_Female || '')
                                            : (result.NormalRange_Female || result.NormalRange_Male || '');

                                        console.log('Selected Range:', normalRange);

                                        // Parse range like "70-100" or "70 - 100"
                                        const rangeMatch = normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);

                                        if (rangeMatch) {
                                            const minNormal = parseFloat(rangeMatch[1]);
                                            const maxNormal = parseFloat(rangeMatch[2]);
                                            isAbnormal = value < minNormal || value > maxNormal;

                                            debugInfo = `Value: ${value}, Range: ${minNormal}-${maxNormal}, Abnormal: ${isAbnormal}`;
                                            console.log(debugInfo);
                                        } else {
                                            console.log('Failed to parse range:', normalRange);
                                        }
                                    }

                                    return (
                                        <div key={index} className={`border rounded-lg p-4 transition-shadow ${isAbnormal ? 'border-red-400 bg-red-50 shadow-lg animate-pulse' : 'border-gray-200 hover:shadow-md'}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">
                                                        {result.test_name || `Test #${result.test_id}`}
                                                    </h4>
                                                    {result.TestCategory && (
                                                        <p className="text-sm text-gray-500">{result.TestCategory}</p>
                                                    )}
                                                    {/* Show debug info in development */}
                                                    {debugInfo && (
                                                        <p className="text-xs text-gray-400 mt-1">{debugInfo}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {isAbnormal && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white flex items-center animate-pulse">
                                                            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                                                            ABNORMAL
                                                        </span>
                                                    )}
                                                    {!isAbnormal && !isNaN(value) && normalRange && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            ✓ Normal
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Result Value</p>
                                                    <p className={`font-semibold text-lg ${isAbnormal ? 'text-red-700 font-bold' : 'text-gray-900'}`}>
                                                        {result.test_result_value || '-'}
                                                        {result.UnitOfMeasure && <span className="text-sm ml-1">{result.UnitOfMeasure}</span>}
                                                    </p>
                                                    {result.OptionalNote && (
                                                        <p className="text-xs text-gray-500 mt-1 italic">
                                                            Note: {result.OptionalNote}
                                                        </p>
                                                    )}
                                                </div>
                                                {patientSex === 'Male' && result.NormalRange_Male && (
                                                    <div>
                                                        <p className="text-gray-600">Normal Range (Male)</p>
                                                        <p className="font-medium text-green-700">{result.NormalRange_Male}</p>
                                                    </div>
                                                )}
                                                {patientSex === 'Female' && result.NormalRange_Female && (
                                                    <div>
                                                        <p className="text-gray-600">Normal Range (Female)</p>
                                                        <p className="font-medium text-green-700">{result.NormalRange_Female}</p>
                                                    </div>
                                                )}
                                                {(!patientSex || (patientSex !== 'Male' && patientSex !== 'Female')) && (
                                                    <>
                                                        {result.NormalRange_Male && (
                                                            <div>
                                                                <p className="text-gray-600">Normal Range (Male)</p>
                                                                <p className="font-medium">{result.NormalRange_Male}</p>
                                                            </div>
                                                        )}
                                                        {result.NormalRange_Female && (
                                                            <div>
                                                                <p className="text-gray-600">Normal Range (Female)</p>
                                                                <p className="font-medium">{result.NormalRange_Female}</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>

            {hasUltrasound && (
                <UltrasoundViewModal
                    isOpen={isUltrasoundViewModalOpen}
                    onClose={() => setIsUltrasoundViewModalOpen(false)}
                    request={labRequest}
                />
            )}
        </div>
    );
}
