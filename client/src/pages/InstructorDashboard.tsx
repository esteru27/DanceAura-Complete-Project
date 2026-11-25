import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { instructorAPI } from '../services/api';
import { Users, BookOpen, DollarSign, Award, Plus, CheckCircle, Shield } from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instructorAPI.getDashboardStats()
      .then((res) => {
        if (res.stats) setStats(res.stats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="instructor-dashboard-page">
      {/* Header */}
      <div className="ins-dash-hero">
        <div className="container hero-container">
          <div>
            <div className="badge badge-purple mb-2">
              <Shield size={14} className="mr-1" /> Faculty Portal
            </div>
            <h1 className="hero-title">Studio Master Administration</h1>
            <p className="hero-desc">
              Welcome Instructor <strong>{user?.firstName} {user?.lastName}</strong>. Manage course batches and monitor studio enrollments.
            </p>
          </div>
        </div>
      </div>

      <div className="container dashboard-main">
        {/* Metric Cards */}
        <div className="grid-3 metrics-row">
          <div className="card metric-card">
            <div className="metric-header">
              <BookOpen className="metric-icon purple" size={24} />
              <span className="metric-badge">Catalog</span>
            </div>
            <div className="metric-value">{stats?.totalCourses || 0}</div>
            <p className="metric-label">Active Studio Courses</p>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <Users className="metric-icon green" size={24} />
              <span className="metric-badge">Students</span>
            </div>
            <div className="metric-value">{stats?.totalStudents || 0}</div>
            <p className="metric-label">Total Registered Students</p>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <DollarSign className="metric-icon gold" size={24} />
              <span className="metric-badge">Gross</span>
            </div>
            <div className="metric-value">${stats?.totalRevenue || 0}</div>
            <p className="metric-label">Total Course Enrollment Fees</p>
          </div>
        </div>

        {/* Studio Active Courses */}
        <div className="dashboard-section mt-10">
          <div className="section-title-row">
            <h2>Course Batches & Enrollment Capacities</h2>
          </div>

          <div className="card table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Schedule</th>
                    <th>Price</th>
                    <th>Enrolled / Cap</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.activeCourses && stats.activeCourses.length > 0 ? (
                    stats.activeCourses.map((c: any) => (
                      <tr key={c._id}>
                        <td><strong>{c.title}</strong></td>
                        <td>{c.category}</td>
                        <td><span className="badge badge-blue">{c.level}</span></td>
                        <td>{c.schedule}</td>
                        <td>${c.price}</td>
                        <td>{c.enrolledCount} / {c.maxStudents || 25}</td>
                        <td><span className="badge badge-green">Active</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No courses loaded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Enrollments Table */}
        <div className="dashboard-section mt-10">
          <div className="section-title-row">
            <h2>Recent Student Enrollments</h2>
          </div>

          <div className="card table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Dance Style</th>
                    <th>Schedule Time</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                    stats.recentEnrollments.map((enr: any) => {
                      const student = enr.student;
                      return (
                        <tr key={enr._id}>
                          <td><strong>{student ? `${student.firstName} ${student.lastName}` : 'Student'}</strong></td>
                          <td>{student?.email || 'N/A'}</td>
                          <td>{enr.danceType}</td>
                          <td>{enr.scheduleTime || 'Standard'}</td>
                          <td>
                            <span className="badge badge-green">
                              {enr.paymentStatus.toUpperCase()}
                            </span>
                          </td>
                          <td><strong>${enr.amountPaid}</strong></td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No enrollments found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .instructor-dashboard-page {
          background-color: #f8fafc;
          padding-bottom: 80px;
        }
        .ins-dash-hero {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 50px 0;
        }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          margin: 6px 0 8px;
        }
        .hero-desc {
          font-size: 15px;
          color: #cbd5e1;
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
          font-size: 36px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }
        .metric-label {
          color: #64748b;
          font-size: 14px;
          margin-top: 6px;
        }
        .section-title-row {
          margin-bottom: 16px;
        }
        .section-title-row h2 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .table-card {
          border-radius: 12px;
          overflow: hidden;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .data-table th {
          background: #f8fafc;
          padding: 14px 18px;
          font-weight: 700;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }
        .data-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        .data-table tr:hover {
          background-color: #f8fafc;
        }
        .mr-1 { margin-right: 4px; }
      `}</style>
    </div>
  );
};
