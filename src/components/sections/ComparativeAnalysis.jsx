import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlayCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const dataSynthetic = [
    { name: 'Transport', CO2: 400 },
    { name: 'Diet', CO2: 250 },
    { name: 'Energy', CO2: 150 },
    { name: 'Waste', CO2: 100 },
];

const dataReal = [
    { name: 'Transport', CO2: 385 },
    { name: 'Diet', CO2: 310 },
    { name: 'Energy', CO2: 215 },
    { name: 'Waste', CO2: 150 },
];

const ComparativeAnalysis = () => {
    const comp = useRef(null);
    const [useRealData, setUseRealData] = useState(false);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Reveal the split sections with advanced spring physics
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".comparative-container",
                    start: "top 75%",
                }
            });

            // Container bounce
            tl.from(".comp-container", { scale: 0.95, duration: 1, ease: "elastic.out(1, 0.7)" }, 0);

            // Left side text elements stragger
            tl.from(".comp-left > *", {
                y: 30,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            }, 0.2);

            // Right side chart scale up
            tl.from(".comp-right", {
                scale: 0.8,
                duration: 1,
                ease: "back.out(1.5)"
            }, 0.4);

            // Accuracy badge pop and tiny rotation
            tl.from(".accuracy-badge", {
                scale: 0.5,
                rotation: -5,
                duration: 0.6,
                ease: "back.out(2.5)"
            }, 0.8);

        }, comp);

        return () => ctx.revert();
    }, []);

    const chartData = useRealData ? dataReal : dataSynthetic;

    return (
        <section ref={comp} id="comparative" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-bg)] w-full relative z-10 border-t border-white/5">
            <div className="max-w-6xl mx-auto comparative-container">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">Model Evaluation</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Our Approach Leads</h3>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg">
                        A visual breakdown of how real-world multimodal context dramatically outperforms baseline synthetic approximations.
                    </p>
                </div>

                <div className="comp-container grid lg:grid-cols-2 gap-12 items-center bg-[var(--color-brand-surface)] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">

                    {/* Subtle background element */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-brand-accent)]/5 rounded-full blur-[100px] pointer-events-none" />

                    {/* Left Side: Features and Toggles */}
                    <div className="comp-left flex flex-col justify-center relative z-10">
                        <h4 className="text-2xl font-bold text-white mb-4">Tri-Modal ML Ecosystem</h4>
                        <p className="text-[var(--color-brand-text-secondary)] mb-8 leading-relaxed">
                            Our architecture unifies Gradient Boosting with YOLO visual extraction and live IoT gas sensors, heavily outperforming traditional regression models. Witness how multimodal real-time telemetry refines our predictions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 w-full">
                            <button
                                onClick={() => setUseRealData(false)}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-300 ${!useRealData ? 'bg-[var(--color-brand-bg)] border border-[var(--color-brand-accent)]/50 text-white shadow-lg' : 'bg-transparent text-[var(--color-brand-text-secondary)] hover:text-white border border-transparent'}`}
                            >
                                Generic Data
                            </button>
                            <button
                                onClick={() => setUseRealData(true)}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-300 ${useRealData ? 'bg-[var(--color-brand-bg)] border border-[var(--color-brand-accent)]/50 text-[var(--color-brand-accent)] shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-transparent text-[var(--color-brand-text-secondary)] hover:text-white border border-transparent'}`}
                            >
                                Real-World Data
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="accuracy-badge bg-[var(--color-brand-accent)]/20 border border-[var(--color-brand-accent)]/40 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-[var(--color-brand-accent)]" />
                                <span className="font-bold text-white tracking-wide">Model R²: {useRealData ? "0.977" : "0.785"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Recharts */}
                    <div className="comp-right h-80 w-full bg-[var(--color-brand-bg)] rounded-xl border border-white/5 p-6 shadow-inner relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="CO2" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1000}>
                                    {
                                        chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={useRealData ? '#10b981' : '#374151'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComparativeAnalysis;
