import mongoose from 'mongoose';

// Schema para itens de alimentos em uma refeição
const foodItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['g', 'ml', 'unidade', 'colher', 'xícara'],
    default: 'g'
  },
  // Valores calculados no momento da adição (para histórico)
  calculatedMacros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
});

const mealSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Nova estrutura com banco de alimentos
  foodItems: [foodItemSchema],
  // Campo legado para compatibilidade (texto livre)
  foods: String,
  // Totais calculados da refeição
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }
});

const dietSchema = new mongoose.Schema({
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
  // Metas diárias
  goals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  // Totais calculados (soma de todas as refeições)
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  meals: [mealSchema],
  notes: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Status da dieta
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Método para recalcular totais da dieta
dietSchema.methods.calculateTotals = function() {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  this.meals.forEach(meal => {
    if (meal.totals) {
      totals.calories += meal.totals.calories || 0;
      totals.protein += meal.totals.protein || 0;
      totals.carbs += meal.totals.carbs || 0;
      totals.fat += meal.totals.fat || 0;
    }
  });

  this.totals = totals;
  return totals;
};

// Middleware para popular alimentos ao buscar
dietSchema.pre(/^find/, function() {
  this.populate('meals.foodItems.food');
});

const Diet = mongoose.model('Diet', dietSchema);

export default Diet;
