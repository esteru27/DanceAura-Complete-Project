import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Users, Award, CheckCircle2, ArrowLeft } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      courseAPI.getById(id)
        .then((res) => {
          if (res.course) setCourse(res.course);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      await enrollmentAPI.enroll(course._id);
      alert(`Congratulations! You have enrolled in "${course.title}". Check your student dashboard to track progress.`);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary mt-4">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="container py-8">
        <Link to="/courses" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to All Courses</span>
        </Link>

        <div className="detail-grid">
          {/* Main Info */}
          <div className="detail-main">
            <span className="badge badge-purple">{course.category} • {course.level}</span>
            <h1 className="detail-title">{course.title}</h1>
            <p className="detail-desc">{course.description}</p>

            <div className="course-image-hero">
              <img src={course.image || '/slide1.jpg'} alt={course.title} className="detail-img" />
            </div>

            <div className="syllabus-section">
              <h3 className="section-heading">Course Curriculum & Syllabus</h3>
              <div className="syllabus-list">
                {course.syllabus && course.syllabus.length > 0 ? (
                  course.syllabus.map((item, idx) => (
                    <div key={idx} className="syllabus-item">
                      <span className="week-num">Module {idx + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Standard 8-week progressive curriculum.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="detail-sidebar">
            <div className="card enroll-card">
              <div className="price-tag-row">
                <span className="price-big">${course.price}</span>
                <span className="price-label">Full Term Access</span>
              </div>

              <div className="sidebar-meta-list">
                <div className="sidebar-meta-item">
                  <Clock size={18} className="meta-ico" />
                  <div>
                    <strong>Duration:</strong>
                    <p>{course.durationWeeks} Weeks</p>
                  </div>
                </div>
                <div className="sidebar-meta-item">
                  <Calendar size={18} className="meta-ico" />
                  <div>
                    <strong>Weekly Schedule:</strong>
                    <p>{course.schedule}</p>
                  </div>
                </div>
                <div className="sidebar-meta-item">
                  <Award size={18} className="meta-ico" />
                  <div>
                    <strong>Master Faculty:</strong>
                    <p>{course.instructorName}</p>
                  </div>
                </div>
                <div className="sidebar-meta-item">
                  <Users size={18} className="meta-ico" />
                  <div>
                    <strong>Batch Capacity:</strong>
                    <p>{course.enrolledCount} / {course.maxStudents || 25} Students</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-enroll-now"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Processing...' : 'Enroll in Course'}
              </button>

              <div className="guarantee-box">
                <CheckCircle2 size={16} className="text-accent" />
                <span>Includes certificate upon final evaluation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .course-detail-page {
          background-color: #f8fafc;
          padding: 30px 0 80px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .back-link:hover { color: #27ae60; }
        .detail-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .detail-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          margin: 12px 0 16px;
          line-height: 1.25;
        }
        .detail-desc {
          color: #475569;
          font-size: 17px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .course-image-hero {
          width: 100%;
          height: 380px;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 36px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .detail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .syllabus-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .section-heading {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .syllabus-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .syllabus-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .week-num {
          font-size: 12px;
          font-weight: 700;
          background: #4a1c6f;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .syllabus-item p {
          margin: 0;
          font-size: 14px;
          color: #334155;
          font-weight: 500;
        }
        .enroll-card {
          padding: 30px;
          border-radius: 14px;
          background: white;
          position: sticky;
          top: 100px;
        }
        .price-tag-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .price-big {
          font-size: 42px;
          font-weight: 800;
          color: #27ae60;
        }
        .price-label {
          color: #64748b;
          font-size: 14px;
        }
        .sidebar-meta-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
        }
        .sidebar-meta-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .meta-ico {
          color: #27ae60;
          margin-top: 3px;
        }
        .sidebar-meta-item strong {
          display: block;
          font-size: 13px;
          color: #94a3b8;
        }
        .sidebar-meta-item p {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }
        .btn-enroll-now {
          width: 100%;
          padding: 14px;
          font-size: 16px;
        }
        .guarantee-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          margin-top: 16px;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
