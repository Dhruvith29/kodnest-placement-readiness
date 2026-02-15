import React from 'react';

export default function ResumePreviewComponent({ data, template = 'classic', color = 'hsl(168, 60%, 40%)' }) {
    if (!data) return <div className="text-center text-gray-400 mt-20">No data loaded</div>;

    const { personal, summary, education, experience, projects, skills, links } = data;

    // Helper to normalize skills data
    const getSkillGroups = () => {
        if (!skills) return [];
        if (typeof skills === 'string') return [{ category: 'Skills', items: skills.split(',').filter(s => s.trim()) }];
        return [
            { category: 'Technical', items: skills.technical },
            { category: 'Soft Skills', items: skills.soft },
            { category: 'Tools', items: skills.tools }
        ].filter(g => g.items && g.items.length > 0);
    };

    const skillGroups = getSkillGroups();

    // Helper for Tech Stack
    const getTechStack = (proj) => {
        if (Array.isArray(proj.techStack)) return proj.techStack;
        if (typeof proj.tech === 'string') return proj.tech.split(',').filter(s => s.trim());
        return [];
    };

    // --- Layout Variants ---

    // 1. Classic: Centered header, heavy border dividers, serif accents
    const ClassicLayout = () => (
        <div className="text-black font-serif leading-relaxed h-full">
            {/* Header */}
            <header className="border-b-2 pb-6 mb-8 text-center" style={{ borderColor: color }}>
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2" style={{ color: color }}>{personal.name || "Your Name"}</h1>
                <div className="flex justify-center flex-wrap text-sm gap-3 text-gray-600 font-sans">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.location && <span>• {personal.location}</span>}
                    {links?.linkedin && <span>• {links.linkedin}</span>}
                    {links?.github && <span>• {links.github}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && summary.trim().length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: color, borderColor: '#e5e7eb' }}>Professional Summary</h2>
                    <p className="text-sm text-gray-800 font-sans">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ color: color, borderColor: '#e5e7eb' }}>Experience</h2>
                    <div className="space-y-5">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1 font-sans">
                                    <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                                    <span className="text-xs text-gray-600">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-bold text-gray-700 mb-1 font-sans">{exp.company}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-line font-sans">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ color: color, borderColor: '#e5e7eb' }}>Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj, idx) => {
                            const stack = getTechStack(proj);
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-1 font-sans">
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                            {stack.length > 0 && <span className="text-xs text-gray-500 italic">({stack.join(', ')})</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 font-sans">{proj.description}</p>
                                    <div className="flex gap-3 mt-1 font-sans text-xs">
                                        {proj.link && <a href={proj.link} className="text-gray-500 hover:text-black underline">Live Demo</a>}
                                        {proj.github && <a href={proj.github} className="text-gray-500 hover:text-black underline">GitHub</a>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skillGroups.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: color, borderColor: '#e5e7eb' }}>Technical Skills</h2>
                    <div className="space-y-1 font-sans text-sm">
                        {skillGroups.map((grp, idx) => (
                            <div key={idx}>
                                <span className="font-bold text-gray-800">{grp.category}:</span> {grp.items.join(', ')}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ color: color, borderColor: '#e5e7eb' }}>Education</h2>
                    <div className="space-y-3 font-sans">
                        {education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                    <div className="text-sm text-gray-700">{edu.degree}</div>
                                </div>
                                <span className="text-xs text-gray-600">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );

    // 2. Modern: Sidebar layout with color block
    const ModernLayout = () => (
        <div className="flex h-full font-sans">
            {/* Sidebar */}
            <div className="w-1/3 text-white p-6 space-y-8 shrink-0" style={{ backgroundColor: color }}>
                {/* Contact */}
                <div className="space-y-2 text-sm text-white/90">
                    {personal.email && <div className="break-all">{personal.email}</div>}
                    {personal.phone && <div>{personal.phone}</div>}
                    {personal.location && <div>{personal.location}</div>}
                    {links?.linkedin && <div className="text-white/80 text-xs mt-2">{links.linkedin}</div>}
                    {links?.github && <div className="text-white/80 text-xs">{links.github}</div>}
                </div>

                {/* Skills in Sidebar */}
                {skillGroups.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-2">Skills</h4>
                        <div className="space-y-3">
                            {skillGroups.map((grp, idx) => (
                                <div key={idx}>
                                    <div className="text-xs font-semibold text-white/70 uppercase mb-1">{grp.category}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {grp.items.map((s, i) => (
                                            <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education in Sidebar */}
                {education && education.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-2">Education</h4>
                        <div className="space-y-3">
                            {education.map((edu, idx) => (
                                <div key={idx}>
                                    <div className="font-bold text-sm">{edu.school}</div>
                                    <div className="text-xs text-white/80">{edu.degree}</div>
                                    <div className="text-xs text-white/60">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-8 text-gray-800 space-y-8">
                {/* Header Name */}
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight uppercase" style={{ color: color }}>{personal.name || "Your Name"}</h1>
                    <div className="h-1 w-20 mt-2" style={{ backgroundColor: color }}></div>
                </div>

                {/* Summary */}
                {summary && summary.trim().length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Profile</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                                        <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                                    </div>
                                    <div className="text-sm font-semibold mb-2" style={{ color: color }}>{exp.company}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Projects</h2>
                        <div className="space-y-4">
                            {projects.map((proj, idx) => {
                                const stack = getTechStack(proj);
                                return (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: color }}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                            <div className="flex gap-2">
                                                {proj.link && <a href={proj.link} className="text-xs hover:underline" style={{ color: color }}>Live</a>}
                                                {proj.github && <a href={proj.github} className="text-xs hover:underline" style={{ color: color }}>Code</a>}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{proj.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {stack.map((t, i) => (
                                                <span key={i} className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    // 3. Minimal: Very sparse, mono cues, lots of white space
    const MinimalLayout = () => (
        <div className="text-black font-sans text-sm leading-relaxed h-full">
            <header className="mb-12 border-b border-gray-100 pb-8">
                <h1 className="text-3xl font-light lowercase tracking-tight mb-2" style={{ color: color }}>{personal.name || "your name"}</h1>
                <div className="text-xs text-gray-400 font-mono lower flex gap-4">
                    <span>{personal.email}</span>
                    <span>{personal.location}</span>
                </div>
            </header>

            <div className="grid grid-cols-[120px_1fr] gap-8">
                {/* Summary */}
                {summary && summary.trim().length > 0 && (
                    <>
                        <div className="text-xs font-mono pt-1" style={{ color: color }}>about</div>
                        <div className="mb-8 text-gray-800">{summary}</div>
                    </>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <>
                        <div className="text-xs font-mono pt-1" style={{ color: color }}>experience</div>
                        <div className="mb-8 space-y-8">
                            {experience.map((exp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1">
                                        <div className="font-medium text-gray-900">{exp.role}</div>
                                        <div className="font-mono text-xs text-gray-400">{exp.duration}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">{exp.company}</div>
                                    <div className="text-gray-600 opacity-90">{exp.description}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <>
                        <div className="text-xs font-mono pt-1" style={{ color: color }}>projects</div>
                        <div className="mb-8 space-y-6">
                            {projects.map((proj, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1">
                                        <div className="font-medium text-gray-900">{proj.name}</div>
                                        <div className="font-mono text-xs text-gray-400 flex gap-2">
                                            {getTechStack(proj).join(' / ')}
                                        </div>
                                    </div>
                                    <div className="text-gray-600 opacity-90 mb-1">{proj.description}</div>
                                    <div className="flex gap-4">
                                        {proj.link && <a href={proj.link} className="font-mono text-xs underline opacity-60 hover:opacity-100" style={{ color: color }}>live</a>}
                                        {proj.github && <a href={proj.github} className="font-mono text-xs underline opacity-60 hover:opacity-100" style={{ color: color }}>code</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Skills */}
                {skillGroups.length > 0 && (
                    <>
                        <div className="text-xs font-mono pt-1" style={{ color: color }}>skills</div>
                        <div className="mb-8 space-y-2">
                            {skillGroups.map((grp, idx) => (
                                <div key={idx} className="text-gray-800">
                                    <span className="text-xs lowercase mr-2 opacity-50" style={{ color: color }}>{grp.category}:</span>
                                    {grp.items.join(', ')}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <>
                        <div className="text-xs font-mono pt-1" style={{ color: color }}>education</div>
                        <div className="mb-8 space-y-2">
                            {education.map((edu, idx) => (
                                <div key={idx}>
                                    <div className="text-gray-900">{edu.school}</div>
                                    <div className="text-gray-500 text-xs">{edu.degree} / {edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-white md:p-10 p-6 min-h-[11in] shadow-sm transform transition-all duration-300" id="resume-preview">
            {template === 'modern' ? <ModernLayout /> : template === 'minimal' ? <MinimalLayout /> : <ClassicLayout />}
        </div>
    );
}
