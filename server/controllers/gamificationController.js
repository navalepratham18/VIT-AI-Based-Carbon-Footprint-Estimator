import Footprint from '../models/Footprint.js';
import Tree from '../models/Tree.js';
import User from '../models/User.js';

// ─── Log Footprint & Earn Tree ──────────────────────────────────────────────
export const logFootprint = async (req, res) => {
    try {
        const { co2_kg } = req.body;
        const userId = req.user._id;
        
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        // 1. Determine tree health based on previous month's performance
        let health = 'healthy';
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;

        const prevEntry = await Footprint.findOne({ userId, month: prevMonth, year: prevYear });

        if (prevEntry) {
            const changePct = ((co2_kg - prevEntry.co2_kg) / prevEntry.co2_kg) * 100;
            if (changePct < -5) {
                health = 'healthy';
            } else if (changePct <= 5) {
                health = 'neutral';
            } else {
                health = 'unhealthy';
            }
        }

        // 2. Save or Update Footprint
        await Footprint.findOneAndUpdate(
            { userId, month, year },
            { co2_kg },
            { upsert: true, new: true }
        );

        // 3. Update or Create Tree for this month
        const speciesPool = ['oak', 'pine', 'maple', 'birch', 'willow'];
        const species = speciesPool[Math.floor(Math.random() * speciesPool.length)];

        const tree = await Tree.findOneAndUpdate(
            { userId, earnedMonth: month, earnedYear: year },
            { health, species },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Footprint logged and tree updated!',
            tree,
            performance: health
        });
    } catch (err) {
        console.error('logFootprint error:', err);
        res.status(500).json({ success: false, message: 'Server error logging footprint' });
    }
};

// ─── Get Forest Data ──────────────────────────────────────────────────────────
export const getMyForest = async (req, res) => {
    try {
        const userId = req.user._id;
        const [trees, footprints] = await Promise.all([
            Tree.find({ userId }).sort({ earnedYear: 1, earnedMonth: 1 }),
            Footprint.find({ userId }).sort({ year: 1, month: 1 })
        ]);

        // Calculate streak (consecutive healthy months)
        let streak = 0;
        for (let i = trees.length - 1; i >= 0; i--) {
            if (trees[i].health === 'healthy') streak++;
            else break;
        }

        res.json({
            success: true,
            trees,
            stats: {
                totalTrees: trees.length,
                healthyTrees: trees.filter(t => t.health === 'healthy').length,
                streak
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching forest data' });
    }
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getLeaderboard = async (req, res) => {
    try {
        // Average CO2 score (lower is better)
        const leaderboard = await Footprint.aggregate([
            { $group: {
                _id: '$userId',
                avgCO2: { $avg: '$co2_kg' },
                monthsTracked: { $sum: 1 }
            }},
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }},
            { $unwind: '$userInfo' },
            { $project: {
                username: '$userInfo.username',
                avatar:   '$userInfo.avatar',
                avgCO2:   { $round: ['$avgCO2', 2] },
                monthsTracked: 1
            }},
            { $sort: { avgCO2: 1 } },
            { $limit: 20 }
        ]);

        res.json({ success: true, leaderboard });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
    }
};

// ─── Friend System ───────────────────────────────────────────────────────────
export const findUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json({ success: true, users: [] });

        const users = await User.find({
            username: { $regex: query, $options: 'i' },
            _id: { $ne: req.user._id }
        }).select('username avatar email').limit(10);

        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error searching users' });
    }
};

export const addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user._id);

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ success: false, message: 'Already friends' });
        }

        user.friends.push(friendId);
        await user.save();

        res.json({ success: true, message: 'Friend added!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding friend' });
    }
};

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'username avatar email');
        res.json({ success: true, friends: user.friends });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching friends' });
    }
};
