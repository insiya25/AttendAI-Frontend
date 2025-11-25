import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import apiClient from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { 
    CameraIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    VideoCameraIcon,
    StopIcon,
    ExclamationTriangleIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

const TeacherLiveAttendancePage = () => {
    const [activeTab, setActiveTab] = useState<'live' | 'register'>('live');
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    
    // Form State
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    
    // Camera State
    const webcamRef = useRef<Webcam>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // For background API calls (Live)
    const [isRegistering, setIsRegistering] = useState(false); // For blocking UI (Register)
    const [flash, setFlash] = useState(false); // Camera flash effect
    
    // Feedback State { type: 'success'|'error'|'warning', message: '', details: '' }
    const [feedback, setFeedback] = useState<any>(null); 

    // Load Initial Data
    useEffect(() => {
        apiClient.get('/teacher/dashboard/').then(res => {
            if(res.data.subjects) setSubjects(res.data.subjects.map((s: any) => ({ value: s.id, label: s.name })));
        });
        apiClient.get('/students/all/').then(res => {
            setStudents(res.data.map((s: any) => ({ value: s.user_id, label: `${s.full_name} (${s.roll_number})` })));
        });
    }, []);

    // --- Trigger Flash Effect ---
    const triggerFlash = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
    };

    // --- Capture & Send Logic ---
    const captureAndSend = async (endpoint: string, payload: any, isRegistrationMode = false) => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        if (isRegistrationMode) {
            triggerFlash();
            setIsRegistering(true);
        } else {
            setIsProcessing(true);
        }
        
        // Convert base64 to blob
        const blob = await (await fetch(imageSrc)).blob();
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');
        
        // Append other data
        Object.keys(payload).forEach(key => formData.append(key, payload[key]));

        try {
            const res = await apiClient.post(endpoint, formData);
            
            if (res.data.status === 'success' || res.data.message) {
                setFeedback({ 
                    type: 'success', 
                    message: res.data.message || `Recognized: ${res.data.student_name}`,
                    details: res.data.student_name 
                });
            } else if (res.data.status === 'warning') {
                // Handle Not Enrolled Warning
                setFeedback({ 
                    type: 'warning', 
                    message: 'Action Required', 
                    details: res.data.message 
                });
            } else if (res.data.status === 'unknown') {
                setFeedback({ type: 'error', message: 'Face Not Recognized' });
            }
        } catch (err: any) {
            setFeedback({ type: 'error', message: err.response?.data?.error || 'Detection Failed' });
        } finally {
            setIsProcessing(false);
            setIsRegistering(false);
            // Clear feedback after 3 seconds
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    // --- Loop for Live Mode ---
    useEffect(() => {
        let interval: any;
        if (isCameraOn && activeTab === 'live' && selectedSubject) {
            interval = setInterval(() => {
                if (!isProcessing && !isRegistering) {
                    captureAndSend('/face/recognize/', { subject_id: selectedSubject.value });
                }
            }, 3000); // Check every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isCameraOn, activeTab, selectedSubject, isProcessing, isRegistering]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
            
            {/* --- Blocking Loader Overlay (For Registration) --- */}
            <AnimatePresence>
                {isRegistering && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white cursor-wait"
                    >
                        <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                            <CpuChipIcon className="absolute inset-0 m-auto w-12 h-12 text-white animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Analyzing Face Data...</h2>
                        <p className="text-gray-400">Encoding facial features into neural network.</p>
                        {selectedStudent && <p className="mt-4 text-sm font-mono bg-gray-800 px-4 py-2 rounded-lg">Target: {selectedStudent.label}</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Face Attendance</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button 
                    disabled={isRegistering}
                    onClick={() => { setActiveTab('live'); setIsCameraOn(false); setFeedback(null); }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'live' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-500'}`}
                >
                    Live Attendance
                </button>
                <button 
                    disabled={isRegistering}
                    onClick={() => { setActiveTab('register'); setIsCameraOn(false); setFeedback(null); }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'register' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-500'}`}
                >
                    Register Face
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration</h3>
                        
                        {activeTab === 'live' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Subject</label>
                                    <Select options={subjects} value={selectedSubject} onChange={setSelectedSubject} isDisabled={isCameraOn} />
                                </div>
                                <p className="text-sm text-gray-500">
                                    1. Select a subject.<br/>
                                    2. Start Camera.<br/>
                                    3. System marks attendance automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Student</label>
                                    <Select options={students} value={selectedStudent} onChange={setSelectedStudent} isDisabled={isRegistering} />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Select a student who doesn't have face data yet, then capture their photo to register them.
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={() => setIsCameraOn(!isCameraOn)}
                            disabled={(activeTab === 'live' && !selectedSubject) || (activeTab === 'register' && !selectedStudent) || isRegistering}
                            className={`w-full mt-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                isCameraOn ? 'bg-gray-900 hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isCameraOn ? <><StopIcon className="w-5 h-5" /> Stop Camera</> : <><VideoCameraIcon className="w-5 h-5" /> Start Camera</>}
                        </button>
                    </div>

                    {/* Feedback Card */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`p-4 rounded-2xl border-l-4 shadow-md ${
                                    feedback.type === 'success' ? 'bg-green-50 border-green-500' : 
                                    feedback.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                                    'bg-red-50 border-red-500'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {feedback.type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-green-600" /> : 
                                     feedback.type === 'warning' ? <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" /> :
                                     <XCircleIcon className="w-6 h-6 text-red-600" />}
                                    <div>
                                        <h4 className={`font-bold ${
                                            feedback.type === 'success' ? 'text-green-800' : 
                                            feedback.type === 'warning' ? 'text-amber-800' :
                                            'text-red-800'
                                        }`}>{feedback.message}</h4>
                                        {feedback.details && <p className="text-sm text-gray-600">{feedback.details}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Camera Feed */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200">
                        {isCameraOn ? (
                            <>
                                <Webcam
                                    ref={webcamRef}
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror
                                />
                                
                                {/* Flash Effect */}
                                <AnimatePresence>
                                    {flash && (
                                        <motion.div 
                                            initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white pointer-events-none z-20"
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Scanning Line (Only in Live Mode) */}
                                {activeTab === 'live' && (
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(255,0,0,0.1)_50%,transparent_100%)] bg-[length:100%_200%] animate-scan" />
                                )}
                                
                                {/* Register Capture Button */}
                                {activeTab === 'register' && !isRegistering && (
                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                                        <button 
                                            onClick={() => captureAndSend('/face/register/', { student_id: selectedStudent.value }, true)}
                                            className="bg-white text-red-600 p-4 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-red-100"
                                        >
                                            <CameraIcon className="w-8 h-8" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <CameraIcon className="w-16 h-16 mb-4 opacity-50" />
                                <p>Camera is inactive</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLiveAttendancePage;