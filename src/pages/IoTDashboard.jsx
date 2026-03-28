import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Radio, Activity, Zap, Cloud, FileText, Download, X, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image'; // Modern replacement for html2canvas
import { jsPDF } from 'jspdf';

const IOT_API_BASE = import.meta.env.VITE_IOT_API_URL || 'http://127.0.0.1:5000';
const POLL_INTERVAL_MS = 5000;

const IoTDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [currentReading, setCurrentReading] = useState(0);
    const [cumulativeDaily, setCumulativeDaily] = useState(0);
    const [projectedFinal, setProjectedFinal] = useState(0);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Audit Report State
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false); 
    const [auditData, setAuditData] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const user = localStorage.getItem('eco_user');
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);

    const fetchIoTData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${IOT_API_BASE}/api/dashboard?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const payload = await response.json();
            if (payload.status !== 'success') throw new Error(payload.message || 'Failed to load live sensor data');

            setChartData(Array.isArray(payload.points) ? payload.points : []);
            setCurrentReading(Number(payload.current_adc || 0));
            setCumulativeDaily(Number(payload.cumulative_daily || 0));
            setProjectedFinal(Number(payload.projected_final || 0));
            setUpdatedAt(payload.updated_at || null);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message || 'Could not fetch IoT data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchIoTData();
        const timer = setInterval(fetchIoTData, POLL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [isAuthenticated, fetchIoTData]);

    const updatedAgoLabel = useMemo(() => {
        if (!updatedAt) return 'No data yet';
        const parsed = new Date(updatedAt.replace(' ', 'T'));
        const deltaMs = Date.now() - parsed.getTime();
        if (Number.isNaN(deltaMs) || deltaMs < 0) return 'just now';
        const secs = Math.floor(deltaMs / 1000);
        if (secs < 60) return `${secs}s ago`;
        const mins = Math.floor(secs / 60);
        if (mins < 60) return `${mins}m ago`;
        return `${Math.floor(mins / 60)}h ago`;
    }, [updatedAt]);

    const handleGenerateReport = async () => {
        try {
            setIsGeneratingAudit(true);
            const response = await fetch(`${IOT_API_BASE}/api/audit`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setAuditData(data);
                setIsAuditModalOpen(true);
            } else {
                alert("Failed to generate report: " + data.message);
            }
        } catch (error) {
            alert("Error connecting to Audit Engine: " + error.message);
        } finally {
            setIsGeneratingAudit(false);
        }
    };

    // UPDATED: Modern, OKLCH-safe PDF Generation
    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            
            const element = printRef.current;
            if (!element) {
                alert("Error: Cannot find the report to print.");
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 150));

            // toPng uses native browser rendering, bypassing the Tailwind color crash
            const data = await toPng(element, { 
                cacheBust: true,
                backgroundColor: '#0b1020', // Forces the dark background
                pixelRatio: 2 // High resolution
            });
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Immutable_Carbon_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
            
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert(`Failed to generate PDF: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-bg)] w-full pt-28 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-start pb-20">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-[var(--color-brand-bg)] -z-10" />

            <div className="w-full max-w-6xl">
                <div className="mb-12 text-center relative">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <Radio className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">IoT Sensor Network</h1>
                    <p className="text-[var(--color-brand-text-secondary)] text-lg max-w-2xl mx-auto">
                        Real-time air quality monitoring with MQ-7 hardware and daily future emission projections.
                    </p>
                </div>

                {!isAuthenticated ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-md mx-auto backdrop-blur-sm">
                        <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
                        <a href="/app" className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold rounded-xl shadow-lg mt-4">
                            Go to Login
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col h-full">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                NodeMCU Status
                            </h3>
                            
                            <div className="space-y-4 flex-grow">
                                <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg"><Zap className="w-5 h-5 text-blue-400" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">Current Readings</p>
                                            <p className="text-lg font-bold text-white">{currentReading.toLocaleString()} ADC</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400">LIVE</span>
                                </div>

                                <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg"><Cloud className="w-5 h-5 text-indigo-400" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">Cumulative Daily</p>
                                            <p className="text-lg font-bold text-white">{cumulativeDaily.toLocaleString()} ppm</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 text-right">Updated<br/>{updatedAgoLabel}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerateReport}
                                disabled={isGeneratingAudit}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <FileText className="w-5 h-5" />
                                {isGeneratingAudit ? "Calculating Data..." : "Generate Audit Report"}
                            </button>
                        </div>

                        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Live Telemetry</h3>
                                    <p className="text-sm text-gray-400">Real-time ADC readings from edge nodes</p>
                                </div>
                                <button
                                    onClick={fetchIoTData}
                                    className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm font-semibold text-blue-400 transition-colors"
                                >
                                    Manual Sync
                                </button>
                            </div>
                            
                            <div className="flex-1 w-full min-h-[300px] mt-4 flex flex-col relative">
                                <p className="text-2xl font-black text-white tracking-widest leading-none drop-shadow-md mb-6 ml-4">
                                    {projectedFinal.toLocaleString()} <span className="text-sm text-blue-400 font-medium tracking-normal">PROJECTED FINAL</span>
                                </p>
                                {fetchError && <p className="text-sm text-rose-400 ml-4 mb-4">{fetchError}</p>}
                                <div className="flex-1 w-full min-h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="time" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                            />
                                            <Line type="monotone" dataKey="emissions" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#0b1020', stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#60a5fa', stroke: '#0b1020', strokeWidth: 2 }} animationDuration={1500} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isAuditModalOpen && auditData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[var(--color-brand-bg)] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                <h2 className="text-xl font-bold text-white">Immutable Carbon Audit</h2>
                            </div>
                            <button onClick={() => setIsAuditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div ref={printRef} className="p-8 bg-[var(--color-brand-bg)]">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Official Emissions Report</h1>
                                <p className="text-gray-400 font-mono text-sm">Generated: {auditData.timestamp}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Total Transactions Audited</span>
                                    <span className="text-white font-bold">{auditData.transactions_audited} Tx</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Exhaust Flow Rate</span>
                                    <span className="text-white font-bold">{auditData.exhaust_flow_rate} m³/hr</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Peak Concentration (CO)</span>
                                    <span className="text-rose-400 font-bold">{auditData.peak_concentration_ppm} PPM</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-300 font-bold text-lg">Total CO Emitted</span>
                                    <span className="text-blue-400 font-black text-2xl">{auditData.total_co_emitted_kg} kg</span>
                                </div>
                            </div>

                            <div className="mt-10 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <p className="text-emerald-400 text-xs font-mono uppercase tracking-wider text-center mb-1">Cryptographically Anchored To Sepolia Testnet</p>
                                <p className="text-gray-500 text-[10px] font-mono text-center break-all">Contract: {auditData.contract_address}</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                            <button onClick={() => setIsAuditModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-semibold transition-colors">
                                Close
                            </button>
                            <button 
                                onClick={handleDownloadPDF} 
                                disabled={isDownloading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" /> 
                                {isDownloading ? "Generating..." : "Download PDF"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IoTDashboard;