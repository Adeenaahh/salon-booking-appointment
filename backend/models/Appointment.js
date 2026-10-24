import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An appointment must belong to a customer']
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'An appointment must specify a salon service']
    },
    appointmentDate: {
      type: String,
      required: [true, 'Please choose an appointment date (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD']
    },
    startTime: {
      type: String,
      required: [true, 'Please choose a salon time slot'],
      trim: true
    },
    endTime: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'rejected', 'cancelled'],
        message: '{VALUE} is not a valid appointment status'
      },
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Notes cannot exceed 300 characters']
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for rapid slot conflict lookups and customer queries
appointmentSchema.index({ appointmentDate: 1, startTime: 1, status: 1 });
appointmentSchema.index({ customerId: 1, appointmentDate: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
