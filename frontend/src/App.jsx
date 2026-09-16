import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";
import AskAI from "./components/AskAI";

import Home from "./pages/Home";

const JobDetail = lazy(() => import("./pages/JobDetail"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const RoadmapDetail = lazy(() => import("./pages/RoadmapDetail"));
const SkillRoadmapDetail = lazy(() => import("./pages/SkillRoadmapDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy"));
const JobVerificationPolicy = lazy(() => import("./pages/JobVerificationPolicy"));
const ContentCorrectionPolicy = lazy(() => import("./pages/ContentCorrectionPolicy"));
const InterviewTips = lazy(() => import("./pages/InterviewTips"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const CareerInsights = lazy(() => import("./pages/CareerInsights"));
const EditorialArticle = lazy(() => import("./pages/EditorialArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminJobForm = lazy(() => import("./pages/admin/AdminJobForm"));

export default function App(){
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <CustomCursor />
        <AskAI />
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:slug" element={<JobDetail />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
              <Route path="/roadmap/:slug" element={<RoadmapDetail />} />
              <Route path="/skill-roadmap/:slug" element={<SkillRoadmapDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/editorial-policy" element={<EditorialPolicy />} />
              <Route path="/job-verification-policy" element={<JobVerificationPolicy />} />
              <Route path="/content-correction-policy" element={<ContentCorrectionPolicy />} />
              <Route path="/career-insights" element={<CareerInsights />} />
              <Route path="/career-guide/interview-tips" element={<InterviewTips />} />
              <Route path="/career-guide/resume-builder" element={<ResumeBuilder />} />
              <Route path="/career-guide/:slug" element={<EditorialArticle />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
              <Route path="/admin/jobs/new" element={<ProtectedRoute><AdminJobForm /></ProtectedRoute>} />
              <Route path="/admin/jobs/:id/edit" element={<ProtectedRoute><AdminJobForm /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}
