import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TreePine, Trophy, Users, Search, UserPlus, Flame, Leaf, History } from 'lucide-react';
import VirtualTree from '../ui/VirtualTree';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const VirtualForestModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('forest');
    const [forestData, setForestData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Debug log for production configuration
        if (import.meta.env.PROD) {
            console.log("🚀 VirtualForest Production Config:", {
                backend: BACKEND_URL,
            });
        }
    }, []);

    const token = localStorage.getItem('eco_token');

    // ─── Data Fetching ────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const [forestRes, leaderboardRes, friendsRes] = await Promise.all([
                fetch(`${BACKEND_URL}/auth/gamification/forest`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${BACKEND_URL}/auth/gamification/leaderboard`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${BACKEND_URL}/auth/gamification/friends`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const [forest, board, comrades] = await Promise.all([
                forestRes.json(),
                leaderboardRes.json(),
                friendsRes.json()
            ]);

            if (forest.success) setForestData(forest);
            if (board.success) setLeaderboard(board.leaderboard);
            if (comrades.success) setFriends(comrades.friends);
        } catch (err) {
            console.error('Error fetching gamification data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchData();
    }, [isOpen]);

    // ─── Search & Add Friends ──────────────────────────────────────────────────
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/auth/gamification/users/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setSearchResults(data.users);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const addFriend = async (friendId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/auth/gamification/friends/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ friendId })
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                setSearchQuery('');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('Add friend error:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        className="bg-[#111111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col relative"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-950/20 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400">
                                    <TreePine className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">The Virtual Forest</h2>
                                    <p className="text-sm text-gray-400">Track your carbon reduction journey</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Stats Bar */}
                        {forestData && (
                            <div className="grid grid-cols-3 gap-1 px-6 py-4 bg-white/2 border-b border-white/5">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Trees</p>
                                    <p className="text-xl font-black text-white">{forestData.stats.totalTrees}</p>
                                </div>
                                <div className="text-center border-x border-white/5">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Healthy Trees</p>
                                    <p className="text-xl font-black text-cyan-400">{forestData.stats.healthyTrees}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Current Streak</p>
                                    <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                                        <Flame className="w-4 h-4" /> {forestData.stats.streak}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tabs Navigation */}
                        <div className="flex gap-1 p-2 bg-black/20 m-4 rounded-xl self-center">
                            {[
                                { id: 'forest', icon: TreePine, label: 'My Forest' },
                                { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                                { id: 'friends', icon: Users, label: 'Friends' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            {isLoading && (
                                <div className="absolute inset-0 bg-[#111111]/50 flex items-center justify-center z-10">
                                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {activeTab === 'forest' && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 items-end justify-items-center">
                                    {forestData?.trees.length > 0 ? (
                                        forestData.trees.map((tree, i) => (
                                            <div key={i} className="group relative">
                                                <VirtualTree health={tree.health} species={tree.species} />
                                                {/* Minimalistic Tooltip on hover */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {new Date(tree.earnedYear, tree.earnedMonth - 1).toLocaleString('default', { month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <Leaf className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                            <p className="text-gray-500 italic">No trees yet. Log your first footprint to start your forest!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'leaderboard' && (
                                <div className="space-y-3">
                                    {leaderboard.map((user, idx) => (
                                        <div key={user._id} className={`flex items-center justify-between p-4 rounded-2xl border ${idx === 0 ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/2 border-white/5'}`}>
                                            <div className="flex items-center gap-4">
                                                <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-amber-400' : 'text-gray-500'}`}>{idx + 1}</span>
                                                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-10 h-10 rounded-full bg-white/10 border border-white/10" alt="" />
                                                <div>
                                                    <p className="font-bold text-white">{user.username}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{user.monthsTracked} months active</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-cyan-400">{user.avgCO2} <span className="text-[10px] font-bold">kg/m</span></p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Tree Requirement</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'friends' && (
                                <div className="space-y-6">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input 
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                            placeholder="Search by username..."
                                        />
                                        
                                        {/* Search Results Dropdown */}
                                        {searchResults.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#12182b] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                                {searchResults.map(user => (
                                                    <div key={user._id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                                        <div className="flex items-center gap-3">
                                                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-8 h-8 rounded-full" alt="" />
                                                            <span className="text-white font-medium">{user.username}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => addFriend(user._id)}
                                                            className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition-all"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Your Friends</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {friends.length > 0 ? (
                                            friends.map(friend => (
                                                <div key={friend._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 group hover:border-cyan-500/30 transition-colors">
                                                    <img src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-white truncate">{friend.username}</p>
                                                        <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                                                    </div>
                                                    <button className="text-gray-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <History className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-10 text-center">
                                                <p className="text-gray-500 italic text-sm">No friends added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tooltip explanation */}
                        <div className="p-4 bg-cyan-500/5 border-t border-cyan-500/10 text-[10px] text-center text-cyan-500/60 font-medium">
                            Every healthy tree earned represents a month of lowering your carbon footprint by at least 5%.
                        </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VirtualForestModal;
