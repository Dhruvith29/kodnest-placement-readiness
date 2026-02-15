import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResumeProof() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <nav className="h-16 px-8 flex items-center border-b border-gray-100">
                <Link to="/resume" className="text-gray-500 hover:text-black transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" /> Back Home
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Proof of Work</h1>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Your resume artifacts and build history will appear here.
                    This feature is currently under development.
                </p>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 max-w-lg w-full text-left">
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Artifacts</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Resume JSON Data</span>
                            <span className="text-indigo-600 font-mono">resumeData.json</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">PDF Export</span>
                            <span className="text-gray-400 italic">Pending...</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
