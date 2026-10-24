import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import './AuthForms.css';

export default function LoginPage() {
  const { loginAsCustomer, loginAsAdmin, setCurrentUser } = useDemo();
  const [roleMode, setRoleMode] = useState('customer'); // 'customer' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDemoFill = (role) => {
    if (role === 'customer') {
      setEmail('sarah.jenkins@example.com');
      setPassword('password123');
      setRoleMode('customer');
    } else {
      setEmail('admin@glamourhaven.com');
      setPassword('AdminPass2026!');
      setRoleMode('admin');
    }
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (roleMode === 'admin') {
      loginAsAdmin();
      navigate('/admin');
    } else {
      loginAsCustomer();
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page section-padding">
      <div className="container">
        <div className="card auth-card">
          <div className="auth-header">
            <span className="auth-brand-icon">🌸</span>
            <h2>Welcome Back</h2>
            <p>Sign in to manage your appointments or salon operations</p>
          </div>

          {/* Role selector tab */}
          <div className="role-tab-group">
            <button
              type="button"
              className={`role-tab ${roleMode === 'customer' ? 'active' : ''}`}
              onClick={() => { setRoleMode('customer'); setError(''); }}
            >
              Client Login
            </button>
            <button
              type="button"
              className={`role-tab ${roleMode === 'admin' ? 'active' : ''}`}
              onClick={() => { setRoleMode('admin'); setError(''); }}
            >
              Admin Staff Login
            </button>
          </div>

          {error && <div className="auth-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder={roleMode === 'admin' ? 'admin@glamourhaven.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {roleMode === 'admin' ? 'Log In as Salon Admin' : 'Log In to My Account'}
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="demo-credentials-helper">
            <span className="helper-title">⚡ Quick Demo Autofill:</span>
            <div className="helper-buttons">
              <button 
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleDemoFill('customer')}
              >
                Autofill Customer
              </button>
              <button 
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleDemoFill('admin')}
              >
                Autofill Admin
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              New to Glamour Haven?{' '}
              <Link to="/register" className="auth-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
