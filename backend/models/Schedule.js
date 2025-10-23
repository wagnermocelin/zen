import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  weekSchedule: {
    monday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    tuesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    wednesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    thursday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    friday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    saturday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    sunday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    }
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
