import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLatestAnalysis, updateAnalysis } from '../lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Progress } from '../components/ui/progress';
import {
    BrainCircuit,
    Calendar,
    CheckSquare,
    Target,
    Download,
    Copy,
    CheckCircle2,
    XCircle,
    ArrowRight
} from 'lucide-react';

export default function ResultsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [skillConfidence, setSkillConfidence] = useState({});
    const [baseScore, setBaseScore] = useState(0);

    // Load Data
    useEffect(() => {
        const id = searchParams.get('id');
        const analysis = id ? getAnalysisById(id) : getLatestAnalysis();

        if (analysis) {
            setData(analysis);

            // Initialize Base Score
            // If baseScore exists in storage, use it. Otherwise, assume the *loaded* readinessScore is the base.
            // But if we already have confidence map, the loaded readinessScore might already be modified.
            // Safety: If baseScore is missing, set it to analysis.readinessScore. 
            // (Imperfect for legacy data if it was already modified, but safe for new flow)
            const initialBase = analysis.baseScore !== undefined ? analysis.baseScore : analysis.readinessScore;
            setBaseScore(initialBase);
            setSkillConfidence(analysis.skillConfidenceMap || {});
        } else {
            navigate('/dashboard');
        }
    }, [searchParams, navigate]);

    // Live Score Calculation & Persistence
    useEffect(() => {
        if (!data) return;

        let modifier = 0;
        const skillsList = Object.values(data.extractedSkills).flat();

        skillsList.forEach(skill => {
            const status = skillConfidence[skill] || 'practice'; // Default to practice
            if (status === 'know') modifier += 2;
            if (status === 'practice') modifier -= 2;
        });

        const newScore = Math.max(0, Math.min(100, baseScore + modifier));

        // Only update interaction if something changed
        if (newScore !== data.readinessScore || JSON.stringify(skillConfidence) !== JSON.stringify(data.skillConfidenceMap)) {
            // Update Local State for UI
            const updatedData = {
                ...data,
                readinessScore: newScore,
                skillConfidenceMap: skillConfidence,
                baseScore: baseScore // Ensure baseScore is persisted
            };
            setData(updatedData);

            // Persist to Storage
            updateAnalysis(data.id, {
                readinessScore: newScore,
                skillConfidenceMap: skillConfidence,
                baseScore: baseScore
            });
        }

    }, [skillConfidence, baseScore, data?.id]); // specific deps to avoid loop


    const handleSkillToggle = (skill) => {
        setSkillConfidence(prev => ({
            ...prev,
            [skill]: prev[skill] === 'know' ? 'practice' : 'know'
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const downloadTxt = () => {
        if (!data) return;
        const content = `
ANALYSIS RESULTS
Role: ${data.role}
Company: ${data.company}
Date: ${new Date(data.createdAt).toLocaleDateString()}
Readiness Score: ${data.readinessScore}/100
------------------------------------------------
SKILLS
${Object.entries(data.extractedSkills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('\n')}
------------------------------------------------
7-DAY PLAN
${data.plan.map(d => `${d.day} (${d.focus}):\n${d.tasks.map(t => `  - ${t}`).join('\n')}`).join('\n\n')}
------------------------------------------------
CHECKLIST
${Object.entries(data.checklist).map(([r, items]) => `${r}:\n${items.map(i => `  - ${i}`).join('\n')}`).join('\n\n')}
------------------------------------------------
QUESTIONS
${data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Placement_Plan_${data.company}_${data.role}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Derived: Top Weak Skills
    const weakSkills = data ? Object.values(data.extractedSkills).flat()
        .filter(s => (skillConfidence[s] || 'practice') === 'practice')
        .slice(0, 3) : [];


    if (!data) return null;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                    <p className="text-gray-500 mt-1">
                        For <span className="font-semibold text-gray-900">{data.role}</span> at <span className="font-semibold text-gray-900">{data.company}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={downloadTxt} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="h-4 w-4" /> Export All
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Live Score</span>
                            <span className="text-3xl font-bold text-primary transition-all duration-300">{data.readinessScore}/100</span>
                        </div>
                        <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-primary transition-all duration-500" style={{ opacity: data.readinessScore / 100 }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Skills & Plan */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                                Interactive Skill Assessment
                            </CardTitle>
                            <CardDescription>Click to toggle: <CheckCircle2 className="inline h-3 w-3 text-green-600" /> I know this vs <XCircle className="inline h-3 w-3 text-gray-400" /> Need practice</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(data.extractedSkills).map(([category, skills]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, idx) => {
                                                const status = skillConfidence[skill] || 'practice';
                                                const isKnown = status === 'know';
                                                return (
                                                    <button
                                                        key={`${category}-${idx}`}
                                                        onClick={() => handleSkillToggle(skill)}
                                                        className={`group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isKnown
                                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {isKnown ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> : <XCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" />}
                                                        {skill}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-500" />
                                7-Day Preparation Plan
                            </CardTitle>
                            <button onClick={() => copyToClipboard(data.plan.map(d => `${d.day}: ${d.focus}`).join('\n'))} className="text-gray-400 hover:text-gray-600">
                                <Copy className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.plan.map((day, index) => (
                                <div key={index} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
                                    <div className="mb-2">
                                        <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded mr-2">{day.day}</span>
                                        <span className="font-semibold text-gray-900">{day.focus}</span>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {day.tasks.map((task, tIdx) => (
                                            <li key={tIdx} className="pl-1 leading-relaxed">{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Questions, Checklists, Action */}
                <div className="space-y-6">
                    {/* Action Next */}
                    <Card className="bg-indigo-50 border-indigo-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Action Next
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-indigo-700 mb-3">
                                You identified <strong>{weakSkills.length}</strong> skills to practice. Start with these:
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {weakSkills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white text-indigo-600 text-xs font-bold rounded border border-indigo-100">
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <button className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
                                Start Day 1 Plan Now <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </CardContent>
                    </Card>

                    {/* Questions */}
                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <BrainCircuit className="h-5 w-5 text-indigo-300" />
                                Interview Qs
                            </CardTitle>
                            <button onClick={() => copyToClipboard(data.questions.join('\n'))} className="text-gray-400 hover:text-white">
                                <Copy className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.questions.map((q, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                                    <span className="text-gray-200">{q}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Checklist */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5 text-green-500" />
                                Checklist
                            </CardTitle>
                            <button onClick={() => copyToClipboard(JSON.stringify(data.checklist, null, 2))} className="text-gray-400 hover:text-gray-600">
                                <Copy className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(data.checklist).map(([round, items], idx) => (
                                <div key={idx}>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-2 pb-1 border-b border-gray-100">{round}</h4>
                                    <ul className="text-sm space-y-2">
                                        {items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-600">
                                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

