import React, { createContext, useContext, useState, useEffect } from 'react';
import { JOB_LIST } from '../data/jobs';

const JobContext = createContext();

export const useJobs = () => {
    return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
    // State for user preferences
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('prp_job_prefs');
        return saved ? JSON.parse(saved) : {
            roleKeywords: '',
            locations: [],
            modes: [],
            experience: '',
            skills: '',
            minMatchScore: 40
        };
    });

    // State for saved jobs (IDs)
    const [savedJobIds, setSavedJobIds] = useState(() => {
        const saved = localStorage.getItem('prp_saved_jobs');
        return saved ? JSON.parse(saved) : [];
    });

    // State for job applications (ID -> Status Map)
    const [jobStatusMap, setJobStatusMap] = useState(() => {
        const saved = localStorage.getItem('prp_job_status');
        return saved ? JSON.parse(saved) : {};
    });

    // Effects to persist state
    useEffect(() => {
        localStorage.setItem('prp_job_prefs', JSON.stringify(preferences));
    }, [preferences]);

    useEffect(() => {
        localStorage.setItem('prp_saved_jobs', JSON.stringify(savedJobIds));
    }, [savedJobIds]);

    useEffect(() => {
        localStorage.setItem('prp_job_status', JSON.stringify(jobStatusMap));
    }, [jobStatusMap]);

    // Actions
    const updatePreferences = (newPrefs) => {
        setPreferences(prev => ({ ...prev, ...newPrefs }));
    };

    const toggleSaveJob = (jobId) => {
        setSavedJobIds(prev => {
            if (prev.includes(jobId)) {
                return prev.filter(id => id !== jobId);
            }
            return [...prev, jobId];
        });
    };

    const updateJobStatus = (jobId, status) => {
        setJobStatusMap(prev => ({
            ...prev,
            [jobId]: status
        }));
    };

    const getJobStatus = (jobId) => {
        return jobStatusMap[jobId] || 'Not Applied';
    };

    // Helper to calculate match score
    const calculateMatchScore = (job) => {
        if (!preferences) return 0;
        let score = 0;

        // Keywords in Title (25pts)
        const keywords = preferences.roleKeywords.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (keywords.length > 0) {
            const title = job.title.toLowerCase();
            if (keywords.some(k => title.includes(k))) score += 25;
        }

        // Location (15pts)
        if (preferences.locations.length > 0 && preferences.locations.includes(job.location)) {
            score += 15;
        }

        // Mode (10pts)
        if (preferences.modes.length > 0 && preferences.modes.includes(job.mode)) {
            score += 10;
        }

        // Experience (10pts)
        if (preferences.experience && job.experience === preferences.experience) {
            score += 10;
        }

        // Skills (15pts)
        const userSkills = preferences.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (userSkills.length > 0 && job.skills) {
            const hasOverlap = job.skills.some(skill =>
                userSkills.some(us => skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase()))
            );
            if (hasOverlap) score += 15;
        }

        // Recency (5pts)
        if (job.postedDaysAgo <= 2) score += 5;

        // Source Boost (5pts)
        if (job.source === 'LinkedIn') score += 5;

        return Math.min(100, score);
    };

    const value = {
        jobs: JOB_LIST,
        preferences,
        savedJobIds,
        jobStatusMap,
        updatePreferences,
        toggleSaveJob,
        updateJobStatus,
        getJobStatus,
        calculateMatchScore
    };

    return (
        <JobContext.Provider value={value}>
            {children}
        </JobContext.Provider>
    );
};
