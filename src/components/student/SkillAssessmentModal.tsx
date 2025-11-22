// src/components/student/SkillAssessmentModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    XMarkIcon, 
    CpuChipIcon, 
    ListBulletIcon, 
    CheckBadgeIcon, 
    ChartBarIcon 
} from "@heroicons/react/24/outline";

interface Skill {
    id: number;
    skill_name: string;
}

interface ModalProps {
    selectedSkill: Skill | null;
    onClose: () => void;
    onStart: (skill: Skill) => void;
}

const SkillAssessmentModal = ({ selectedSkill, onClose, onStart }: ModalProps) => {
    if (!selectedSkill) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose} 
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
                />
                
                {/* Modal Content */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/50"
                >
                    {/* Decorative Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-500 px-8 py-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h2 className="text-2xl font-bold text-white relative z-10">Verify Skill</h2>
                        <p className="text-red-100 text-sm mt-1 relative z-10">
                            Assessment for <span className="font-bold text-white underline decoration-red-300">{selectedSkill.skill_name}</span>
                        </p>
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                <CpuChipIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">AI-Powered Assessment</h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                                    Our AI will generate a unique set of technical questions to validate your proficiency.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assessment Rules</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <ListBulletIcon className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>There will be <strong>5 questions</strong> generated.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <ChartBarIcon className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>Each question carries <strong>2 marks</strong> (Total 10).</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckBadgeIcon className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>To get verified, you need a score of <strong>4+ marks</strong>.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CpuChipIcon className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>For a correct answer (2 marks), our AI must rate your answer <strong>6/10 or higher</strong>.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={onClose} 
                                className="flex-1 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => onStart(selectedSkill)} 
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all transform active:scale-95"
                            >
                                Start Assessment
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SkillAssessmentModal;