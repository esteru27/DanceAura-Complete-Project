import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

export const StudentLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      // If logging in as admin, default to /admin if from is default /dashboard
      if (email.includes('admin') && from === '/dashboard') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = () => {
    setEmail('akhilareddyevuri1908@gmail.com');
    setPassword('1234');
  };

  const handleDemoInstructor = () => {
    setEmail('instructor@danceaura.com');
    setPassword('dance123');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@danceaura.com');
    setPassword('admin123');
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="card login-card">
          <div className="login-header">
            <span className="title-cursive text-gold">Welcome Back</span>
            <h1 className="login-title">Student & Staff Login</h1>
            <p className="login-desc">Sign in to your DanceAura account to manage courses, track learning, and view dashboards.</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control with-icon"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control with-icon"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-submit-login" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="demo-accounts-box">
            <span className="demo-label">
              <ShieldCheck size={16} /> Quick Role-Based Demo Logins:
            </span>
            <div className="demo-btns">
              <button type="button" className="demo-btn" onClick={handleDemoStudent}>
                Student (1234)
              </button>
              <button type="button" className="demo-btn" onClick={handleDemoInstructor}>
                Instructor
              </button>
              <button type="button" className="demo-btn admin-demo-btn" onClick={handleDemoAdmin}>
                <ShieldAlert size={12} className="inline mr-1" /> Admin
              </button>
            </div>
          </div>

          <div className="register-prompt">
            <span>New to DanceAura Studio? </span>
            <Link to="/register" className="text-accent fw-bold">
              Register Here
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          background-color: #f1f5f9;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 60px 20px;
        }
        .login-container {
          max-width: 480px;
        }
        .login-card {
          padding: 38px;
          border-radius: 16px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 26px;
        }
        .login-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 6px 0 6px;
        }
        .login-desc {
          color: #64748b;
          font-size: 14px;
        }
        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          font-size: 12px;
          color: #27ae60;
          font-weight: 600;
        }
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .form-control.with-icon {
          padding-left: 38px;
        }
        .btn-submit-login {
          width: 100%;
          padding: 13px;
          font-size: 16px;
          margin-top: 10px;
        }
        .demo-accounts-box {
          margin-top: 24px;
          padding: 14px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px dashed #cbd5e1;
        }
        .demo-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }
        .demo-btns {
          display: flex;
          gap: 8px;
        }
        .demo-btn {
          flex: 1;
          padding: 7px 10px;
          font-size: 11px;
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          color: #334155;
          font-weight: 600;
          transition: all 0.2s;
        }
        .demo-btn:hover {
          background: #27ae60;
          color: white;
          border-color: #27ae60;
        }
        .admin-demo-btn {
          border-color: #8e44ad;
          color: #8e44ad;
        }
        .admin-demo-btn:hover {
          background: #8e44ad;
          color: white;
          border-color: #8e44ad;
        }
        .register-prompt {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #64748b;
        }
        .fw-bold { font-weight: 700; }
      `}</style>
    </div>
  );
};
