import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.forgotPassword(email);
      setSubmitted(true);
      setMessage(res.message || 'Password reset link dispatched.');
      if (res.devToken) {
        setDevToken(res.devToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container forgot-container">
        <div className="card forgot-card">
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          <div className="forgot-header">
            <span className="title-cursive text-gold">Account Recovery</span>
            <h1 className="forgot-title">Forgot Password</h1>
            <p className="forgot-desc">
              Enter the email address registered with your DanceAura account and we will send you a secure link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="success-state">
              <div className="alert alert-success">
                <CheckCircle2 size={22} className="flex-shrink-0" />
                <div>
                  <strong>Request Dispatched</strong>
                  <p>{message}</p>
                </div>
              </div>

              {devToken && (
                <div className="dev-token-box">
                  <strong>Development Mode Token:</strong>
                  <p className="token-text">{devToken}</p>
                  <Link to={`/reset-password/${devToken}`} className="btn btn-primary btn-sm mt-3">
                    Proceed to Reset Password Form
                  </Link>
                </div>
              )}

              <p className="resend-text text-muted mt-4">
                Did not receive the email? Check your spam folder or{' '}
                <button type="button" className="text-btn text-accent" onClick={() => setSubmitted(false)}>
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="alert alert-error">
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Your Registered Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control with-icon"
                    placeholder="e.g. akhilareddyevuri1908@gmail.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-submit-forgot" disabled={loading}>
                {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .forgot-password-page {
          background-color: #f1f5f9;
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 60px 20px;
        }
        .forgot-container {
          max-width: 480px;
        }
        .forgot-card {
          padding: 38px;
          border-radius: 16px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .back-link:hover { color: #27ae60; }
        .forgot-header {
          text-align: center;
          margin-bottom: 26px;
        }
        .forgot-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 6px 0 8px;
        }
        .forgot-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
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
        .btn-submit-forgot {
          width: 100%;
          padding: 13px;
          font-size: 15px;
          margin-top: 10px;
        }
        .dev-token-box {
          margin-top: 18px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
        }
        .token-text {
          word-break: break-all;
          background: #e2e8f0;
          padding: 6px 10px;
          border-radius: 4px;
          margin-top: 6px;
          font-family: monospace;
        }
        .text-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
