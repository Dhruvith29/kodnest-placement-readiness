import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-20">
            {/* Search Input */}
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search resources, problems..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="ml-4 flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="flex flex-col text-right hidden sm:block">
                        <span className="text-sm font-medium text-gray-900">John Doe</span>
                        <span className="text-xs text-gray-500">Student</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white cursor-pointer">
                        JD
                    </div>
                </div>
            </div>
        </header>
    );
}
