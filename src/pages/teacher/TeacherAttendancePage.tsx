import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/axios';
import { 
    CalendarDaysIcon, 
    FunnelIcon, 
    ArrowPathIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    CameraIcon
} from '@heroicons/react/24/outline';

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
                    <p className="text-gray-500 mt-1">Manage daily attendance logs.</p>
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
                                {saving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="w-5 h-5" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* --- The Grid --- */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                        {loading ? (
                            <div className="p-20 flex justify-center">
                                <ArrowPathIcon className="w-8 h-8 text-red-600 animate-spin" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {/* Sticky Columns for Name/Roll */}
                                                    <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-24 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                                                        Roll No
                                                    </th>
                                                    <th scope="col" className="sticky left-24 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-48 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                                                        Name
                                                    </th>
                                                    {/* Dates */}
                                                    {renderDaysHeader()}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {students.map((student) => (
                                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                                                            {student.roll_number}
                                                        </td>
                                                        <td className="sticky left-24 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                                                            {student.full_name}
                                                        </td>
                                                        {/* Checkboxes for each day */}
                                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                                            const status = student.attendance[day]; // 'present', 'absent', or undefined
                                                            const isPresent = status === 'present';
                                                            return (
                                                                <td key={day} className="px-2 py-4 whitespace-nowrap text-center border-b border-gray-100">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isPresent}
                                                                        onChange={() => handleAttendanceChange(student.id, day, status)}
                                                                        className={`w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer transition-all ${
                                                                            isPresent ? 'bg-red-600 border-red-600' : 'bg-white'
                                                                        }`}
                                                                    />
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

            {/* --- OCR MODE (Placeholder) --- */}
            {mode === 'ocr' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <CameraIcon className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">AI Scanner</h2>
                    <p className="text-gray-500 mt-2">Coming up next: Upload sheet photos for auto-detection.</p>
                </motion.div>
            )}
        </div>
    );
};

export default TeacherAttendancePage;