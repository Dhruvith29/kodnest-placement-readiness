import React from 'react';

export default function ResumePreviewComponent({ data }) {
    if (!data) return <div className="text-center text-gray-400 mt-20">No data loaded</div>;

    const { personal, summary, education, experience, projects, skills, links } = data;

    return (
        <div className="bg-white text-black font-sans leading-relaxed md:p-10 p-6 min-h-[11in] shadow-sm" id="resume-preview">
            {/* Header */}
            <header className="border-b border-gray-900 pb-6 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{personal.name || "Your Name"}</h1>
                <div className="flex flex-wrap text-sm gap-4 text-gray-600">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.location && <span>• {personal.location}</span>}
                    {links && links.linkedin && <span>• {links.linkedin}</span>}
                    {links && links.github && <span>• {links.github}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && summary.trim().length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">Professional Summary</h2>
                    <p className="text-sm text-gray-800">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                    <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                    <span className="text-xs text-gray-500 font-medium">{proj.tech}</span>
                                </div>
                                <p className="text-sm text-gray-700">{proj.description}</p>
                                {proj.link && <a href={proj.link} className="text-xs text-gray-400 hover:text-gray-600 underline mt-1 block">{proj.link}</a>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.trim().length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">Technical Skills</h2>
                    <p className="text-sm text-gray-700">{skills}</p>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                    <span className="text-xs text-gray-500 font-medium">{edu.year}</span>
                                </div>
                                <div className="text-sm text-gray-700">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
