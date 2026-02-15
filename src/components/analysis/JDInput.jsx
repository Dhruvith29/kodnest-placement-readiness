import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { analyzeJD } from '../../lib/analyzer';
import { saveAnalysis } from '../../lib/storage';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

export default function JDInput() {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    const handleAnalyze = async () => {
        setError('');
        setWarning('');

        if (!jdText.trim()) {
            setError('Please paste a Job Description to proceed.');
            return;
        }

        if (jdText.length < 200) {
            setWarning('This JD is too short to analyze deeply. Paste full JD for better output.');
            // We allow proceeding, but show warning. User can click again or we can auto-proceed with warning?
            // Requirement says "show calm warning". It doesn't strictly say block. 
            // But let's add a small confirmation or just show it nearby.
            // Let's assume we proceed but display the warning in the UI if we don't navigate immediately.
            // However, the analyzing happens immediately. 
            // Let's delay slighty or just show it as a toast if we had one.
            // Better: Show warning inline and let them click "Analyze" again or just proceed?
            // Let's proceed but maybe store the warning? Or just let the analysis be "light".
            // Actually, usually "show warning" implies interrupting. 
            // But "This JD is too short..." usually implies a quality nudge.
            // Let's use a confirm dialog or just proceed with a visible warning status if we were staying on page.
            // Since we navigate away, maybe we just alert? No, "calm warning".
            // Let's set a state and return if it's the *first* attempt, but maybe that's annoying.
            // Let's just proceed for now but maybe UI shd reflect it? 
            // Re-reading: "If JD < 200 characters: show calm warning". 
            // Let's implement this: If < 200, set warning. If they click again, proceed.
            if (!warning) {
                setWarning('This JD is too short to analyze deeply. Click Analyze again to proceed anyway.');
                return;
            }
        }

        setIsAnalyzing(true);

        // Simulate a small delay for "processing" feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = analyzeJD(jdText, company, role);
        saveAnalysis(result);
        setIsAnalyzing(false);

        // Navigate to results page (using a query param for ID)
        navigate(`/dashboard/results?id=${result.id}`);
    };

    return (
        <Card className="border-indigo-100 shadow-md">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    New Analysis
                </CardTitle>
                <CardDescription>Paste a Job Description (JD) to get a tailored preparation plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Google, Amazon"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. SDE-1, Frontend Engineer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Job Description *</label>
                    <textarea
                        className="w-full min-h-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-gray-600"
                        placeholder="Paste the full JD text here..."
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-500 font-medium px-1">{error}</p>}
                {warning && <p className="text-sm text-amber-600 font-medium px-1 bg-amber-50 p-2 rounded border border-amber-200">{warning}</p>}

                <button
                    onClick={handleAnalyze}
                    disabled={!jdText.trim() || isAnalyzing}
                    className="w-full flex items-center justify-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze JD'
                    )}
                </button>
            </CardContent>
        </Card>
    );
}
