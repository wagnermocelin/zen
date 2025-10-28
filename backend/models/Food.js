import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do alimento é obrigatório'],
    trim: true
  },
  category: {
    type: String,
    enum: ['proteina', 'carboidrato', 'vegetal', 'fruta', 'gordura', 'lacteo', 'bebida', 'outro'],
    default: 'outro'
  },
  // Valores nutricionais por 100g
  serving: {
    amount: {
      type: Number,
      default: 100
    },
    unit: {
      type: String,
      enum: ['g', 'ml', 'unidade', 'colher', 'xícara'],
      default: 'g'
    }
  },
  calories: {
    type: Number,
    required: [true, 'Calorias são obrigatórias'],
    min: 0
  },
  protein: {
    type: Number,
    required: [true, 'Proteínas são obrigatórias'],
    min: 0
  },
  carbs: {
    type: Number,
    required: [true, 'Carboidratos são obrigatórios'],
    min: 0
  },
  fat: {
    type: Number,
    required: [true, 'Gorduras são obrigatórias'],
    min: 0
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0
  },
  // Indica se é um alimento padrão (TACO) ou customizado pelo trainer
  isCustom: {
    type: Boolean,
    default: false
  },
  // Se for customizado, referência ao trainer que criou
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Fonte dos dados (TACO, USDA, Manual, etc)
  source: {
    type: String,
    default: 'TACO'
  },
  // Tags para facilitar busca
  tags: [{
    type: String,
    lowercase: true
  }],
  // Alimentos comuns/favoritos aparecem primeiro
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para busca rápida
foodSchema.index({ name: 'text', tags: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ popular: -1 });
foodSchema.index({ trainer: 1 });

// Método para calcular macros para uma quantidade específica
foodSchema.methods.calculateMacros = function(amount, unit = 'g') {
  // Converter para 100g base
  let multiplier = amount / 100;
  
  // Se a unidade for diferente, ajustar
  if (unit !== this.serving.unit) {
    // Aqui poderia ter conversões mais complexas
    // Por enquanto, assume que a quantidade já está correta
  }
  
  return {
    calories: Math.round(this.calories * multiplier),
    protein: Math.round(this.protein * multiplier * 10) / 10,
    carbs: Math.round(this.carbs * multiplier * 10) / 10,
    fat: Math.round(this.fat * multiplier * 10) / 10,
    fiber: Math.round(this.fiber * multiplier * 10) / 10
  };
};

const Food = mongoose.model('Food', foodSchema);

export default Food;
