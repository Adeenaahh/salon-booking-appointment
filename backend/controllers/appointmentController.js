import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';

// Standard salon operating hours time slots
export const SALON_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
];

/**
 * @desc    Check available and occupied time slots for a specific date
 * @route   GET /api/appointments/available-slots
 * @access  Public
 */
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date in YYYY-MM-DD format as a query parameter (?date=YYYY-MM-DD).'
      });
    }

    // Find all active appointments on this date
    // Note: Cancelled or rejected bookings release their time slots
    const activeBookings = await Appointment.find({
      appointmentDate: date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime');

    const bookedSlots = activeBookings.map(b => b.startTime);
    const availableSlots = SALON_TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      date,
      allSlots: SALON_TIME_SLOTS,
      bookedSlots,
      availableSlots
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Book a new salon appointment
 * @route   POST /api/appointments
 * @access  Private (Logged-in Customer)
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const { serviceId, appointmentDate, startTime, notes } = req.body;

    // 1. Validate required inputs
    if (!serviceId || !appointmentDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceId, appointmentDate, and startTime.'
      });
    }

    // 2. Validate salon service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'The selected salon service does not exist.'
      });
    }

    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This salon service is currently unavailable for booking.'
      });
    }

    // 3. Date validation - appointments cannot be made in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Appointments cannot be scheduled for past dates.'
      });
    }

    // 4. Time slot validation - must be within operating hours
    if (!SALON_TIME_SLOTS.includes(startTime)) {
      return res.status(400).json({
        success: false,
        message: `Invalid time slot. Please choose from salon operating hours: ${SALON_TIME_SLOTS.join(', ')}`
      });
    }

    // 5. Overlap prevention: verify slot is not occupied by an active appointment
    const conflictingBooking = await Appointment.findOne({
      appointmentDate,
      startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time slot.'
      });
    }

    // 6. Create appointment
    const appointment = await Appointment.create({
      customerId: req.user._id,
      serviceId: service._id,
      appointmentDate,
      startTime,
      notes: notes ? notes.trim() : '',
      status: 'pending'
    });

    // Populate service and customer info for immediate frontend display
    await appointment.populate('serviceId', 'name price duration image category');
    await appointment.populate('customerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Appointment booking request received. Status: Pending Confirmation.',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get appointments for the logged-in customer (Data isolation)
 * @route   GET /api/appointments/my
 * @access  Private (Customer)
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ customerId: req.user._id })
      .populate('serviceId', 'name price duration image category')
      .sort({ appointmentDate: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments (Admin only, with filters)
 * @route   GET /api/appointments
 * @access  Private / Admin
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.appointmentDate = date;
    }

    const appointments = await Appointment.find(query)
      .populate('customerId', 'name email')
      .populate('serviceId', 'name price duration category image')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single appointment details
 * @route   GET /api/appointments/:id
 * @access  Private (Owner or Admin)
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('serviceId', 'name price duration description image category');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Role check: Only owner or admin can view
    const isOwner = appointment.customerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own appointments.'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment status (Confirm, Reject, Cancel)
 * @route   PATCH /api/appointments/:id/status
 * @access  Private / Admin
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    appointment.status = status;
    const updated = await appointment.save();

    await updated.populate('customerId', 'name email');
    await updated.populate('serviceId', 'name price duration');

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel personal appointment by customer
 * @route   PATCH /api/appointments/:id/cancel
 * @access  Private (Customer Owner)
 */
export const cancelMyAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Verify ownership
    if (appointment.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own appointments.'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment is already cancelled.'
      });
    }

    appointment.status = 'cancelled';
    const updated = await appointment.save();

    await updated.populate('serviceId', 'name price duration');

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. The time slot has been released.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
