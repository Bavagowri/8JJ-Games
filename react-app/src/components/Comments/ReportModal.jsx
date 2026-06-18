// react-app/src/components/Comments/ReportModal.jsx

import { useState } from 'react';
import { commentAPI } from '../../api/comment.api';
import './ReportModal.css';

export default function ReportModal({ commentId, onClose }) {
  const [reason, setReason] = useState('spam');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await commentAPI.reportComment(commentId, reason, description);
      alert('Report submitted successfully');
      onClose();
    } catch (err) {
      console.error('Failed to submit report:', err);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Report Comment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for reporting:</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="spam">Spam</option>
              <option value="offensive">Offensive content</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional details (optional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}