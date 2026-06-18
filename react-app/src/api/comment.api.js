// react-app/src/api/comment.api.js
import { API } from "../config/api";

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const commentAPI = {
  // Get comments for a game
  getGameComments: async (gameId, params = {}) => {
    const query = new URLSearchParams({
      sort: params.sort || 'newest',
      limit: params.limit || 20,
      offset: params.offset || 0
    }).toString();

    const res = await fetch(
      `${API_BASE}/api/comments/game/${gameId}?${query}`,
      { headers: getAuthHeaders() }
    );

    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  // Get replies for a comment
  getReplies: async (commentId) => {
    const res = await fetch(
      `${API_BASE}/api/comments/${commentId}/replies`,
      { headers: getAuthHeaders() }
    );

    if (!res.ok) throw new Error('Failed to fetch replies');
    return res.json();
  },

  // Post a new comment
  createComment: async (data) => {
    const res = await fetch(API.COMMENT, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to post comment');
    return res.json();
  },

  // Update a comment
  updateComment: async (commentId, content) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });

    if (!res.ok) throw new Error('Failed to update comment');
    return res.json();
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  },

  // React to a comment
  reactToComment: async (commentId, reactionType) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}/react`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reactionType })
    });

    if (!res.ok) throw new Error('Failed to react');
    return res.json();
  },

  // Report a comment
  reportComment: async (commentId, reason, description) => {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, description })
    });

    if (!res.ok) throw new Error('Failed to report comment');
    return res.json();
  }
};