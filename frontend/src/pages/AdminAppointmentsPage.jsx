import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import AppointmentCard from '../components/AppointmentCard';
import './AdminPages.css';

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus, currentUser, loginAsAdmin } = useDemo();

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="container section-padding">
        <div className="card admin-restricted-card">
          <span className="restricted-icon">🛑</span>
          <h2>Admin Authorization Required</h2>
          <p>You must be signed in as an Administrator to view and update customer appointments.</p>
          <button className="btn btn-primary" onClick={loginAsAdmin}>
            Switch to Admin Role
          </button>
        </div>
      </div>
    );
  }

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.appointmentDate === dateFilter;
    const matchesSearch = !searchCustomer ||
      apt.customerName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      apt.customerEmail.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchCustomer.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div className="admin-page section-padding">
      <div className="container">
        {/* Header */}
        <div className="admin-header-card card">
          <div>
            <div className="admin-breadcrumb">
              <Link to="/admin">Admin Console</Link> <span>/</span> All Bookings
            </div>
            <h2>Salon Appointments Roster</h2>
            <p>Review customer booking requests, verify slot availability, and manage status.</p>
          </div>
          <Link to="/book" className="btn btn-secondary">
            + Walk-in Booking
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="card admin-filters-card">
          <div className="admin-filter-group">
            <label className="filter-label">Filter by Status:</label>
            <div className="status-pills">
              {['all', 'pending', 'confirmed', 'rejected', 'cancelled'].map(status => (
                <button
                  key={status}
                  className={`status-filter-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-filter-inputs">
            <div className="filter-input-wrap">
              <label className="filter-label">Search Client / Service:</label>
              <input
                type="text"
                placeholder="e.g. Jenkins, Facial..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="filter-input-wrap">
              <label className="filter-label">Filter by Date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-input"
              />
            </div>

            {(statusFilter !== 'all' || dateFilter || searchCustomer) && (
              <button
                className="btn btn-sm btn-secondary reset-filter-btn"
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('');
                  setSearchCustomer('');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="grid-2">
            {filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isAdminView={true}
                onStatusChange={updateAppointmentStatus}
              />
            ))}
          </div>
        ) : (
          <div className="card empty-filter-state">
            <span className="empty-filter-icon">🔍</span>
            <h3>No Appointments Match Your Filters</h3>
            <p>Try clearing your date or status criteria to view more records.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('');
                setSearchCustomer('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
