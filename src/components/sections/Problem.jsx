import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, FileX, LineChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const problems = [
    {
        icon: <AlertCircle className="w-8 h-8 text-rose-400" />,
        title: "Lack of Awareness",
        description: "Most individuals severely underestimate their daily carbon footprint because of invisible emissions tied to habitual activities."
    },
    {
        icon: <FileX className="w-8 h-8 text-amber-400" />,
        title: "Static Calculators",
        description: "Existing tools rely on outdated national averages and static forms rather than continuous, personalized local datasets."
    },
    {
        icon: <LineChart className="w-8 h-8 text-blue-400" />,
        title: "No Real-Time Insights",
        description: "Users receive static yearly reports instead of actionable, real-time guidance on how simple choices can compound."
    }
];

const Problem = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header animation
            gsap.from(".problem-header", {
                scrollTrigger: {
                    trigger: ".problem-header",
                    start: "top 80%",
                },
                y: 30,
                duration: 0.8,
                ease: "power2.out"
            });

            // Cards stagger animation
            gsap.from(".problem-card", {
                scrollTrigger: {
                    trigger: ".cards-container",
                    start: "top 75%",
                },
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="problem" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-bg)] w-full relative z-10 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="problem-header text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">The Challenge</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Current Sustainability Tools Fail</h3>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg">
                        Traditional calculators are disconnected from reality. We need dynamic intelligence, not just simple math.
                    </p>
                </div>

                <div className="cards-container grid md:grid-cols-3 gap-8">
                    {problems.map((problem, idx) => (
                        <div
                            key={idx}
                            className="problem-card bg-[var(--color-brand-surface)] p-8 rounded-2xl border border-white/5 hover:border-[var(--color-brand-accent)]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-brand-accent)]/10 group flex flex-col items-start"
                        >
                            <div className="p-4 rounded-xl bg-[var(--color-brand-bg)] border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {problem.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{problem.title}</h4>
                            <p className="text-[var(--color-brand-text-secondary)] leading-relaxed">
                                {problem.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Problem;
