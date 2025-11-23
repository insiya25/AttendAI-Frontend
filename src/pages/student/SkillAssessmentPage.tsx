// src/pages/student/SkillAssessmentPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import apiClient from '../../api/axios';
import { 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    CpuChipIcon,
    SparklesIcon,
    MicrophoneIcon,
    VideoCameraIcon,
    VideoCameraSlashIcon,
    StopIcon,
    SpeakerWaveIcon
} from '@heroicons/react/24/outline';

// --- Types ---
type Stage = 'start' | 'loading_questions' | 'in_progress' | 'evaluating' | 'completed';
type Mode = 'text' | 'voice';

interface Result {
    total_score: number;
    max_score: number;
    verified: boolean;
    overall_review: string;
    detailed_results: {
        question: string;
        answer: string;
        rating: number;
        suggestion: string;
        marks: number;
    }[];
}

// --- Helper for Web Speech API ---
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const SkillAssessmentPage = () => {
    const { skillName, skillId } = useParams<{ skillName: string; skillId: string }>();
    const navigate = useNavigate();
    
    // State
    const [stage, setStage] = useState<Stage>('start');
    const [mode, setMode] = useState<Mode>('text');
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState<Result | null>(null);
    const [error, setError] = useState('');

    // Voice Mode State
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    // --- AI & Setup Logic ---

    const handleStartTest = async (selectedMode: Mode) => {
        setMode(selectedMode);
        setStage('loading_questions');
        try {
            const response = await apiClient.post('/assessment/start/', { skill_name: skillName });
            setQuestions(response.data.questions);
            setAnswers(new Array(response.data.questions.length).fill(''));
            setStage('in_progress');
            
            // If Voice Mode, Trigger First Question Read
            if (selectedMode === 'voice') {
                setTimeout(() => speakQuestion(response.data.questions[0]), 1000);
            }
        } catch (err) {
            setError('Failed to generate questions. Please try again.');
            setStage('start');
        }
    };

    // --- Voice Logic (TTS & STT) ---

    const speakQuestion = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onstart = () => setIsAISpeaking(true);
            utterance.onend = () => setIsAISpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startListening = () => {
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Try Chrome.");
            return;
        }
        
        window.speechSynthesis.cancel(); // Stop AI if student interrupts
        setIsAISpeaking(false);

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            // Update the input field real-time
            const newAnswers = [...answers];
            // Append to existing answer for this question so we don't lose previous chunks if stopped/started
            // Note: For simplicity in this demo, we replace the current session's buffer. 
            // A more complex version would append.
            setTranscript(currentTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
            // When stopped, commit transcript to main answers array
            if (transcript) {
                const newAnswers = [...answers];
                // Append current transcript to whatever was already there (allows pausing/resuming)
                const previous = newAnswers[currentQuestionIndex] || '';
                newAnswers[currentQuestionIndex] = previous + (previous ? ' ' : '') + transcript;
                setAnswers(newAnswers);
                setTranscript(''); // Clear temp buffer
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // Handle manual text change (works in both modes)
    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = e.target.value;
        setAnswers(newAnswers);
    };

    // Navigation
    const handleNextQuestion = () => {
        // Stop any ongoing audio/recording
        stopListening();
        window.speechSynthesis.cancel();

        // Commit any pending transcript
        if (transcript) {
            const newAnswers = [...answers];
            const previous = newAnswers[currentQuestionIndex] || '';
            newAnswers[currentQuestionIndex] = previous + (previous ? ' ' : '') + transcript;
            setAnswers(newAnswers);
            setTranscript('');
        }

        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        
        // Speak next question automatically in voice mode
        if (mode === 'voice') {
            setTimeout(() => speakQuestion(questions[nextIdx]), 500);
        }
    };

    const handlePrevQuestion = () => {
        stopListening();
        window.speechSynthesis.cancel();
        setCurrentQuestionIndex(i => i - 1);
    };

    const handleSubmitAssessment = async () => {
        stopListening();
        window.speechSynthesis.cancel();
        
        // Final commit of transcript if active
        let finalAnswers = [...answers];
        if (transcript) {
            const previous = finalAnswers[currentQuestionIndex] || '';
            finalAnswers[currentQuestionIndex] = previous + (previous ? ' ' : '') + transcript;
        }

        setStage('evaluating');
        const qa_pairs = questions.map((q, index) => ({ question: q, answer: finalAnswers[index] }));
        try {
            const response = await apiClient.post('/assessment/submit/', { skillId, qa_pairs });
            setResults(response.data);
            setStage('completed');
        } catch (err) {
            setError('Failed to evaluate. Please try again.');
            setStage('in_progress'); 
        }
    };

    // --- Renders ---

    const renderStart = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600" />
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <CpuChipIcon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Skill Assessment: <span className="text-red-600">{skillName}</span></h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
                Select your preferred mode. Both modes are powered by AI evaluation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => handleStartTest('text')} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all flex-1">
                    Text Mode
                </button>
                <button onClick={() => handleStartTest('voice')} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 flex-1 flex items-center justify-center gap-2">
                    <VideoCameraIcon className="w-5 h-5" /> Interview Mode
                </button>
            </div>
            {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </motion.div>
    );

    const renderVoiceInProgress = () => (
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: AI & Question */}
            <div className="flex flex-col justify-center space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    {isAISpeaking && (
                        <div className="absolute top-0 right-0 p-4">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${isAISpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                            <SpeakerWaveIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Interviewer</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                        {questions[currentQuestionIndex]}
                    </h2>
                    <button onClick={() => speakQuestion(questions[currentQuestionIndex])} className="text-red-600 text-sm font-bold mt-4 hover:underline">
                        Replay Question
                    </button>
                </div>

                {/* Transcript Area */}
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 min-h-[200px]">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Live Transcript</p>
                    <textarea
                        value={isListening ? (answers[currentQuestionIndex] + (transcript ? ' ' + transcript : '')) : answers[currentQuestionIndex]}
                        onChange={handleAnswerChange} // Allow manual correction even in voice mode
                        className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-700 text-lg resize-none p-0"
                        placeholder="Speak your answer..."
                    />
                </div>
            </div>

            {/* RIGHT: Camera & Controls */}
            <div className="flex flex-col gap-6">
                <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200">
                    {isCameraOn ? (
                        <Webcam 
                            audio={false}
                            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                            <VideoCameraSlashIcon className="w-16 h-16" />
                        </div>
                    )}
                    
                    {/* Overlay Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button 
                            onClick={() => setIsCameraOn(!isCameraOn)} 
                            className="p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all"
                        >
                            {isCameraOn ? <VideoCameraIcon className="w-5 h-5" /> : <VideoCameraSlashIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Recording Indicator */}
                    {isListening && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full" /> Recording
                        </div>
                    )}
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-3 gap-4 items-center">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 disabled:opacity-0"
                    >
                        Previous
                    </button>

                    <div className="flex justify-center">
                        {!isListening ? (
                            <button 
                                onClick={startListening}
                                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700 hover:scale-105 transition-all border-4 border-red-100"
                            >
                                <MicrophoneIcon className="w-8 h-8" />
                            </button>
                        ) : (
                            <button 
                                onClick={stopListening}
                                className="w-20 h-20 bg-white border-4 border-red-600 rounded-full flex items-center justify-center text-red-600 shadow-lg hover:bg-red-50 transition-all animate-pulse"
                            >
                                <StopIcon className="w-8 h-8" />
                            </button>
                        )}
                    </div>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className="py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2"
                        >
                            Next <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmitAssessment} 
                            className="py-4 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"
                        >
                            Submit <CheckCircleIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-wide">
                    {isListening ? 'Listening...' : 'Tap Mic to Speak'}
                </p>
            </div>
        </div>
    );

    // Reuse text renderer from before
    const renderTextInProgress = () => (
        <div className="max-w-3xl w-full">
             <div className="mb-8 flex justify-between items-end">
                <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Assessment in Progress</span>
                    <h2 className="text-2xl font-bold text-gray-900">Question {currentQuestionIndex + 1} <span className="text-gray-400 font-normal">/ {questions.length}</span></h2>
                </div>
                <div className="text-sm font-medium text-gray-500">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <motion.div className="h-full bg-red-600 rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
            </div>
            <motion.div 
                key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">{questions[currentQuestionIndex]}</p>
                <div className="relative">
                    <textarea
                        value={answers[currentQuestionIndex]}
                        onChange={handleAnswerChange}
                        placeholder="Type your answer here..."
                        className="w-full h-64 p-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none text-gray-700 placeholder-gray-400"
                        autoFocus
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium pointer-events-none">{answers[currentQuestionIndex]?.length || 0} chars</div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0} className="flex items-center px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-0"><ArrowLeftIcon className="h-5 w-5 mr-2" /> Previous</button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button onClick={() => setCurrentQuestionIndex(i => i + 1)} className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">Next <ArrowRightIcon className="h-5 w-5 ml-2" /></button>
                    ) : (
                        <button onClick={handleSubmitAssessment} className="flex items-center px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">Submit Assessment <CheckCircleIcon className="h-5 w-5 ml-2" /></button>
                    )}
                </div>
            </motion.div>
        </div>
    );

    const renderLoading = (text: string) => (
        <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 animate-pulse">{text}</h3>
            <p className="text-gray-500 mt-2">This involves complex AI processing...</p>
        </div>
    );

    const renderCompleted = () => (
        results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-red-50/50 opacity-50" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment Results</h2>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Final Score</p>
                                <p className="text-5xl font-black text-gray-900">{results.total_score} <span className="text-2xl text-gray-400 font-medium">/ {results.max_score}</span></p>
                            </div>
                            <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border ${results.verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {results.verified ? (
                                    <><CheckCircleIcon className="w-8 h-8" /><div className="text-left"><p className="font-bold text-lg leading-none">Verified!</p><p className="text-xs opacity-80">Badge Awarded</p></div></>
                                ) : (
                                    <><XCircleIcon className="w-8 h-8" /><div className="text-left"><p className="font-bold text-lg leading-none">Not Verified</p><p className="text-xs opacity-80">Try again later</p></div></>
                                )}
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-left">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">AI Overall Review</h4>
                            <div className="prose prose-sm prose-red max-w-none text-gray-700">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{results.overall_review}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-red-600" />Detailed Breakdown</h3>
                <div className="space-y-6">
                    {results.detailed_results.map((res, index) => (
                        <div key={index} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${res.rating >= 6 ? 'border-green-200 border-l-4 border-l-green-500' : 'border-red-200 border-l-4 border-l-red-500'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-800 text-lg">Question {index + 1}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.rating >= 6 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Rating: {res.rating}/10</span>
                            </div>
                            <p className="text-gray-600 mb-4 font-medium italic">"{res.question}"</p>
                            <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Your Answer</p>
                                <p className="text-gray-700 whitespace-pre-wrap text-sm">{res.answer}</p>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <CpuChipIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div><span className="font-bold text-gray-900">AI Feedback: </span><span className="text-gray-600">{res.suggestion}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12 mb-12">
                    <button onClick={() => navigate('/profile')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">Back to Profile</button>
                </div>
            </motion.div>
        )
    );

    const stageContent = {
        'start': renderStart(),
        'loading_questions': renderLoading('Generating customized questions...'),
        'in_progress': mode === 'voice' ? renderVoiceInProgress() : renderTextInProgress(),
        'evaluating': renderLoading('AI is grading your answers...'),
        'completed': renderCompleted()
    };
    
    return (
        <div className="min-h-screen bg-gray-50 relative overflow-y-auto overflow-x-hidden flex flex-col">
             <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
                {stageContent[stage]}
            </div>
        </div>
    );
};

export default SkillAssessmentPage;