import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a salon service name'],
      trim: true,
      minlength: [3, 'Service name must be at least 3 characters long'],
      maxlength: [100, 'Service name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Please specify a service category'],
      enum: {
        values: ['Hair', 'Skincare', 'Nail Care', 'Makeup', 'Body & Spa'],
        message: '{VALUE} is not a supported category'
      },
      default: 'Hair'
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the treatment'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a service price'],
      min: [0, 'Service price cannot be negative']
    },
    duration: {
      type: Number,
      required: [true, 'Please specify service duration in minutes'],
      min: [15, 'Service duration must be at least 15 minutes']
    },
    image: {
      type: String,
      required: [true, 'Please provide a service image URL'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for quick queries
serviceSchema.index({ isActive: 1, category: 1, name: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
