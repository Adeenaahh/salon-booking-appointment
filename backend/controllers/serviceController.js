import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';

/**
 * @desc    Get all salon services (with category and active filter)
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res, next) => {
  try {
    const { category, search, all } = req.query;

    const query = {};

    // By default, public endpoint only returns active services
    // Only return inactive if specifically requested by admin
    if (all !== 'true' || !req.user || req.user.role !== 'admin') {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Salon service not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new salon service
 * @route   POST /api/services
 * @access  Private / Admin
 */
export const createService = async (req, res, next) => {
  try {
    const { name, category, description, price, duration, image, isActive } = req.body;

    // Validation
    if (!name || !description || price === undefined || !duration || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, duration, and image.'
      });
    }

    const service = await Service.create({
      name: name.trim(),
      category: category || 'Hair',
      description: description.trim(),
      price: Number(price),
      duration: Number(duration),
      image: image.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({
      success: true,
      message: 'Salon service created successfully.',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing salon service
 * @route   PUT /api/services/:id
 * @access  Private / Admin
 */
export const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Salon service not found.'
      });
    }

    // Update fields
    const { name, category, description, price, duration, image, isActive } = req.body;

    service.name = name !== undefined ? name.trim() : service.name;
    service.category = category !== undefined ? category : service.category;
    service.description = description !== undefined ? description.trim() : service.description;
    service.price = price !== undefined ? Number(price) : service.price;
    service.duration = duration !== undefined ? Number(duration) : service.duration;
    service.image = image !== undefined ? image.trim() : service.image;
    service.isActive = isActive !== undefined ? Boolean(isActive) : service.isActive;

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: 'Salon service updated successfully.',
      data: updatedService
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a salon service
 * @route   DELETE /api/services/:id
 * @access  Private / Admin
 */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Salon service not found.'
      });
    }

    // Safety check: protect against deleting service with active upcoming appointments
    const activeAppointments = await Appointment.countDocuments({
      serviceId: service._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeAppointments > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete service: there are ${activeAppointments} active booking(s) for this service. You can toggle its status to inactive instead.`
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Salon service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
