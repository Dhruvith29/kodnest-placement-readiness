import React, { useMemo } from 'react';
import { useJobs } from '../../context/JobContext';
import JobCard from '../../components/jobs/JobCard';
import { Bookmark } from 'lucide-react';

export default function SavedJobs() {
    const { jobs, savedJobIds } = useJobs();

    const savedJobs = useMemo(() => {
        return jobs.filter(job => savedJobIds.includes(job.id));
    }, [jobs, savedJobIds]);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Saved Jobs</h1>
                    <p className="text-sm text-gray-500">
                        {savedJobs.length} {savedJobs.length === 1 ? 'role' : 'roles'} saved for later.
                    </p>
                </div>
            </div>

            {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No saved jobs yet</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        Browse the Job Tracker and save roles you're interested in to see them here.
                    </p>
                </div>
            )}
        </div>
    );
}
