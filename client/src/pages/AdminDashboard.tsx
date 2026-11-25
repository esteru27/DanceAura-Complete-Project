import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ShieldAlert,
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'instructors' | 'courses'>('overview');

  // Overview stats state
  const [stats, setStats] = useState<any>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);

  // Students state
  const [students, setStudents] = useState<any[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  // Instructors state
  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorModal, setInstructorModal] = useState<any | null>(null);

  // Courses state
  const [courses, setCourses] = useState<any[]>([]);
  const [courseModal, setCourseModal] = useState<any | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Data fetchers
  const fetchOverview = async () => {
    try {
      const res = await adminAPI.getDashboard();
      if (res.success) {
        setStats(res.stats);
        setCategoryBreakdown(res.categoryBreakdown || []);
        setRecentEnrollments(res.recentEnrollments || []);
      }
    } catch (err: any) {
      showMsg(err.message || 'Failed to load dashboard statistics', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await adminAPI.getStudents(searchStudent);
      if (res.success) setStudents(res.students);
    } catch (err: any) {
      showMsg('Failed to fetch students', 'error');
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await adminAPI.getInstructors();
      if (res.success) setInstructors(res.instructors);
    } catch (err: any) {
      showMsg('Failed to fetch instructors', 'error');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await adminAPI.getCourses();
      if (res.success) setCourses(res.courses);
    } catch (err: any) {
      showMsg('Failed to fetch courses', 'error');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOverview(), fetchStudents(), fetchInstructors(), fetchCourses()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      const delaySearch = setTimeout(() => {
        fetchStudents();
      }, 300);
      return () => clearTimeout(delaySearch);
    }
  }, [searchStudent, activeTab]);

  // Student Actions
  const handleViewStudentDetails = async (id: string) => {
    try {
      const res = await adminAPI.getStudentById(id);
      if (res.success) setSelectedStudent(res);
    } catch (err: any) {
      showMsg('Failed to fetch student profile', 'error');
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      await adminAPI.updateStudent(editingStudent._id, editingStudent);
      showMsg('Student updated successfully');
      setEditingStudent(null);
      fetchStudents();
    } catch (err: any) {
      showMsg(err.message || 'Failed to update student', 'error');
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) return;
    try {
      await adminAPI.deleteStudent(id);
      showMsg(`Student ${name} deleted successfully`);
      fetchStudents();
      fetchOverview();
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete student', 'error');
    }
  };

  // Instructor Actions
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorModal) return;
    try {
      if (instructorModal._id) {
        await adminAPI.updateInstructor(instructorModal._id, instructorModal);
        showMsg('Instructor updated successfully');
      } else {
        await adminAPI.createInstructor(instructorModal);
        showMsg('New instructor added successfully');
      }
      setInstructorModal(null);
      fetchInstructors();
      fetchOverview();
    } catch (err: any) {
      showMsg(err.message || 'Failed to save instructor', 'error');
    }
  };

  const handleDeleteInstructor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove instructor "${name}"?`)) return;
    try {
      await adminAPI.deleteInstructor(id);
      showMsg(`Instructor ${name} removed`);
      fetchInstructors();
      fetchOverview();
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete instructor', 'error');
    }
  };

  // Course Actions
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseModal) return;
    try {
      if (courseModal._id) {
        await adminAPI.updateCourse(courseModal._id, courseModal);
        showMsg('Course updated successfully');
      } else {
        await adminAPI.createCourse(courseModal);
        showMsg('New course added successfully');
      }
      setCourseModal(null);
      fetchCourses();
      fetchOverview();
    } catch (err: any) {
      showMsg(err.message || 'Failed to save course', 'error');
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      await adminAPI.deleteCourse(id);
      showMsg(`Course "${title}" deleted`);
      fetchCourses();
      fetchOverview();
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete course', 'error');
    }
  };

  return (
    <div className="admin-page">
      {/* Admin Top Navigation & Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-flex">
            <div>
              <span className="badge badge-purple mb-1">
                <ShieldAlert size={14} className="mr-1 inline-block" /> Super Administrator
              </span>
              <h1 className="admin-title">DanceAura Studio Control Center</h1>
              <p className="admin-subtitle">
                Welcome <strong>{user?.firstName} {user?.lastName}</strong>. Manage students, faculty, course batches, and live studio metrics.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs-row">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={16} /> Overview Analytics
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={16} /> Student Management ({students.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructors')}
            >
              <Award size={16} /> Instructors ({instructors.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={16} /> Course Management ({courses.length})
            </button>
          </div>
        </div>
      </div>

      <div className="container admin-body">
        {/* Toast Alert */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Cards Grid */}
            <div className="grid-3 mb-8">
              <div className="card stat-card">
                <div className="stat-card-icon-box bg-purple-light">
                  <Users className="text-purple" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Registered Students</span>
                  <div className="stat-card-value">{stats?.totalStudents || 0}</div>
                  <span className="stat-card-foot text-accent">Active Learners: {stats?.activeStudents || 0}</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-card-icon-box bg-green-light">
                  <Award className="text-green" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Dance Instructors</span>
                  <div className="stat-card-value">{stats?.totalInstructors || 0}</div>
                  <span className="stat-card-foot text-muted">Certified Faculty Mentors</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-card-icon-box bg-blue-light">
                  <BookOpen className="text-blue" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Dance Courses</span>
                  <div className="stat-card-value">{stats?.totalCourses || 0}</div>
                  <span className="stat-card-foot text-muted">Active Masterclasses</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-card-icon-box bg-gold-light">
                  <Layers className="text-gold" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Total Enrollments</span>
                  <div className="stat-card-value">{stats?.totalEnrollments || 0}</div>
                  <span className="stat-card-foot text-accent">Completed Courses: {stats?.completedCourses || 0}</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-card-icon-box bg-green-light">
                  <DollarSign className="text-green" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Tuition Revenue</span>
                  <div className="stat-card-value">${stats?.totalRevenue || 0}</div>
                  <span className="stat-card-foot text-muted">Collected Enrollment Fees</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-card-icon-box bg-purple-light">
                  <CheckCircle className="text-purple" size={24} />
                </div>
                <div className="stat-card-data">
                  <span className="stat-card-label">Completed Courses</span>
                  <div className="stat-card-value">{stats?.completedCourses || 0}</div>
                  <span className="stat-card-foot text-accent">Graduated Student Batches</span>
                </div>
              </div>
            </div>

            {/* Charts & Breakdown Row */}
            <div className="grid-2 mb-8">
              {/* Category Distribution Chart */}
              <div className="card p-6">
                <h3 className="section-title-sm mb-4">Course Category Distribution</h3>
                <div className="chart-bar-list">
                  {categoryBreakdown.map((item, idx) => {
                    const maxVal = Math.max(...categoryBreakdown.map((b) => b.count), 1);
                    const pct = Math.round((item.count / maxVal) * 100);
                    return (
                      <div key={idx} className="chart-bar-row">
                        <div className="chart-bar-labels">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-slate-500 font-semibold">{item.count} classes</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Enrollments */}
              <div className="card p-6">
                <h3 className="section-title-sm mb-4">Recent Studio Enrollments</h3>
                <div className="recent-enrollments-list">
                  {recentEnrollments.map((enr, i) => (
                    <div key={i} className="recent-enr-item">
                      <div className="recent-avatar">
                        {enr.student?.firstName ? enr.student.firstName[0].toUpperCase() : 'S'}
                      </div>
                      <div className="recent-info">
                        <strong>{enr.student?.firstName} {enr.student?.lastName}</strong>
                        <p className="text-xs text-muted">{enr.course?.title} • {enr.danceType}</p>
                      </div>
                      <div className="recent-meta">
                        <span className="badge badge-green">${enr.amountPaid}</span>
                        <span className="text-xs text-muted">
                          {new Date(enr.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STUDENT MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <div className="card p-6">
            <div className="table-controls mb-6">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or style..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Dance Style</th>
                    <th>Enrolled</th>
                    <th>Completed</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar-xs">
                            {st.firstName ? st.firstName[0].toUpperCase() : 'S'}
                          </div>
                          <strong>{st.firstName} {st.lastName}</strong>
                        </div>
                      </td>
                      <td>{st.email}</td>
                      <td>{st.phone}</td>
                      <td><span className="badge badge-purple">{st.danceType}</span></td>
                      <td>{st.enrolledCount || 0} courses</td>
                      <td>{st.completedCoursesCount || 0} done</td>
                      <td>
                        <span className={`badge ${st.isPaid ? 'badge-green' : 'badge-orange'}`}>
                          {st.isPaid ? 'PAID' : 'TRIAL'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View Progress & Details"
                            onClick={() => handleViewStudentDetails(st._id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit Student"
                            onClick={() => setEditingStudent(st)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon text-danger"
                            title="Delete Student"
                            onClick={() => handleDeleteStudent(st._id, `${st.firstName} ${st.lastName}`)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-muted">
                        No students found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INSTRUCTOR MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'instructors' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title-sm">Faculty Mentors & Resident Gurus</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setInstructorModal({
                    name: '',
                    email: '',
                    phone: '',
                    bio: '',
                    danceStyles: ['Bharatanatyam'],
                    experienceYears: 5,
                    rating: 4.9,
                    image: '/ins1.png',
                  })
                }
              >
                <Plus size={16} /> Add New Instructor
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Instructor</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Styles Taught</th>
                    <th>Experience</th>
                    <th>Rating</th>
                    <th>Assigned Courses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((ins) => (
                    <tr key={ins._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={ins.image || '/ins1.png'} alt={ins.name} className="ins-table-avatar" />
                          <div>
                            <strong>{ins.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>{ins.email}</td>
                      <td>{ins.phone}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {ins.danceStyles?.map((s: string, idx: number) => (
                            <span key={idx} className="badge badge-purple text-xs">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td>{ins.experienceYears} Years</td>
                      <td>⭐ {ins.rating}</td>
                      <td>{ins.assignedCourses?.length || 0} courses</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit Instructor"
                            onClick={() => setInstructorModal(ins)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon text-danger"
                            title="Delete Instructor"
                            onClick={() => handleDeleteInstructor(ins._id, ins.name)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COURSE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'courses' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title-sm">Studio Course Offerings</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setCourseModal({
                    title: '',
                    description: '',
                    category: 'Bharatanatyam',
                    level: 'Beginner',
                    instructorName: instructors[0]?.name || 'Meenakshi Sundaram',
                    durationWeeks: 8,
                    price: 49,
                    schedule: 'Mon & Wed, 6:00 PM',
                    image: '/slide1.jpg',
                    maxStudents: 25,
                    syllabus: ['Foundation & Posture', 'Footwork Drills', 'Choreography Routine'],
                  })
                }
              >
                <Plus size={16} /> Add New Dance Course
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Faculty Guru</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Enrolled / Cap</th>
                    <th>Schedule</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <img src={c.image || '/slide1.jpg'} alt={c.title} className="course-table-thumb" />
                          <strong>{c.title}</strong>
                        </div>
                      </td>
                      <td>{c.category}</td>
                      <td><span className="badge badge-blue">{c.level}</span></td>
                      <td>{c.instructorName}</td>
                      <td>{c.durationWeeks} wks</td>
                      <td><strong>${c.price}</strong></td>
                      <td>{c.enrolledCount} / {c.maxStudents || 25}</td>
                      <td><span className="text-xs text-muted">{c.schedule}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit Course"
                            onClick={() => setCourseModal(c)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon text-danger"
                            title="Delete Course"
                            onClick={() => handleDeleteCourse(c._id, c.title)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: STUDENT DETAILS & PROGRESS */}
      {/* ========================================================= */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-container max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Profile & Progress History</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="big-avatar">
                  {selectedStudent.student.firstName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedStudent.student.firstName} {selectedStudent.student.lastName}
                  </h2>
                  <p className="text-sm text-muted">{selectedStudent.student.email} • {selectedStudent.student.phone}</p>
                  <p className="text-xs text-muted mt-1">
                    Registered: {new Date(selectedStudent.student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-3 border-b pb-1">Enrolled Courses & Completion</h4>
              <div className="space-y-3 mb-6">
                {selectedStudent.enrollments.map((enr: any) => (
                  <div key={enr._id} className="p-3 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <strong>{enr.course?.title}</strong>
                      <span className={`badge ${enr.isCompleted ? 'badge-green' : 'badge-orange'}`}>
                        {enr.isCompleted ? 'COMPLETED' : `${enr.progressPercentage || 0}%`}
                      </span>
                    </div>
                    <div className="text-xs text-muted mb-2">
                      Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()} • Schedule: {enr.scheduleTime}
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${enr.progressPercentage || 0}%` }} />
                    </div>
                  </div>
                ))}
                {selectedStudent.enrollments.length === 0 && (
                  <p className="text-sm text-muted">No course enrollments found for this student.</p>
                )}
              </div>

              <h4 className="font-bold text-slate-800 mb-3 border-b pb-1">Completed Lessons History</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.completedLessons.map((p: any) => (
                  <span key={p._id} className="badge badge-green text-xs">
                    ✔ {p.lesson?.title || 'Lesson'}
                  </span>
                ))}
                {selectedStudent.completedLessons.length === 0 && (
                  <p className="text-sm text-muted">No individual lessons completed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT STUDENT */}
      {/* ========================================================= */}
      {editingStudent && (
        <div className="modal-backdrop" onClick={() => setEditingStudent(null)}>
          <div className="modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student Information</h3>
              <button type="button" className="close-btn" onClick={() => setEditingStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveStudent} className="p-6">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    value={editingStudent.firstName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dance Style</label>
                  <input
                    type="text"
                    value={editingStudent.danceType}
                    onChange={(e) => setEditingStudent({ ...editingStudent, danceType: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Status</label>
                <select
                  value={editingStudent.isPaid ? 'true' : 'false'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, isPaid: e.target.value === 'true' })}
                  className="form-control"
                >
                  <option value="true">PAID (Enrolled Full Student)</option>
                  <option value="false">TRIAL (Unpaid / Demo)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setEditingStudent(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD / EDIT INSTRUCTOR */}
      {/* ========================================================= */}
      {instructorModal && (
        <div className="modal-backdrop" onClick={() => setInstructorModal(null)}>
          <div className="modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{instructorModal._id ? 'Edit Instructor' : 'Add New Instructor'}</h3>
              <button type="button" className="close-btn" onClick={() => setInstructorModal(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveInstructor} className="p-6">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={instructorModal.name}
                  onChange={(e) => setInstructorModal({ ...instructorModal, name: e.target.value })}
                  className="form-control"
                  placeholder="e.g. Meenakshi Sundaram"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={instructorModal.email}
                    onChange={(e) => setInstructorModal({ ...instructorModal, email: e.target.value })}
                    className="form-control"
                    placeholder="instructor@danceaura.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    value={instructorModal.phone}
                    onChange={(e) => setInstructorModal({ ...instructorModal, phone: e.target.value })}
                    className="form-control"
                    placeholder="+91 98450 11221"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio & Accomplishments</label>
                <textarea
                  value={instructorModal.bio}
                  onChange={(e) => setInstructorModal({ ...instructorModal, bio: e.target.value })}
                  className="form-control"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    value={instructorModal.experienceYears}
                    onChange={(e) => setInstructorModal({ ...instructorModal, experienceYears: Number(e.target.value) })}
                    className="form-control"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={instructorModal.rating}
                    onChange={(e) => setInstructorModal({ ...instructorModal, rating: Number(e.target.value) })}
                    className="form-control"
                    min="1"
                    max="5"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="text"
                  value={instructorModal.image}
                  onChange={(e) => setInstructorModal({ ...instructorModal, image: e.target.value })}
                  className="form-control"
                  placeholder="/ins1.png"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setInstructorModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> {instructorModal._id ? 'Update Faculty' : 'Save Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADD / EDIT COURSE */}
      {/* ========================================================= */}
      {courseModal && (
        <div className="modal-backdrop" onClick={() => setCourseModal(null)}>
          <div className="modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{courseModal._id ? 'Edit Dance Course' : 'Create New Dance Course'}</h3>
              <button type="button" className="close-btn" onClick={() => setCourseModal(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="p-6">
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  value={courseModal.title}
                  onChange={(e) => setCourseModal({ ...courseModal, title: e.target.value })}
                  className="form-control"
                  placeholder="e.g. Bharatanatyam Foundation"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={courseModal.category}
                    onChange={(e) => setCourseModal({ ...courseModal, category: e.target.value })}
                    className="form-control"
                    required
                  >
                    {[
                      'Bharatanatyam',
                      'Kathak',
                      'Kuchipudi',
                      'Ballet',
                      'Contemporary',
                      'Hip Hop',
                      'Salsa',
                      'Zumba',
                      'K-Pop',
                      'Belly Dance',
                      'Bhangra',
                      'Garba',
                      'Aerobics',
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Skill Level</label>
                  <select
                    value={courseModal.level}
                    onChange={(e) => setCourseModal({ ...courseModal, level: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Description</label>
                <textarea
                  value={courseModal.description}
                  onChange={(e) => setCourseModal({ ...courseModal, description: e.target.value })}
                  className="form-control"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Faculty Guru</label>
                  <input
                    type="text"
                    value={courseModal.instructorName}
                    onChange={(e) => setCourseModal({ ...courseModal, instructorName: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($ USD)</label>
                  <input
                    type="number"
                    value={courseModal.price}
                    onChange={(e) => setCourseModal({ ...courseModal, price: Number(e.target.value) })}
                    className="form-control"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={courseModal.durationWeeks}
                    onChange={(e) => setCourseModal({ ...courseModal, durationWeeks: Number(e.target.value) })}
                    className="form-control"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Schedule Slot</label>
                  <input
                    type="text"
                    value={courseModal.schedule}
                    onChange={(e) => setCourseModal({ ...courseModal, schedule: e.target.value })}
                    className="form-control"
                    placeholder="Mon & Wed, 6:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image</label>
                <input
                  type="text"
                  value={courseModal.image}
                  onChange={(e) => setCourseModal({ ...courseModal, image: e.target.value })}
                  className="form-control"
                  placeholder="/slide1.jpg or image URL"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setCourseModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> {courseModal._id ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-page {
          background-color: #f8fafc;
          min-height: 90vh;
          padding-bottom: 80px;
        }
        .admin-header {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 40px 0 0;
        }
        .admin-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          margin: 6px 0 6px;
        }
        .admin-subtitle {
          color: #cbd5e1;
          font-size: 15px;
          margin-bottom: 24px;
        }
        .admin-tabs-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
        }
        .admin-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          padding: 12px 20px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-tab-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .admin-tab-btn.active {
          background: #ffffff;
          color: #1e293b;
        }
        .admin-body {
          margin-top: 30px;
        }
        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-radius: 14px;
        }
        .stat-card-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-purple-light { background: #f3e8fa; }
        .bg-green-light { background: #e8f8f0; }
        .bg-blue-light { background: #e0f2fe; }
        .bg-gold-light { background: #fef3c7; }
        .text-purple { color: #8e44ad; }
        .text-green { color: #27ae60; }
        .text-blue { color: #0284c7; }
        .text-gold { color: #d97706; }
        .stat-card-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }
        .stat-card-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.1;
          margin: 2px 0;
        }
        .stat-card-foot {
          font-size: 12px;
          font-weight: 600;
        }
        .section-title-sm {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }
        .chart-bar-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chart-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .recent-enrollments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .recent-enr-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .recent-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #4a1c6f;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .recent-info {
          flex: 1;
        }
        .recent-meta {
          text-align: right;
        }
        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .search-box {
          position: relative;
          width: 320px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          font-size: 14px;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 12px 14px;
          font-weight: 700;
          color: #475569;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: middle;
        }
        .admin-table tr:hover {
          background: #f8fafc;
        }
        .action-buttons {
          display: flex;
          gap: 6px;
        }
        .btn-icon {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: #e2e8f0;
          color: #1e293b;
        }
        .btn-icon.text-danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }
        .avatar-xs {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #27ae60;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .ins-table-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .course-table-thumb {
          width: 50px;
          height: 36px;
          border-radius: 4px;
          object-fit: cover;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-container {
          background: white;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          max-height: 90vh;
          overflow-y: auto;
        }
        .max-w-lg { max-width: 520px; }
        .max-w-2xl { max-width: 680px; }
        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }
        .close-btn:hover { color: #1e293b; }
      `}</style>
    </div>
  );
};
