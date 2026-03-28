import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Server, Laptop, Cpu, ScanSearch, Activity, RadioTower } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const blocks = [
    { id: 'frontend', name: 'React + Tailwind', icon: <Laptop className="w-5 h-5" />, col: 'col-span-3' },
    { id: 'backend', name: 'FastAPI / Python', icon: <Server className="w-5 h-5" />, col: 'col-span-3' },
    { id: 'iot', name: 'Flask + NodeMCU', icon: <RadioTower className="w-5 h-5" />, col: 'col-span-3' },
    { id: 'ml', name: 'Gradient Boosting (XGBoost)', icon: <Cpu className="w-5 h-5" />, col: 'col-span-1' },
    { id: 'db', name: 'Time-Series DB', icon: <Database className="w-5 h-5" />, col: 'col-span-1' }
];

const Architecture = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Setup timeline for architecture build-up
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".arch-container",
                    start: "top 75%",
                }
            });

            tl.from(".arch-block", {
                scale: 0.8,
                opacity: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: "back.out(1.5)"
            });

            // SVG path drawing animation
            tl.fromTo(".connector-line path", {
                strokeDasharray: 200,
                strokeDashoffset: 200,
            }, {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "power2.inOut",
                stagger: 0.2
            }, "-=0.5");

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-bg)] w-full relative z-10 border-t border-white/5">
            <div className="max-w-5xl mx-auto arch-container">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">System Design</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Production-Ready Architecture</h3>
                </div>

                <div className="relative w-full h-auto min-h-[600px] md:min-h-0 md:aspect-[16/9] bg-[var(--color-brand-surface)]/50 border border-white/10 rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-between overflow-hidden gap-6 md:gap-0">

                    {/* Abstract grid background */}
                    <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                    {/* Client Layer */}
                    <div className="arch-block relative z-10 bg-[var(--color-brand-bg)] border-2 border-[#008B8B]/40 hover:border-[#00FFFF] px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(0,139,139,0.15)] w-full max-w-md flex items-center justify-center gap-3 group transition-colors cursor-default">
                        <div className="p-2 bg-[#008B8B]/20 rounded-lg text-[#00FFFF] group-hover:scale-110 transition-transform">
                            <Laptop className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-[var(--color-brand-text-secondary)] uppercase tracking-wider font-semibold">Frontend Client</span>
                            <span className="text-lg font-bold text-white">React + Tailwind UI</span>
                        </div>
                    </div>

                    {/* Connector 1 */}
                    <svg className="connector-line w-12 h-16 md:h-24 z-10" viewBox="0 0 40 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0 L20 100" stroke="#008B8B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                        <circle cx="20" cy="50" r="6" fill="#00FFFF" />
                    </svg>

                    {/* API Layer - Split into FastAPI and Flask IoT */}
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl relative z-10 justify-center">
                        <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-blue-400/40 hover:border-blue-400 px-4 py-4 rounded-xl shadow-[0_0_20px_rgba(96,165,250,0.1)] flex items-center justify-center gap-3 group transition-colors cursor-default">
                            <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                <Server className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs text-[var(--color-brand-text-secondary)] uppercase tracking-wider font-semibold">Vision/ML Backend</span>
                                <span className="text-sm font-bold text-white">FastAPI Ecosystem</span>
                            </div>
                        </div>

                        <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-amber-500/40 hover:border-amber-500 px-4 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)] flex items-center justify-center gap-3 group transition-colors cursor-default">
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
                                <RadioTower className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs text-[var(--color-brand-text-secondary)] uppercase tracking-wider font-semibold">IoT Edge API</span>
                                <span className="text-sm font-bold text-white">Flask + ESP8266</span>
                            </div>
                        </div>
                    </div>

                    {/* Branching Connectors - Desktop Only */}
                    <div className="relative w-full max-w-2xl h-16 md:h-24 hidden md:flex justify-between px-16 z-10">
                        <svg className="connector-line absolute inset-0 w-full h-full" viewBox="0 0 600 100" fill="none" preserveAspectRatio="none">
                            <path d="M300 0 L300 40 L100 40 L100 100" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                            <path d="M300 0 L300 40 L300 100" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                            <path d="M300 0 L300 40 L500 40 L500 100" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                            <circle cx="300" cy="40" r="6" fill="#60a5fa" />
                        </svg>
                    </div>

                    {/* Data & ML Layer */}
                    <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-center items-center gap-4 z-10 pb-4 md:pb-0">
                        {/* Time-Series DB */}
                        <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-amber-400/40 hover:border-amber-400 py-4 px-2 rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 group transition-colors cursor-default text-center">
                            <div className="text-amber-400 group-hover:scale-110 transition-transform"><Database className="w-6 h-6" /></div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">User DB</span>
                        </div>

                        {/* Tri ML/Data Pipeline */}
                        <div className="w-full lg:w-3/4 flex flex-col sm:flex-row gap-4">
                            {/* Model 1: Regression */}
                            <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-[#008B8B]/40 hover:border-[#00FFFF] py-4 px-2 rounded-xl shadow-[0_0_20px_rgba(0,139,139,0.15)] flex flex-col items-center justify-center gap-2 group transition-colors cursor-default text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[#008B8B]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-[#00FFFF] group-hover:scale-110 transition-transform relative z-10"><Cpu className="w-6 h-6" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-white relative z-10 uppercase tracking-wider">Lifestyle Regression</span>
                            </div>

                            {/* Model 2: YOLO Vision */}
                            <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-purple-400/40 hover:border-purple-400 py-4 px-2 rounded-xl shadow-[0_0_20px_rgba(192,132,252,0.15)] flex flex-col items-center justify-center gap-2 group transition-colors cursor-default text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-purple-400 group-hover:scale-110 transition-transform relative z-10"><ScanSearch className="w-6 h-6" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-white relative z-10 uppercase tracking-wider">YOLO Image Vision</span>
                            </div>

                            {/* Model 3: Time Series IoT */}
                            <div className="arch-block flex-1 bg-[var(--color-brand-bg)] border-2 border-amber-500/40 hover:border-amber-500 py-4 px-2 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center gap-2 group transition-colors cursor-default text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-amber-500 group-hover:scale-110 transition-transform relative z-10"><Activity className="w-6 h-6" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-white relative z-10 uppercase tracking-wider">MQ-7 Sensor Forecaster</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Architecture;
