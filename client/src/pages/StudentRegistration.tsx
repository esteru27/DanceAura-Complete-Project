import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Lock, Mail, Phone, MapPin, Calendar, Clock, Music } from 'lucide-react';

export const StudentRegistration: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'prefer_not_to_say',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    region: '',
    zipCode: '',
    country: 'India',
    danceType: 'Bharatanatyam',
    startDate: '',
    startTime: '10:00 AM',
    comments: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }

    if (formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="container reg-container">
        <div className="card reg-form-card">
          <div className="reg-header">
            <span className="title-cursive text-gold">Begin Your Journey</span>
            <h1 className="reg-title">Student Registration</h1>
            <p className="reg-desc">Complete your enrollment details to access courses and student progress tracking.</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Student Name */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Akhila"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Reddy"
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address <span className="text-danger">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="student@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </div>

            {/* Dance Style & Gender */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Dance Style <span className="text-danger">*</span></label>
                <select
                  name="danceType"
                  value={formData.danceType}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="Bharatanatyam">Bharatanatyam (Indian Classical)</option>
                  <option value="Kathak">Kathak (North Indian Classical)</option>
                  <option value="Kuchipudi">Kuchipudi (Classical Drama)</option>
                  <option value="Ballet">Classical Ballet</option>
                  <option value="Contemporary">Contemporary Movement</option>
                  <option value="Hip Hop">Hip Hop & Urban Street</option>
                  <option value="Salsa">Latin Salsa & Partnering</option>
                  <option value="Zumba">Zumba Fitness Dance</option>
                  <option value="K-Pop">K-Pop Choreography</option>
                  <option value="Belly Dance">Belly Dance</option>
                  <option value="Bhangra">Punjabi Bhangra</option>
                  <option value="Garba">Gujarati Garba / Dandiya</option>
                  <option value="Aerobics">Dance Aerobics</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Start Schedule */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Start Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time Slot <span className="text-danger">*</span></label>
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="07:00 AM">Morning Batch (07:00 AM)</option>
                  <option value="10:00 AM">Mid-Morning Batch (10:00 AM)</option>
                  <option value="04:00 PM">Afternoon Batch (04:00 PM)</option>
                  <option value="06:00 PM">Evening Batch (06:00 PM)</option>
                  <option value="07:30 PM">Late Evening Batch (07:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Street Address <span className="text-danger">*</span></label>
              <input
                type="text"
                name="streetAddress1"
                value={formData.streetAddress1}
                onChange={handleChange}
                className="form-control"
                placeholder="House / Flat / Street Name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State / Region <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="State / Province"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Postal / Zip Code <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Zip Code"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Create Password <span className="text-danger">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="At least 4 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            {/* Comments */}
            <div className="form-group">
              <label className="form-label">Prior Experience or Goals</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className="form-control"
                placeholder="Tell us about any prior training or what you wish to achieve..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-submit-reg" disabled={submitting}>
              {submitting ? 'Creating Student Account...' : 'Complete Registration'}
            </button>

            <div className="login-prompt">
              <span>Already registered? </span>
              <Link to="/login" className="text-accent fw-bold">
                Student Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .registration-page {
          background-color: #f1f5f9;
          padding: 60px 20px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }
        .reg-container {
          max-width: 720px;
        }
        .reg-form-card {
          padding: 40px;
          border-radius: 16px;
        }
        .reg-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .reg-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 6px 0 8px;
        }
        .reg-desc {
          color: #64748b;
          font-size: 15px;
        }
        .text-danger { color: #e74c3c; }
        .btn-submit-reg {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          margin-top: 10px;
        }
        .login-prompt {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #64748b;
        }
        .fw-bold { font-weight: 700; }
        @media (max-width: 640px) {
          .reg-form-card { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
};
