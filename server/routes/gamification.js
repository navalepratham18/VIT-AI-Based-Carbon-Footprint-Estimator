import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    logFootprint,
    getMyForest,
    getLeaderboard,
    findUsers,
    addFriend,
    getFriends
} from '../controllers/gamificationController.js';

const router = express.Router();

router.use(protect); // All gamification routes require authentication

router.post('/log', logFootprint);
router.get('/forest', getMyForest);
router.get('/leaderboard', getLeaderboard);
router.get('/users/search', findUsers);
router.post('/friends/add', addFriend);
router.get('/friends', getFriends);

export default router;
