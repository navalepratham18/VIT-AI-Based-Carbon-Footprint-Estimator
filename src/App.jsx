import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import AppDashboard from './pages/AppDashboard';
import AuthSuccess from './pages/AuthSuccess';
import VisionLifestyleDashboard from './pages/VisionLifestyleDashboard';
import IoTDashboard from './pages/IoTDashboard';

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Smoothness intensity
      smoothWheel: true,
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // GSAP's time is in seconds, so we multiply by 1000 to get milliseconds
    function raf(time) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0); // Prevent GSAP from messing with the raf rhythm on lag

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text-primary)] font-sans antialiased overflow-x-hidden w-full relative">
        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppDashboard />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/vision-lifestyle" element={<VisionLifestyleDashboard />} />
          <Route path="/iot-sensors" element={<IoTDashboard />} />
        </Routes>

        <footer className="w-full bg-[#0b1020] border-t border-white/5 py-8 text-center text-[var(--color-brand-text-secondary)] relative z-50">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
            <p>© 2026 EcoGuard. Built for SIC Hackathon.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App;
