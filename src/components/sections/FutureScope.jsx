import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Zap, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const roadmap = [
    {
        icon: <Zap className="w-5 h-5 text-white" />,
        title: "IoT Smart Meter Integration",
        desc: "Direct API hooks into home energy usage for zero-click monitoring."
    },
    {
        icon: <ShieldCheck className="w-5 h-5 text-white" />,
        title: "Blockchain Carbon Logs",
        desc: "Immutable ledger tracking of carbon savings for verifiable corporate ESG reporting."
    },
    {
        icon: <Clock className="w-5 h-5 text-white" />,
        title: "Carbon-Aware Scheduling",
        desc: "Automatically shifts heavy appliance API operations to low-carbon grid hours."
    }
];

const FutureScope = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Line mask reveal
            gsap.to(".timeline-progress", {
                scrollTrigger: {
                    trigger: ".future-container",
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1,
                },
                height: "100%",
                ease: "none"
            });

            // Timeline items reveal
            gsap.from(".timeline-item", {
                scrollTrigger: {
                    trigger: ".future-container",
                    start: "top 70%",
                },
                x: -50,
                opacity: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: "power2.out"
            });

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="future" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-surface)] w-full relative z-10 border-t border-white/5">
            <div className="max-w-4xl mx-auto future-container">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">Roadmap</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">What's Next for EcoGuard</h3>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg">
                        We are continuously building to increase scale, precision, and verifiability.
                    </p>
                </div>

                <div className="relative pl-8 md:pl-0">
                    {/* Vertical Timeline Track */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full z-0 overflow-hidden">
                        <div className="timeline-progress w-full bg-gradient-to-b from-[#008B8B] to-[#00FFFF]" style={{ height: '0%' }}></div>
                    </div>

                    <div className="flex flex-col gap-12 relative z-10">
                        {roadmap.map((item, idx) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <div key={idx} className={`timeline-item flex items-center md:justify-between w-full w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Desktop spacer */}
                                    <div className="hidden md:block w-5/12"></div>

                                    {/* Node */}
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-brand-bg)] border-2 border-[var(--color-brand-accent)] flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)] absolute left-0 md:static md:translate-x-0">
                                        <div className="p-1.5">{item.icon}</div>
                                    </div>

                                    {/* Content */}
                                    <div className={`w-full pl-10 md:pl-0 md:w-5/12 flex flex-col ${!isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                                        <div className="bg-[var(--color-brand-bg)] p-6 rounded-2xl border border-white/5 hover:border-[var(--color-brand-accent)]/30 hover:-translate-y-1 transition-all duration-300 w-full group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-[var(--color-brand-text-secondary)]">{item.desc}</p>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default FutureScope;
