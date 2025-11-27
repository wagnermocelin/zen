import mongoose from 'mongoose';

const wellhubTokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  expiresAt: {
    type: Number, // Timestamp em segundos
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Método para verificar se o token está expirado
wellhubTokenSchema.methods.isExpired = function() {
  const now = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
  return now >= this.expiresAt;
};

// Método estático para obter token válido
wellhubTokenSchema.statics.getValidToken = async function(trainerId) {
  const token = await this.findOne({
    trainer: trainerId,
    isActive: true
  }).sort({ createdAt: -1 });

  if (!token || token.isExpired()) {
    return null;
  }

  return token;
};

const WellhubToken = mongoose.model('WellhubToken', wellhubTokenSchema);

export default WellhubToken;
