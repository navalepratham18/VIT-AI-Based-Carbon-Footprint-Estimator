import Hero from '../components/sections/Hero';
import Problem from '../components/sections/Problem';
import Solution from '../components/sections/Solution';
import ComparativeAnalysis from '../components/sections/ComparativeAnalysis';
import Gamification from '../components/sections/Gamification';
import Features from '../components/sections/Features';
import Architecture from '../components/sections/Architecture';
import FutureScope from '../components/sections/FutureScope';
import CTA from '../components/sections/CTA';

const Landing = () => {
    return (
        <main className="flex flex-col items-center w-full">
            <Hero />
            <Problem />
            <Solution />
            <ComparativeAnalysis />
            <Gamification />
            <Features />
            <Architecture />
            <FutureScope />
            <CTA />
        </main>
    );
};

export default Landing;
