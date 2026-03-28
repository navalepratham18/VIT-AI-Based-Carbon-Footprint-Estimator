import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TreePine, Trophy, Zap, ShieldCheck } from 'lucide-react';
import VirtualTree from '../ui/VirtualTree';
import AnimatedButton from '../ui/AnimatedButton';
import RadialOrbitalTimelineDemo from '../ui/radial-orbital-timeline-demo';

gsap.registerPlugin(ScrollTrigger);

const Gamification = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".gamification-header", {
                scrollTrigger: {
                    trigger: ".gamification-header",
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            // Cards staggered animation
            gsap.from(".gamification-card", {
                scrollTrigger: {
                    trigger: ".gamification-grid",
                    start: "top 75%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });

            // Forest Preview Float
            gsap.to(".forest-preview", {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: <TreePine className="w-6 h-6 text-[#00FFFF]" />,
            title: "Earn Virtual Trees",
            desc: "Every time you reduce your monthly footprint, you earn a digital tree in your forest."
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-400" />,
            title: "Dynamic Feedback",
            desc: "Your trees' health changes based on your habits. Green for savings, amber for warnings."
        },
        {
            icon: <Trophy className="w-6 h-6 text-purple-400" />,
            title: "Global Leaderboards",
            desc: "Compete for the lowest 'Tree Requirement' score and climb the ranks of top savers."
        }
    ];

    return (
        <section 
            ref={sectionRef} 
            id="gamification" 
            className="py-32 px-4 sm:px-6 lg:px-8 bg-[#050B10] w-full relative overflow-hidden border-t border-white/5"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Left: Text Content */}
                    <div className="gamification-header relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-bold mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Gaming for Good</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#00FFFF]">Virtual Forest</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            Turn carbon savings into a tangible digital legacy. Track, compete, and visualize your environmental impact with our premium gamification engine.
                        </p>
                        
                        <div className="pt-4">
                            <AnimatedButton href="/app" className="shadow-lg shadow-cyan-500/20">
                                Launch My Forest
                            </AnimatedButton>
                        </div>
                    </div>

                    {/* Right: Visual Preview - Replaced with Radial Orbital Timeline */}
                    <div className="relative flex justify-center items-center min-h-[450px] lg:min-h-[600px] w-full transform lg:scale-110">
                        <RadialOrbitalTimelineDemo />
                        
                        {/* Outer floating elements kept for extra flair */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -right-4 bg-[#111111] border border-white/10 p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#00FFFF]/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-[#00FFFF]" />
                            </div>
                            <span className="text-xs font-bold text-white whitespace-nowrap">+2.5kg Offsets Earned</span>
                        </motion.div>
                    </div>
                </div>

                {/* Features: Now Parallel (One Horizontal Line) */}
                <div className="gamification-grid grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {features.map((f, i) => (
                        <div key={i} className="gamification-card flex flex-col items-center text-center gap-4 bg-[#1A1A1A]/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-all hover:-translate-y-2 group">
                            <div className="p-4 bg-gray-900 rounded-2xl h-fit border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                {f.icon}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default Gamification;
