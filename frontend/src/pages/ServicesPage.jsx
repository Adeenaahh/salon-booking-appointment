import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import ServiceCard from '../components/ServiceCard';
import './ServicesPage.css';

export default function ServicesPage() {
  const { services } = useDemo();
  // Category state defaults to 'All'
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Search query state for searching by service name
  const [searchQuery, setSearchQuery] = useState('');

  // Required category buttons
  const categories = ['All', 'Hair', 'Skincare', 'Nail Care', 'Makeup'];

  // Explicit handler to set selected category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Reset both category and search query
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  // Combined filtering logic: category selection and search query work together
  const filteredServices = (services || []).filter(service => {
    if (!service) return false;

    // 1. Category Matching Logic
    // If selectedCategory is "All", match all services
    const isAll = !selectedCategory || selectedCategory.trim().toLowerCase() === 'all';

    let matchesCategory = false;
    if (isAll) {
      matchesCategory = true;
    } else {
      const selectedLower = selectedCategory.trim().toLowerCase();
      const serviceCatLower = (service.category || '').trim().toLowerCase();

      matchesCategory =
        serviceCatLower === selectedLower ||
        (selectedLower === 'hair' && serviceCatLower.includes('hair')) ||
        (selectedLower === 'skincare' && serviceCatLower.includes('skin')) ||
        (selectedLower === 'nail care' && serviceCatLower.includes('nail')) ||
        (selectedLower === 'makeup' && serviceCatLower.includes('makeup'));
    }

    // 2. Search Query Matching Logic (searches by service name)
    const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const serviceName = (service.name || '').toLowerCase();
    const serviceDesc = (service.description || '').toLowerCase();

    const matchesSearch =
      query === '' ||
      serviceName.includes(query) ||
      serviceDesc.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-page">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div className="container">
          <span className="section-subtitle">OUR TREATMENT CATALOG</span>
          <h1>Salon &amp; Spa Services</h1>
          <p>Indulge in our tailored collection of luxury treatments, designed to nurture your hair, skin, and spirit.</p>
        </div>
      </div>

      <div className="container section-padding">
        {/* Controls Section: Search Bar & Category Filters Above Service Cards */}
        <div className="services-filter-panel card">
          {/* 1. Search Bar */}
          <div className="search-bar-row">
            <label htmlFor="service-search" className="search-bar-label">
              Search Services
            </label>
            <div className="search-input-container">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                id="service-search"
                type="text"
                placeholder="Search services by name (e.g. Keratin, Facial, Manicure, Makeup)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="service-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search text"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. Category Filter Buttons: All, Hair, Skincare, Nail Care, and Makeup */}
          <div className="category-filter-row">
            <span className="category-filter-label">Filter by Category:</span>
            <div className="category-buttons-group" role="group" aria-label="Filter services by category">
              {categories.map(category => {
                const isActive =
                  selectedCategory.trim().toLowerCase() === category.trim().toLowerCase();
                return (
                  <button
                    key={category}
                    type="button"
                    className={`category-filter-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                    aria-pressed={isActive}
                    data-category={category}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Feedback & Reset */}
          <div className="filter-status-row">
            <span className="results-count-text">
              Showing <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? 'service' : 'services'}
              {selectedCategory.trim().toLowerCase() !== 'all' && (
                <span> in <strong>{selectedCategory}</strong></span>
              )}
              {searchQuery.trim() !== '' && (
                <span> matching "<strong>{searchQuery}</strong>"</span>
              )}
            </span>

            {(selectedCategory.trim().toLowerCase() !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                className="btn btn-sm btn-outline clear-all-btn"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 3. Service Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid-3 services-grid">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <span className="empty-icon">🍃</span>
            <h3>No Services Found</h3>
            <p>
              No salon treatments match your search for "{searchQuery}" in "{selectedCategory}".
            </p>
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              Show All Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
