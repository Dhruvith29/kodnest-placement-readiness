import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ResumeHome() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
            {/* Nav */}
            <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <div className="text-xl font-bold tracking-tight">AI Resume Builder</div>
                <div className="flex gap-6 text-sm font-medium text-gray-600">
                    <Link to="/resume/builder" className="hover:text-black transition-colors">Builder</Link>
                    <Link to="/resume/preview" className="hover:text-black transition-colors">Preview</Link>
                    <Link to="/resume/proof" className="hover:text-black transition-colors">Proof</Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mb-8 animate-fade-in-up">
                    <Sparkles className="h-4 w-4" />
                    <span>Powered by Intelligence</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
                    Build a Resume <br />
                    <span className="text-gray-400">That Gets Read.</span>
                </h1>

                <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
                    Create a professional, ATS-friendly resume in minutes.
                    Clean design, smart formatting, and premium typography.
                </p>

                <Link
                    to="/resume/builder"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl"
                >
                    Start Building <ArrowRight className="h-5 w-5" />
                </Link>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">
                &copy; {new Date().getFullYear()} KodNest Premium Build System
            </footer>
        </div>
    );
}
