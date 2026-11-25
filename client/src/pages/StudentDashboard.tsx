import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentProgressAPI, enrollmentAPI } from '../services/api';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Play,
  AlertCircle,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [coursesProgress, setCoursesProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, progRes] = await Promise.all([
        studentProgressAPI.getDashboard(),
        studentProgressAPI.getProgress(),
      ]);

      if (dashRes.success) setDashboardData(dashRes);
      if (progRes.success) setCoursesProgress(progRes.courses || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelEnrollment = async (enrollmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this course enrollment?')) return;
    try {
      await enrollmentAPI.cancelEnrollment(enrollmentId);
      alert('Enrollment cancelled.');
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Error cancelling enrollment');
    }
  };

  const stats = dashboardData?.stats || {
    totalEnrolledCourses: coursesProgress.length,
    completedLessonsCount: 0,
    pendingLessonsCount: 0,
    overallProgress: 0,
    completedCoursesCount: 0,
  };

  return (
    <div className="student-dashboard-page">
      {/* Student Welcome Banner */}
      <div className="dashboard-hero">
        <div className="container hero-container">
          <div className="student-avatar-box">
            <div className="big-avatar">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'S'}
            </div>
            <div>
              <span className="welcome-tag">Student Learning Hub</span>
              <h1 className="hero-name">Welcome, {user?.firstName} {user?.lastName}!</h1>
              <p className="hero-sub">
                Primary Style: <strong>{user?.danceType || 'Bharatanatyam'}</strong> • Status:{' '}
                <span className={`status-pill ${user?.isPaid ? 'paid' : 'trial'}`}>
                  {user?.isPaid ? 'Enrolled Student' : 'Trial Member'}
                </span>
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary">
              <BookOpen size={16} /> Browse Courses
            </Link>
            <Link to="/videos" className="btn btn-outline-white">
              <Play size={16} /> Video Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="container dashboard-main">
        {/* ========================================== */}
        {/* SECTION A: DYNAMIC STATISTIC METRIC CARDS  */}
        {/* ========================================== */}
        <div className="grid-4 metrics-row">
          <div className="card metric-card">
            <div className="metric-header">
              <BookOpen className="metric-icon purple" size={24} />
              <span className="metric-badge">Enrolled</span>
            </div>
            <div className="metric-value">{stats.totalEnrolledCourses}</div>
            <p className="metric-label">Enrolled Studio Courses</p>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <CheckCircle className="metric-icon green" size={24} />
              <span className="metric-badge">Completed</span>
            </div>
            <div className="metric-value">{stats.completedLessonsCount}</div>
            <p className="metric-label">Lessons Completed</p>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <Clock className="metric-icon blue" size={24} />
              <span className="metric-badge">Remaining</span>
            </div>
            <div className="metric-value">{stats.pendingLessonsCount}</div>
            <p className="metric-label">Pending Course Lessons</p>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <Award className="metric-icon gold" size={24} />
              <span className="metric-badge">Overall Score</span>
            </div>
            <div className="metric-value">{stats.overallProgress}%</div>
            <div className="progress-track mt-2">
              <div className="progress-fill" style={{ width: `${stats.overallProgress}%` }} />
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* SECTION B: ENROLLED COURSES & PROGRESS     */}
        {/* ========================================== */}
        <div className="dashboard-section mt-10">
          <div className="section-title-row">
            <h2>Course Progress & Interactive Modules</h2>
            <Link to="/courses" className="view-all-link">
              <span>Explore All Courses</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="text-muted">Loading your learning courses...</p>
          ) : coursesProgress.length === 0 ? (
            <div className="card empty-card text-center">
              <AlertCircle size={36} className="text-muted mx-auto mb-2" />
              <h3>No Active Course Enrollments Yet</h3>
              <p className="text-muted">
                You have not enrolled in any structured courses yet. Browse our dance courses to get started!
              </p>
              <Link to="/courses" className="btn btn-primary mt-4">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="enrollments-list">
              {coursesProgress.map((courseItem) => {
                const isFinished = courseItem.isCompleted || courseItem.progressPercentage === 100;

                return (
                  <div key={courseItem.enrollmentId} className="card course-progress-card">
                    <img
                      src={courseItem.image || '/slide1.jpg'}
                      alt={courseItem.title}
                      className="cp-thumb"
                    />

                    <div className="cp-details">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-purple">{courseItem.category}</span>
                        <span className="badge badge-blue">{courseItem.level}</span>
                        {isFinished && (
                          <span className="badge badge-green flex items-center gap-1">
                            <CheckCircle size={12} /> COMPLETED
                          </span>
                        )}
                      </div>

                      <h3 className="cp-title">{courseItem.title}</h3>
                      <p className="text-sm text-slate-500 mb-3">
                        Mentor: <strong>{courseItem.instructorName}</strong> • Weekly Schedule: {courseItem.schedule}
                      </p>

                      {/* Progress Bar & Stats */}
                      <div className="cp-progress-container">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">
                            Completed Lessons: <strong>{courseItem.completedLessons}</strong> / {courseItem.totalLessons}
                          </span>
                          <span className="text-accent font-bold">{courseItem.progressPercentage}%</span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${courseItem.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {isFinished && courseItem.completedAt && (
                        <div className="text-xs text-accent mt-2 flex items-center gap-1 font-semibold">
                          <Sparkles size={14} /> Completed on {new Date(courseItem.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="cp-actions">
                      <Link to={`/courses/${courseItem.courseId}/learn`} className="btn btn-primary btn-learn">
                        <Play size={16} /> Continue Learning
                      </Link>

                      <div className="flex gap-2">
                        <Link to={`/courses/${courseItem.courseId}`} className="btn btn-outline btn-sm">
                          Course Info
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelEnrollment(courseItem.enrollmentId)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SECTION E: STUDENT PROGRESS HISTORY TABLE  */}
        {/* ========================================== */}
        {coursesProgress.length > 0 && (
          <div className="dashboard-section mt-10">
            <div className="section-title-row">
              <h2>Student Learning Progress History</h2>
            </div>

            <div className="card table-card">
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Enrollment Date</th>
                      <th>Lessons Completed</th>
                      <th>Last Accessed</th>
                      <th>Completion Date</th>
                      <th>Current Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesProgress.map((item) => (
                      <tr key={item.enrollmentId}>
                        <td>
                          <strong>{item.title}</strong>
                          <span className="block text-xs text-muted">{item.category} ({item.level})</span>
                        </td>
                        <td>{new Date(item.enrolledAt).toLocaleDateString()}</td>
                        <td>
                          <span className="font-semibold text-slate-800">
                            {item.completedLessons} / {item.totalLessons}
                          </span>
                        </td>
                        <td>{item.lastAccessedAt ? new Date(item.lastAccessedAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {item.completedAt ? (
                            <span className="badge badge-green">
                              {new Date(item.completedAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-xs text-muted">In Progress</span>
                          )}
                        </td>
                        <td>
                          <div className="w-32">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span>{item.progressPercentage}%</span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${item.progressPercentage}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .student-dashboard-page {
          background-color: #f8fafc;
          padding-bottom: 80px;
        }
        .dashboard-hero {
          background: linear-gradient(135deg, #4a1c6f 0%, #1c3a47 100%);
          color: white;
          padding: 50px 0;
        }
        .hero-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .student-avatar-box {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .big-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #27ae60;
          color: white;
          font-size: 32px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .welcome-tag {
          font-family: 'Great Vibes', cursive;
          font-size: 26px;
          color: #2ecc71;
        }
        .hero-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          margin: 2px 0 6px;
        }
        .hero-sub {
          font-size: 14px;
          color: #cbd5e1;
        }
        .status-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 6px;
        }
        .status-pill.paid { background: #27ae60; color: white; }
        .status-pill.trial { background: #f39c12; color: white; }
        .hero-actions {
          display: flex;
          gap: 12px;
        }
        .dashboard-main {
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }
        .metric-card {
          padding: 24px;
          border-radius: 14px;
        }
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .metric-icon.purple { color: #8e44ad; }
        .metric-icon.green { color: #27ae60; }
        .metric-icon.blue { color: #0284c7; }
        .metric-icon.gold { color: #f39c12; }
        .metric-badge {
          font-size: 11px;
          font-weight: 700;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 10px;
          color: #64748b;
        }
        .metric-value {
          font-size: 34px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }
        .metric-label {
          color: #64748b;
          font-size: 13px;
          margin-top: 6px;
        }
        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-title-row h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #27ae60;
          font-size: 14px;
          font-weight: 600;
        }
        .enrollments-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .course-progress-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 14px;
          gap: 24px;
        }
        .cp-thumb {
          width: 160px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .cp-details {
          flex: 1;
        }
        .cp-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .cp-progress-container {
          max-width: 480px;
          margin-top: 8px;
        }
        .cp-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }
        .btn-learn {
          padding: 10px 22px;
          font-size: 14px;
          white-space: nowrap;
        }
        .table-card {
          border-radius: 12px;
          overflow: hidden;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .history-table th {
          background: #f8fafc;
          padding: 14px 18px;
          font-weight: 700;
          color: #475569;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .history-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: middle;
        }
        .history-table tr:hover {
          background: #f8fafc;
        }
        .empty-card {
          padding: 50px 20px;
          border-radius: 12px;
        }
        @media (max-width: 900px) {
          .course-progress-card { flex-direction: column; align-items: flex-start; }
          .cp-thumb { width: 100%; height: 180px; }
          .cp-actions { width: 100%; align-items: stretch; }
        }
      `}</style>
    </div>
  );
};
