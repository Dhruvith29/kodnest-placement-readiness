import React, { useEffect, useState } from 'react';
import ContextHeader from '../../components/layout/ContextHeader';
import { CheckCircle2, Copy, Rocket, ExternalLink } from 'lucide-react';

const ResumeProofPage = () => {
    const [progress, setProgress] = useState({});

    // Links state
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });

    useEffect(() => {
        // Load progress
        const newProgress = {};
        for (let i = 1; i <= 8; i++) {
            const artifact = localStorage.getItem(`rb_step_${i}_artifact`);
            if (artifact) {
                newProgress[i] = JSON.parse(artifact);
            }
        }
        setProgress(newProgress);
    }, []);

    const handleCopySubmission = () => {
        const text = `
Project: AI Resume Builder
Lovable Link: ${links.lovable}
GitHub Repo: ${links.github}
Deployment: ${links.deploy}
        `.trim();
        navigator.clipboard.writeText(text);
        alert("Submission details copied to clipboard!");
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-8 pb-0">
                <ContextHeader
                    title="Proof of Work"
                    description="Verify and submit your final build artifacts."
                />
            </div>

            <div className="p-8 max-w-5xl mx-auto w-full space-y-10">

                {/* 8 Step Status Grid */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Build Track Progress</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(step => {
                            const isDone = !!progress[step];
                            return (
                                <div key={step} className={`p-4 rounded-xl border ${isDone ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'} flex items-center justify-between`}>
                                    <span className={`font-semibold ${isDone ? 'text-green-800' : 'text-gray-400'}`}>Step {step}</span>
                                    {isDone ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Submission Inputs */}
                <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-indigo-600" />
                        Final Shipment Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Lovable Project Link</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="https://lovable.dev/..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={links.lovable}
                                    onChange={e => setLinks({ ...links, lovable: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-span-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700">GitHub Repository</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="https://github.com/..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={links.github}
                                    onChange={e => setLinks({ ...links, github: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Live Deployment URL</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="https://my-app.vercel.app"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={links.deploy}
                                    onChange={e => setLinks({ ...links, deploy: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleCopySubmission}
                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5"
                    >
                        <Copy className="h-5 w-5" />
                        Copy Final Submission
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ResumeProofPage;
