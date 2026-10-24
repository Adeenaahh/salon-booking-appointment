import React, { createContext, useContext, useState } from 'react';
import { INITIAL_SERVICES, INITIAL_APPOINTMENTS, SALON_TIME_SLOTS } from '../data/mockData';

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  // Demo Users
  const customerUser = {
    id: "usr-cust-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    role: "customer"
  };

  const adminUser = {
    id: "usr-admin-1",
    name: "Salon Manager (Admin)",
    email: "admin@glamourhaven.com",
    role: "admin"
  };

  // State
  const [currentUser, setCurrentUser] = useState(customerUser); // default logged in as customer for instant preview
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Auth actions (Mock for Stage 2)
  const loginAsCustomer = () => {
    setCurrentUser(customerUser);
    showNotification("Logged in as Customer (Sarah Jenkins) for demo preview.");
  };

  const loginAsAdmin = () => {
    setCurrentUser(adminUser);
    showNotification("Logged in as Admin (Salon Manager) with admin privileges.");
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification("Logged out successfully.", "info");
  };

  const registerMock = (name, email) => {
    const newUser = {
      id: `usr-cust-${Date.now()}`,
      name,
      email,
      role: "customer"
    };
    setCurrentUser(newUser);
    showNotification(`Welcome, ${name}! Your account was created (Demo mode).`);
  };

  // Appointment actions
  const bookAppointment = (newBooking) => {
    const appointment = {
      id: `apt-${Date.now()}`,
      customerId: currentUser ? currentUser.id : "usr-cust-temp",
      customerName: currentUser ? currentUser.name : "Walk-in Guest",
      customerEmail: currentUser ? currentUser.email : "guest@example.com",
      status: "pending",
      createdAt: new Date().toISOString(),
      ...newBooking
    };
    setAppointments(prev => [appointment, ...prev]);
    showNotification("Appointment booked successfully! Status: Pending Approval.");
    return appointment;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt))
    );
    showNotification("Appointment has been cancelled.", "info");
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt))
    );
    showNotification(`Appointment marked as ${newStatus.toUpperCase()}.`);
  };

  // Service Management actions (Admin)
  const addService = (serviceData) => {
    const newService = {
      id: `srv-${Date.now()}`,
      isActive: true,
      ...serviceData
    };
    setServices(prev => [newService, ...prev]);
    showNotification(`Service "${newService.name}" created successfully!`);
  };

  const updateService = (id, updatedData) => {
    setServices(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, ...updatedData } : srv))
    );
    showNotification("Service updated successfully!");
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(srv => srv.id !== id));
    showNotification("Service deleted from salon catalog.", "info");
  };

  return (
    <DemoContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        registerMock,
        services,
        appointments,
        salonTimeSlots: SALON_TIME_SLOTS,
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        addService,
        updateService,
        deleteService,
        notification,
        showNotification
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
