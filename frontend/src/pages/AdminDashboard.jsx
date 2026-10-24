import React from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import AppointmentCard from '../components/AppointmentCard';
import './AdminPages.css';

export default function AdminDashboard() {
  const { appointments, services, currentUser, loginAsAdmin, updateAppointmentStatus } = useDemo();

  // Route protection warning if not in admin role
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container section-padding">
        <div className="card admin-restricted-card">
          <span className="restricted-icon">🛑</span>
          <h2>Admin Authorization Required</h2>
          <p>Access to the Salon Administration Console is strictly restricted to authorized staff.</p>
          <div className="restricted-actions">
            <button className="btn btn-primary" onClick={loginAsAdmin}>
              Switch to Admin Role (Demo Preview)
            </button>
            <Link to="/" className="btn btn-secondary">
              Return to Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const estimatedRevenue = appointments
    .filter(a => a.status === 'confirmed')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);

  const recentAppointments = appointments.slice(0, 4);

  return (
    <div className="admin-page section-padding">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-card card">
          <div>
            <span className="admin-eyebrow">👑 SALON MANAGEMENT CONSOLE</span>
            <h2>Operations &amp; Performance Dashboard</h2>
            <p>Welcome back, Administrator. Overview of bookings, catalog status, and revenues.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin/services" className="btn btn-secondary">
              ✂️ Manage Services ({services.length})
            </Link>
            <Link to="/admin/appointments" className="btn btn-primary">
              📋 View All Bookings ({totalBookings})
            </Link>
          </div>
        </div>

        {/* 4 Statistics Metric Cards */}
        <div className="grid-4 stat-metrics-grid">
          <div className="card metric-card">
            <div className="metric-icon bg-pink">📅</div>
            <div className="metric-data">
              <span className="metric-num">{totalBookings}</span>
              <span className="metric-label">Total Bookings</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-icon bg-amber">⏳</div>
            <div className="metric-data">
              <span className="metric-num">{pendingCount}</span>
              <span className="metric-label">Pending Approval</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-icon bg-emerald">✅</div>
            <div className="metric-data">
              <span className="metric-num">{confirmedCount}</span>
              <span className="metric-label">Confirmed Slots</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-icon bg-rose">💰</div>
            <div className="metric-data">
              <span className="metric-num">${estimatedRevenue}</span>
              <span className="metric-label">Confirmed Revenue</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="admin-recent-section">
          <div className="section-title-bar">
            <h3>Recent Booking Requests</h3>
            <Link to="/admin/appointments" className="view-all-link">
              View &amp; Filter All Bookings →
            </Link>
          </div>

          <div className="grid-2">
            {recentAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isAdminView={true}
                onStatusChange={updateAppointmentStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
