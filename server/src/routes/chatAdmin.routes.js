// server/src/routes/chatAdmin.routes.js

import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getChatStats,
  getMessages,
  deleteMessage,
  bulkDeleteMessages,
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  getOnlineUsers,
  broadcastMessage,
} from '../controllers/chatAdminController.js';

const router = express.Router();

// All routes require admin auth
router.use(adminAuth);

// Stats
router.get('/stats', getChatStats);

// Messages
router.get('/messages', getMessages);
router.delete('/messages/bulk-delete', bulkDeleteMessages); // must be before :messageId
router.delete('/messages/:messageId', deleteMessage);

// Channels
router.get('/channels', getChannels);
router.post('/channels', createChannel);
router.put('/channels/:channelId', updateChannel);
router.delete('/channels/:channelId', deleteChannel);

// Online users
router.get('/online-users', getOnlineUsers);

// Broadcast
router.post('/broadcast', broadcastMessage);

export default router;