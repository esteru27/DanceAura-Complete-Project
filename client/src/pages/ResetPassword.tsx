import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (!token) {
      setErrorMsg('Invalid or missing password reset token.');
      return;
    }

    try {
      setLoading(true);
      await authAPI.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error resetting password. The token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="container reset-container">
        <div className="card reset-card">
          <div className="reset-header">
            <span className="title-cursive text-gold">DanceAura Security</span>
            <h1 className="reset-title">Reset Your Password</h1>
            <p className="reset-desc">Choose a strong new password for your account.</p>
          </div>

          {success ? (
            <div className="success-state text-center">
              <div className="alert alert-success">
                <CheckCircle2 size={24} className="text-accent flex-shrink-0" />
                <span>Password reset successful! You can now log in with your new password.</span>
              </div>
              <Link to="/login" className="btn btn-primary mt-4 w-full">
                Go to Student Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="alert alert-error">
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control with-icon"
                    placeholder="At least 4 characters"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control with-icon"
                    placeholder="Re-enter new password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-submit-reset" disabled={loading}>
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .reset-password-page {
          background-color: #f1f5f9;
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 60px 20px;
        }
        .reset-container {
          max-width: 460px;
        }
        .reset-card {
          padding: 38px;
          border-radius: 16px;
        }
        .reset-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .reset-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 6px 0 8px;
        }
        .reset-desc {
          color: #64748b;
          font-size: 14px;
        }
        .input-with-icon { position: relative; }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .form-control.with-icon { padding-left: 38px; }
        .btn-submit-reset {
          width: 100%;
          padding: 13px;
          font-size: 15px;
          margin-top: 10px;
        }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
};
