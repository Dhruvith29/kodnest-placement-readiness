import React from 'react';
import { Copy, ExternalLink, CheckCircle2, AlertTriangle, Image } from 'lucide-react';

const BuildPanel = ({
    stepNumber,
    onArtifactUpload,
    hasArtifact,
    copyText = "AI Prompt for this step...",
    lovableLink = "#"
}) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(copyText);
        // Toast notification could go here
    };

    return (
        <aside className="w-[30%] bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Copy Section */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 block">
                        Copy This Into Lovable
                    </label>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={copyText}
                            className="w-full h-32 p-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition-colors"
                            title="Copy to clipboard"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                    </button>
                </div>

                {/* Build Link */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 block">
                        Build
                    </label>
                    <a
                        href={lovableLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Build in Lovable
                    </a>
                </div>

                {/* Status / Output Section */}
                <div className="space-y-3 border-t border-gray-100 pt-6">
                    <label className="text-sm font-semibold text-gray-900 block">
                        Outcome
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onArtifactUpload('success')}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${hasArtifact
                                    ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500 ring-offset-1'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                }`}
                        >
                            <CheckCircle2 className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium">It Worked</span>
                        </button>

                        <button
                            onClick={() => alert("Please fix errors in Lovable first.")}
                            className="flex flex-col items-center justify-center p-3 rounded-lg border bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                            <AlertTriangle className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium">Error</span>
                        </button>
                    </div>

                    <button
                        onClick={() => onArtifactUpload('screenshot')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <Image className="h-4 w-4" />
                        Add Screenshot
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default BuildPanel;
