import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';

// 404 Fallback
function NotFoundPage() {
  return (
    <div className="container section-padding">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🌸</span>
        <h2>Page Not Found</h2>
        <p style={{ margin: '1rem 0 1.5rem 0' }}>The salon page you are looking for does not exist or has been relocated.</p>
        <Link to="/" className="btn btn-primary">Return to Home Sanctuary</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/book" element={<BookingPage />} />

              {/* Customer Portal */}
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />

              {/* Admin Portal */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DemoProvider>
  );
}
