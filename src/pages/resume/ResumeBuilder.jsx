import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Eye, Download, Save, RefreshCw, CheckCircle2, TrendingUp, AlertCircle, Palette, ChevronRight, Plus, X, Sparkles, ChevronDown, ChevronUp, Github, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import ResumePreviewComponent from '../../components/resume/ResumePreviewComponent';

// Initial Empty State
const INITIAL_STATE = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] }, // New Structure
    links: { linkedin: '', github: '' },
    template: 'classic'
};

// Sample Data
const SAMPLE_DATA = {
    personal: {
        name: 'Alex Developer',
        email: 'alex@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    },
    summary: 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and AI integration.',
    education: [
        { school: 'University of Technology', degree: 'B.S. Computer Science', year: '2020' }
    ],
    experience: [
        {
            role: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            duration: '2022 - Present',
            description: 'Led development of core SaaS platform features using React and Node.js. Improved system performance by 40% through optimization.'
        }
    ],
    projects: [
        {
            name: 'AI Resume Builder',
            techStack: ['React', 'Tailwind', 'OpenAI'],
            description: 'A premium tool for generating professional resumes instantly. Integrated with 3rd party APIs for real-time analysis.',
            link: 'https://resume.io',
            github: 'https://github.com/alex/resume'
        }
    ],
    skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python'],
        soft: ['Leadership', 'Communication'],
        tools: ['Git', 'Docker', 'AWS']
    },
    links: { linkedin: 'linkedin.com/in/alexdev', github: 'github.com/alexdev' },
    template: 'modern'
};

const ACTION_VERBS = [
    'built', 'developed', 'designed', 'implemented', 'led', 'improved', 'created', 'optimized',
    'automated', 'managed', 'orchestrated', 'engineered', 'architected', 'reduced', 'increased',
    'saved', 'launched', 'delivered', 'integrated', 'refactored', 'streamlined', 'deployed'
];

export default function ResumeBuilder() {
    // 1) Auto-save data
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        try {
            const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
            // Legacy check: if skills is string, convert to object
            if (typeof parsed.skills === 'string') {
                parsed.skills = { technical: parsed.skills.split(',').filter(Boolean), soft: [], tools: [] };
            }
            return parsed;
        } catch (e) {
            return INITIAL_STATE;
        }
    });

    const [isSuggesting, setIsSuggesting] = useState(false);
    const [expandedProject, setExpandedProject] = useState(0);

    // Save to localStorage
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
        setResumeData(prev => {
            const newArray = [...prev[section], template];
            if (section === 'projects') setExpandedProject(newArray.length - 1);
            return { ...prev, [section]: newArray };
        });
    };

    const removeArrayItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const setTemplate = (tpl) => {
        setResumeData(prev => ({ ...prev, template: tpl }));
    };

    // --- Skills Logic ---
    const addSkill = (category, skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        if (resumeData.skills[category].includes(trimmed)) return;

        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], trimmed]
            }
        }));
    };

    const removeSkill = (category, skillToRemove) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skillToRemove)
            }
        }));
    };

    const handleSuggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResumeData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    // --- Project Tags Logic ---
    const addProjectTag = (index, tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setResumeData(prev => {
            const newProjects = [...prev.projects];
            const currentTags = newProjects[index].techStack || [];
            if (!currentTags.includes(trimmed)) {
                newProjects[index] = { ...newProjects[index], techStack: [...currentTags, trimmed] };
            }
            return { ...prev, projects: newProjects };
        });
    };

    const removeProjectTag = (index, tagToRemove) => {
        setResumeData(prev => {
            const newProjects = [...prev.projects];
            const currentTags = newProjects[index].techStack || [];
            newProjects[index] = { ...newProjects[index], techStack: currentTags.filter(t => t !== tagToRemove) };
            return { ...prev, projects: newProjects };
        });
    };

    // Helper: Bullet Analysis
    const analyzeBullet = (text) => {
        if (!text) return [];
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const warnings = [];

        lines.forEach((line, idx) => {
            const words = line.trim().split(' ');
            const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, '');

            // Check Action Verb
            if (firstWord && !ACTION_VERBS.includes(firstWord)) {
                warnings.push({ line: idx + 1, type: 'verb', msg: `Line ${idx + 1}: Start with a strong action verb (e.g., 'Built', 'Led').` });
            }

            // Check Numbers
            const hasNumber = /\d+|%|\b[XkM]\b/.test(line);
            if (!hasNumber) {
                warnings.push({ line: idx + 1, type: 'number', msg: `Line ${idx + 1}: Add measurable impact (numbers, %, etc.).` });
            }
        });
        return warnings;
    };

    // 3) ATS Score v1 (Deterministic) & Improvements
    const { score, improvements } = useMemo(() => {
        let score = 0;
        let improvs = [];

        if (resumeData.personal.name && resumeData.personal.email) score += 20;

        const summaryWords = resumeData.summary.trim().split(/\s+/).filter(Boolean).length;
        if (summaryWords >= 40) score += 15;
        else improvs.push("Expand summary to 40+ words.");

        if (resumeData.projects.length >= 2) score += 10;
        else improvs.push(`Add ${2 - resumeData.projects.length} more project(s).`);

        if (resumeData.experience.length >= 1) score += 10;
        else improvs.push("Add at least 1 experience entry.");

        // Skills Check (Sum of all categories)
        const totalSkills = (resumeData.skills.technical?.length || 0) +
            (resumeData.skills.soft?.length || 0) +
            (resumeData.skills.tools?.length || 0);

        if (totalSkills >= 8) score += 10;
        else improvs.push("Add more skills (target 8+ total).");

        if (resumeData.links.github || resumeData.links.linkedin) score += 10;

        const hasNumbers = [...resumeData.experience].some(item => /\d+|%|\b[XkM]\b/.test(item.description || ""));
        if (hasNumbers) score += 15;
        else improvs.push("Add numbers/metrics to experience.");

        const hasEducation = resumeData.education.length > 0;
        if (hasEducation) score += 10;

        return {
            score: Math.min(score, 100),
            improvements: improvs.slice(0, 3)
        };
    }, [resumeData]);

    const getScoreColor = (s) => s >= 80 ? 'text-green-600 bg-green-50 border-green-200' : s >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';

    // -- Sub-Components --
    const TagInput = ({ placeholder, onAdd }) => (
        <input
            type="text"
            placeholder={placeholder}
            className="flex-1 p-2 bg-transparent outline-none text-sm min-w-[120px]"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onAdd(e.target.value);
                    e.target.value = '';
                }
            }}
        />
    );

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
                        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                            {['classic', 'modern', 'minimal'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${(resumeData.template || 'classic') === t
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setResumeData({ ...SAMPLE_DATA, template: resumeData.template })}
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
                            placeholder="Briefly describe your professional background..."
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all h-24 resize-none"
                        />
                        <div className="text-xs text-gray-400 text-right">
                            {resumeData.summary.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Experience</h2>
                            <button onClick={() => addArrayItem('experience', { role: '', company: '', duration: '', description: '' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add Position</button>
                        </div>
                        {resumeData.experience.map((exp, idx) => {
                            const warnings = analyzeBullet(exp.description);
                            return (
                                <div key={idx} className="p-4 border border-gray-100 rounded-lg space-y-3 relative group">
                                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="Role / Title" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                        <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                    </div>
                                    <input type="text" placeholder="Duration (e.g. 2020 - 2022)" value={exp.duration} onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full" />
                                    <textarea placeholder="Description (Bullet points recommended)..." value={exp.description} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} className="p-2 border rounded bg-gray-50 text-sm w-full h-32 resize-none" />

                                    {/* Bullet Guidance */}
                                    {warnings.length > 0 && (
                                        <div className="bg-amber-50 border border-amber-100 rounded p-2 text-xs text-amber-800 space-y-1">
                                            {warnings.slice(0, 2).map((w, i) => (
                                                <div key={i} className="flex gap-1.5">
                                                    <span className="shrink-0 mt-0.5">💡</span>
                                                    <span>{w.msg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    {/* Skills Section (NEW) */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Skills</h2>
                            <button
                                onClick={handleSuggestSkills}
                                disabled={isSuggesting}
                                className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50"
                            >
                                {isSuggesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                Suggest Skills
                            </button>
                        </div>

                        {['technical', 'soft', 'tools'].map(cat => (
                            <div key={cat} className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-gray-500 flex justify-between">
                                    {cat === 'technical' ? 'Technical Skills' : cat === 'soft' ? 'Soft Skills' : 'Tools & Technologies'}
                                    <span className="text-gray-400 font-normal">({resumeData.skills[cat]?.length || 0})</span>
                                </label>
                                <div className="min-h-[42px] p-2 border rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-black transition-all flex flex-wrap gap-2">
                                    {resumeData.skills[cat]?.map((skill, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                            {skill}
                                            <button onClick={() => removeSkill(cat, skill)} className="text-gray-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                                        </span>
                                    ))}
                                    <TagInput
                                        placeholder={`Add ${cat} skill... (Enter)`}
                                        onAdd={(val) => addSkill(cat, val)}
                                    />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Projects Section (NEW Accordion) */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Projects</h2>
                            <button onClick={() => addArrayItem('projects', { name: 'New Project', techStack: [], description: '' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add Project
                            </button>
                        </div>
                        <div className="space-y-3">
                            {resumeData.projects.map((proj, idx) => {
                                const isExpanded = expandedProject === idx;
                                const descLen = proj.description?.length || 0;
                                return (
                                    <div key={idx} className={`border rounded-lg transition-all ${isExpanded ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                        <div
                                            className="flex justify-between items-center p-4 cursor-pointer"
                                            onClick={() => setExpandedProject(isExpanded ? null : idx)}
                                        >
                                            <div className="font-semibold text-sm text-gray-800">{proj.name || 'Untitled Project'}</div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={(e) => { e.stopPropagation(); removeArrayItem('projects', idx); }} className="text-gray-400 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="p-4 pt-0 space-y-4 border-t border-gray-100 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Project Title"
                                                    value={proj.name}
                                                    onChange={(e) => handleArrayChange('projects', idx, 'name', e.target.value)}
                                                    className="w-full p-2 border rounded bg-gray-50 focus:bg-white outline-none text-sm font-bold"
                                                />

                                                {/* Tech Stack Tags */}
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Tech Stack</label>
                                                    <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50 focus-within:bg-white min-h-[38px]">
                                                        {(proj.techStack || []).map((tag, tIdx) => (
                                                            <span key={tIdx} className="inline-flex items-center gap-1 bg-white border px-2 py-0.5 rounded text-xs">
                                                                {tag}
                                                                <button onClick={() => removeProjectTag(idx, tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                                                            </span>
                                                        ))}
                                                        <TagInput placeholder="Add tech... (Enter)" onAdd={(val) => addProjectTag(idx, val)} />
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <textarea
                                                        placeholder="Project Description (Max 200 chars)..."
                                                        value={proj.description}
                                                        maxLength={200}
                                                        onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                                                        className="w-full p-2 border rounded bg-gray-50 focus:bg-white outline-none text-sm h-24 resize-none"
                                                    />
                                                    <div className={`text-xs text-right mt-1 ${descLen >= 200 ? 'text-red-500' : 'text-gray-400'}`}>{descLen}/200</div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex items-center gap-2 border rounded p-2 bg-gray-50">
                                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                                        <input type="text" placeholder="Live Demo URL" value={proj.link || ''} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} className="bg-transparent outline-none text-sm w-full" />
                                                    </div>
                                                    <div className="flex items-center gap-2 border rounded p-2 bg-gray-50">
                                                        <Github className="h-4 w-4 text-gray-400" />
                                                        <input type="text" placeholder="GitHub URL" value={proj.github || ''} onChange={(e) => handleArrayChange('projects', idx, 'github', e.target.value)} className="bg-transparent outline-none text-sm w-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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

                    {/* Top 3 Improvements */}
                    {improvements.length > 0 ? (
                        <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Improvements</div>
                            {improvements.map((improv, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                    <ChevronRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                                    <span>{improv}</span>
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
                        <ResumePreviewComponent data={resumeData} template={resumeData.template || 'classic'} />
                    </div>
                </div>
            </div>
        </div>
    );
}
