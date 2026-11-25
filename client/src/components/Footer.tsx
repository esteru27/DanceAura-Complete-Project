import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Studio Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <img src="/Logo.png" alt="DanceAura" className="footer-logo" />
              <h3>DANCEAURA</h3>
            </div>
            <p className="footer-tagline">
              Unleash your inner rhythm. Premier classical and contemporary dance academy empowering dancers of all levels with passionate master instructors.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/categories">Dance Categories</Link></li>
              <li><Link to="/courses">Courses & Schedules</Link></li>
              <li><Link to="/videos">Free Video Tutorials</Link></li>
              <li><Link to="/contact">Contact & Auditions</Link></li>
            </ul>
          </div>

          {/* Dance Styles */}
          <div className="footer-col">
            <h4 className="footer-heading">Dance Styles</h4>
            <ul className="footer-links-list">
              <li><Link to="/courses?category=Bharatanatyam">Bharatanatyam</Link></li>
              <li><Link to="/courses?category=Kathak">Kathak</Link></li>
              <li><Link to="/courses?category=Kuchipudi">Kuchipudi</Link></li>
              <li><Link to="/courses?category=Hip%20Hop">Hip Hop & Urban</Link></li>
              <li><Link to="/courses?category=Ballet">Classical Ballet</Link></li>
              <li><Link to="/courses?category=Salsa">Latin Salsa</Link></li>
              <li><Link to="/courses?category=Zumba">Zumba Fitness</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4 className="footer-heading">Visit Studio</h4>
            <ul className="contact-info-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>42 Rhythm Avenue, Dance Heritage District, Art Square</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+91 (040) 2345-6789</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>info@danceaura.com</span>
              </li>
            </ul>
            <div className="studio-timing">
              <strong>Studio Hours:</strong>
              <p>Mon – Sat: 6:00 AM – 9:00 PM</p>
              <p>Sunday: 7:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DanceAura Studio. All rights reserved.</p>
          <p className="credit">Crafted with <Heart size={14} className="heart-icon" /> for the dance community.</p>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: #0e1211;
          color: #ffffff;
          padding: 60px 0 24px;
          margin-top: 60px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
          gap: 36px;
          margin-bottom: 40px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .footer-logo {
          width: 44px;
          height: 44px;
        }
        .footer-brand h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
          letter-spacing: 1px;
        }
        .footer-tagline {
          color: #a0aec0;
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .social-links {
          display: flex;
          gap: 14px;
        }
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a202c;
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .social-links a:hover {
          background: #27ae60;
          transform: translateY(-2px);
        }
        .footer-heading {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 18px;
          color: #f7fafc;
          position: relative;
          padding-bottom: 8px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 32px;
          height: 2px;
          background: #27ae60;
        }
        .footer-links-list, .contact-info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-list a {
          color: #cbd5e1;
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-links-list a:hover {
          color: #27ae60;
          padding-left: 4px;
        }
        .contact-info-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #cbd5e1;
          font-size: 14px;
        }
        .contact-icon {
          color: #27ae60;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .studio-timing {
          margin-top: 14px;
          font-size: 13px;
          color: #94a3b8;
          border-left: 2px solid #27ae60;
          padding-left: 10px;
        }
        .footer-bottom {
          border-top: 1px solid #1e293b;
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #94a3b8;
        }
        .heart-icon {
          color: #e74c3c;
          vertical-align: middle;
          margin: 0 2px;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
