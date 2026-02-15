import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getLatestAnalysis } from '../lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Progress } from '../components/ui/progress';
import { BadgeCheck, BrainCircuit, Calendar, CheckSquare, Target } from 'lucide-react';

export default function ResultsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        const analysis = id ? getAnalysisById(id) : getLatestAnalysis();

        if (analysis) {
            setData(analysis);
        } else {
            // Redirect to dashboard if no data found
            navigate('/dashboard');
        }
    }, [searchParams, navigate]);

    if (!data) return null;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                    <p className="text-gray-500 mt-1">
                        For <span className="font-semibold text-gray-900">{data.role}</span> at <span className="font-semibold text-gray-900">{data.company}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 font-medium">Readiness Score</span>
                        <span className="text-3xl font-bold text-primary">{data.readinessScore}/100</span>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-primary" style={{ opacity: data.readinessScore / 100 }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Skills & Checklist */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                                Identified Skills
                            </CardTitle>
                            <CardDescription>Key technologies and concepts extracted from the JD</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(data.extractedSkills).map(([category, skills]) => (
                                    skills.map((skill, idx) => (
                                        <span key={`${category}-${idx}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {skill}
                                            <span className="ml-2 text-xs text-indigo-400 border-l border-indigo-200 pl-2 uppercase tracking-wider">{category}</span>
                                        </span>
                                    ))
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-500" />
                                7-Day Preparation Plan
                            </CardTitle>
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

                {/* Right Column: Questions & Rounds */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-900 to-gray-900 text-white border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Target className="h-5 w-5 text-indigo-300" />
                                Top Interview Questions
                            </CardTitle>
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5 text-green-500" />
                                Round Checklist
                            </CardTitle>
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
