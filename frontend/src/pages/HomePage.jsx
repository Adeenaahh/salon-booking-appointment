import React from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import ServiceCard from '../components/ServiceCard';
import './HomePage.css';

export default function HomePage() {
  const { services } = useDemo();
  const featuredServices = services.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">🌸 WELCOME TO GLAMOUR HAVEN</span>
            <h1 className="hero-title">
              Reveal Your Natural Radiance &amp; Timeless Elegance
            </h1>
            <p className="hero-description">
              Step into a luxury sanctuary where bespoke hair artistry, restorative botanical skincare, and rejuvenating spa therapies blend into an unforgettable self-care experience.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn btn-primary hero-btn">
                Book an Appointment
              </Link>
              <Link to="/services" className="btn btn-secondary hero-btn">
                Explore Services
              </Link>
            </div>
            <div className="hero-highlights">
              <div className="highlight-item">
                <span className="highlight-number">15+</span>
                <span className="highlight-label">Expert Stylists</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">4.9 ★</span>
                <span className="highlight-label">Client Rating</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">10k+</span>
                <span className="highlight-label">Happy Clients</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-frame">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" 
                alt="Luxury Salon Interior" 
                className="hero-main-img"
              />
              <div className="hero-floating-badge">
                <span className="floating-icon">✨</span>
                <div>
                  <strong>Book 24/7 Online</strong>
                  <p>Instant slot confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">THE GLAMOUR DIFFERENCE</span>
            <h2>Why Our Clients Cherish Our Sanctuary</h2>
            <p>Every detail of your visit is crafted to leave you feeling pampered, revitalized, and confident.</p>
          </div>

          <div className="grid-3 features-grid">
            <div className="card feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Organic &amp; Cruelty-Free</h3>
              <p>We strictly curate non-toxic botanical treatments, ammonia-free glazes, and clean beauty formulas for radiant results.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">✂️</div>
              <h3>Master Stylists &amp; Aestheticians</h3>
              <p>Our team holds international certifications with years of experience crafting personalized styles suited to you.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">💆‍♀️</div>
              <h3>Tranquil Spa Ambience</h3>
              <p>Sip rose tea in private treatment suites featuring soft ambient acoustics, heated massage chairs, and aromatherapy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">SIGNATURE EXPERIENCES</span>
            <h2>Our Most Beloved Treatments</h2>
            <p>Select from our award-winning rituals designed to elevate your everyday beauty.</p>
          </div>

          <div className="grid-3">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="featured-more-btn-wrap">
            <Link to="/services" className="btn btn-outline">
              View All Salon Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <span className="cta-tag">LIMITED APPOINTMENTS DAILY</span>
              <h2>Ready to Experience True Pampering?</h2>
              <p>Book your preferred salon service in less than 2 minutes. Choose your date, pick an open time slot, and leave the rest to our experts.</p>
              <Link to="/book" className="btn btn-primary cta-btn">
                Reserve Your Appointment Now 🌸
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
