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
  },
  // Configurações de Email
  emailConfig: {
    enabled: {
      type: Boolean,
      default: true
    },
    provider: {
      type: String,
      enum: ['ethereal', 'gmail', 'smtp', 'sendgrid'],
      default: 'ethereal'
    },
    smtpHost: {
      type: String,
      default: ''
    },
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpSecure: {
      type: Boolean,
      default: false
    },
    smtpUser: {
      type: String,
      default: '',
      select: false // Não retornar por padrão por segurança
    },
    smtpPassword: {
      type: String,
      default: '',
      select: false // Não retornar por padrão por segurança
    },
    fromEmail: {
      type: String,
      default: 'noreply@zen.com'
    },
    fromName: {
      type: String,
      default: 'Zen Personal Trainer'
    },
    // Templates de Email
    emailTemplates: {
      welcomeSubject: {
        type: String,
        default: 'Bem-vindo ao Zen - Ative sua conta'
      },
      welcomeEnabled: {
        type: Boolean,
        default: true
      },
      resetPasswordSubject: {
        type: String,
        default: 'Redefinir Senha - Zen Personal Trainer'
      },
      resetPasswordEnabled: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

const Config = mongoose.model('Config', configSchema);

export default Config;
