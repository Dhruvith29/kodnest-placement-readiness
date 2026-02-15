import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import ResumePreviewComponent from '../../components/resume/ResumePreviewComponent';

export default function ResumePreview() {
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
            setResumeData(JSON.parse(saved));
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-50 print:hidden">
                <Link to="/resume/builder" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Builder
                </Link>
                <div className="font-bold tracking-tight">Preview Mode</div>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Printer className="h-4 w-4" /> Print / PDF
                </button>
            </nav>

            {/* Preview Container */}
            <main className="pt-24 pb-20 flex justify-center print:pt-0 print:pb-0">
                <div className="w-[8.5in] min-h-[11in] bg-white shadow-xl print:shadow-none">
                    <ResumePreviewComponent data={resumeData} />
                </div>
            </main>
        </div>
    );
}
