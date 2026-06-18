// react-app/src/components/Comments/CommentForm.jsx

import { useState, useRef, useEffect } from 'react';
import './CommentForm.css';

export default function CommentForm({ 
  gameId, 
  onCommentAdded, 
  onCancel, 
  placeholder = "Write a comment...",
  autoFocus = false 
}) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const MIN_COMMENT_LENGTH = 2;

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');

    // Validate content length
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      setError('Comment cannot be empty');
      return;
    }

    if (trimmedContent.length < MIN_COMMENT_LENGTH) {
      setError(`Comment must be at least ${MIN_COMMENT_LENGTH} characters long`);
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      await onCommentAdded(content);
      setContent('');
      setError('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const remainingChars = 1000 - content.length;

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          // Clear error when user starts typing
          if (error) setError('');
        }}
        placeholder={placeholder}
        maxLength={1000}
        rows={3}
        disabled={submitting}
      />
      
      {error && (
        <div className="error-message-inline">
          {error}
        </div>
      )}
      
      <div className="form-footer">
        <span className={`char-count ${remainingChars < 50 ? 'warning' : ''}`}>
          {remainingChars} characters remaining
        </span>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          {/* <button 
            type="submit" 
            disabled={!content.trim() || content.trim().length < MIN_COMMENT_LENGTH || submitting}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button> */}

          <button type="submit" >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </form>
  );
}