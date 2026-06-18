// react-app/src/components/Comments/CommentSection.jsx - AUTH REQUIRED VERSION

import { useState, useEffect } from 'react';
import { commentAPI } from '../../api/comment.api';
import { useAuth } from '../../context/AuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './CommentSection.css';


export default function CommentSection({ gameId }) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);
  const COMMENTS_PER_PAGE = 7;


  useEffect(() => {
    // Only load comments if user is logged in
    if (!authLoading && user) {
      loadComments();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [gameId, sortBy, user, authLoading]);


  const loadComments = async (append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentOffset = append ? offset : 0;
      
      const data = await commentAPI.getGameComments(gameId, {
        sort: sortBy,
        limit: COMMENTS_PER_PAGE,
        offset: currentOffset
      });
      
      if (append) {
        setComments(prev => [...prev, ...data.comments]);
        setOffset(prev => prev + data.comments.length);
      } else {
        setComments(data.comments);
        setOffset(data.comments.length);
      }

      setHasMore(data.pagination.hasMore);
    } catch (err) {
      console.error('❌ Failed to load comments:', err);
      setError('Failed to load comments. Please try again.');
      
      if (err.message.includes('401') || err.message.includes('Authentication required')) {
        setError('Please log in to view comments.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = async (content) => {
    try {
      const response = await commentAPI.createComment({
        gameId,
        content
      });

      setComments(prev => [response.comment, ...prev]);
      
      return response;
    } catch (err) {
      console.error('❌ Failed to post comment:', err);
      throw err;
    }
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleCommentUpdated = (commentId, newContent) => {
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
          ? { ...c, content: newContent, is_edited: true }
          : c
      )
    );
  };

 
  if (!authLoading && !user) {
    return (
      <div className="comment-section">
        <div className="comment-header">
          <h2>Comments</h2>
        </div>

        <div className="login-prompt">
          {/* Top glow line — handled by existing ::before pseudo-element */}

          {/* Icon row — lock + reward pills */}
          <div className="login-prompt__icon-row">
            <div className="login-prompt__lock" aria-hidden="true">🔐</div>
            <div className="login-prompt__pills">
              <span className="login-prompt__pill">+20 Comment</span>
              <span className="login-prompt__pill">+5 Like</span>
            </div>
          </div>

          <div className="login-prompt-content">
            <h3>Join the Conversation!</h3>
            <p>
              Log in to view and post comments — and{" "}
              <strong>earn points</strong> for every interaction you make.
            </p>

            {/* Reward chips row */}
            <div className="login-prompt__rewards">
              <div className="login-prompt__reward-chip">
                <span className="login-prompt__reward-pts">+20</span>
                <span className="login-prompt__reward-label">Per Comment</span>
              </div>
              <div className="login-prompt__reward-chip">
                <span className="login-prompt__reward-pts">+5</span>
                <span className="login-prompt__reward-label">Per Like</span>
              </div>
              <div className="login-prompt__reward-chip login-prompt__reward-chip--highlight">
                <span className="login-prompt__reward-pts">+100</span>
                <span className="login-prompt__reward-label">Welcome Bonus</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="login-prompt__btns">
              <button
                className="login-btn"
                onClick={() => window.location.href = '/login'}
              >
                Log In to Earn
              </button>
              <button
                className="login-btn login-btn--secondary"
                onClick={() => window.location.href = '/register'}
              >
                Register Free →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="comment-section">
        <div className="comment-header">
          <h2>Comments</h2>
        </div>
        <div className="loading-skeleton">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // User is authenticated - show full comment section
  return (
    <div className="comment-section">
      <div className="comment-header">
        <h2>Comments ({comments.length})</h2>
        
        <div className="comment-sort">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => loadComments()}>Try Again</button>
        </div>
      )}

      <CommentForm 
        gameId={gameId}
        onCommentAdded={handleCommentAdded}
        placeholder="Share your thoughts about this game..."
      />

      <div className="comment-list">
        {loading && comments.length === 0 ? (
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="comment-skeleton" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                gameId={gameId}
                onDeleted={handleCommentDeleted}
                onUpdated={handleCommentUpdated}
              />
            ))}

            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={() => loadComments(true)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Comments'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}