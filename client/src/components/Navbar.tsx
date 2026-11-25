import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, LayoutDashboard, Shield, ShieldAlert, Menu, X, BookOpen, Film, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar-wrapper">
      <div className="container nav-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="brand-link">
          <img src="/Logo.png" alt="DanceAura Logo" className="brand-logo" />
          <span className="brand-title">DANCEAURA</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Categories
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Courses
          </NavLink>
          <NavLink to="/videos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Videos
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-link ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={15} /> Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Auth / Profile Area */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            <div className="profile-dropdown-container">
              <button
                type="button"
                className="profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="avatar-circle">
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user.firstName}</span>
                <span className="dropdown-caret">▼</span>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.firstName} {user.lastName}</strong>
                    <span className="user-badge">{user.role.toUpperCase()}</span>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="dropdown-item admin-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShieldAlert size={16} />
                      Admin Control Center
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Student Progress
                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  {(user.role === 'instructor' || user.role === 'admin') && (
                    <Link
                      to="/instructor-dashboard"
                      className="dropdown-item instructor-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield size={16} />
                      Instructor Portal
                    </Link>
                  )}

                  <div className="dropdown-divider" />

                  <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/categories" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Dance Categories
          </NavLink>
          <NavLink to="/courses" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Dance Courses
          </NavLink>
          <NavLink to="/videos" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Dance Videos
          </NavLink>
          <NavLink to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </NavLink>

          {isAuthenticated ? (
            <>
              <div className="mobile-divider" />
              {user?.role === 'admin' && (
                <NavLink to="/admin" className="mobile-link text-purple font-bold" onClick={() => setMobileMenuOpen(false)}>
                  Admin Control Center
                </NavLink>
              )}
              <NavLink to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Student Progress
              </NavLink>
              <NavLink to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </NavLink>
              <button
                type="button"
                className="mobile-link text-danger logout-btn"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-row">
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          background-color: #ffffff;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
        }
        .brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .brand-logo {
          height: 48px;
          width: 48px;
          object-fit: contain;
        }
        .brand-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 800;
          color: #1c3a47;
          letter-spacing: 1px;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-link {
          font-size: 15px;
          font-weight: 500;
          color: #333333;
          padding: 7px 14px;
          border-radius: 20px;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link:hover, .nav-link.active {
          background-color: #27ae60;
          color: #ffffff;
        }
        .admin-nav-link {
          color: #8e44ad;
          font-weight: 700;
        }
        .admin-dropdown-item {
          color: #8e44ad !important;
          font-weight: 700;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .profile-dropdown-container {
          position: relative;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 30px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          transition: background 0.2s;
        }
        .profile-btn:hover {
          background: #e2e8f0;
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #27ae60;
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }
        .dropdown-caret {
          font-size: 10px;
          color: #64748b;
        }
        .profile-dropdown-menu {
          position: absolute;
          right: 0;
          top: 115%;
          width: 230px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          padding: 8px 0;
          z-index: 1001;
        }
        .dropdown-header {
          padding: 10px 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .user-badge {
          display: inline-block;
          font-size: 10px;
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 8px;
          border-radius: 12px;
          width: fit-content;
          font-weight: 700;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          color: #334155;
          font-size: 14px;
          text-decoration: none;
          background: transparent;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f8fafc;
          color: #27ae60;
        }
        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 6px 0;
        }
        .mobile-toggle-btn {
          display: none;
          background: transparent;
          color: #1e293b;
          padding: 6px;
        }
        .mobile-drawer {
          display: flex;
          flex-direction: column;
          padding: 16px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          gap: 12px;
        }
        .mobile-link {
          font-size: 16px;
          padding: 8px 0;
          color: #334155;
          text-decoration: none;
          font-weight: 500;
        }
        .mobile-link.active {
          color: #27ae60;
          font-weight: 700;
        }
        @media (max-width: 960px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle-btn {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};
