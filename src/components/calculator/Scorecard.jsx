import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Activity, ArrowLeft, Leaf, ScanSearch, TreePine, TriangleAlert, Info, ShieldCheck, X, Share2, Globe, Sparkles, History } from 'lucide-react';
import CountUp from 'react-countup';
import VirtualForestModal from '../gamification/VirtualForestModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';
const FOREST_URL = import.meta.env.VITE_GAMIFICATION_URL || 'http://localhost:5001';

const Scorecard = ({ lifestyleCarbon, imageRes, sensorData }) => {
    const [isForestOpen, setIsForestOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    useEffect(() => {
        // Debug log for production configuration
        if (import.meta.env.PROD) {
            console.log("🚀 Scorecard Production Sync Config:", {
                backend: BACKEND_URL,
                gamification: FOREST_URL
            });
        }
    }, []);

    const token = localStorage.getItem('eco_token');

    // Calculations should be at the top of the component to be available for functions
    const imageCarbon = imageRes && imageRes.length > 0
        ? imageRes.reduce((sum, item) => sum + item.carbon_kg, 0)
        : 0;

    const sensorCarbon = sensorData ? sensorData.predicted_midnight_kg : 0;
    const totalCarbon = lifestyleCarbon + imageCarbon + sensorCarbon;

    // Average mature tree absorbs ~21.7 kg of CO2 per year
    const treesNeeded = Math.ceil(totalCarbon / 21.7);

    const syncToForest = async () => {
        if (!token) return;
        setIsSyncing(true);
        try {
            // 1. Sync to Node/MongoDB backend
            const res = await fetch(`${BACKEND_URL}/auth/gamification/log`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ co2_kg: totalCarbon })
            });

            // 2. Sync to Flask/SQLite gamification backend
            const userData = JSON.parse(localStorage.getItem('eco_user') || '{}');
            if (userData.name) {
                await fetch(`${FOREST_URL}/api/users/by-username/${userData.name}/footprint`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ co2_kg: totalCarbon })
                });
            }

            const data = await res.json();
            if (data.success) {
                setSyncSuccess(true);
                setTimeout(() => setSyncSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    let status = "Medium";
    let color = "#fbbf24"; // yellow
    let textGrad = "from-amber-400 to-yellow-500";
    let AlertIcon = Info;
    let alertMsg = "Your emissions are currently at a moderate level. Consider minor lifestyle adjustments.";
    let alertStyles = "bg-amber-500/10 border-amber-500/20 text-amber-500";

    if (totalCarbon < 1500) {
        status = "Low";
        color = "#008B8B"; // Dark Cyan
        textGrad = "from-[var(--color-brand-accent)] to-cyan-400";
        AlertIcon = ShieldCheck;
        alertMsg = "Excellent! You are maintaining an environmentally sustainable, low-impact footprint.";
        alertStyles = "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    } else if (totalCarbon > 3500) {
        status = "High";
        color = "#ef4444"; // red
        textGrad = "from-red-400 to-rose-500";
        AlertIcon = TriangleAlert;
        alertMsg = "Critical emissions detected! Immediate actionable reduction strategy required.";
        alertStyles = "bg-red-500/10 border-red-500/20 text-red-400";
    }

    const chartData = [
        { name: 'Lifestyle', CO2: lifestyleCarbon, color: '#00ced1' }, // DarkTurboCyan
        { name: 'Visual Waste', CO2: Number(imageCarbon.toFixed(2)), color: '#8b5cf6' }, // violet
        { name: 'Sensor Forecast', CO2: sensorCarbon, color: '#f59e0b' } // amber
    ];

    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        if (showPopup) {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                if (status === 'High') {
                    // Urgent pulsating alarm for High Alert (Loops for 10s)
                    oscillator.type = 'sawtooth';
                    for (let i = 0; i < 20; i++) { // 20 pulses of 0.5s = 10s
                        const time = audioCtx.currentTime + (i * 0.5);
                        oscillator.frequency.setValueAtTime(400, time);
                        oscillator.frequency.exponentialRampToValueAtTime(800, time + 0.2);
                        oscillator.frequency.exponentialRampToValueAtTime(400, time + 0.4);
                        gainNode.gain.setValueAtTime(0.2, time);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.45);
                    }
                } else if (status === 'Low') {
                    // Pleasant chime for Low Alert (Loops for 10s)
                    oscillator.type = 'sine';
                    for (let i = 0; i < 10; i++) { // 10 chimes of 1s = 10s
                        const time = audioCtx.currentTime + i;
                        oscillator.frequency.setValueAtTime(600, time);
                        oscillator.frequency.exponentialRampToValueAtTime(1200, time + 0.2);
                        gainNode.gain.setValueAtTime(0.1, time);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.9);
                    }
                } else {
                    // Neutral blip for Medium Alert (Loops for 10s)
                    oscillator.type = 'triangle';
                    for (let i = 0; i < 10; i++) { // 10 blips of 1s = 10s
                        const time = audioCtx.currentTime + i;
                        oscillator.frequency.setValueAtTime(500, time);
                        gainNode.gain.setValueAtTime(0.1, time);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
                    }
                }

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                // Extended duration to 10 seconds
                oscillator.stop(audioCtx.currentTime + 10.0);
            } catch (e) {
                console.error("Audio playback blocked or failed", e);
            }
        }
    }, [showPopup, status]);

    return (
        <>
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative">
                            <div className={`h-2 w-full ${status === 'High' ? 'bg-red-500' : status === 'Low' ? 'bg-cyan-500' : 'bg-amber-500'}`} />
                            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-8 pb-10 text-center flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/10 ${status === 'High' ? 'bg-red-500/20 text-red-500' : status === 'Low' ? 'bg-cyan-500/20 text-cyan-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    <AlertIcon className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {status === 'High' ? 'Critical Action Needed' : status === 'Low' ? 'Outstanding Footprint' : 'Moderate Emissions'}
                                </h2>
                                <p className="text-gray-300 mb-8">{alertMsg}</p>

                                <button
                                    onClick={() => setShowPopup(false)}
                                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${status === 'High' ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20' : status === 'Low' ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20' : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'}`}
                                >
                                    View Detailed Dashboard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[var(--color-brand-surface)] border border-white/5 rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl overflow-hidden flex flex-col gap-8 md:gap-10 min-w-0"
            >
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 w-full min-w-0">
                    <div className="w-full min-w-0">
                        <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap w-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] rounded-full border border-white/10 text-sm">
                                <Leaf className="w-4 h-4 text-[var(--color-brand-accent)]" />
                                <span className="text-gray-300">Tri-Modal AI Analysis Complete</span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${alertStyles}`}>
                                <AlertIcon className="w-4 h-4" />
                                <span>{alertMsg}</span>
                            </div>
                        </div>
                        <h3 className="text-[var(--color-brand-text-secondary)] font-medium uppercase tracking-widest text-sm mb-2">Total Estimated Footprint</h3>
                        <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-2 mb-4 w-full">
                            <span className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGrad} break-all`}>
                                <CountUp end={totalCarbon} decimals={1} duration={2.5} separator="," />
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-gray-400">kg/yr</span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-cyan-400 font-medium">
                            <TreePine className="w-5 h-5" />
                            <span className="flex items-center gap-1">
                                Requires <CountUp end={treesNeeded} duration={3} className="font-bold text-xl" /> trees to offset annually
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#111111]/50 border border-white/5 rounded-2xl p-6 w-full md:w-auto min-w-[250px]">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm gap-8">
                                <span className="text-gray-400">Lifestyle Carbon</span>
                                <span className="text-white font-medium">{Math.floor(lifestyleCarbon)} kg</span>
                            </div>
                            <div className="flex justify-between items-center text-sm gap-8">
                                <span className="text-gray-400 flex items-center gap-1"><ScanSearch className="w-3 h-3" /> YOLO Waste</span>
                                <span className="text-white font-medium">{imageCarbon > 0 ? imageCarbon.toFixed(2) : '0'} kg</span>
                            </div>
                            <div className="flex justify-between items-center text-sm gap-8">
                                <span className="text-gray-400 flex items-center gap-1"><Activity className="w-3 h-3" /> SensorAI Forecast</span>
                                <span className="text-white font-medium">{sensorCarbon > 0 ? sensorCarbon.toFixed(2) : '0'} kg</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between items-center gap-8">
                                <span className="text-cyan-400 font-bold">Total Equivalent</span>
                                <span className="text-cyan-400 font-bold">{totalCarbon.toFixed(2)} kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: IoT Sensor Dashboard (New) */}
                {sensorData && (
                    <div className="w-full bg-[#111111] border border-amber-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden min-w-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 relative z-10 w-full min-w-0">
                            <div className="w-full md:w-1/3 min-w-0">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-amber-500 shrink-0" />
                                    <span className="truncate">Live Sensor</span>
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-400 mb-6">Real-time MQ-7 Gas readings forecasting the midnight total emission.</p>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mt-4">
                                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                        <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Current</span>
                                        <div className="text-base sm:text-xl font-black text-amber-500 tabular-nums break-all mt-1">
                                            <CountUp end={sensorData.current_cumulative_kg} decimals={2} duration={2} /> <span className="text-[10px] sm:text-sm text-amber-500/50">kg</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                        <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Predicted</span>
                                        <div className="text-base sm:text-xl font-black text-rose-400 tabular-nums break-all mt-1">
                                            <CountUp end={sensorData.predicted_midnight_kg} decimals={2} duration={2.5} /> <span className="text-[10px] sm:text-sm text-rose-400/50">kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tiny Recharts Instance just for the sensor line */}
                            <div className="w-full md:w-2/3 h-[140px] border border-white/5 rounded-xl bg-black/20 p-4">
                                <div className="text-xs text-gray-500 mb-2 w-full flex justify-between"><span>Live ADC History</span> <span className="text-amber-500/80 animate-pulse">● Live</span></div>
                                <div className="h-[90px] w-full flex items-end justify-between gap-1 opacity-70">
                                    {sensorData.raw_adc_history.map((val, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(val / 250) * 100}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="w-full bg-amber-500 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full min-w-0">

                    {/* Left: Table & Suggestion */}
                    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
                        <div className="w-full min-w-0">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ScanSearch className="w-5 h-5 text-violet-400 shrink-0" />
                                Computer Vision Log
                            </h4>

                            {imageRes && imageRes.length > 0 ? (
                                <div className="border border-white/10 rounded-xl overflow-x-auto bg-[#111111] w-full min-w-0">
                                    <table className="w-full text-left text-sm min-w-max">
                                        <thead className="bg-white/5 text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Material Detected</th>
                                                <th className="px-4 py-3 font-medium">Confidence</th>
                                                <th className="px-4 py-3 font-medium">Weight (g)</th>
                                                <th className="px-4 py-3 font-medium text-right">CO₂ (kg)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-gray-300">
                                            {imageRes.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 capitalize">{item.material}</td>
                                                    <td className="px-4 py-3 text-cyan-400">{Math.round(item.confidence * 100)}%</td>
                                                    <td className="px-4 py-3">{item.weight_g}g</td>
                                                    <td className="px-4 py-3 text-right font-medium text-white">{item.carbon_kg}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6 bg-[#111111] border border-white/5 rounded-xl text-center text-gray-500 text-sm">
                                    No waste images were uploaded or processed.
                                </div>
                            )}
                        </div>

                        <div className="bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-xl">
                            <h5 className="font-bold text-cyan-400 mb-2">Multimodal Reduction Suggestion</h5>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Your carbon footprint is classified as <strong style={{ color }}>{status}</strong>.
                                Our regression model notes that reducing private transport mileage is the fastest localized ways to drop this base score. Stopping petroleum-based plastic usage prevents downstream emissions based on your Vision AI scan. Finally, your live gas sensor predicts an unsafe midnight total—consider modifying your immediate environment ventilation strategy.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 text-sm text-[var(--color-brand-text-secondary)] hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Recalculate
                            </button>

                            {token && (
                                <button
                                    onClick={syncToForest}
                                    disabled={isSyncing}
                                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition-all ${
                                        syncSuccess 
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {isSyncing ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : syncSuccess ? (
                                        <Sparkles className="w-4 h-4" />
                                    ) : (
                                        <History className="w-4 h-4" />
                                    )}
                                    {syncSuccess ? 'Synced to Forest!' : 'Sync to Virtual Forest'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Bar Chart */}
                    <div className="h-full min-h-[300px] w-full bg-[#111111] rounded-xl border border-white/5 p-6 relative">
                        <div className="flex justify-between items-start mb-6">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Model Contribution Breakdown</h4>
                            <button 
                                onClick={() => setIsForestOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-lg shadow-cyan-500/10"
                            >
                                <TreePine className="w-3.5 h-3.5" />
                                Open My Forest
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={40} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg CO₂`}
                                />
                                <Bar dataKey="CO2" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500}>
                                    {
                                        chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </motion.div>

            <VirtualForestModal 
                isOpen={isForestOpen} 
                onClose={() => setIsForestOpen(false)} 
            />
        </>
    );
};

export default Scorecard;
