import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import AppointmentCard from '../components/AppointmentCard';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const { appointments, cancelAppointment, currentUser, loginAsCustomer } = useDemo();
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'history'

  // If not logged in as a customer, show prompt to log in or switch
  if (!currentUser) {
    return (
      <div className="container section-padding">
        <div className="card empty-auth-state">
          <span className="empty-auth-icon">🔒</span>
          <h2>Client Authentication Required</h2>
          <p>Please log in with your client account to view and manage your personal salon appointments.</p>
          <div className="empty-auth-actions">
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
            <button className="btn btn-secondary" onClick={loginAsCustomer}>
              Quick Demo: Log in as Sarah
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Strictly filter appointments for the current customer (Data isolation AC-02)
  const myAppointments = appointments.filter(apt => 
    apt.customerId === currentUser.id || apt.customerEmail === currentUser.email
  );

  const filteredAppointments = myAppointments.filter(apt => {
    if (filterTab === 'active') {
      return apt.status === 'pending' || apt.status === 'confirmed';
    }
    if (filterTab === 'history') {
      return apt.status === 'cancelled' || apt.status === 'rejected';
    }
    return true; // 'all'
  });

  const activeCount = myAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

  return (
    <div className="customer-dashboard section-padding">
      <div className="container">
        {/* Admin notice if previewing dashboard while in admin role */}
        {currentUser.role === 'admin' && (
          <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', backgroundColor: '#FFF5F6', border: '1.5px dashed var(--color-rose-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span>👑 <strong>Admin Portal Preview:</strong> You are currently signed in as Administrator. To view sample client bookings, switch to Customer mode.</span>
            <button className="btn btn-sm btn-primary" onClick={loginAsCustomer}>
              Switch to Sarah Jenkins (Customer)
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="dashboard-header card">
          <div className="header-greeting">
            <span className="greeting-eyebrow">🌸 CLIENT APPOINTMENT PORTAL</span>
            <h2>Welcome, {currentUser.name}</h2>
            <p>Track your upcoming treatments, review your salon history, and manage appointments.</p>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-title">Active Bookings</span>
            </div>
            <Link to="/book" className="btn btn-primary">
              + New Appointment
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`dash-tab ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            All Appointments ({myAppointments.length})
          </button>
          <button 
            className={`dash-tab ${filterTab === 'active' ? 'active' : ''}`}
            onClick={() => setFilterTab('active')}
          >
            Active &amp; Upcoming ({activeCount})
          </button>
          <button 
            className={`dash-tab ${filterTab === 'history' ? 'active' : ''}`}
            onClick={() => setFilterTab('history')}
          >
            Past &amp; Cancelled ({myAppointments.length - activeCount})
          </button>
        </div>

        {/* Appointment Cards List */}
        {filteredAppointments.length > 0 ? (
          <div className="grid-2 dashboard-grid">
            {filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isAdminView={false}
                onCancel={cancelAppointment}
              />
            ))}
          </div>
        ) : (
          <div className="card dashboard-empty">
            <span className="empty-flower">🌸</span>
            <h3>No Appointments In This View</h3>
            <p>You currently have no salon appointments categorized under this view.</p>
            <Link to="/book" className="btn btn-secondary">
              Book a Salon Experience
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
