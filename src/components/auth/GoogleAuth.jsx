import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';
const FOREST_URL = import.meta.env.VITE_GAMIFICATION_URL || 'http://localhost:5001';

const GoogleAuth = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [syncSuccess, setSyncSuccess] = useState(false);

    useEffect(() => {
        // Debug log for production configuration
        if (import.meta.env.PROD) {
            console.log("🚀 EcoGuard Production Config:", {
                backend: BACKEND_URL,
                gamification: FOREST_URL,
                status: BACKEND_URL.includes('localhost') ? '⚠️ FALLBACK TO LOCALHOST' : '✅ PRODUCTION URL DETECTED'
            });
        }
    }, []);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError(null);
            try {
                // Send the Google access_token to our backend
                const res = await fetch(`${BACKEND_URL}/auth/google/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token }),
                });

                const data = await res.json();

                if (data.success) {
                    // Store JWT for secured API calls
                    localStorage.setItem('eco_token', data.token);

                    // Store user session (compatible with existing Navbar shape)
                    const userSession = {
                        name:          data.user.username,
                        email:         data.user.email,
                        picture:       data.user.avatar,
                        authenticated: true,
                    };
                    localStorage.setItem('eco_user', JSON.stringify(userSession));

                    // Notify Navbar + parent component
                    window.dispatchEvent(new Event('auth_change'));
                    
                    // Show success but allow going to game
                    setSyncSuccess(true);
                    onLogin(userSession);
                } else {
                    setError(data.message || 'Login failed. Please try again.');
                }
            } catch (err) {
                console.error('OAuth error:', err);
                setError('Could not connect to server. Make sure backend is running.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            setError('Google sign-in was cancelled or failed.');
            setIsLoading(false);
        }
    });

    const handleGoogleLogin = () => {
        setIsLoading(true);
        login();
    };

    return (
        <div className="w-full flex items-center justify-center pt-20 pb-40">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0b1020]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden"
            >
                {/* Decorative Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--color-brand-accent)] rounded-full blur-[80px] opacity-20 pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--color-brand-accent)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="M12 8v4" />
                            <path d="M12 16h.01" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Authentication</h2>
                    <p className="text-gray-400 text-sm">Sign in to save your carbon reduction metrics and access the Tri-Modal prediction dashboard.</p>
                </div>

                <div className="relative z-10 space-y-4">
                    {!syncSuccess ? (
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                <p className="text-emerald-400 font-bold mb-1">Success! Logged in.</p>
                                <p className="text-xs text-emerald-400/60">Your metrics are now being synced.</p>
                            </div>
                            <a 
                                href={FOREST_URL} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-emerald-500/20"
                            >
                                Go to Virtual Forest Game
                            </a>
                        </div>
                    )}

                    <p className="text-xs text-center text-gray-500 mt-6">
                        By continuing, you are setting up a local session to securely compute your environmental footprint.
                    </p>

                    {error && (
                        <p className="text-xs text-center text-rose-400 mt-3 bg-rose-400/10 border border-rose-400/20 rounded-lg py-2 px-3">
                            {error}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GoogleAuth;
