import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

const STORAGE_KEY = 'prp_test_checklist';

const TEST_ITEMS = [
    { id: 'jd_validation', label: 'JD required validation works', hint: 'Try analyzing empty JD. Should see error.' },
    { id: 'short_jd', label: 'Short JD warning shows for <200 chars', hint: 'Try analyzing short text. Should see warning.' },
    { id: 'skills_group', label: 'Skills extraction groups correctly', hint: 'Verify skills appear in correct categories (Core CS, Web, etc.).' },
    { id: 'round_mapping', label: 'Round mapping changes based on company + skills', hint: 'Check Enterprise vs Startup round flows.' },
    { id: 'score_calc', label: 'Score calculation is deterministic', hint: 'Same input should always give same base score.' },
    { id: 'skill_toggles', label: 'Skill toggles update score live', hint: 'Toggle skills in results and watch score change.' },
    { id: 'persistence', label: 'Changes persist after refresh', hint: 'Refresh results page. Toggles should remain.' },
    { id: 'history_load', label: 'History saves and loads correctly', hint: 'Check History page for saved analysis.' },
    { id: 'export_content', label: 'Export buttons copy the correct content', hint: 'Verify text file content matches UI.' },
    { id: 'console_errors', label: 'No console errors on core pages', hint: 'Check F12 console navigation.' }
];

export default function TestPage() {
    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize all false
        return TEST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});
    });

    const [passedCount, setPassedCount] = useState(0);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
        const count = Object.values(checklist).filter(Boolean).length;
        setPassedCount(count);
    }, [checklist]);

    const handleToggle = (id) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the checklist?")) {
            const resetState = TEST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});
            setChecklist(resetState);
        }
    };

    const isAllPassed = passedCount === TEST_ITEMS.length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Test Checklist</h1>
                    <p className="text-gray-500 mt-1">Verify all features before shipping.</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isAllPassed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                    {isAllPassed ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    <span className="font-bold">Tests Passed: {passedCount} / {TEST_ITEMS.length}</span>
                </div>
            </div>

            {/* Warning if not passed */}
            {!isAllPassed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <Lock className="h-5 w-5 text-red-500" />
                    <p className="text-sm font-medium text-red-700">Shipping is locked. Fix issues and check all items to proceed to Ship functionality.</p>
                </div>
            )}

            {/* Checklist */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Verification Steps</CardTitle>
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                        <RefreshCw className="h-3 w-3" /> Reset Checklist
                    </button>
                </CardHeader>
                <CardContent className="space-y-1">
                    {TEST_ITEMS.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0 border-gray-100">
                            <div className="pt-0.5">
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    checked={checklist[item.id] || false}
                                    onChange={() => handleToggle(item.id)}
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                            </div>
                            <label htmlFor={item.id} className="flex-1 cursor-pointer">
                                <p className={`font-medium ${checklist[item.id] ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {item.label}
                                </p>
                                {item.hint && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Hint: {item.hint}
                                    </p>
                                )}
                            </label>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
