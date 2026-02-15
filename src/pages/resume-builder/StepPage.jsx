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
        content: 'Unit tests, Integration tests, and User Acceptance Testing.'
    },
    '08-ship': {
        title: 'Ship & Deploy',
        description: 'Prepare for launch.',
        content: 'Deployment pipeline, Environment variables, Final polish.'
    }
};

const StepPage = () => {
    const location = useLocation();
    const path = location.pathname.split('/').pop();
    const data = STEP_CONTENT[path] || { title: 'Unknown Step', description: '-', content: '-' };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 pb-0">
                <ContextHeader title={data.title} description={data.description} />
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
                <div className="prose max-w-none text-gray-600">
                    <p className="text-lg">{data.content}</p>
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
                </div>
            </div>

            <ProofFooter />
        </div>
    );
};

export default StepPage;
