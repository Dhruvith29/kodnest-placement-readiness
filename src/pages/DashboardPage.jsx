import React from 'react';
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
import { CheckCircle2, Circle, Clock, CalendarDays, ArrowRight } from 'lucide-react';

// Mock Data for Radar Chart
const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

// Mock Data for Upcoming Assessments
const assessments = [
    {
        id: 1,
        title: 'DSA Mock Test',
        time: 'Tomorrow, 10:00 AM',
        type: 'Technical',
    },
    {
        id: 2,
        title: 'System Design Review',
        time: 'Wed, 2:00 PM',
        type: 'Technical',
    },
    {
        id: 3,
        title: 'HR Interview Prep',
        time: 'Friday, 11:00 AM',
        type: 'Behavioral',
    },
];

export default function DashboardPage() {
    const readinessScore = 72;
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Last updated: Just now</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Overall Readiness */}
                <Card className="flex flex-col items-center justify-center p-6 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-center">Overall Readiness</CardTitle>
                        <CardDescription>Your preparation score based on all activities</CardDescription>
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
                        <p className="mt-4 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Readiness Score
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Skill Breakdown */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                        <CardDescription>Analysis across key competency areas</CardDescription>
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

                {/* 3. Continue Practice */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                        <CardDescription>Pick up where you left off</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-700">Dynamic Programming</span>
                            <span className="text-sm text-gray-500">3/10 Completed</span>
                        </div>
                        <Progress value={30} className="mb-4" />
                        <p className="text-sm text-gray-500 mb-4">
                            Last solved: <span className="font-medium text-gray-900">Longest Common Subsequence</span>
                        </p>
                    </CardContent>
                    <CardFooter>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </CardFooter>
                </Card>

                {/* 4. Weekly Goals */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                        <CardDescription>Stay consistent with your preparation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">Problems Solved</span>
                            <span className="text-sm font-bold text-gray-900">12/20</span>
                        </div>
                        <Progress value={60} className="mb-6 h-2.5" />

                        <div className="flex justify-between items-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2",
                                        [0, 1, 3, 4].includes(idx)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-transparent text-gray-400 border-gray-100"
                                    )}>
                                        {day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Upcoming Assessments (Spans 2 columns on desktop) */}
                <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                        <CardDescription>Scheduled mock tests and reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {assessments.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={cn(
                                            "p-2.5 rounded-full",
                                            item.type === 'Technical' ? "bg-indigo-100 text-primary" : "bg-purple-100 text-purple-600"
                                        )}>
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
                                    <button className="text-sm text-primary font-medium hover:underline">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
