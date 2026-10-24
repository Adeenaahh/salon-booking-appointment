import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

export default function ServiceCard({ service, isAdminView = false, onEdit, onDelete, onBook }) {
  const { id, name, category, price, duration, image, description, isActive } = service;

  return (
    <div className={`card service-card ${!isActive ? 'service-inactive' : ''}`}>
      <div className="service-image-container">
        <img src={image} alt={name} className="service-image" loading="lazy" />
        <span className="service-duration-badge">⏱ {duration} mins</span>
        {category && <span className="service-category-badge">{category}</span>}
      </div>

      <div className="service-card-body">
        <div className="service-card-header">
          <h3 className="service-title">{name}</h3>
          <span className="service-price">${price}</span>
        </div>

        <p className="service-description">{description}</p>

        <div className="service-card-footer">
          {isAdminView ? (
            <div className="admin-card-actions">
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit(service)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(id)}
              >
                🗑️ Delete
              </button>
            </div>
          ) : (
            <Link 
              to={`/book?serviceId=${id}`}
              className="btn btn-primary btn-block"
            >
              Book Service
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
