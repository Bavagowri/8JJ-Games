// server/src/controllers/chatAdminController.js

import { db } from '../db/index.js';
import { getIO } from '../socket/chatSocket.js';

/* ─── Stats ──────────────────────────────────────── */
export async function getChatStats(req, res) {
  try {
    const [[{ totalMessages }]] = await db.execute(
      'SELECT COUNT(*) as totalMessages FROM chat_messages'
    );
    const [[{ messagesToday }]] = await db.execute(
      'SELECT COUNT(*) as messagesToday FROM chat_messages WHERE DATE(created_at) = CURDATE()'
    );
    const [[{ deletedMessages }]] = await db.execute(
      'SELECT COUNT(*) as deletedMessages FROM chat_messages WHERE is_deleted = TRUE'
    );
    const [[{ activeChannels }]] = await db.execute(
      'SELECT COUNT(*) as activeChannels FROM chat_channels WHERE is_active = TRUE'
    );
    const [[{ uniqueChatters }]] = await db.execute(
      'SELECT COUNT(DISTINCT user_id) as uniqueChatters FROM chat_messages WHERE is_deleted = FALSE'
    );
    const [[{ onlineUsers }]] = await db.execute(
      "SELECT COUNT(*) as onlineUsers FROM user_presence WHERE status IN ('online', 'away', 'busy')"
    );

    res.json({
      totalMessages,
      messagesToday,
      deletedMessages,
      activeChannels,
      uniqueChatters,
      onlineUsers,
    });
  } catch (err) {
    console.error('CHAT STATS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch chat stats' });
  }
}

/* ─── Messages ───────────────────────────────────── */
export async function getMessages(req, res) {
  try {
    const { page = 1, limit = 30, channel = '', search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conditions = [];
    const params = [];

    if (channel) {
      conditions.push('cm.channel_id = ?');
      params.push(channel);
    }
    if (search) {
      conditions.push('(cm.content LIKE ? OR u.username LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total FROM chat_messages cm 
       INNER JOIN users u ON cm.user_id = u.id ${where}`,
      params
    );

    const [messages] = await db.query(
      `SELECT cm.id, cm.content, cm.is_deleted, cm.reply_to_message_id,
              cm.created_at, u.id as user_id, u.username, u.role,
              cc.name as channel_name, cc.id as channel_id
       FROM chat_messages cm
       INNER JOIN users u ON cm.user_id = u.id
       INNER JOIN chat_channels cc ON cm.channel_id = cc.id
       ${where}
       ORDER BY cm.created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('GET MESSAGES ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;

    const [[msg]] = await db.execute(
      'SELECT channel_id FROM chat_messages WHERE id = ?',
      [messageId]
    );

    if (!msg) return res.status(404).json({ message: 'Message not found' });

    await db.execute(
      'UPDATE chat_messages SET is_deleted = TRUE WHERE id = ?',
      [messageId]
    );

    // Broadcast deletion via socket
    try {
      const io = getIO();
      io.to(`channel:${msg.channel_id}`).emit('message:deleted', {
        messageId: parseInt(messageId),
      });
    } catch {
      // Socket may not be up during testing — don't fail the request
    }

    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error('DELETE MESSAGE ERROR:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
}

export async function bulkDeleteMessages(req, res) {
  try {
    const { messageIds } = req.body;
    if (!Array.isArray(messageIds) || !messageIds.length) {
      return res.status(400).json({ message: 'No message IDs provided' });
    }

    // Get channel IDs for socket notifications
    const placeholders = messageIds.map(() => '?').join(',');
    const [msgs] = await db.execute(
      `SELECT DISTINCT channel_id FROM chat_messages WHERE id IN (${placeholders})`,
      messageIds
    );

    await db.execute(
      `UPDATE chat_messages SET is_deleted = TRUE WHERE id IN (${placeholders})`,
      messageIds
    );

    // Notify via socket
    try {
      const io = getIO();
      for (const { channel_id } of msgs) {
        for (const id of messageIds) {
          io.to(`channel:${channel_id}`).emit('message:deleted', { messageId: id });
        }
      }
    } catch { /* ignore */ }

    res.json({ message: `${messageIds.length} messages deleted` });
  } catch (err) {
    console.error('BULK DELETE ERROR:', err);
    res.status(500).json({ message: 'Failed to bulk delete' });
  }
}

/* ─── Channels ───────────────────────────────────── */
export async function getChannels(req, res) {
  try {
    const [channels] = await db.execute(
      `SELECT cc.*, 
       (SELECT COUNT(*) FROM chat_messages WHERE channel_id = cc.id AND is_deleted = FALSE) as message_count
       FROM chat_channels cc
       ORDER BY cc.display_order ASC`
    );
    res.json(channels);
  } catch (err) {
    console.error('GET CHANNELS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
}

export async function createChannel(req, res) {
  try {
    const { name, description, icon, color, is_active } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const [result] = await db.execute(
      `INSERT INTO chat_channels (name, description, icon, color, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || null, icon || '💬', color || '#5865F2', is_active !== false]
    );

    // Fetch the created channel
    const [[newChannel]] = await db.execute(
      'SELECT * FROM chat_channels WHERE id = ?',
      [result.insertId]
    );

    //  Broadcast to all connected clients
    try {
      const io = getIO();
      io.emit('channel:created', newChannel);
      console.log('✅ Channel created event emitted:', newChannel.name);
    } catch (e) {
      console.warn('⚠️ Failed to emit channel:created:', e.message);
    }

    res.status(201).json({ message: 'Channel created', channelId: result.insertId });
  } catch (err) {
    console.error('CREATE CHANNEL ERROR:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Channel name already exists' });
    }
    res.status(500).json({ message: 'Failed to create channel' });
  }
}

export async function updateChannel(req, res) {
  try {
    const { channelId } = req.params;
    const { name, description, icon, color, is_active } = req.body;

    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (icon !== undefined) { fields.push('icon = ?'); params.push(icon); }
    if (color !== undefined) { fields.push('color = ?'); params.push(color); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }

    if (!fields.length) return res.status(400).json({ message: 'Nothing to update' });

    params.push(channelId);
    await db.execute(`UPDATE chat_channels SET ${fields.join(', ')} WHERE id = ?`, params);

    // Fetch updated channel
    const [[updatedChannel]] = await db.execute(
      'SELECT * FROM chat_channels WHERE id = ?',
      [channelId]
    );

    //  Broadcast to all connected clients
    try {
      const io = getIO();
      io.emit('channel:updated', updatedChannel);
      console.log('✅ Channel updated event emitted:', updatedChannel.name);
    } catch (e) {
      console.warn('⚠️ Failed to emit channel:updated:', e.message);
    }

    res.json({ message: 'Channel updated' });
  } catch (err) {
    console.error('UPDATE CHANNEL ERROR:', err);
    res.status(500).json({ message: 'Failed to update channel' });
  }
}

export async function deleteChannel(req, res) {
  try {
    const { channelId } = req.params;
    
    await db.execute('DELETE FROM chat_channels WHERE id = ?', [channelId]);

    //  Broadcast to all connected clients
    try {
      const io = getIO();
      io.emit('channel:deleted', { channelId: parseInt(channelId) });
      console.log('✅ Channel deleted event emitted:', channelId);
    } catch (e) {
      console.warn('⚠️ Failed to emit channel:deleted:', e.message);
    }

    res.json({ message: 'Channel deleted' });
  } catch (err) {
    console.error('DELETE CHANNEL ERROR:', err);
    res.status(500).json({ message: 'Failed to delete channel' });
  }
}

/* ─── Online users ───────────────────────────────── */
export async function getOnlineUsers(req, res) {
  try {
    const [users] = await db.execute(
      `SELECT u.id, u.username, u.avatar, u.role, u.level,
              up.status, up.current_channel_id, up.last_seen
       FROM user_presence up
       INNER JOIN users u ON up.user_id = u.id
       WHERE up.status IN ('online', 'away', 'busy')
       ORDER BY up.status ASC, u.username ASC`
    );
    res.json(users);
  } catch (err) {
    console.error('ONLINE USERS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch online users' });
  }
}

/* ─── Broadcast ──────────────────────────────────── */
export async function broadcastMessage(req, res) {
  try {
    const { channelId, message } = req.body;
    const adminId = req.admin.id;

    if (!channelId || !message?.trim()) {
      return res.status(400).json({ message: 'channelId and message are required' });
    }

    // Insert as system message from admin user
    const [result] = await db.execute(
      `INSERT INTO chat_messages (channel_id, user_id, content, message_type)
       VALUES (?, ?, ?, 'system')`,
      [channelId, adminId, message.trim()]
    );

    // Fetch inserted message for broadcast
    const [[msg]] = await db.execute(
      `SELECT cm.id, cm.content, cm.message_type, cm.created_at,
              u.id as user_id, u.username, u.avatar, u.role, u.level
       FROM chat_messages cm
       INNER JOIN users u ON cm.user_id = u.id
       WHERE cm.id = ?`,
      [result.insertId]
    );

    try {
      const io = getIO();
      io.to(`channel:${channelId}`).emit('message:new', { ...msg, is_system: true });
    } catch { /* ignore */ }

    res.json({ message: 'Broadcast sent', messageId: result.insertId });
  } catch (err) {
    console.error('BROADCAST ERROR:', err);
    res.status(500).json({ message: 'Failed to broadcast message' });
  }
}