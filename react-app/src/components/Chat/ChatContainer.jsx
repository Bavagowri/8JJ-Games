// react-app/src/components/Chat/ChatContainer.jsx 

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatSocket } from '../../hooks/useChatSocket';
import { chatAPI } from '../../api/chat.api';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChannelList from './ChannelList';
import OnlineUsersList from './OnlineUsersList';
import './ChatContainer.css';

export default function ChatContainer() {
  const navigate = useNavigate();
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Load channels from API
  const loadChannels = useCallback(async () => {
    try {
      setChannelsLoading(true);
      const channelsData = await chatAPI.getChannels();
      setChannels(channelsData);
      
      // Set default channel if none selected
      if (!currentChannel && channelsData.length > 0) {
        setCurrentChannel(channelsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load channels:', err);
    } finally {
      setChannelsLoading(false);
    }
  }, [currentChannel]);

  // Load channels on mount
  useEffect(() => {
    if (token) {
      loadChannels();
    }
  }, [token, loadChannels]);

  // Socket event handlers
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleHistory = useCallback((history) => {
    setMessages(history);
  }, []);

  const handleOnlineUsers = useCallback((users) => {
    setOnlineUsers(users);
  }, []);

  const handleTyping = useCallback(({ userId, username, isTyping }) => {
    setTypingUsers(prev => {
      if (isTyping) {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      } else {
        return prev.filter(u => u !== username);
      }
    });
  }, []);

  const handleMessageDeleted = useCallback(({ messageId }) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, is_deleted: true, content: '[Message deleted]' }
        : msg
    ));
  }, []);

  const handleMessageReactions = useCallback(({ messageId, reactions }) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, reactions }
        : msg
    ));
  }, []);

  //  NEW: Handle channel updates from admin
  const handleChannelCreated = useCallback((channel) => {
    //console.log('✅ New channel created:', channel);
    setChannels(prev => {
      // Check if channel already exists
      if (prev.some(c => c.id === channel.id)) {
        return prev;
      }
      // Add new channel and sort by display_order
      return [...prev, channel].sort((a, b) => 
        (a.display_order || 0) - (b.display_order || 0)
      );
    });
  }, []);

  const handleChannelUpdated = useCallback((channel) => {
    // console.log('✅ Channel updated:', channel);
    setChannels(prev => prev.map(c => 
      c.id === channel.id ? channel : c
    ).sort((a, b) => 
      (a.display_order || 0) - (b.display_order || 0)
    ));
  }, []);

  const handleChannelDeleted = useCallback(({ channelId }) => {
    // console.log('✅ Channel deleted:', channelId);
    setChannels(prev => prev.filter(c => c.id !== channelId));
    
    // If current channel was deleted, switch to first available
    if (currentChannel === channelId) {
      setChannels(prev => {
        if (prev.length > 0) {
          setCurrentChannel(prev[0].id);
        }
        return prev;
      });
    }
  }, [currentChannel]);

  // Socket connection with channel event handlers
  const { socket, connected } = useChatSocket({
    onMessage: handleNewMessage,
    onHistory: handleHistory,
    onOnlineUsers: handleOnlineUsers,
    onTyping: handleTyping,
    onMessageDeleted: handleMessageDeleted,
    onMessageReactions: handleMessageReactions,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
  });

  // Join channel when selected
  useEffect(() => {
    if (!token || !currentChannel) return;
    if (socket && connected) {
      socket.emit('join:channel', currentChannel);
    }
  }, [socket, connected, currentChannel, token]);

  const handleSendMessage = useCallback((content) => {
    if (!socket || !connected) return;

    socket.emit('message:send', {
      channelId: currentChannel,
      content,
      replyToMessageId: replyingTo?.id || null
    });

    setReplyingTo(null);
  }, [socket, connected, currentChannel, replyingTo]);

  const handleTypingEmit = useCallback((isTyping) => {
    if (!socket || !connected) return;

    if (isTyping) {
      socket.emit('typing:start', { channelId: currentChannel });
    } else {
      socket.emit('typing:stop', { channelId: currentChannel });
    }
  }, [socket, connected, currentChannel]);

  const handleChannelChange = useCallback((channelId) => {
    setCurrentChannel(channelId);
    setMessages([]);
    setReplyingTo(null);

    if (socket && connected) {
      socket.emit('join:channel', channelId);
    }
  }, [socket, connected]);

  const handleDeleteMessage = useCallback((messageId) => {
    if (!socket || !connected) return;
    socket.emit('message:delete', { messageId });
  }, [socket, connected]);

  const handleReaction = useCallback((messageId, emoji) => {
    if (!socket || !connected) return;
    socket.emit('message:react', { messageId, emoji });
  }, [socket, connected]);

  const handleReply = useCallback((message) => {
    setReplyingTo(message);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  if (!token) {
    return (
      <div className="chat-login-required">
        <p>🔒 Please log in to join the community chat</p>
        <button onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    );
  }

  if (channelsLoading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <div className="spinner" />
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="chat-container">
        <div className="chat-no-channels">
          <p>No channels available</p>
        </div>
      </div>
    );
  }

  const currentChannelData = channels.find(c => c.id === currentChannel);

  return (
    <div className="chat-container">
      {/* Left Sidebar - Channels */}
      <ChannelList
        channels={channels}
        currentChannel={currentChannel}
        onChannelChange={handleChannelChange}
      />

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div>
            <h2>
              {currentChannelData?.icon} {currentChannelData?.name}
              {!connected && (
                <span className="connection-status">Connecting...</span>
              )}
            </h2>
            <p>{currentChannelData?.description}</p>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={messages}
          typingUsers={typingUsers}
          currentUser={currentUser}
          onDelete={handleDeleteMessage}
          onReaction={handleReaction}
          onReply={handleReply}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          onTyping={handleTypingEmit}
          replyingTo={replyingTo}
          onCancelReply={cancelReply}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Right Sidebar - Online Users */}
      <OnlineUsersList
        users={onlineUsers}
        currentUserId={currentUser.id}
      />
    </div>
  );
}