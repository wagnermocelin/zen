import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentDate: Date,
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  paymentMethod: String,
  notes: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
