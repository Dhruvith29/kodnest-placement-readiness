import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Lock, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'prp_test_checklist';
const REQUIRED_COUNT = 10;

export default function ShipPage() {
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const checklist = JSON.parse(saved);
            const passedCount = Object.values(checklist).filter(Boolean).length;
            if (passedCount === REQUIRED_COUNT) {
                setIsLocked(false);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
                    <Lock className="h-10 w-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipment Locked</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You cannot access the shipping dashboard until all system tests have passed verification.
                </p>
                <div className="flex justify-center">
                    <Link
                        to="/prp/07-test"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Go to Test Checklist
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="text-center py-10">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-pulse">
                    <Rocket className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Ready to Ship! 🚀</h1>
                <p className="text-xl text-gray-600">
                    All systems go. The platform is hardened and verified.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="pt-6 text-center">
                        <h3 className="font-bold text-indigo-900">Build Status</h3>
                        <p className="text-green-600 font-semibold mt-1">Passing</p>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="pt-6 text-center">
                        <h3 className="font-bold text-indigo-900">Tests Verified</h3>
                        <p className="text-green-600 font-semibold mt-1">10 / 10</p>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="pt-6 text-center">
                        <h3 className="font-bold text-indigo-900">Version</h3>
                        <p className="text-indigo-600 font-semibold mt-1">v1.2.0 (Hardened)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center mt-8">
                <Link
                    to="/prp/proof"
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition-all"
                >
                    Proceed to Final Submission <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}
