import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown, Cpu, Activity, Share2, Globe, Shield, Map } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <Cpu className="w-6 h-6 text-white" />,
        title: "ML Benchmarking & Accuracy",
        content: "Validates multiple regressors. Identifies Gradient Boosting as optimal with R²=0.977 on combined datasets."
    },
    {
        icon: <Activity className="w-6 h-6 text-white" />,
        title: "Physics-Informed Bounds",
        content: "Hardcodes physical constraints (like thermodynamics of heating) preventing model hallucinations on unknown data."
    },
    {
        icon: <Share2 className="w-6 h-6 text-white" />,
        title: "Multimodal Waste Scanner",
        content: "Classify items and materials automatically using image capture to assign correct emission factors instantly."
    },
    {
        icon: <Globe className="w-6 h-6 text-white" />,
        title: "Scenario Simulation",
        content: "Provides concrete 'What If' interactive adjustments showing exactly how a lifestyle tweak cuts CO₂ output."
    },
    {
        icon: <Map className="w-6 h-6 text-white" />,
        title: "Regional Carbon Awareness",
        content: "Modulates energy grid factors dynamically based on your locale, mapping accurate daytime usage vs nighttime storage."
    },
    {
        icon: <Shield className="w-6 h-6 text-white" />,
        title: "Active IoT Telemetry",
        content: "Seamlessly ingests real-time timeseries data from ESP8266 + MQ-7 hardware sensors via a dedicated Python Flask Microservice."
    }
];

const Features = () => {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: ".features-grid",
                    start: "top 80%",
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-surface)] w-full relative z-10 border-t border-white/5">
            <div className="max-w-4xl mx-auto">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-[var(--color-brand-accent)] font-semibold tracking-wide uppercase text-sm mb-3">Enterprise Grade</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for Scale and Precision</h3>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg">
                        A robust engineering framework under the hood, ensuring speed, security, and extensibility.
                    </p>
                </div>

                <div className="features-grid grid gap-4">
                    {features.map((feature, idx) => (
                        <Disclosure key={idx} as="div" className="feature-card bg-[var(--color-brand-bg)] border border-white/5 rounded-2xl overflow-hidden hover:border-[var(--color-brand-accent)]/30 transition-colors duration-300">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full items-center justify-between px-6 py-5 text-left group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-all duration-300 ${open ? 'bg-[var(--color-brand-accent)] shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[var(--color-brand-surface)] group-hover:bg-white/10'}`}>
                                                {feature.icon}
                                            </div>
                                            <span className="text-lg font-bold text-white group-hover:text-[var(--color-brand-accent)] transition-colors">{feature.title}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${open ? 'rotate-180 text-[var(--color-brand-accent)]' : ''}`} />
                                    </Disclosure.Button>

                                    <Transition
                                        enter="transition duration-300 ease-out"
                                        enterFrom="transform scale-95 opacity-0 m-0 p-0 h-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-200 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0 m-0 p-0 h-0"
                                    >
                                        <Disclosure.Panel className="px-6 pb-6 pt-2 text-[var(--color-brand-text-secondary)] ml-16 text-md leading-relaxed">
                                            {feature.content}
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Features;
