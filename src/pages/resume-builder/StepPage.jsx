import React from 'react';
import ContextHeader from '../../components/layout/ContextHeader';
import ProofFooter from '../../components/layout/ProofFooter';
import { useOutletContext, useLocation } from 'react-router-dom';

const STEP_CONTENT = {
    '01-problem': {
        title: 'Define the Problem',
        description: 'Clearly articulate the problem your AI Resume Builder solves.',
        content: 'Identify the core pain points of users creating resumes. Is it formatting? Content generation? ATS optimization?'
    },
    '02-market': {
        title: 'Market Analysis',
        description: 'Analyze competitors and finding your niche.',
        content: 'Research existing resume builders. What features are standard? What is missing? How can "AI" provide a 10x better experience?'
    },
    '03-architecture': {
        title: 'System Architecture',
        description: 'Design the technical architecture.',
        content: 'Define the stack. Frontend framework? Backend services? Database? AI Model integration (OpenAI/Gemini)?'
    },
    '04-hld': {
        title: 'High Level Design',
        description: 'Map out the major components and data flow.',
        content: 'Create a specific HLD diagram. User -> UI -> API Gateway -> Resume Service -> PDF Generator.'
    },
    '05-lld': {
        title: 'Low Level Design',
        description: 'Detailed component and class design.',
        content: 'Define API endpoints, Database schema, React component hierarchy.'
    },
    '06-build': {
        title: 'Core Build',
        description: 'Implement the core functionality.',
        content: 'Execute the build phase. Focus on the "Happy Path".'
    },
    '07-test': {
        title: 'Testing Strategy',
        description: 'Verify functionality and robustness.',
        content: 'Execute the mandatory pre-shipment checklist. All items must be verified to proceed.'
    },
    '08-ship': {
        title: 'Ship & Deploy',
        description: 'Prepare for launch.',
        content: 'Deployment pipeline, Environment variables, Final polish.'
    }
};

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

const StepPage = () => {
    const location = useLocation();
    const { setHasArtifact } = useOutletContext();
    const path = location.pathname.split('/').pop();
    const data = STEP_CONTENT[path] || { title: 'Unknown Step', description: '-', content: '-' };

    // Checklist Logic for 07-test
    const [checklist, setChecklist] = React.useState(() => {
        const saved = localStorage.getItem('rb_test_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    React.useEffect(() => {
        if (path === '07-test') {
            const allChecked = CHECKLIST_ITEMS.every(item => checklist[item]);
            setHasArtifact(allChecked);
            localStorage.setItem('rb_test_checklist', JSON.stringify(checklist));
        }
    }, [checklist, path, setHasArtifact]);

    const toggleCheck = (item) => {
        setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 pb-0">
                <ContextHeader title={data.title} description={data.description} />
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
                <div className="prose max-w-none text-gray-600">
                    <p className="text-lg">{data.content}</p>

                    {/* Conditional Checklist for 07-test */}
                    {path === '07-test' && (
                        <div className="mt-8 space-y-4">
                            <h3 className="text-md font-bold text-gray-900">Pre-Shipment Verification</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {CHECKLIST_ITEMS.map((item, idx) => (
                                    <label key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 cursor-pointer transition-all shadow-sm">
                                        <input
                                            type="checkbox"
                                            checked={!!checklist[item]}
                                            onChange={() => toggleCheck(item)}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className={`font-medium ${checklist[item] ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {item}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400 italic mt-2 text-center">
                                * All items must be checked to enable the Next button.
                            </p>
                        </div>
                    )}

                    {!path.includes('07-test') && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="text-md font-bold text-gray-900 mb-2">Instructions</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Review the objective above.</li>
                                <li>Copy the prompt from the Build Panel.</li>
                                <li>Run the prompt in your AI coding assistant (Lovable/Cursor).</li>
                                <li>Verify the output.</li>
                                <li>Click "It Worked" in the panel when satisfied.</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <ProofFooter />
        </div>
    );
};

export default StepPage;
