import emailjs from '@emailjs/browser';

// REPLACE WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
const SERVICE_ID = 'service_krfrhip';
const TEMPLATE_ID_TEACHER = 'template_djqk1td'; 
const TEMPLATE_ID_STUDENT = 'template_6inpupy';
const PUBLIC_KEY = '2B-KrIFw3fS-U5MCE';

export const sendApprovalRequestEmail = async (toName: string, studentName: string, subject: string, message: string) => {
    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID_TEACHER, {
            to_name: toName,
            from_name: studentName,
            subject: subject,
            message: message,
        }, PUBLIC_KEY);
    } catch (error) {
        console.error("EmailJS Error:", error);
    }
};

export const sendApprovalDecisionEmail = async (studentName: string, teacherName: string, status: string, subject: string) => {
    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID_STUDENT, {
            to_name: studentName,
            from_name: teacherName,
            subject: subject,
            status: status, // "Approved" or "Rejected"
        }, PUBLIC_KEY);
    } catch (error) {
        console.error("EmailJS Error:", error);
    }
};