import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <Header />

            {/* Main Content Area */}
            <main className="pl-64 pt-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-6 sm:px-8 sm:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
