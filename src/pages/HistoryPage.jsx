import React, { useEffect, useState } from 'react';
import { getHistory, clearHistory } from '../lib/storage';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Trash2, ArrowRight } from 'lucide-react';

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClear = () => {
        if (confirm('Clear all history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
                {history.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                        <Trash2 className="h-4 w-4" /> Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No analysis history found. Analyze a JD correctly!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => navigate(`/dashboard/results?id=${item.id}`)}
                        >
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">
                                        {item.role || "Unknown Role"} <span className="text-gray-400 font-normal">at</span> {item.company || "Unknown Company"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Scored <span className="font-semibold text-gray-900">{item.readinessScore}/100</span> • {timeAgo(item.createdAt)}
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
