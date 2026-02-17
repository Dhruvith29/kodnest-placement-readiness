import React from 'react';
import { Bookmark, MapPin, Briefcase, ExternalLink, CalendarDays } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { cn } from '../../lib/utils';

export default function JobCard({ job }) {
    const { toggleSaveJob, savedJobIds, updateJobStatus, getJobStatus, calculateMatchScore } = useJobs();
    const isSaved = savedJobIds.includes(job.id);
    const status = getJobStatus(job.id);
    const matchScore = calculateMatchScore(job);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group relative">
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-primary border border-indigo-100 mb-2 w-fit">
                        {job.source}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1" title={job.title}>
                        {job.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-600">{job.company}</p>
                </div>
                <div className={cn("px-2 py-1 rounded text-xs font-bold border", getScoreColor(matchScore))}>
                    {matchScore}% Match
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {job.location} ({job.mode})
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                    {job.experience} • {job.salaryRange}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                    {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        isSaved ? "text-primary bg-primary/10" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    )}
                    title={isSaved ? "Unsave" : "Save"}
                >
                    <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                </button>

                <div className="flex gap-2">
                    <div className="relative group/status">
                        <select
                            value={status}
                            onChange={(e) => updateJobStatus(job.id, e.target.value)}
                            className={cn(
                                "text-xs font-medium py-1.5 px-3 rounded-lg border appearance-none focus:outline-none cursor-pointer",
                                status === 'Applied' && "bg-blue-50 text-blue-700 border-blue-200",
                                status === 'Selected' && "bg-green-50 text-green-700 border-green-200",
                                status === 'Rejected' && "bg-red-50 text-red-700 border-red-200",
                                status === 'Not Applied' && "bg-gray-50 text-gray-600 border-gray-200"
                            )}
                        >
                            <option value="Not Applied">Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Selected">Selected</option>
                        </select>
                    </div>

                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Apply <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
