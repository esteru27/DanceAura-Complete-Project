import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { Clock, Calendar, Users, DollarSign, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI } from '../services/api';

interface CourseCardProps {
  course: Course;
  onEnrollSuccess?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnrollSuccess }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = React.useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentAPI.enroll(course._id);
      alert(`Success! You have enrolled in "${course.title}". Check your dashboard!`);
      if (onEnrollSuccess) onEnrollSuccess();
    } catch (error: any) {
      alert(error.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const levelBadgeClass = {
    Beginner: 'badge-green',
    Intermediate: 'badge-blue',
    Advanced: 'badge-orange',
    'All Levels': 'badge-purple',
  }[course.level] || 'badge-green';

  return (
    <div className="card course-card">
      <div className="course-thumb-container">
        <img src={course.image || '/slide1.jpg'} alt={course.title} className="course-thumb" />
        <span className="course-category-tag">{course.category}</span>
        <span className={`badge ${levelBadgeClass} course-level-badge`}>{course.level}</span>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.description}</p>

        <div className="course-instructor-row">
          <Award size={16} className="instructor-badge-icon" />
          <span>Instructor: <strong>{course.instructorName}</strong></span>
        </div>

        <div className="course-meta-row">
          <div className="meta-item">
            <Clock size={15} />
            <span>{course.durationWeeks} Weeks</span>
          </div>
          <div className="meta-item">
            <Calendar size={15} />
            <span>{course.schedule}</span>
          </div>
          <div className="meta-item">
            <Users size={15} />
            <span>{course.enrolledCount} enrolled</span>
          </div>
        </div>

        <div className="course-card-footer">
          <div className="course-price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">{course.price}</span>
            <span className="price-period">/ course</span>
          </div>

          <div className="card-buttons">
            <Link to={`/courses/${course._id}`} className="btn btn-outline btn-sm">
              Details
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .course-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .course-thumb-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .course-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .course-card:hover .course-thumb {
          transform: scale(1.05);
        }
        .course-category-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(14, 18, 17, 0.75);
          backdrop-filter: blur(4px);
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .course-level-badge {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .course-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .course-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .course-card-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .course-instructor-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #475569;
          margin-bottom: 14px;
        }
        .instructor-badge-icon {
          color: #27ae60;
        }
        .course-meta-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 18px;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .course-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }
        .course-price-box {
          display: flex;
          align-items: baseline;
        }
        .price-currency {
          font-size: 16px;
          font-weight: 700;
          color: #27ae60;
        }
        .price-amount {
          font-size: 26px;
          font-weight: 800;
          color: #1e293b;
        }
        .price-period {
          font-size: 12px;
          color: #94a3b8;
          margin-left: 2px;
        }
        .card-buttons {
          display: flex;
          gap: 8px;
        }
        .btn-sm {
          padding: 7px 14px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};
