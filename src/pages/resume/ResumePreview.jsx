import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Copy, AlertTriangle, Check, X } from 'lucide-react';
import ResumePreviewComponent from '../../components/resume/ResumePreviewComponent';

export default function ResumePreview() {
    const [resumeData, setResumeData] = useState(null);
    const [showValidationWarning, setShowValidationWarning] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            setResumeData(JSON.parse(saved));
        }
    }, []);

    // Validation Logic
    const validateResume = () => {
        if (!resumeData) return false;
        const hasName = resumeData.personal?.name?.trim().length > 0;
        const hasExperience = resumeData.experience?.length > 0;
        const hasProjects = resumeData.projects?.length > 0;

        // "Name + (Experience OR Projects)"
        if (!hasName || (!hasExperience && !hasProjects)) {
            return false; // Invalid
        }
        return true; // Valid
    };

    const handlePrint = () => {
        if (!validateResume()) {
            setShowValidationWarning('print');
        } else {
            window.print();
        }
    };

    const handleCopyText = () => {
        if (!validateResume()) {
            setShowValidationWarning('copy');
        } else {
            performCopy();
        }
    };

    const confirmAction = () => {
        if (showValidationWarning === 'print') {
            window.print();
        } else if (showValidationWarning === 'copy') {
            performCopy();
        }
        setShowValidationWarning(false);
    };

    const performCopy = () => {
        if (!resumeData) return;

        const { personal, summary, experience, projects, skills, links, education } = resumeData;

        let text = `${personal.name || 'Name'}\n`;
        text += `${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''}\n`;
        text += `${links.linkedin ? 'LinkedIn: ' + links.linkedin : ''} ${links.github ? '| GitHub: ' + links.github : ''}\n\n`;

        if (summary) text += `SUMMARY\n${summary}\n\n`;

        if (experience.length > 0) {
            text += `EXPERIENCE\n`;
            experience.forEach(exp => {
                text += `${exp.role} at ${exp.company} (${exp.duration})\n${exp.description}\n\n`;
            });
        }

        if (projects.length > 0) {
            text += `PROJECTS\n`;
            projects.forEach(proj => {
                text += `${proj.name} (${proj.tech})\n${proj.description}\n${proj.link || ''}\n\n`;
            });
        }

        if (skills) text += `SKILLS\n${skills}\n\n`;

        if (education.length > 0) {
            text += `EDUCATION\n`;
            education.forEach(edu => {
                text += `${edu.school} - ${edu.degree} (${edu.year})\n`;
            });
        }

        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    if (!resumeData) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            {/* Action Bar */}
            <div className="w-full max-w-[8.5in] flex justify-between items-center mb-6 px-4 md:px-0 no-print">
                <Link to="/resume/builder" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors rounded-lg px-3 py-2 text-sm font-medium hover:bg-white">
                    <ArrowLeft className="h-4 w-4" /> Back to Builder
                </Link>
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                <Printer className="h-4 w-4" /> Print / PDF
            </button>
        </nav>

            {/* Preview Container */ }
    <main className="pt-24 pb-20 flex justify-center print:pt-0 print:pb-0">
        <div className="w-[8.5in] min-h-[11in] bg-white shadow-xl print:shadow-none">
            <ResumePreviewComponent data={resumeData} />
        </div>
    </main>
        </div >
    );
}
