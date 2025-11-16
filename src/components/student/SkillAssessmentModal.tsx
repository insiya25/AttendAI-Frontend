// src/components/student/SkillAssessmentModal.tsx
import React from "react";

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold">Verify {selectedSkill.skill_name}</h2>
                {/* ... rest of the modal content is the same as your JSX ... */}
                <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancel</button>
                    <button onClick={() => onStart(selectedSkill)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Start Assessment</button>
                </div>
            </div>
        </div>
    );
};

export default SkillAssessmentModal;