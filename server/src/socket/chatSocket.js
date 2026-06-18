// server/src/socket/chatSocket.js - UPDATED VERSION

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.username = decoded.username;
      socket.role = decoded.role || 'user';
      
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

    // Update user presence
    await updateUserPresence(socket.userId, 'online', socket.id);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Emit online users list to all clients
    emitOnlineUsers();

    /* ================= JOIN CHANNEL ================= */
    socket.on("join:channel", async (channelId) => {
      try {
        // Leave previous channel rooms
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
          if (room.startsWith('channel:')) {
            socket.leave(room);
          }
        });

        // Join new channel
        socket.join(`channel:${channelId}`);
        
        await db.execute(
          'UPDATE user_presence SET current_channel_id = ? WHERE user_id = ?',
          [channelId, socket.userId]
        );

        // Send recent messages from this channel (WITH REPLIES)
        const [messages] = await db.execute(
          `SELECT 
            cm.id,
            cm.content,
            cm.message_type,
            cm.image_url,
            cm.reply_to_message_id,
            cm.is_edited,
            cm.created_at,
            u.id as user_id,
            u.username,
            u.avatar,
            u.role,
            u.level,
            rm.id as replied_message_id,
            rm.content as replied_message_content,
            ru.username as replied_message_username
           FROM chat_messages cm
           INNER JOIN users u ON cm.user_id = u.id
           LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id
           LEFT JOIN users ru ON rm.user_id = ru.id
           WHERE cm.channel_id = ?
             AND cm.is_deleted = FALSE
           ORDER BY cm.created_at DESC
           LIMIT 50`,
          [channelId]
        );

        // Transform messages to include replied_message object
        const transformedMessages = messages.map(msg => ({
          ...msg,
          replied_message: msg.replied_message_id ? {
            id: msg.replied_message_id,
            content: msg.replied_message_content,
            username: msg.replied_message_username
          } : null
        }));

        socket.emit("channel:history", transformedMessages.reverse());

        console.log(`📢 ${socket.username} joined channel ${channelId}`);

      } catch (err) {
        console.error("JOIN CHANNEL ERROR:", err);
        socket.emit("error", { message: "Failed to join channel" });
      }
    });

    /* ================= SEND MESSAGE (WITH REPLY SUPPORT) ================= */
    socket.on("message:send", async (data) => {
      try {
        const { channelId, content, replyToMessageId = null } = data;

        // Validation
        if (!content || content.trim().length === 0) {
          return socket.emit("error", { message: "Message cannot be empty" });
        }

        if (content.length > 2000) {
          return socket.emit("error", { message: "Message too long" });
        }

        // Rate limiting check
        const [[{ recent_count }]] = await db.execute(
          `SELECT COUNT(*) as recent_count 
           FROM chat_messages 
           WHERE user_id = ? 
             AND channel_id = ?
             AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)`,
          [socket.userId, channelId]
        );

        if (recent_count >= 5) {
          return socket.emit("error", { 
            message: "Slow down! You're sending messages too fast" 
          });
        }

        // Insert message WITH reply_to_message_id
        const [result] = await db.execute(
          `INSERT INTO chat_messages 
           (channel_id, user_id, content, reply_to_message_id)
           VALUES (?, ?, ?, ?)`,
          [channelId, socket.userId, content, replyToMessageId]
        );

        // Fetch complete message data WITH replied message
        const [[message]] = await db.execute(
          `SELECT 
            cm.id,
            cm.content,
            cm.message_type,
            cm.reply_to_message_id,
            cm.created_at,
            u.id as user_id,
            u.username,
            u.avatar,
            u.role,
            u.level,
            rm.id as replied_message_id,
            rm.content as replied_message_content,
            ru.username as replied_message_username
           FROM chat_messages cm
           INNER JOIN users u ON cm.user_id = u.id
           LEFT JOIN chat_messages rm ON cm.reply_to_message_id = rm.id
           LEFT JOIN users ru ON rm.user_id = ru.id
           WHERE cm.id = ?`,
          [result.insertId]
        );

        // Transform message
        const transformedMessage = {
          ...message,
          replied_message: message.replied_message_id ? {
            id: message.replied_message_id,
            content: message.replied_message_content,
            username: message.replied_message_username
          } : null
        };

        // Broadcast to channel
        io.to(`channel:${channelId}`).emit("message:new", transformedMessage);

        console.log(`💬 ${socket.username}: ${content.substring(0, 50)}`);

      } catch (err) {
        console.error("SEND MESSAGE ERROR:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /* ================= TYPING INDICATOR ================= */
    socket.on("typing:start", async ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit("typing:update", {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });

    socket.on("typing:stop", async ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit("typing:update", {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });

    /* ================= MESSAGE REACTIONS ================= */
    socket.on("message:react", async ({ messageId, emoji }) => {
      try {
        // Check if already reacted with this emoji
        const [[existing]] = await db.execute(
          'SELECT id FROM message_reactions WHERE user_id = ? AND message_id = ? AND emoji = ?',
          [socket.userId, messageId, emoji]
        );

        if (existing) {
          // Remove reaction
          await db.execute('DELETE FROM message_reactions WHERE id = ?', [existing.id]);
          await db.execute(
            'UPDATE chat_messages SET reaction_count = reaction_count - 1 WHERE id = ?',
            [messageId]
          );
        } else {
          // Add reaction
          await db.execute(
            'INSERT INTO message_reactions (user_id, message_id, emoji) VALUES (?, ?, ?)',
            [socket.userId, messageId, emoji]
          );
          await db.execute(
            'UPDATE chat_messages SET reaction_count = reaction_count + 1 WHERE id = ?',
            [messageId]
          );
        }

        // Get updated reactions
        const [reactions] = await db.execute(
          `SELECT emoji, COUNT(*) as count, 
           JSON_ARRAYAGG(u.username) as users
           FROM message_reactions mr
           INNER JOIN users u ON mr.user_id = u.id
           WHERE message_id = ?
           GROUP BY emoji`,
          [messageId]
        );

        // Get channel_id for broadcasting
        const [[msg]] = await db.execute(
          'SELECT channel_id FROM chat_messages WHERE id = ?',
          [messageId]
        );

        // Broadcast to channel
        io.to(`channel:${msg.channel_id}`).emit("message:reactions", {
          messageId,
          reactions
        });

      } catch (err) {
        console.error("REACT ERROR:", err);
        socket.emit("error", { message: "Failed to react" });
      }
    });

    /* ================= DELETE MESSAGE ================= */
    socket.on("message:delete", async ({ messageId }) => {
      try {
        // Check ownership
        const [[message]] = await db.execute(
          'SELECT user_id, channel_id FROM chat_messages WHERE id = ?',
          [messageId]
        );

        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        if (message.user_id !== socket.userId && socket.role !== 'admin') {
          return socket.emit("error", { message: "Not authorized" });
        }

        // Soft delete
        await db.execute(
          'UPDATE chat_messages SET is_deleted = TRUE WHERE id = ?',
          [messageId]
        );

        // Broadcast deletion
        io.to(`channel:${message.channel_id}`).emit("message:deleted", {
          messageId
        });

      } catch (err) {
        console.error("DELETE MESSAGE ERROR:", err);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${socket.username}`);
      
      await updateUserPresence(socket.userId, 'offline');
      emitOnlineUsers();
    });

  });

  return io;
}

// Helper: Update user presence
async function updateUserPresence(userId, status, socketId = null) {
  try {
    await db.execute(
      `INSERT INTO user_presence (user_id, status, socket_id, last_seen)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         socket_id = VALUES(socket_id),
         last_seen = NOW()`,
      [userId, status, socketId]
    );
  } catch (err) {
    console.error("UPDATE PRESENCE ERROR:", err);
  }
}

// Helper: Emit online users list
async function emitOnlineUsers() {
  try {
    const [onlineUsers] = await db.execute(
      `SELECT 
        u.id,
        u.username,
        u.avatar,
        u.role,
        u.level,
        up.status,
        up.current_channel_id
       FROM user_presence up
       INNER JOIN users u ON up.user_id = u.id
       WHERE up.status IN ('online', 'away', 'busy')
       ORDER BY u.username ASC`
    );

    io.emit("users:online", onlineUsers);
  } catch (err) {
    console.error("EMIT ONLINE USERS ERROR:", err);
  }
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}