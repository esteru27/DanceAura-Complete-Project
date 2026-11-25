import React, { useState } from 'react';
import { VideoClass } from '../types';
import { X, CheckCircle, Clock, Tag, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

interface VideoModalProps {
  video: VideoClass;
  isCompleted?: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  isCompleted = false,
  onClose,
  onCompleted,
}) => {
  const { isAuthenticated } = useAuth();
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      alert('Please log in to track your video lessons in your student progress dashboard!');
      return;
    }

    try {
      setLoading(true);
      await authAPI.trackProgress({
        danceStyle: video.danceStyle,
        level: video.level,
        videoId: video.id,
      });
      setCompleted(true);
      if (onCompleted) onCompleted();
    } catch (error: any) {
      alert(error.message || 'Error tracking progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-purple">{video.danceStyle} • {video.level}</span>
            <h2 className="modal-title">{video.title}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="video-player-box">
          <iframe
            src={video.videoUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          />
        </div>

        <div className="modal-details">
          <div className="modal-meta-row">
            <span className="meta-badge"><Clock size={15} /> {video.duration}</span>
            <span className="meta-badge"><Tag size={15} /> {video.type}</span>
            <span className="meta-badge">Instructor: {video.instructor}</span>
          </div>

          <div className="video-tags-list">
            {video.tags.map((tag, i) => (
              <span key={i} className="video-tag-pill">#{tag}</span>
            ))}
          </div>

          <div className="modal-footer-actions">
            {completed ? (
              <div className="completed-badge-box">
                <CheckCircle size={20} className="check-icon" />
                <span>Lesson Completed & Added to Your Progress</span>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleMarkComplete}
                disabled={loading}
              >
                <CheckCircle size={18} />
                {loading ? 'Recording Progress...' : 'Mark Lesson as Completed'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-container {
          background: #1e293b;
          color: white;
          width: 100%;
          max-width: 800px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #334155;
        }
        .modal-title {
          font-size: 22px;
          font-weight: 700;
          margin-top: 6px;
        }
        .close-btn {
          background: transparent;
          color: #94a3b8;
          padding: 4px;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: white;
        }
        .video-player-box {
          position: relative;
          padding-top: 56.25%; /* 16:9 ratio */
          background: black;
        }
        .video-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .modal-details {
          padding: 24px;
        }
        .modal-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }
        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #334155;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: #cbd5e1;
        }
        .video-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .video-tag-pill {
          color: #2ecc71;
          font-size: 13px;
        }
        .modal-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #334155;
        }
        .completed-badge-box {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(39, 174, 96, 0.2);
          color: #2ecc71;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        .check-icon {
          color: #2ecc71;
        }
      `}</style>
    </div>
  );
};
