import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="footer-icon">🌸</span>
            <span className="footer-title">GLAMOUR HAVEN</span>
          </div>
          <p className="footer-desc">
            Your sanctuary for bespoke hair design, restorative skincare, and luxurious spa rituals. Experience elegance, relaxation, and radiant beauty.
          </p>
          <div className="footer-socials">
            <span className="social-pill">Instagram</span>
            <span className="social-pill">Facebook</span>
            <span className="social-pill">Pinterest</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Sanctuary</Link></li>
            <li><Link to="/services">Salon Services & Pricing</Link></li>
            <li><Link to="/book">Book an Appointment</Link></li>
            <li><Link to="/dashboard">Customer Dashboard</Link></li>
            <li><Link to="/admin">Staff Admin Portal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Salon Hours</h4>
          <ul className="footer-hours">
            <li><span>Monday – Friday:</span> <strong>9:00 AM – 7:00 PM</strong></li>
            <li><span>Saturday:</span> <strong>9:00 AM – 6:00 PM</strong></li>
            <li><span>Sunday:</span> <strong>10:00 AM – 4:00 PM</strong></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Visit Us</h4>
          <address className="footer-address">
            <p>📍 742 Evergreen Rose Boulevard, Suite 100</p>
            <p>Beverly Hills, CA 90210</p>
            <p>📞 Phone: (555) 321-4321</p>
            <p>✉️ Email: concierge@glamourhaven.com</p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Glamour Haven Salon & Spa. All Rights Reserved.</p>
          <p className="footer-exam-tag">Full Stack Development Skill Exam • MERN Stack Architecture</p>
        </div>
      </div>
    </footer>
  );
}
