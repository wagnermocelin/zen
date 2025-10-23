import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  gymName: {
    type: String,
    default: 'Zen'
  },
  logo: {
    type: String
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Config = mongoose.model('Config', configSchema);

export default Config;
