import express from 'express';
import {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelMyAppointment
} from '../controllers/appointmentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public availability check
router.get('/available-slots', getAvailableSlots);

// Customer appointment operations
router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/cancel', protect, cancelMyAppointment);

// Admin appointment operations
router.get('/', protect, adminOnly, getAllAppointments);
router.patch('/:id/status', protect, adminOnly, updateAppointmentStatus);

// Shared single appointment view (owner or admin)
router.get('/:id', protect, getAppointmentById);

export default router;
