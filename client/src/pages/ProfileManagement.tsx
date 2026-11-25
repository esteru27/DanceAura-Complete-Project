import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Save, CheckCircle2 } from 'lucide-react';

export const ProfileManagement: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    gender: user?.gender || 'prefer_not_to_say',
    streetAddress1: user?.streetAddress1 || '',
    streetAddress2: user?.streetAddress2 || '',
    city: user?.city || '',
    region: user?.region || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'India',
    danceType: user?.danceType || 'Bharatanatyam',
    comments: user?.comments || '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      await updateProfile(formData);
      setSuccessMsg('Your profile has been updated successfully!');
      setFormData({ ...formData, password: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <span className="title-cursive text-gold">Student Account</span>
          <h1 className="profile-hero-title">Manage Your Profile</h1>
          <p className="profile-hero-desc">Keep your contact information and dance preferences up to date.</p>
        </div>
      </div>

      <div className="container profile-container">
        <div className="card profile-form-card">
          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3 className="section-subtitle-form">Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="form-control bg-disabled"
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Dance Style</label>
                <select
                  name="danceType"
                  value={formData.danceType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Bharatanatyam">Bharatanatyam</option>
                  <option value="Kathak">Kathak</option>
                  <option value="Kuchipudi">Kuchipudi</option>
                  <option value="Ballet">Ballet</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Salsa">Salsa</option>
                  <option value="Zumba">Zumba</option>
                  <option value="K-Pop">K-Pop</option>
                  <option value="Belly Dance">Belly Dance</option>
                  <option value="Bhangra">Bhangra</option>
                  <option value="Garba">Garba</option>
                  <option value="Aerobics">Aerobics</option>
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

            <h3 className="section-subtitle-form mt-6">Residential Address</h3>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="streetAddress1"
                value={formData.streetAddress1}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State / Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <h3 className="section-subtitle-form mt-6">Security (Optional)</h3>
            <div className="form-group">
              <label className="form-label">Change Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter new password (optional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-save-profile" disabled={submitting}>
              <Save size={18} />
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          background-color: #f8fafc;
          padding-bottom: 80px;
        }
        .profile-hero {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
        }
        .profile-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 36px;
          font-weight: 700;
          margin: 6px 0 8px;
        }
        .profile-hero-desc {
          font-size: 15px;
          color: #cbd5e1;
        }
        .profile-container {
          max-width: 700px;
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }
        .profile-form-card {
          padding: 36px;
          border-radius: 16px;
        }
        .section-subtitle-form {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 8px;
        }
        .mt-6 { margin-top: 24px; }
        .bg-disabled { background-color: #f1f5f9; color: #64748b; cursor: not-allowed; }
        .btn-save-profile {
          width: 100%;
          padding: 13px;
          font-size: 16px;
          margin-top: 14px;
        }
      `}</style>
    </div>
  );
};
