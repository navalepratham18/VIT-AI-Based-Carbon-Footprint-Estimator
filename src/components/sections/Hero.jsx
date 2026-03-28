import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import CountUp from 'react-countup';
import { ArrowRight, Leaf } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';
import CalculateFootprintButton from '../ui/CalculateFootprintButton';
import ThreeDHeroCard from '../ui/3DHeroCard';

const Hero = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Fade in background overlay slightly
            tl.to(".hero-gradient", { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);

            // Slide up text elements
            tl.from(".hero-text", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
            }, 0.2);

            // Buttons scale in (removed opacity to prevent hot-reload invisibility bug)
            tl.from(".hero-btn", {
                scale: 0.9,
                duration: 0.5,
                stagger: 0.15,
                ease: "back.out(1.7)",
            }, "+=0.1");

            // Counter container fade & float
            tl.from(".hero-counter", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.4");

        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={comp}
            className="relative min-h-[100vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 w-full overflow-hidden"
            id="hero"
        >
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                style={{ filter: 'blur(2px) brightness(0.55)' }}
            >
                <source src="/9316128-hd_1920_1080_30fps.mp4" type="video/mp4" />
            </video>

            {/* Dark teal overlay on top of video */}
            <div className="absolute inset-0 bg-[#001010]/50 z-10 pointer-events-none" />

            {/* Background Gradient Animation */}
            <div className="hero-gradient absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_top_right,_#008B8B_0%,_transparent_50%)] z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="flex flex-col items-start text-left z-10 w-full">
                    <div className="hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A]/80 border border-[#00FFFF]/30 text-[#00FFFF] text-sm font-medium tracking-wide mb-6 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
                        <Leaf className="w-4 h-4" />
                        <span>AI-Driven Sustainability</span>
                    </div>

                    <h1 className="hero-text text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008B8B] to-[#00FFFF]">
                            Carbon Intelligence
                        </span>
                        <br /> for Sustainable Living
                    </h1>


                    <div className="flex flex-wrap gap-4 w-full sm:w-auto relative z-50 pointer-events-auto">
                        <CalculateFootprintButton className="hero-btn w-full sm:w-auto" />
                        <AnimatedButton href="#problem" className="hero-btn w-full sm:w-auto">
                            Learn More
                        </AnimatedButton>
                    </div>
                </div>

                {/* Right Content - Counter & Visuals */}
                <div className="hero-counter relative mt-12 lg:mt-0 flex justify-center z-10 w-full h-full min-h-[400px]">
                    {/* Decorative glowing orb */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#008B8B]/30 rounded-full blur-[80px] pointer-events-none" />

                    {/* Counter Card */}
                    <div className="relative w-full max-w-md flex flex-col items-center justify-center my-auto aspect-square group perspective-1000">
                        <ThreeDHeroCard />
                    </div>
                </div>
            </div>

            {/* Inject small custom animation for progress bar to avoid heavy styling files */}
            <style>{`
        @keyframes scale-x {
          to { transform: scaleX(0.975); }
        }
      `}</style>
        </section>
    );
};

export default Hero;
