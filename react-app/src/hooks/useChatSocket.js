// react-app/src/hooks/useChatSocket.js 

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050';

export function useChatSocket({ 
  onMessage, 
  onHistory, 
  onOnlineUsers,
  onTyping,
  onMessageDeleted,
  onMessageReactions,
  onChannelCreated,    //  NEW
  onChannelUpdated,    //  NEW
  onChannelDeleted,    //  NEW
}) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  // Store callbacks in refs so the socket effect never needs to re-run
  // when the parent re-renders and recreates these functions
  const onMessageRef = useRef(onMessage);
  const onHistoryRef = useRef(onHistory);
  const onOnlineUsersRef = useRef(onOnlineUsers);
  const onTypingRef = useRef(onTyping);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onMessageReactionsRef = useRef(onMessageReactions);
  const onChannelCreatedRef = useRef(onChannelCreated);      //  NEW
  const onChannelUpdatedRef = useRef(onChannelUpdated);      //  NEW
  const onChannelDeletedRef = useRef(onChannelDeleted);      //  NEW

  // Keep refs up to date on every render without triggering the socket effect
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onHistoryRef.current = onHistory; }, [onHistory]);
  useEffect(() => { onOnlineUsersRef.current = onOnlineUsers; }, [onOnlineUsers]);
  useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);
  useEffect(() => { onMessageDeletedRef.current = onMessageDeleted; }, [onMessageDeleted]);
  useEffect(() => { onMessageReactionsRef.current = onMessageReactions; }, [onMessageReactions]);
  useEffect(() => { onChannelCreatedRef.current = onChannelCreated; }, [onChannelCreated]);     //  NEW
  useEffect(() => { onChannelUpdatedRef.current = onChannelUpdated; }, [onChannelUpdated]);     //  NEW
  useEffect(() => { onChannelDeletedRef.current = onChannelDeleted; }, [onChannelDeleted]);     //  NEW

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found, skipping socket connection');
      return;
    }

    console.log('🔌 Attempting socket connection to:', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🚫 Socket connection error:', error.message);
      setConnected(false);
    });

    // Chat events — call the ref so we always invoke the latest callback
    // without the socket needing to be recreated
    newSocket.on('message:new', (message) => {
      console.log('📩 New message:', message);
      onMessageRef.current?.(message);
    });

    newSocket.on('channel:history', (history) => {
      console.log('📜 Channel history:', history.length, 'messages');
      onHistoryRef.current?.(history);
    });

    newSocket.on('users:online', (users) => {
      console.log('👥 Online users:', users.length);
      onOnlineUsersRef.current?.(users);
    });

    newSocket.on('typing:update', (data) => {
      onTypingRef.current?.(data);
    });

    newSocket.on('message:deleted', (data) => {
      console.log('🗑️ Message deleted:', data.messageId);
      onMessageDeletedRef.current?.(data);
    });

    newSocket.on('message:reactions', (data) => {
      console.log('💖 Message reactions updated:', data.messageId);
      onMessageReactionsRef.current?.(data);
    });

    //  NEW: Channel events
    newSocket.on('channel:created', (channel) => {
      console.log('📢 Channel created:', channel);
      onChannelCreatedRef.current?.(channel);
    });

    newSocket.on('channel:updated', (channel) => {
      console.log('📢 Channel updated:', channel);
      onChannelUpdatedRef.current?.(channel);
    });

    newSocket.on('channel:deleted', (data) => {
      console.log('📢 Channel deleted:', data.channelId);
      onChannelDeletedRef.current?.(data);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      alert(error.message || 'Chat error occurred');
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []); // ← empty array: socket is created once only

  return { socket, connected };
}