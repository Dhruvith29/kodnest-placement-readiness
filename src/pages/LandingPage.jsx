import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3, CheckCircle } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Navbar (Simple for Landing Page) */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Placement Prep</span>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32 space-y-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Ace Your <span className="text-primary">Placement</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Practice, assess, and prepare for your dream job with our comprehensive readiness platform.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-primary rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Get Started
                    </button>
                </div>

                {/* Abstract shapes/blobs for background interest */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-semibold tracking-wide text-primary uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 bg-indigo-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-xl mb-6 text-primary">
                                <Code className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Problems</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Solve coding challenges across various difficulty levels to sharpen your algorithmic thinking.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 bg-purple-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="inline-flex items-center justify-center p-3 bg-purple-50 rounded-xl mb-6 text-purple-600">
                                <Video className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Mock Interviews</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Simulate real interview scenarios with AI-driven feedback to build confidence and poise.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 bg-pink-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="inline-flex items-center justify-center p-3 bg-pink-50 rounded-xl mb-6 text-pink-600">
                                <BarChart3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Visualize your growth with detailed analytics and insights into your strengths and weaknesses.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="bg-white/10 p-1.5 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Placement Prep</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Placement Prep Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
