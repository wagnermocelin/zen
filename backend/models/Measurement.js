import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Dados Básicos
  weight: Number,
  height: Number,
  
  // Calculados
  imc: Number,
  bodyFat: Number,
  fatMass: Number,
  leanMass: Number,
  waistHipRatio: Number,
  bodyDensity: Number,
  skinFoldSum: Number,
  armMuscleArea: Number,
  armFatArea: Number,
  
  // Circunferências
  shoulders: Number,
  chest: Number,
  waist: Number,
  abdomen: Number,
  hip: Number,
  calfLeft: Number,
  calfRight: Number,
  thighLeft: Number,
  thighRight: Number,
  proximalThighLeft: Number,
  proximalThighRight: Number,
  relaxedArmLeft: Number,
  relaxedArmRight: Number,
  contractedArmLeft: Number,
  contractedArmRight: Number,
  
  // Pregas Cutâneas
  bicepsFold: Number,
  tricepsFold: Number,
  midAxillaryFold: Number,
  chestFold: Number,
  abdominalFold: Number,
  subscapularFold: Number,
  thighFold: Number,
  
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Measurement = mongoose.model('Measurement', measurementSchema);

export default Measurement;
