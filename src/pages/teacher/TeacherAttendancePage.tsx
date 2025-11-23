import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/axios';
import { 
    CalendarDaysIcon, 
    FunnelIcon, 
    ArrowPathIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    CameraIcon,
    CloudArrowUpIcon,
    SparklesIcon,
    ArrowDownTrayIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';

import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

// --- Types ---
interface StudentRow {
    id: number;
    full_name: string;
    roll_number: string;
    attendance: Record<number, 'present' | 'absent'>; // Map day number to status
}

interface Subject { id: number; name: string; }

const TeacherAttendancePage = () => {
    // Mode State
    const [mode, setMode] = useState<'manual' | 'ocr'>('manual');

    // Filter State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Data State
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [daysInMonth, setDaysInMonth] = useState(30);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState<any[]>([]); // Track unsaved changes

    // OCR State
    const [ocrResults, setOcrResults] = useState<any>(null);
    const [scanStage, setScanStage] = useState(0); // For loader animation text

    // --- Initial Load ---
    useEffect(() => {
        // Fetch subjects for dropdown
        apiClient.get('/teacher/dashboard/').then(res => {
            if (res.data.subjects && res.data.subjects.length > 0) {
                setSubjects(res.data.subjects);
                setSelectedSubjectId(res.data.subjects[0].id);
            }
        });
    }, []);

    // --- Manual Mode Logic ---
    // --- Fetch Sheet Data ---
    useEffect(() => {
        if (!selectedSubjectId) return;
        fetchAttendanceSheet();
    }, [selectedSubjectId, selectedMonth, selectedYear]);

    const fetchAttendanceSheet = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/teacher/attendance/sheet/`, {
                params: { subject_id: selectedSubjectId, month: selectedMonth, year: selectedYear }
            });
            setStudents(res.data.students);
            setDaysInMonth(res.data.days_in_month);
            setChanges([]); // Reset changes on new fetch
        } catch (error) {
            console.error("Failed to fetch sheet", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handle Checkbox Click ---
    const handleAttendanceChange = (studentId: number, day: number, currentStatus: string | undefined) => {
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';
        
        // 1. Update Local UI immediately (Optimistic)
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return { ...s, attendance: { ...s.attendance, [day]: newStatus } };
            }
            return s;
        }));

        // 2. Track Change for Bulk Save
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const existingChangeIndex = changes.findIndex(c => c.student_id === studentId && c.date === dateStr);
        
        if (existingChangeIndex > -1) {
            // Update existing change
            const newChanges = [...changes];
            newChanges[existingChangeIndex].status = newStatus;
            setChanges(newChanges);
        } else {
            // Add new change
            setChanges([...changes, { student_id: studentId, date: dateStr, status: newStatus }]);
        }
    };

    // --- Save Changes ---
    const saveChanges = async () => {
        if (changes.length === 0) return;
        setSaving(true);
        try {
            await apiClient.post('/teacher/attendance/update/', {
                subject_id: selectedSubjectId,
                updates: changes
            });
            setChanges([]); // Clear changes after success
            // Optionally show success toast here
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    // --- OCR Logic ---

    const handleOCRUpload = async (file: File) => {
        setLoading(true);
        
        // Cycle through loading messages
        const interval = setInterval(() => {
            setScanStage(prev => (prev + 1) % 4);
        }, 1500);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await apiClient.post('/teacher/attendance/ocr/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.records) {
                setOcrResults(response.data.records);
            } else {
                alert("AI could not find records. Try a clearer image.");
            }
        } catch (error) {
            console.error("OCR Failed", error);
            alert("Failed to analyze image.");
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const toggleOCRStatus = (studentIdx: number, attendanceIdx: number) => {
        const newResults = [...ocrResults];
        const current = newResults[studentIdx].attendance[attendanceIdx].status;
        newResults[studentIdx].attendance[attendanceIdx].status = current === 'present' ? 'absent' : 'present';
        setOcrResults(newResults);
    };

    // Handle Editable Fields in OCR
    const handleOcrChange = (studentIdx: number, field: string, value: string) => {
        const newResults = [...ocrResults];
        newResults[studentIdx][field] = value;
        setOcrResults(newResults);
    };

    // Handle Date Header Change (Updates date for ALL students at that index)
    const handleOcrDateChange = (dateIdx: number, newDate: string) => {
        const newResults = ocrResults.map((student: any) => {
            const newAttendance = [...student.attendance];
            newAttendance[dateIdx].date = newDate;
            return { ...student, attendance: newAttendance };
        });
        setOcrResults(newResults);
    };

    const saveOCRData = async () => {
        if (!selectedSubjectId) {
            alert("Please select a subject first (in the Manual tab filter) to associate this data.");
            return;
        }
        setSaving(true);
        try {
             await apiClient.post('/teacher/attendance/update/', {
                 subject_id: selectedSubjectId,
                 ocr_data: ocrResults,
                 is_ocr: true
             });
             alert("Attendance synced with database!");
             setOcrResults(null);
             setMode('manual');
             fetchAttendanceSheet(); 
        } catch (err) {
            console.error(err);
            alert("Failed to save data.");
        } finally {
            setSaving(false);
        }
    };

    // --- Export Functions ---

    const getFlattenedData = () => {
        if (!ocrResults || ocrResults.length === 0) return [];
        
        // Get Dates from first record
        const dates = ocrResults[0].attendance.map((a: any) => a.date);
        
        return ocrResults.map((student: any) => {
            const row: any = {
                'Roll Number': student.roll_number,
                'Student Name': student.name
            };
            student.attendance.forEach((att: any) => {
                row[att.date] = att.status; // or "P" / "A" if preferred
            });
            return row;
        });
    };

    const downloadExcel = () => {
        const data = getFlattenedData();
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");
        XLSX.writeFile(wb, "Attendance_Analysis.xlsx");
    };

    const downloadCSV = () => {
        const data = getFlattenedData();
        const ws = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Attendance_Analysis.csv";
        link.click();
    };


    // --- Helper for rendering the grid ---
    const renderDaysHeader = () => {
        const headers = [];
        for (let i = 1; i <= daysInMonth; i++) {
            headers.push(
                <th key={i} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px] border-b border-gray-200">
                    {i}
                </th>
            );
        }
        return headers;
    };



   return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Register</h1>
                    <p className="text-gray-500 mt-1">Manage daily logs or scan physical sheets.</p>
                </div>
                
                {/* Mode Toggle */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
                    <button 
                        onClick={() => setMode('manual')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <DocumentTextIcon className="w-4 h-4" /> Manual
                    </button>
                    <button 
                        onClick={() => setMode('ocr')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'ocr' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <CameraIcon className="w-4 h-4" /> AI Scanner
                    </button>
                </div>
            </div>

            {/* --- MANUAL MODE --- */}
            {mode === 'manual' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    
                    {/* Filters Toolbar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Subject Select */}
                            <div className="relative">
                                <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select 
                                    value={selectedSubjectId || ''}
                                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                                    className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                >
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            {/* Month Select */}
                            <div className="relative">
                                <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Select */}
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-2">
                            {changes.length > 0 && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-bold animate-pulse">
                                    {changes.length} Unsaved Changes
                                </span>
                            )}
                            <button 
                                onClick={saveChanges}
                                disabled={saving || changes.length === 0}
                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : <><CheckCircleIcon className="w-5 h-5" /> Save Changes</>}
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                        {loading ? (
                            <div className="p-20 flex justify-center"><ArrowPathIcon className="w-8 h-8 text-red-600 animate-spin" /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-24 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">Roll No</th>
                                                    <th className="sticky left-24 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-48 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">Name</th>
                                                    {renderDaysHeader()}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {students.map((student) => (
                                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">{student.roll_number}</td>
                                                        <td className="sticky left-24 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">{student.full_name}</td>
                                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                                            const isPresent = student.attendance[day] === 'present';
                                                            return (
                                                                <td key={day} className="px-2 py-4 whitespace-nowrap text-center border-b border-gray-100">
                                                                    <input type="checkbox" checked={isPresent} onChange={() => handleAttendanceChange(student.id, day, student.attendance[day])} className={`w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer transition-all ${isPresent ? 'bg-red-600 border-red-600' : 'bg-white'}`} />
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* --- OCR MODE --- */}
            {mode === 'ocr' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    
                    {/* 1. Upload Area */}
                    {!ocrResults && !loading && (
                        <div className="max-w-2xl mx-auto">
                            <OCRUploader onUpload={handleOCRUpload} />
                        </div>
                    )}

                    {/* 2. Enhanced Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {/* Scanning Animation */}
                            <div className="relative w-64 h-40 bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden mb-8 shadow-inner">
                                {/* Mock Lines */}
                                <div className="absolute top-4 left-4 w-3/4 h-2 bg-gray-200 rounded"></div>
                                <div className="absolute top-8 left-4 w-1/2 h-2 bg-gray-200 rounded"></div>
                                <div className="absolute top-12 left-4 w-full h-2 bg-gray-200 rounded"></div>
                                {/* Moving Laser */}
                                <motion.div 
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900 animate-pulse">
                                    {['Detecting Grid...', 'Reading Roll Numbers...', 'Checking Signatures...', 'Finalizing Data...'][scanStage]}
                                </h3>
                                <p className="text-gray-500">Our AI is analyzing handwriting patterns.</p>
                            </div>
                        </div>
                    )}

                    {/* 3. Results Preview & Verification */}
                    {ocrResults && !loading && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-red-50/30 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <SparklesIcon className="w-5 h-5 text-red-600" />
                                        AI Analysis Results
                                    </h3>
                                    <p className="text-sm text-gray-500">Verify and edit the data before saving.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={downloadCSV} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download CSV">
                                        <TableCellsIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={downloadExcel} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download Excel">
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                    </button>
                                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                                    <button onClick={() => setOcrResults(null)} className="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100">Discard</button>
                                    <button onClick={saveOCRData} disabled={saving} className="px-6 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg">
                                        {saving ? 'Syncing...' : 'Approve & Save'}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                            {ocrResults[0]?.attendance.map((att: any, i: number) => (
                                                <th key={i} className="px-2 py-3 text-center min-w-[120px]">
                                                    {/* Editable Date Header */}
                                                    <input 
                                                        type="text" 
                                                        value={att.date} 
                                                        onChange={(e) => handleOcrDateChange(i, e.target.value)}
                                                        className="bg-transparent border-b border-dashed border-gray-400 text-center text-xs font-bold text-gray-700 w-full focus:outline-none focus:border-red-500"
                                                    />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {ocrResults.map((student: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <input 
                                                        type="text" 
                                                        value={student.roll_number} 
                                                        onChange={(e) => handleOcrChange(idx, 'roll_number', e.target.value)}
                                                        className="w-full bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <input 
                                                        type="text" 
                                                        value={student.name} 
                                                        onChange={(e) => handleOcrChange(idx, 'name', e.target.value)}
                                                        className="w-full bg-transparent border-none text-sm text-gray-500 focus:ring-0"
                                                    />
                                                </td>
                                                {student.attendance.map((att: any, i: number) => (
                                                    <td key={i} className="px-4 py-3 whitespace-nowrap text-center">
                                                        <button
                                                            onClick={() => toggleOCRStatus(idx, i)}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                                                                att.status === 'present' 
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            }`}
                                                        >
                                                            {att.status}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

// --- Uploader Component ---
const OCRUploader = ({ onUpload }: { onUpload: (file: File) => void }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop: acceptedFiles => { if (acceptedFiles.length > 0) onUpload(acceptedFiles[0]); }
    });

    return (
        <div {...getRootProps()} className={`border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-gray-50'}`}>
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CameraIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upload Attendance Sheet</h3>
            <p className="text-gray-500 mt-2">Drag & drop a photo here, or <span className="text-red-600 font-bold">click to select</span>.</p>
            <p className="text-xs text-gray-400 mt-6">Supports JPG, PNG. Mobile camera friendly.</p>
        </div>
    );
};

export default TeacherAttendancePage;