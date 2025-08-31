import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Viewer from "./pages/Viewer";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import AutoReveal from "./components/effects/AutoReveal";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div style={{ perspective: "1200px" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, rotateX: -6, y: 20, translateZ: -30 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, translateZ: 0 }}
          exit={{ opacity: 0, rotateY: 6, y: -10, translateZ: -30 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/notes/:id" element={<Viewer />} />
            <Route path="/courses/:slug" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          {/* Scroll to top on route change */}
          <ScrollToTop />
          <AutoReveal />
          <AnimatedRoutes />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
