import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do exercício é obrigatório'],
    trim: true
  },
  category: {
    type: String,
    enum: ['peito', 'costas', 'pernas', 'ombros', 'biceps', 'triceps', 'abdomen', 'cardio', 'funcional', 'outro'],
    default: 'outro'
  },
  muscleGroup: {
    type: String,
    enum: ['peitoral', 'dorsal', 'quadriceps', 'posterior', 'gluteos', 'deltoides', 'biceps', 'triceps', 'abdominais', 'panturrilhas', 'trapezio', 'antebracos', 'cardio', 'corpo-inteiro'],
    required: true
  },
  equipment: {
    type: String,
    enum: ['barra', 'halteres', 'maquina', 'cabo', 'peso-corporal', 'elastico', 'kettlebell', 'medicine-ball', 'nenhum'],
    default: 'nenhum'
  },
  difficulty: {
    type: String,
    enum: ['iniciante', 'intermediario', 'avancado'],
    default: 'intermediario'
  },
  description: {
    type: String,
    default: ''
  },
  instructions: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  // Indica se é um exercício padrão ou customizado pelo trainer
  isCustom: {
    type: Boolean,
    default: false
  },
  // Se for customizado, referência ao trainer que criou
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Tags para facilitar busca
  tags: [{
    type: String,
    lowercase: true
  }],
  // Exercícios comuns/favoritos aparecem primeiro
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para busca rápida
exerciseSchema.index({ name: 'text', tags: 'text' });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ muscleGroup: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ popular: -1 });
exerciseSchema.index({ trainer: 1 });

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
