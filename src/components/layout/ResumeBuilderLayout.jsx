import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import BuildPanel from './BuildPanel';

const STEPS = [
    { id: '01-problem', number: 1, title: 'Define the Problem' },
    { id: '02-market', number: 2, title: 'Market Analysis' },
    { id: '03-architecture', number: 3, title: 'System Architecture' },
    { id: '04-hld', number: 4, title: 'High Level Design' },
    { id: '05-lld', number: 5, title: 'Low Level Design' },
    { id: '06-build', number: 6, title: 'Core Build' },
    { id: '07-test', number: 7, title: 'Testing Strategy' },
    { id: '08-ship', number: 8, title: 'Ship & Deploy' },
];

const ResumeBuilderLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [hasArtifact, setHasArtifact] = useState(false);

    // Determine current step from URL
    useEffect(() => {
        const path = location.pathname.split('/').pop();
        const step = STEPS.find(s => s.id === path);
        if (step) {
            setCurrentStep(step.number);
            // Check for artifact
            const artifact = localStorage.getItem(`rb_step_${step.number}_artifact`);
            setHasArtifact(!!artifact);
        } else if (path === 'proof') {
            setCurrentStep(9); // 9 for proof
        }
    }, [location]);

    const handleArtifactUpload = (type) => {
        // Simulate upload/success
        localStorage.setItem(`rb_step_${currentStep}_artifact`, JSON.stringify({ type, timestamp: new Date().toISOString() }));
        setHasArtifact(true);
    };

    const handleStepChange = (direction) => {
        if (direction === 'next') {
            const nextStep = STEPS.find(s => s.number === currentStep + 1);
            if (nextStep) {
                navigate(`/rb/${nextStep.id}`);
            } else if (currentStep === 8) {
                navigate('/rb/proof');
            }
        }
    };

    const currentStepConfig = STEPS.find(s => s.number === currentStep) || { title: 'Final Proof' };

    // Don't render layout structure for proof page if it needs full width, 
    // but requirement said "Use the same Premium Layout system" for /rb/proof too, 
    // but maybe minus the Build Panel? 
    // The prompt says: "Create /rb/proof page: 8 step status, inputs for Lovable link..."
    // And "Use the same Premium Layout system... Proof footer".
    // Usually proof page is full width or has different panels. 
    // Let's keep the layout but maybe disable/change functionality of panel if passing 'proof' route.

    // Actually, prompt says: "Build panel: ... It Worked / Error / Add Screenshot"
    // For Proof page, it says: "inputs for Lovable link, GitHub link, Deploy link... Copy Final Submission button"
    // This implies the Proof page content might replace the workspace AND panel, or sit inside the workspace.
    // Let's assume the Layout wraps everything, and the BuildPanel is always there for steps 1-8.
    // For step 9 (Proof), maybe we hide the panel or show a summary?
    // "Use the same Premium Layout system: ... Main workspace (70%), Secondary build panel (30%)". 
    // I entered step 9 for proof, but let's check if the user wants the build panel on the proof page.
    // "Create /rb/proof page: - 8 step status ... inputs ... Copy Final Submission button".
    // This sounds like the content of the Proof Page.
    // If I keep the layout, I have a 30% panel space. I'll leave the panel for steps 1-8.
    // For proof, I might hide it or show a summary. 
    // Let's conditionally render BuildPanel.

    const isProofPage = location.pathname.includes('/rb/proof');

    return (
        <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
            <TopBar
                projectName="AI Resume Builder"
                currentStep={isProofPage ? 8 : currentStep}
                totalSteps={8}
                status={isProofPage ? "Completed" : "In Progress"}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Main Workspace - expands if no panel */}
                <main className={`flex flex-col ${isProofPage ? 'w-full' : 'w-[70%]'} relative`}>
                    <Outlet context={{ currentStep, setHasArtifact }} />

                    {/* Next Button Overlay/Float for Steps */}
                    {!isProofPage && (
                        <div className="absolute bottom-8 right-8 z-10">
                            <button
                                onClick={() => handleStepChange('next')}
                                disabled={!hasArtifact}
                                className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all ${hasArtifact
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next Step &rarr;
                            </button>
                        </div>
                    )}
                </main>

                {/* Build Panel - Only for steps */}
                {!isProofPage && (
                    <BuildPanel
                        stepNumber={currentStep}
                        onArtifactUpload={handleArtifactUpload}
                        hasArtifact={hasArtifact}
                        copyText={`Prompt for ${currentStepConfig.title}...`}
                    />
                )}
            </div>
        </div>
    );
};

export default ResumeBuilderLayout;
