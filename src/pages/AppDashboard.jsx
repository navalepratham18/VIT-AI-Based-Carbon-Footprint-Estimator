import { useState, useEffect } from 'react';
import Wizard from '../components/calculator/Wizard';
import Scorecard from '../components/calculator/Scorecard';
import GoogleAuth from '../components/auth/GoogleAuth';
import VirtualForestModal from '../components/gamification/VirtualForestModal';
import { predictLifestyle, predictImage, predictSensorData } from '../lib/ml-api';
import { TreePine, ExternalLink } from 'lucide-react';

const AppDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lifestyleCarbon, setLifestyleCarbon] = useState(null);
    const [imageRes, setImageRes] = useState(null);
    const [sensorData, setSensorData] = useState(null);
    const [isForestOpen, setIsForestOpen] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('eco_user');
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (sessionData) => {
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('auth_change')); // notify navbar
    };

    const handleComplete = async (data) => {
        setIsCalculating(true);
        console.log("Collected Data:", data);

        try {
            // Run all 3 backend pipelines in parallel
            const [lifestyleResult, imageResult, sensorResult] = await Promise.all([
                predictLifestyle(data),
                predictImage(data.WasteImage),
                predictSensorData()
            ]);

            setLifestyleCarbon(lifestyleResult.lifestyle_carbon);
            setImageRes(imageResult);
            setSensorData(sensorResult);
        } catch (error) {
            console.error("Prediction failed:", error);
            setLifestyleCarbon(2435); // fallback
            setImageRes([]);
            setSensorData(null);
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-bg)] w-full pt-24 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-start pb-20">

            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--color-brand-accent)]/5 to-[var(--color-brand-bg)] -z-10" />

            <div className="w-full max-w-4xl">
                <div className="mb-12 text-center relative">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Carbon Emission Calculator</h1>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg mb-6">
                        Answer the following questions to get a hyper-accurate reading using our Gradient Boosting ML Model.
                    </p>

                    {isAuthenticated && (
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <button 
                                onClick={() => setIsForestOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                            >
                                <TreePine className="w-4 h-4" />
                                Open My Forest
                            </button>
                            <a 
                                href="http://localhost:5001" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Go to Forest Game
                            </a>
                        </div>
                    )}
                </div>

                {!isAuthenticated ? (
                    <GoogleAuth onLogin={handleLogin} />
                ) : !lifestyleCarbon ? (
                    <div className="relative">
                        {isCalculating && (
                            <div className="absolute inset-0 z-50 bg-[var(--color-brand-surface)]/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-4 border-[var(--color-brand-accent)] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-white font-medium animate-pulse mb-2">Running Dual-Model AI Pipeline...</p>
                                <p className="text-sm text-[var(--color-brand-accent)]">Processing Lifestyle Registry & YOLO Vision Weights</p>
                            </div>
                        )}
                        <Wizard onComplete={handleComplete} />
                    </div>
                ) : (
                    <Scorecard lifestyleCarbon={lifestyleCarbon} imageRes={imageRes} sensorData={sensorData} />
                )}
            </div>

            <VirtualForestModal 
                isOpen={isForestOpen} 
                onClose={() => setIsForestOpen(false)} 
            />
        </div>
    );
};

export default AppDashboard;
