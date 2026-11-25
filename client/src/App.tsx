import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { DanceCategories } from './pages/DanceCategories';
import { DanceCourses } from './pages/DanceCourses';
import { CourseDetail } from './pages/CourseDetail';
import { CourseLearning } from './pages/CourseLearning';
import { DanceVideos } from './pages/DanceVideos';
import { StudentRegistration } from './pages/StudentRegistration';
import { StudentLogin } from './pages/StudentLogin';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfileManagement } from './pages/ProfileManagement';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/categories" element={<DanceCategories />} />
              <Route path="/courses" element={<DanceCourses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/videos" element={<DanceVideos />} />
              <Route path="/register" element={<StudentRegistration />} />
              <Route path="/login" element={<StudentLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Student Learning & Progress Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/learn"
                element={
                  <ProtectedRoute>
                    <CourseLearning />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileManagement />
                  </ProtectedRoute>
                }
              />

              {/* Protected Faculty Route */}
              <Route
                path="/instructor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Control Center Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
