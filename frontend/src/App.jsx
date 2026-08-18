import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";
import ScrollTopButton from "./components/ScrollTopButton";

import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminJobForm from "./pages/admin/AdminJobForm";

export default function App(){
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <CustomCursor />
        <ScrollTopButton />
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:slug" element={<JobDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/jobs/new" element={<ProtectedRoute><AdminJobForm /></ProtectedRoute>} />
            <Route path="/admin/jobs/:id/edit" element={<ProtectedRoute><AdminJobForm /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}
