import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import AssessmentsPage from './pages/AssessmentsPage';
import ResourcesPage from './pages/ResourcesPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import TestPage from './pages/TestPage';
import ShipPage from './pages/ShipPage';
import ProofPage from './pages/ProofPage';
import ResumeBuilderLayout from './components/layout/ResumeBuilderLayout';
import StepPage from './pages/resume-builder/StepPage';
import ResumeProofPage from './pages/resume-builder/ResumeProofPage';
import ResumeHome from './pages/resume/ResumeHome';
import ResumeBuilder from './pages/resume/ResumeBuilder';
import ResumePreview from './pages/resume/ResumePreview';
import ResumeProof from './pages/resume/ResumeProof';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/results" element={<ResultsPage />} />
          <Route path="/dashboard/history" element={<HistoryPage />} />
          <Route path="/dashboard/practice" element={<PracticePage />} />
          <Route path="/dashboard/assessments" element={<AssessmentsPage />} />
          <Route path="/dashboard/resources" element={<ResourcesPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/prp/07-test" element={<TestPage />} />
          <Route path="/prp/08-ship" element={<ShipPage />} />
          <Route path="/prp/proof" element={<ProofPage />} />
        </Route>

        {/* Project 3: AI Resume Builder Routes */}
        <Route path="/rb" element={<ResumeBuilderLayout />}>
          <Route path="01-problem" element={<StepPage />} />
          <Route path="02-market" element={<StepPage />} />
          <Route path="03-architecture" element={<StepPage />} />
          <Route path="04-hld" element={<StepPage />} />
          <Route path="05-lld" element={<StepPage />} />
          <Route path="06-build" element={<StepPage />} />
          <Route path="07-test" element={<StepPage />} />
          <Route path="08-ship" element={<StepPage />} />
          <Route path="proof" element={<ResumeProofPage />} />
        </Route>

        {/* New AI Resume Builder Application Routes */}
        <Route path="/resume" element={<ResumeHome />} />
        <Route path="/resume/builder" element={<ResumeBuilder />} />
        <Route path="/resume/preview" element={<ResumePreview />} />
        <Route path="/resume/proof" element={<ResumeProof />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
