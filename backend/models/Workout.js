import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  // Referência ao exercício (novo formato)
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  },
  // Dados do exercício (para compatibilidade)
  exerciseData: {
    type: mongoose.Schema.Types.Mixed
  },
  // Nome do exercício (formato antigo - ainda aceito)
  name: {
    type: String
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
