import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".cta-content", {
                scrollTrigger: {
                    trigger: ".cta-container",
                    start: "top 80%",
                },
                scale: 0.9,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.5)"
            });

            // Gentle floating animation for sparkles
            gsap.to(".sparkle-icon", {
                y: -10,
                rotation: 10,
                yoyo: true,
                repeat: -1,
                duration: 2,
                ease: "sine.inOut"
            });

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="try-now" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 border-t border-white/5 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#0a1a1a] to-[#111111] -z-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#008B8B]/10 rounded-full blur-[120px] -z-10 animate-pulse" />

            <div className="max-w-4xl mx-auto cta-container relative z-10">
                <div className="cta-content bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#00FFFF]/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30"></div>

                    <Sparkles className="sparkle-icon w-12 h-12 text-[#00FFFF] mx-auto mb-6 opacity-80" />

                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Start Measuring Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008B8B] to-[#00FFFF]">
                            Carbon Footprint Today
                        </span>
                    </h2>

                    <p className="text-lg text-[var(--color-brand-text-secondary)] mb-10 max-w-2xl mx-auto">
                        Join the sustainability movement. Upload your first data point and let our ML intelligence guide your next steps.
                    </p>

                    <Link to="/app" className="inline-flex items-center justify-center gap-2 bg-[#008B8B] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(0,139,139,0.4)] hover:bg-[#00FFFF] hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all duration-300">
                        Launch App
                        <ArrowRight className="w-6 h-6" />
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default CTA;
