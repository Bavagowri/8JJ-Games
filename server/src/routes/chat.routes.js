// server/src/routes/chat.routes.js

import express from 'express';
import { auth } from '../middleware/auth.js';
import { db } from '../db/index.js';

const router = express.Router();

// Get active channels for users
router.get('/channels', auth, async (req, res) => {
  try {
    const [channels] = await db.execute(
      `SELECT id, name, description, icon, color, display_order, is_active
       FROM chat_channels
       WHERE is_active = TRUE
       ORDER BY display_order ASC, name ASC`
    );

    res.json(channels);
  } catch (err) {
    console.error('GET CHANNELS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
});

// Get channel by ID
router.get('/channels/:channelId', auth, async (req, res) => {
  try {
    const { channelId } = req.params;
    
    const [channels] = await db.execute(
      `SELECT id, name, description, icon, color
       FROM chat_channels
       WHERE id = ? AND is_active = TRUE`,
      [channelId]
    );

    if (!channels.length) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channels[0]);
  } catch (err) {
    console.error('GET CHANNEL ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch channel' });
  }
});

export default router;