import React, { useEffect, useState } from 'react';
import ContextHeader from '../../components/layout/ContextHeader';
import { CheckCircle2, Copy, Rocket, ExternalLink, AlertCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeProofPage = () => {
    const [progress, setProgress] = useState({});
    const [checklistPassed, setChecklistPassed] = useState(false);

    // Links state
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('rb_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deployed: '' };
    });

    useEffect(() => {
        // Load progress (Steps 1-8)
        const newProgress = {};
        for (let i = 1; i <= 8; i++) {
            const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
            if (artifact) {
                newProgress[i] = JSON.parse(artifact);
            }
        }
        setProgress(newProgress);

        // Load Checklist Status (Step 7)
        const savedChecklist = localStorage.getItem('rb_test_checklist');
        if (savedChecklist) {
            const parsed = JSON.parse(savedChecklist);
            const items = Object.values(parsed);
            // Assuming 10 items, but logically if all keys present are true. 
            // Better to check specific length or if all values are true.
            const passedCount = items.filter(Boolean).length;
            setChecklistPassed(passedCount >= 10); // 10 items in list
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify(links));
    }, [links]);

    const isStepsComplete = [1, 2, 3, 4, 5, 6, 7, 8].every(step => !!progress[step]);
    const isLinksComplete = Object.values(links).every(l => l && l.startsWith('http'));
    // Shipped Logic: All Steps + Checklist + Links
    const isShipped = isStepsComplete && checklistPassed && isLinksComplete;

    const handleCopySubmission = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
        `.trim();
        navigator.clipboard.writeText(text);
        alert("Final submission copied to clipboard!");
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Proof of Work</h1>
                        <p className="text-gray-500 mt-1">Finalize your project for submission.</p>
                    </div>
                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${isShipped ? 'bg-green-100 border-green-200 text-green-800' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                        {isShipped ? <Trophy className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-bold uppercase tracking-wide">{isShipped ? "Shipped" : "In Progress"}</span>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-20">

                {isShipped && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-2xl font-bold text-green-900 mb-4">Project 3 Shipped Successfully.</h2>
                        <p className="text-lg text-green-800 max-w-2xl mx-auto leading-relaxed opacity-90">
                            You've built a complex, data-driven application with real persistence and logic.<br />
                            This is premium software engineering.
                        </p>
                    </div>
                )}

                {/* A) Step Completion Overview */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">A) Step Completion Overview</h3>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(step => {
                            const isDone = !!progress[step];
                            return (
                                <div key={step} className={`p-4 rounded-xl border ${isDone ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'} flex items-center justify-between transition-colors`}>
                                    <span className={`font-semibold ${isDone ? 'text-green-800' : 'text-gray-400'}`}>Step {step}</span>
                                    {isDone ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* B) Artifact Collection */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">B) Artifact Collection</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {!checklistPassed && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <div>
                                    <strong className="block font-bold">Checklist Validation Failed</strong>
                                    <span className="text-sm">You must complete all 10 items in the <Link to="/rb/07-test" className="underline font-medium hover:text-red-800">Testing Checklist</Link> before shipping.</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Lovable Project Link <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://lovable.dev/..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={links.lovable}
                                        onChange={e => setLinks({ ...links, lovable: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 space-y-2">
                                <label className="text-sm font-medium text-gray-700">GitHub Repository <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={links.github}
                                        onChange={e => setLinks({ ...links, github: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Deployed URL <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="url"
                                        placeholder="https://vercel.app/..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={links.deploy}
                                        onChange={e => setLinks({ ...links, deploy: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Action */}
                <div className={`transition-all duration-500 ${isShipped ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale'}`}>
                    <button
                        onClick={handleCopySubmission}
                        disabled={!isShipped}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${isShipped
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Copy className="h-6 w-6" />
                        Copy Final Submission
                    </button>
                    {!isShipped && (
                        <p className="text-center text-sm text-gray-400 mt-2">
                            Complete all steps, pass the checklist, and provide all links to unlock submission.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ResumeProofPage;
