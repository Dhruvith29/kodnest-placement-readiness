import React, { useState, useMemo } from 'react';
import { useJobs } from '../../context/JobContext';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';

export default function JobsDashboard() {
    const { jobs, preferences } = useJobs();
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        experience: '',
        mode: ''
    });

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesKeyword = !filters.keyword ||
                job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.company.toLowerCase().includes(filters.keyword.toLowerCase());

            const matchesLocation = !filters.location || job.location === filters.location;
            const matchesExperience = !filters.experience || job.experience === filters.experience;
            const matchesMode = !filters.mode || job.mode === filters.mode;

            return matchesKeyword && matchesLocation && matchesExperience && matchesMode;
        });
    }, [jobs, filters]);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Job Tracker</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Find and track your dream role. Tailored matches based on your profile.
                    </p>
                </div>
            </div>

            <JobFilter filters={filters} setFilters={setFilters} />

            {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No jobs found matching your filters.</p>
                    <button
                        onClick={() => setFilters({ keyword: '', location: '', experience: '', mode: '' })}
                        className="mt-4 text-primary hover:underline font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
