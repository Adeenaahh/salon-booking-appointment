import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, loginAsCustomer, loginAsAdmin, logout, notification } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      {/* Top Demo Banner for Skill Exam Examiners */}
      <div className="demo-banner">
        <span>✨ <strong>Stage 2 Frontend Preview Mode</strong> (Active Role: <strong>{currentUser ? currentUser.role.toUpperCase() : 'GUEST'}</strong>)</span>
        <div className="role-switchers">
          <button 
            className={`role-btn ${currentUser?.role === 'customer' ? 'active' : ''}`}
            onClick={loginAsCustomer}
          >
            Switch to Customer
          </button>
          <button 
            className={`role-btn ${currentUser?.role === 'admin' ? 'active' : ''}`}
            onClick={loginAsAdmin}
          >
            Switch to Admin
          </button>
          {currentUser && (
            <button className="role-btn" onClick={handleLogout}>
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="navbar container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🌸</span>
          <div className="brand-text">
            <span className="brand-title">GLAMOUR HAVEN</span>
            <span className="brand-tagline">LUXURY SALON & SPA</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="hamburger-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Services
          </NavLink>
          <NavLink to="/book" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Book Appointment
          </NavLink>

          {/* Customer Dashboard Link - Accessible for customers and visitors */}
          {currentUser?.role !== 'admin' && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Customer Dashboard
            </NavLink>
          )}

          {/* Admin Links */}
          {currentUser?.role === 'admin' && (
            <div className="admin-nav-group">
              <NavLink to="/admin" end className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Admin Dashboard
              </NavLink>
              <NavLink to="/admin/services" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Services
              </NavLink>
              <NavLink to="/admin/appointments" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Appointments
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Customer View
              </NavLink>
            </div>
          )}

          {/* Auth Button or User Badge */}
          <div className="nav-auth-section">
            {currentUser ? (
              <div className="user-profile-badge">
                <span className="user-avatar">
                  {currentUser.role === 'admin' ? '👑' : '💄'}
                </span>
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  className="user-name"
                  title={currentUser.role === 'admin' ? 'Go to Admin Dashboard' : 'Go to Customer Dashboard'}
                >
                  {currentUser.name.split(' ')[0]}
                </Link>
                <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-sm btn-secondary" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
