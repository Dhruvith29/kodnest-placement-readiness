import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Eye, Download, Save, RefreshCw, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import ResumePreviewComponent from '../../components/resume/ResumePreviewComponent';

// Initial Empty State
const INITIAL_STATE = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: '',
    links: { linkedin: '', github: '' }
};

// Sample Data
const SAMPLE_DATA = {
    personal: {
        name: 'Alex Developer',
        email: 'alex@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    },
    summary: 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and AI integration. Proven track record of delivering high-quality software solutions in agile environments. Committed to continuous learning and staying updated with emerging technologies.',
    education: [
        { school: 'University of Technology', degree: 'B.S. Computer Science', year: '2020' }
    ],
    experience: [
        {
            role: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            duration: '2022 - Present',
            description: 'Led development of core SaaS platform features using React and Node.js. Improved system performance by 40% through optimization.'
        },
        {
            role: 'Frontend Developer',
            company: 'WebSolutions',
            duration: '2020 - 2022',
            description: 'Built responsive UI components and implemented modern design systems. Collaborated with UX team to redesign client portal.'
        }
    ],
    projects: [
        {
            name: 'AI Resume Builder',
            tech: 'React, Tailwind, OpenAI API',
            description: 'A premium tool for generating professional resumes instantly. Integrated with 3rd party APIs for real-time analysis.',
            link: 'https://github.com/alex/resume-builder'
        },
        {
            name: 'E-commerce Dashboard',
            tech: 'Vue.js, Firebase',
            description: 'Real-time analytics dashboard for online retailers. Visualized sales data using D3.js.',
            link: 'https://github.com/alex/dashboard'
        }
    ],
    skills: 'JavaScript (ES6+), React, Node.js, Python, TypeScript, Tailwind CSS, SQL, Git, AWS',
    links: { linkedin: 'linkedin.com/in/alexdev', github: 'github.com/alexdev' }
};

export default function ResumeBuilder() {
    // 1) Auto-save data: Load from 'resumeBuilderData'
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, [resumeData]);

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [name]: value }
        }));
    };

    const handleLinksChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            links: { ...prev.links, [name]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setResumeData(prev => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addArrayItem = (section, template) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeArrayItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    // 3) ATS Score v1 (Deterministic)
    const { score, suggestions } = useMemo(() => {
        let score = 0;
        let suggestions = [];

        // Base Score (Structure) - Awarded if basic info exists
        if (resumeData.personal.name && resumeData.personal.email) {
            score += 20;
        }

        // Summary Length (40-120 words)
        const summaryWords = resumeData.summary.trim().split(/\s+/).filter(Boolean).length;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            suggestions.push("Write a stronger summary (40–120 words).");
        }

        // Projects >= 2
        if (resumeData.projects.length >= 2) {
            score += 10;
        } else {
            suggestions.push(`Add at least 2 projects (current: ${resumeData.projects.length}).`);
        }

        // Experience >= 1
        if (resumeData.experience.length >= 1) {
            score += 10;
        } else {
            suggestions.push("Add at least 1 experience entry.");
        }

        // Skills >= 8 items
        const skillList = resumeData.skills.split(',').filter(s => s.trim().length > 0);
        if (skillList.length >= 8) {
            score += 10;
        } else {
            suggestions.push(`Add more skills (target 8+, current: ${skillList.length}).`);
        }

        // Links (GitHub or LinkedIn)
        if (resumeData.links.github || resumeData.links.linkedin) {
            score += 10;
        } else {
            suggestions.push("Add GitHub or LinkedIn link.");
        }

        // Numbers in bullets (Experience or Projects)
        const hasNumbers = [...resumeData.experience, ...resumeData.projects].some(item => {
            const text = item.description || "";
            // Regex for numbers, %, k (like 10k), etc.
            return /\d+|%|\b[XkM]\b/.test(text);
        });

        if (hasNumbers) {
            score += 15;
        } else {
            suggestions.push("Add measurable impact (numbers/%) in descriptions.");
        }

        // Education Complete
        const hasEducation = resumeData.education.some(edu => edu.school && edu.degree && edu.year);
        if (hasEducation) {
            score += 10;
        } else {
            if (resumeData.education.length === 0) suggestions.push("Add education details.");
        }

        return { score: Math.min(score, 100), suggestions: suggestions.slice(0, 3) };
    }, [resumeData]);

    // Color for score
    const getScoreColor = (s) => {
        if (s >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Left Panel - Editor */}
            <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    <Link to="/resume" className="font-bold text-gray-900 flex items-center gap-2">
                        <Layout className="h-5 w-5" /> Builder
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setResumeData(SAMPLE_DATA)}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center gap-1"
                        >
                            <RefreshCw className="h-3 w-3" /> Sample
                        </button>
                        <Link
                            to="/resume/preview"
                            className="px-3 py-1.5 text-xs font-medium bg-black hover:bg-gray-800 text-white rounded-md transition-colors flex items-center gap-1"
                        >
                            <Eye className="h-3 w-3" /> Preview
                        </Link>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10">

                    {/* Personal Info */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Personal Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder="Full Name" value={resumeData.personal.name} onChange={handlePersonalChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                            <input type="text" name="email" placeholder="Email" value={resumeData.personal.email} onChange={handlePersonalChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                            <input type="text" name="phone" placeholder="Phone" value={resumeData.personal.phone} onChange={handlePersonalChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                            <input type="text" name="location" placeholder="City, Country" value={resumeData.personal.location} onChange={handlePersonalChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Professional Summary</h2>
                        <textarea
                            value={resumeData.summary}
                            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Briefly describe your professional background and goals... (40-120 words recommended)"
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all h-24 resize-none"
                        />
                        <div className="text-xs text-gray-400 text-right">
                            Word count: {resumeData.summary.trim().split(/\s+/).filter(Boolean).length}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Experience</h2>
                            <button onClick={() => addArrayItem('experience', { role: '', company: '', duration: '', description: '' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add Position</button>
                        </div>
                        {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-3 relative group">
                                <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Role / Title" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                </div>
                                <textarea placeholder="Description of responsibilities (include numbers!)..." value={exp.description} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full h-20 resize-none" />
                            </div>
                        ))}
                    </section>

                    {/* Projects */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Projects</h2>
                            <button onClick={() => addArrayItem('projects', { name: '', tech: '', description: '', link: '' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add Project</button>
                        </div>
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-3 relative group">
                                <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', idx, 'name', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                    <input type="text" placeholder="Tech Stack" value={proj.tech} onChange={(e) => handleArrayChange('projects', idx, 'tech', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                </div>
                                <textarea placeholder="Project Description (include numbers!)..." value={proj.description} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full h-16 resize-none" />
                                <input type="text" placeholder="Link URL" value={proj.link} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Education</h2>
                            <button onClick={() => addArrayItem('education', { school: '', degree: '', year: '' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add Education</button>
                        </div>
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-3 relative group">
                                <button onClick={() => removeArrayItem('education', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                <input type="text" placeholder="School / University" value={edu.school} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                </div>
                            </div>
                        ))}
                    </section>
                    {/* Skills */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Skills</h2>
                        <textarea
                            value={resumeData.skills}
                            onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                            placeholder="Comma separated skills (e.g. React, Node.js, Python)..."
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all h-20 resize-none"
                        />
                    </section>

                    {/* Links */}
                    <section className="space-y-4 pb-10">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Links</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="linkedin" placeholder="LinkedIn URL" value={resumeData.links.linkedin} onChange={handleLinksChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                            <input type="text" name="github" placeholder="GitHub URL" value={resumeData.links.github} onChange={handleLinksChange} className="p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" />
                        </div>
                    </section>

                </div>
            </div>

            {/* Right Panel - Preview & ATS Status */}
            <div className="w-1/2 bg-gray-100 flex flex-col h-full overflow-hidden">
                {/* ATS Score Header */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm z-10 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            <h3 className="font-bold text-gray-900">ATS Readiness Score</h3>
                        </div>
                        <span className={`text-lg font-bold px-3 py-1 rounded-full border ${getScoreColor(score)}`}>
                            {score} / 100
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 ? (
                        <div className="space-y-2">
                            {suggestions.map((suggestion, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                    <span>{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Great job! Your profile looks strong.</span>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100">
                    <div className="w-[8.5in] min-h-[11in] bg-white shadow-2xl origin-top transform scale-75 md:scale-90 lg:scale-100 transition-transform">
                        <ResumePreviewComponent data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
