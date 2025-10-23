import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  time: String,
  name: String,
  foods: String
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
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  meals: [mealSchema],
  notes: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Diet = mongoose.model('Diet', dietSchema);

export default Diet;
