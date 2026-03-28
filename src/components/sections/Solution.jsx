import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Image as ImageIcon, Cpu, Lightbulb } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        icon: <User className="w-6 h-6 text-white" />,
        title: "1. Lifestyle Input",
        description: "Enter commuting, diet, and energy habits to form your base profile."
    },
    {
        icon: <ImageIcon className="w-6 h-6 text-white" />,
        title: "2. YOLO Vision Scan",
        description: "Upload images of your daily waste. The YOLO AI detects materials and weights instantly."
    },
    {
        icon: <Cpu className="w-6 h-6 text-white" />,
        title: "3. Tri-Modal Synthesis",
        description: "Lifestyle regression aggregates with YOLO vision and live IoT gas sensor data for hyper-accurate CO₂ metrics."
    },
    {
        icon: <Lightbulb className="w-6 h-6 text-white" />,
        title: "4. Actionable Insights",
        description: "Receive targeted, localized strategies to offset your footprint immediately."
    }
];

const Solution = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".solution-header", {
                scrollTrigger: {
                    trigger: ".solution-header",
                    start: "top 80%",
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
            });

            // Timeline line growing animation
            gsap.to(".process-line-active", {
                scrollTrigger: {
                    trigger: ".process-container",
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1, // Connects exactly to scroll
                },
                scaleX: 1,
                ease: "none"
            });

            // Nodes light up animation based on scrub
            const nodes = gsap.utils.toArray(".process-node");
            nodes.forEach((node, i) => {
                gsap.to(node, {
                    scrollTrigger: {
                        trigger: ".process-container",
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1,
                    },
                    // Animate the border and background color color by relying on a class toggle or scale
                    scale: 1,
                    duration: 0.1,
                    delay: (i / nodes.length) * 0.5 // Delay mapping
                });
            });

            // Simpler approach for the text appearing one by one:
            gsap.from(".process-text", {
                scrollTrigger: {
                    trigger: ".process-container",
                    start: "top 60%",
                },
                y: 20,
                opacity: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: "back.out(1.5)"
            });

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="solution" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-surface)] w-full relative z-10 border-t border-white/5 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="solution-header text-center max-w-2xl mx-auto mb-20 relative z-20">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">How EcoGuard Works</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">A Seamless Workflow to Carbon Zero</h3>
                </div>

                <div className="process-container relative max-w-5xl mx-auto pt-10 pb-20 mt-12">
                    {/* Background inactive line */}
                    <div className="absolute top-[48px] left-0 right-0 h-1 bg-gray-800 rounded-full z-0 hidden md:block"></div>

                    {/* Active growing line connected to scroll */}
                    <div
                        className="process-line-active absolute top-[48px] left-0 right-0 h-1 bg-gradient-to-r from-[#008B8B] via-[#00B3B3] to-[#00FFFF] rounded-full z-0 origin-left hidden md:block"
                        style={{ transform: "scaleX(0)" }}
                    >
                        {/* Glow effect on the active line */}
                        <div className="absolute inset-0 bg-[#00FFFF] blur-md opacity-30"></div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12 md:gap-8 relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center relative">
                                {/* Node icon */}
                                <div className="process-node relative w-16 h-16 rounded-2xl bg-gray-900 border-2 border-gray-700 flex items-center justify-center mb-6 shadow-xl z-10 transition-colors duration-500 overflow-hidden group">
                                    <div className="absolute inset-0 bg-[var(--color-brand-accent)]/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />

                                    {/* Outer glow ring wrapper */}
                                    <div className="absolute inset-0 bg-transparent border-2 border-[var(--color-brand-accent)] rounded-2xl opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>

                                    {step.icon}
                                </div>

                                {/* Process Text */}
                                <div className="process-text flex flex-col items-center w-full">
                                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                    <p className="text-[var(--color-brand-text-secondary)] text-sm max-w-[200px] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Vertical line indicator for mobile only */}
                                {idx !== steps.length - 1 && (
                                    <div className="md:hidden w-1 h-12 bg-gray-800 my-4 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Solution;
