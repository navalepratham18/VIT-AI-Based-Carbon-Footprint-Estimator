import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Leaf, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import GetStartedButton from '../ui/GetStartedButton';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const checkAuth = () => {
        const session = localStorage.getItem('eco_user');
        if (session) {
            try {
                setUser(JSON.parse(session));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('eco_user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Setup Auth Listeners
        checkAuth();
        window.addEventListener('auth_change', checkAuth);
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('auth_change', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('eco_user');
        setUser(null);
        window.dispatchEvent(new Event('auth_change'));
        if (window.location.pathname === '/app') {
            window.location.href = '/'; // redirect to home page
        }
    };

    const navLinks = [
        { name: 'Problem', href: '/#problem' },
        { name: 'Solution', href: '/#solution' },
        { name: 'Architecture', href: '/#architecture' },
        { name: 'Gamification', href: '/#gamification' },
        { name: 'Features', href: '/#features' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled ? "bg-[var(--color-brand-bg)]/80 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
        )}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008B8B] to-[#00FFFF] flex items-center justify-center shadow-lg shadow-[#008B8B]/20 group-hover:scale-105 transition-transform duration-300">
                            <Leaf className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Eco<span className="text-[#00FFFF]">Guard</span></span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {!user && navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-[var(--color-brand-text-secondary)] hover:text-white transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                        {user && (
                            <>
                                <Link 
                                    to="/iot-sensors" 
                                    className="text-sm font-medium text-[var(--color-brand-text-secondary)] hover:text-white transition-colors flex items-center gap-2"
                                >
                                    IoT Network
                                </Link>
                                <Link 
                                    to="/app" 
                                    className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
                                >
                                    <Leaf className="w-4 h-4" />
                                    AI Vision & Virtual Forest
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* CTA / Auth State */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                                <div className="hidden sm:flex items-center gap-2">
                                    {user.picture ? (
                                        <img src={user.picture} alt={user?.name || 'User'} className="w-7 h-7 rounded-full border border-[#008B8B]/30" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#008B8B]/20 text-[#00FFFF] flex items-center justify-center text-xs font-bold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-300">{user?.name || 'User'}</span>
                                </div>
                                <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <GetStartedButton />
                        )}
                    </div>
                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center ml-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#111827]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-4 flex flex-col gap-4">
                    {!user && navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-gray-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* Mobile Auth Links */}
                    {user && (
                        <div className="flex flex-col gap-2 px-2 pb-2">
                            <Link
                                to="/iot-sensors"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                IoT Network Dashboard
                            </Link>
                            <Link
                                to="/app"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-emerald-400 hover:text-emerald-300 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <Leaf className="w-5 h-5" /> AI Vision & Virtual Forest
                            </Link>
                        </div>
                    )}

                    {/* Mobile Auth Summary */}
                    {user && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                {user.picture ? (
                                    <img src={user.picture} alt={user?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-[#008B8B]/30" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#008B8B]/20 text-[#00FFFF] flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">{user?.name || 'User'}</span>
                                    <span className="text-xs text-gray-400">Signed In</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
