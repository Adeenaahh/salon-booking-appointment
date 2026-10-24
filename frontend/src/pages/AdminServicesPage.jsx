import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import ServiceCard from '../components/ServiceCard';
import Modal from '../components/Modal';
import './AdminPages.css';

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService, currentUser, loginAsAdmin } = useDemo();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hair');
  const [price, setPrice] = useState(65);
  const [duration, setDuration] = useState(60);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="container section-padding">
        <div className="card admin-restricted-card">
          <span className="restricted-icon">🛑</span>
          <h2>Admin Authorization Required</h2>
          <p>You must be signed in as an Administrator to manage salon services.</p>
          <button className="btn btn-primary" onClick={loginAsAdmin}>
            Switch to Admin Role
          </button>
        </div>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingServiceId(null);
    setName('');
    setCategory('Hair');
    setPrice(65);
    setDuration(60);
    setImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingServiceId(service.id);
    setName(service.name);
    setCategory(service.category || 'Hair');
    setPrice(service.price);
    setDuration(service.duration);
    setImage(service.image);
    setDescription(service.description);
    setIsActive(service.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const serviceData = {
      name,
      category,
      price: Number(price),
      duration: Number(duration),
      image,
      description,
      isActive
    };

    if (editingServiceId) {
      updateService(editingServiceId, serviceData);
    } else {
      addService(serviceData);
    }

    setIsModalOpen(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Are you sure you want to delete this service from the salon catalog?")) {
      deleteService(id);
    }
  };

  return (
    <div className="admin-page section-padding">
      <div className="container">
        {/* Navigation Breadcrumb & Header */}
        <div className="admin-header-card card">
          <div>
            <div className="admin-breadcrumb">
              <Link to="/admin">Admin Console</Link> <span>/</span> Services Management
            </div>
            <h2>Salon Treatment Catalog</h2>
            <p>Create, update prices and durations, or remove salon services.</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add New Service
          </button>
        </div>

        {/* Services Grid with Admin Controls */}
        <div className="grid-3 services-grid">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              isAdminView={true}
              onEdit={openEditModal}
              onDelete={handleDeleteService}
            />
          ))}
        </div>

        {/* Add / Edit Service Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingServiceId ? 'Edit Salon Treatment' : 'Add New Salon Treatment'}
        >
          <form onSubmit={handleSaveService} className="admin-service-form">
            <div className="form-group">
              <label className="form-label">Service Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Royal Gold Facial"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Hair">Hair</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Nail Care">Nail Care</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price ($ USD)</label>
                <input
                  type="number"
                  min="5"
                  required
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input
                  type="number"
                  step="15"
                  min="15"
                  required
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                required
                placeholder="Describe the inclusions, botanical oils, and customer benefits..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Active Service (Visible to customers on the website)</span>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingServiceId ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
