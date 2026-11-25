import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { contactAPI } from '../services/api';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please fill in all mandatory fields (Name, Email, Subject, Message).');
      return;
    }

    try {
      setSubmitting(true);
      await contactAPI.submit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <div className="container">
          <span className="title-cursive text-gold">Get In Touch</span>
          <h1 className="contact-hero-title">Contact & Studio Auditions</h1>
          <p className="contact-hero-desc">
            Have questions about our course schedules, private coaching, fee structures, or stage auditions? We'd love to connect.
          </p>
        </div>
      </div>

      <div className="container contact-section">
        <div className="contact-split">
          {/* Info Card */}
          <div className="contact-info-panel">
            <span className="section-subtitle">Visit Us</span>
            <h2 className="section-title">DanceAura Main Academy</h2>
            <p className="panel-desc">
              Come by for a guided tour of our sprung floor studios, observation mirrors, and student wellness lounges.
            </p>

            <div className="info-items">
              <div className="info-box">
                <MapPin className="info-icon" size={24} />
                <div>
                  <h4>Studio Location</h4>
                  <p>42 Rhythm Avenue, Dance Heritage District, Art Square, Metro Station Gate 3</p>
                </div>
              </div>

              <div className="info-box">
                <Phone className="info-icon" size={24} />
                <div>
                  <h4>Direct Telephones</h4>
                  <p>+91 (040) 2345-6789 / +91 98450 11221</p>
                </div>
              </div>

              <div className="info-box">
                <Mail className="info-icon" size={24} />
                <div>
                  <h4>Electronic Mail</h4>
                  <p>admissions@danceaura.com | info@danceaura.com</p>
                </div>
              </div>

              <div className="info-box">
                <Clock className="info-icon" size={24} />
                <div>
                  <h4>Studio Working Hours</h4>
                  <p>Monday – Saturday: 6:00 AM – 9:00 PM</p>
                  <p>Sunday: 7:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card contact-form-card">
            <h3 className="form-title">Send An Inquiry</h3>
            <p className="form-subtext">We typically reply within 24 business hours.</p>

            {submitted && (
              <div className="alert alert-success">
                <CheckCircle2 size={20} />
                <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-error">
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Akhila Reddy"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. akhila@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject of Inquiry *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select a topic...</option>
                    <option value="Course Registration">Course Registration</option>
                    <option value="Free Trial Rehearsal">Free Trial Rehearsal</option>
                    <option value="Private 1-on-1 Coaching">Private 1-on-1 Coaching</option>
                    <option value="Stage Auditions & Competitions">Stage Auditions & Competitions</option>
                    <option value="Fee Structure & Scholarships">Fee Structure & Scholarships</option>
                    <option value="Other Feedback">Other Feedback</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-control"
                  placeholder="Tell us about your dance goals or any questions..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                <Send size={18} />
                {submitting ? 'Sending Message...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-hero {
          background: linear-gradient(135deg, #4a1c6f 0%, #1c3a47 100%);
          color: white;
          padding: 70px 0;
          text-align: center;
        }
        .contact-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 700;
          margin: 8px 0 12px;
        }
        .contact-hero-desc {
          max-width: 620px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 16px;
        }
        .contact-section {
          padding: 70px 20px;
        }
        .contact-split {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
          align-items: start;
        }
        .panel-desc {
          color: #64748b;
          font-size: 15px;
          margin: 8px 0 28px;
        }
        .info-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .info-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .info-icon {
          color: #27ae60;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .info-box h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 3px;
        }
        .info-box p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .contact-form-card {
          padding: 36px;
          border-radius: 16px;
        }
        .form-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .form-subtext {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 24px;
        }
        .btn-submit {
          width: 100%;
          padding: 13px;
          font-size: 16px;
        }
        @media (max-width: 900px) {
          .contact-split { grid-template-columns: 1fr; }
          .contact-form-card { padding: 24px; }
        }
      `}</style>
    </div>
  );
};
