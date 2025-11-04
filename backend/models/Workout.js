import mongoose from 'mongoose';

// Schema para cada série individual
const setSchema = new mongoose.Schema({
  reps: String,
  weight: String,
  rest: String
}, { _id: false });

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
  // Sets pode ser array de objetos (novo) ou string (antigo)
  sets: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  // Campos antigos (ainda aceitos)
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
