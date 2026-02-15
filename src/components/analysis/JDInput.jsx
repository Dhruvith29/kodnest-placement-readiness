import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
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

    const handleAnalyze = async () => {
        if (!jdText.trim()) return;

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
