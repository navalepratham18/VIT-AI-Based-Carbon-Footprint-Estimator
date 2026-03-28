import { useState, useEffect } from 'react';
import { Camera, Activity } from 'lucide-react';

const VisionLifestyleDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('eco_user');
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-brand-bg)] w-full pt-28 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-start pb-20">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#008B8B]/10 to-[var(--color-brand-bg)] -z-10" />

            <div className="w-full max-w-6xl">
                <div className="mb-12 text-center relative">
                    <div className="inline-flex items-center justify-center p-3 bg-[#008B8B]/10 rounded-2xl mb-4 border border-[#008B8B]/20">
                        <Camera className="w-8 h-8 text-[#00FFFF]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Vision & Lifestyle AI</h1>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg max-w-2xl mx-auto">
                        Computer Vision waste detection and personalized Machine Learning carbon prediction dashboard.
                    </p>
                </div>

                {!isAuthenticated ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-md mx-auto backdrop-blur-sm">
                        <Activity className="w-12 h-12 text-[#008B8B] mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
                        <p className="text-gray-400 text-sm mb-6">Please sign in to access the AI Vision models and your personalized Lifestyle metrics.</p>
                        <a href="/app" className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#008B8B] to-[#00FFFF] text-white font-bold rounded-xl shadow-lg hover:shadow-[#008B8B]/20 transition-all">
                            Go to Login
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vision Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center min-h-[400px]">
                            <h3 className="text-2xl font-bold text-white mb-2">YOLOv8 Waste Analyzer</h3>
                            <p className="text-gray-400 text-center mb-8 text-sm">Upload an image of waste to instantly analyze material density and carbon impact.</p>
                            
                            <div className="w-full max-w-sm aspect-video border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-gray-300">Click or drag image here</span>
                                </div>
                            </div>
                        </div>

                        {/* Lifestyle Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center min-h-[400px]">
                            <h3 className="text-2xl font-bold text-white mb-2">Lifestyle AI Model</h3>
                            <p className="text-gray-400 text-center mb-8 text-sm">Predicts your precise Monthly Carbon Footprint based on daily habits.</p>
                            
                            <div className="w-full p-6 bg-[#0b1020]/50 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-400">Current AI Confidence</span>
                                    <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">94.2%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[94%] bg-gradient-to-r from-[#008B8B] to-[#00FFFF] rounded-full"></div>
                                </div>
                                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-colors border border-white/10">
                                    Run Lifestyle Prediction Array
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisionLifestyleDashboard;
