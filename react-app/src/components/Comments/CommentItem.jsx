// react-app/src/components/Comments/CommentItem.jsx

import { useState, useEffect } from 'react';
import { commentAPI } from '../../api/comment.api';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import ReportModal from './ReportModal';
import { formatDistanceToNow } from 'date-fns';
import './CommentItem.css';

export default function CommentItem({ comment, gameId, onDeleted, onUpdated, isReply = false }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReportModal, setShowReportModal] = useState(false);
  const [userReaction, setUserReaction] = useState(comment.user_reaction);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [isEdited, setIsEdited] = useState(comment.is_edited || false);

  const isOwner = user && user.id === comment.user_id;
  const isAdmin = user && user.role === 'admin';

  //  ADD THIS: Helper function for safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'just now';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'recently';
    }
  };

  // Load replies when expanded
  useEffect(() => {
    if (showReplies && !isReply && replies.length === 0) {
      loadReplies();
    }
  }, [showReplies]);

  const loadReplies = async () => {
    try {
      const data = await commentAPI.getReplies(comment.id);
      setReplies(data);
    } catch (err) {
      console.error('Failed to load replies:', err);
    }
  };

  const handleReply = async (content) => {
    try {
      const response = await commentAPI.createComment({
        gameId,
        content,
        parentCommentId: comment.id
      });

      setReplies(prev => [...prev, response.comment]);
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Failed to post reply');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content); // Reset to original if unchanged
      return;
    }

    try {
      await commentAPI.updateComment(comment.id, editContent);
      onUpdated(comment.id, editContent);
      setIsEditing(false);
      setIsEdited(true); // Mark as edited locally
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.deleteComment(comment.id);
      onDeleted(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  const handleReact = async (reactionType) => {
    if (!user) {
      alert('Please log in to react to comments');
      return;
    }

    try {
      const response = await commentAPI.reactToComment(comment.id, reactionType);

      if (response.action === 'added') {
        setUserReaction(reactionType);
        setLikeCount(prev => prev + 1);
      } else {
        setUserReaction(null);
        setLikeCount(prev => prev - 1);
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/images/default-avatar.png"; // fallback

    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("blob:")) return avatar;
    if (avatar.startsWith("data:")) return avatar;

    if (avatar.startsWith("/uploads")) {
      return `${API_BASE}${avatar}`;
    }

    return avatar;
  };

  return (
    <div className={`comment-item ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-avatar">
        <img
          src={getAvatarUrl(comment.avatar)}  // Changed from user.avatar
          alt={comment.username}
          className="podium-avatar"
        />
        {comment.role === 'admin' && (
          <span className="admin-badgez">Admin</span>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-meta">
            <div className="comment-role">
              {/* {comment.role === 'admin' ? 'Admin' : 'User'} */}


              <span className="comment-username">
                {comment.username}
              </span>
              <span className="comment-level">
                Lvl {comment.level} • {comment.tier}
              </span>



            </div>

            <div className="comment-time-wrapper">
              <span className="comment-time">
                {/*  CHANGED: Use the safe formatDate function */}
                {formatDate(comment.created_at)}
              </span>
              {isEdited && (
                <span className="edited-badge">(edited)</span>
              )}
            </div>
          </div>

          <div className="comment-actions">
            {isOwner && !isEditing && (
              <>
                <button
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="action-btn danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}

            {/* {!isOwner && user && (
              <button
                className="action-btn"
                onClick={() => setShowReportModal(true)}
              >
                Report
              </button>
            )} */}

            {isAdmin && !isOwner && (
              <button
                className="action-btn danger"
                onClick={handleDelete}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="comment-body">
          {isEditing ? (
            <div className="comment-edit-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={1000}
                rows={3}
                autoFocus
              />
              <div className="edit-actions">
                <button onClick={handleEdit}>Save</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content); // Reset on cancel
                }}>Cancel</button>
              </div>
            </div>
          ) : (
            <p className="comment-text">{editContent}</p>
          )}
        </div>

        <div className="comment-footer">
          <button
            className={`reaction-btn ${userReaction === 'like' ? 'active' : ''}`}
            onClick={() => handleReact('like')}
          >
            👍 {likeCount > 0 && likeCount}
          </button>

          {!isReply && (
            <button
              className="reply-btn"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              💬 Reply
            </button>
          )}

          {!isReply && comment.reply_count > 0 && (
            <button
              className="view-replies-btn"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? '▼' : '▶'} {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="reply-form-container">
            <CommentForm
              gameId={gameId}
              onCommentAdded={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${comment.username}...`}
              autoFocus
            />
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="replies-list">
            {replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                gameId={gameId}
                onDeleted={(id) => setReplies(prev => prev.filter(r => r.id !== id))}
                onUpdated={(id, content) =>
                  setReplies(prev =>
                    prev.map(r => r.id === id ? { ...r, content, is_edited: true } : r)
                  )
                }
                isReply
              />
            ))}
          </div>
        )}
      </div>

      {showReportModal && (
        <ReportModal
          commentId={comment.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}