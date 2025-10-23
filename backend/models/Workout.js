import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: String,
  reps: String,
  rest: String,
  notes: String
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do treino é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  exercises: [exerciseSchema],
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
