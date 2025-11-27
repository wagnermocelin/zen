import mongoose from 'mongoose';

const wellhubUserSchema = new mongoose.Schema({
  // ID do usuário no Wellhub
  gympassUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Referência ao aluno no sistema
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  // Dados do Wellhub
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    enum: ['web', 'android', 'ios'],
    default: 'web'
  },
  userStatus: {
    type: String, // 1: basic, 2: premium, etc
    default: '1'
  },
  countryCode: {
    type: String,
    lowercase: true,
    length: 2
  },
  // Status do registro
  registrationStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  // Check-ins
  checkIns: [{
    date: {
      type: Date,
      default: Date.now
    },
    origin: String,
    notes: String
  }],
  // Metadata
  lastCheckIn: {
    type: Date
  },
  totalCheckIns: {
    type: Number,
    default: 0
  },
  // Trainer responsável
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices
wellhubUserSchema.index({ trainer: 1, registrationStatus: 1 });
wellhubUserSchema.index({ student: 1 });
wellhubUserSchema.index({ email: 1 });

// Método para registrar check-in
wellhubUserSchema.methods.addCheckIn = function(origin, notes) {
  this.checkIns.push({
    date: new Date(),
    origin: origin || 'web',
    notes: notes || ''
  });
  this.lastCheckIn = new Date();
  this.totalCheckIns = this.checkIns.length;
  return this.save();
};

const WellhubUser = mongoose.model('WellhubUser', wellhubUserSchema);

export default WellhubUser;
