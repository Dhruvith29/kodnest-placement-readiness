import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2, Copy, ExternalLink, Trophy, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
    { id: '1', label: '1. Project Setup & Routing' },
    { id: '2', label: '2. UI Implementation (Premium Design)' },
    { id: '3', label: '3. Core Logic (Analyzer Engine)' },
    { id: '4', label: '4. Data Persistence (LocalStorage)' },
    { id: '5', label: '5. Interactive Features (Toggles/Score)' },
    { id: '6', label: '6. Hardening (Validation & Schema)' },
    { id: '7', label: '7. Testing (Checklist Verification)' },
    { id: '8', label: '8. Deployment (Vercel/Netlify)' }
];

export default function ProofPage() {
    const [steps, setSteps] = useState(() => {
        const saved = localStorage.getItem('prp_proof_steps');
        return saved ? JSON.parse(saved) : {};
    });

    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('prp_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deployed: '' };
    });

    const [checklistPassed, setChecklistPassed] = useState(false);

    useEffect(() => {
        localStorage.setItem('prp_proof_steps', JSON.stringify(steps));
    }, [steps]);

    useEffect(() => {
        localStorage.setItem('prp_final_submission', JSON.stringify(links));
    }, [links]);

    useEffect(() => {
        const savedChecklist = localStorage.getItem('prp_test_checklist');
        if (savedChecklist) {
            const parsed = JSON.parse(savedChecklist);
            const passedCount = Object.values(parsed).filter(Boolean).length;
            setChecklistPassed(passedCount === 10);
        }
    }, []);

    const handleStepToggle = (id) => {
        setSteps(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLinkChange = (field, value) => {
        setLinks(prev => ({ ...prev, [field]: value }));
    };

    const isStepsComplete = STEPS.every(s => steps[s.id]);
    const isLinksComplete = Object.values(links).every(l => l && l.startsWith('http'));
    const isShipped = checklistPassed && isStepsComplete && isLinksComplete;

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
        `.trim();
        navigator.clipboard.writeText(text);
        alert("Final submission copied to clipboard!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header / Status Badge */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Proof of Work</h1>
                    <p className="text-gray-500 mt-1">Finalize your project for submission.</p>
                </div>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${isShipped ? 'bg-green-100 border-green-200 text-green-800' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                    {isShipped ? <Trophy className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-bold uppercase tracking-wide">{isShipped ? "Shipped" : "In Progress"}</span>
                </div>
            </div>

            {isShipped && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-green-900 mb-4">You built a real product.</h2>
                    <p className="text-lg text-green-800 max-w-2xl mx-auto leading-relaxed">
                        Not a tutorial. Not a clone.<br />
                        A structured tool that solves a real problem.<br />
                        <span className="font-semibold block mt-4">This is your proof of work.</span>
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step A: Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>A) Step Completion Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {STEPS.map(step => (
                            <label key={step.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                                <input
                                    type="checkbox"
                                    checked={!!steps[step.id]}
                                    onChange={() => handleStepToggle(step.id)}
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className={`font-medium ${steps[step.id] ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                            </label>
                        ))}
                    </CardContent>
                </Card>

                {/* Step B: Links */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>B) Artifact Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!checklistPassed && (
                                <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
                                    <strong>Warning:</strong> System Checklist not passed. Go to <Link to="/prp/07-test" className="underline">Tests</Link>.
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lovable Project Link</label>
                                <input
                                    type="url"
                                    placeholder="https://lovable.dev/..."
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository Link</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/..."
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deployed URL</label>
                                <input
                                    type="url"
                                    placeholder="https://vercel.app/..."
                                    value={links.deployed}
                                    onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={isShipped ? "border-green-200 bg-green-50/50" : "opacity-75 grayscale"}>
                        <CardHeader>
                            <CardTitle>Final Submission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4">
                                Once all steps are marked complete and links are valid, copy your final submission.
                            </p>
                            <button
                                onClick={copyFinalSubmission}
                                disabled={!isShipped}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${isShipped
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Copy className="h-5 w-5" />
                                Copy Final Submission
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
