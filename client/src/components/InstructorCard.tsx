import React from 'react';
import { Instructor } from '../types';
import { Star, Award, Phone, Mail } from 'lucide-react';

interface InstructorCardProps {
  instructor: Instructor;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <div className="card instructor-card">
      <div className="ins-avatar-box">
        <img src={instructor.image} alt={instructor.name} className="ins-img" />
        <div className="ins-rating-badge">
          <Star size={14} className="star-icon" />
          <span>{instructor.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="ins-body">
        <h3 className="ins-name">{instructor.name}</h3>
        <p className="ins-exp">
          <Award size={15} className="award-icon" />
          <span>{instructor.experienceYears}+ Years Teaching Experience</span>
        </p>

        <div className="ins-styles-list">
          {instructor.danceStyles.map((style, idx) => (
            <span key={idx} className="badge badge-purple ins-style-tag">
              {style}
            </span>
          ))}
        </div>

        <p className="ins-bio">{instructor.bio}</p>

        <div className="ins-contact-bar">
          <span className="ins-contact-item">
            <Mail size={14} />
            {instructor.email}
          </span>
          <span className="ins-contact-item">
            <Phone size={14} />
            {instructor.phone}
          </span>
        </div>
      </div>

      <style>{`
        .instructor-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        .ins-avatar-box {
          position: relative;
          height: 240px;
          background: #f1f5f9;
          overflow: hidden;
        }
        .ins-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.4s ease;
        }
        .instructor-card:hover .ins-img {
          transform: scale(1.04);
        }
        .ins-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .star-icon {
          color: #f39c12;
          fill: #f39c12;
        }
        .ins-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .ins-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }
        .ins-exp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .award-icon {
          color: #27ae60;
        }
        .ins-styles-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .ins-style-tag {
          font-size: 11px;
        }
        .ins-bio {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 18px;
          flex: 1;
        }
        .ins-contact-bar {
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #94a3b8;
        }
        .ins-contact-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};
