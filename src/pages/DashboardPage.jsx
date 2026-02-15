import React, { useEffect, useState } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { CalendarDays, ArrowRight, History, Clock } from 'lucide-react';
import { getLatestAnalysis } from '../lib/storage';
import JDInput from '../components/analysis/JDInput';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function DashboardPage() {
    const [latestData, setLatestData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLatestData(getLatestAnalysis());
    }, []);

    // Derived data or defaults
    const readinessScore = latestData ? latestData.readinessScore : 35;
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

    // Transform extracted skills for Radar Chart
    const skillData = latestData ? [
        { subject: 'Core CS', A: (latestData.extractedSkills['Core CS']?.length || 0) * 20 + 20, fullMark: 100 },
        { subject: 'Languages', A: (latestData.extractedSkills['Languages']?.length || 0) * 20 + 20, fullMark: 100 },
        { subject: 'Web', A: (latestData.extractedSkills['Web']?.length || 0) * 20 + 20, fullMark: 100 },
        { subject: 'Data', A: (latestData.extractedSkills['Data']?.length || 0) * 20 + 20, fullMark: 100 },
        { subject: 'Cloud', A: (latestData.extractedSkills['Cloud/DevOps']?.length || 0) * 20 + 20, fullMark: 100 },
    ] : [
        { subject: 'DSA', A: 40, fullMark: 100 },
        { subject: 'System Design', A: 30, fullMark: 100 },
        { subject: 'Communication', A: 60, fullMark: 100 },
        { subject: 'Resume', A: 50, fullMark: 100 },
        { subject: 'Aptitude', A: 40, fullMark: 100 },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        {latestData ? `Latest analysis for ${latestData.role} at ${latestData.company}` : 'Start by analyzing a Job Description'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/history')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <History className="h-4 w-4" />
                    View History
                </button>
            </div>

            {/* JD Input Section */}
            <div className="max-w-3xl mx-auto w-full">
                <JDInput />
            </div>

            {latestData && (
                <div className="grid gap-6 md:grid-cols-2 mt-8">
                    {/* 1. Overall Readiness */}
                    <Card className="flex flex-col items-center justify-center p-6 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-center">Overall Readiness</CardTitle>
                            <CardDescription>Based on your latest JD analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-6">
                            <div className="relative flex items-center justify-center">
                                <svg
                                    height={radius * 2}
                                    width={radius * 2}
                                    className="transform -rotate-90"
                                >
                                    <circle
                                        stroke="currentColor"
                                        strokeWidth={stroke}
                                        strokeOpacity="0.1"
                                        fill="transparent"
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                        className="text-primary"
                                    />
                                    <circle
                                        stroke="currentColor"
                                        strokeWidth={stroke}
                                        strokeDasharray={circumference + ' ' + circumference}
                                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                                        fill="transparent"
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                        className="text-primary"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold text-gray-900">{readinessScore}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/dashboard/results?id=${latestData.id}`)}
                                className="mt-6 text-sm font-medium text-primary hover:underline flex items-center"
                            >
                                View Details <ArrowRight className="ml-1 h-3 w-3" />
                            </button>
                        </CardContent>
                    </Card>

                    {/* 2. Skill Breakdown */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Skill Match</CardTitle>
                            <CardDescription>Alignment with JD requirements</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Skills"
                                        dataKey="A"
                                        stroke="hsl(245, 58%, 51%)"
                                        fill="hsl(245, 58%, 51%)"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 4. Plan Preview */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recommended Focus</CardTitle>
                            <CardDescription>Immediate steps from your 7-day plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {latestData.plan.slice(0, 3).map((day, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <div className="bg-white p-2 rounded border border-gray-200 shadow-sm shrink-0">
                                            <span className="block text-xs font-bold text-gray-500 text-center uppercase">Day</span>
                                            <span className="block text-lg font-bold text-primary text-center leading-none">{idx * 2 + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{day.focus}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{day.tasks[0]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Static Assesssments (Keep as requested) */}
            {!latestData && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                            <CardDescription>Sample schedule</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { id: 1, title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', type: 'Technical' },
                                    { id: 2, title: 'System Design Review', time: 'Wed, 2:00 PM', type: 'Technical' },
                                    { id: 3, title: 'HR Interview Prep', time: 'Friday, 11:00 AM', type: 'Behavioral' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className={cn("p-2.5 rounded-full", item.type === 'Technical' ? "bg-indigo-100 text-primary" : "bg-purple-100 text-purple-600")}>
                                                <CalendarDays className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {item.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
