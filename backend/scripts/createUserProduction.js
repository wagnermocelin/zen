import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    // Usar a URL do MongoDB do Render (você precisa configurar no .env)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI não encontrado no .env');
      process.exit(1);
    }

    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Dados do usuário
    const userData = {
      name: 'Juliana Dolinski',
      email: 'juliana@zem.com',
      password: 'senha123', // Será criptografada
      role: 'professional'
    };

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('⚠️ Usuário já existe:', userData.email);
      process.exit(0);
    }

    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Criar usuário
    const user = await User.create(userData);
    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', userData.email);
    console.log('🔑 Senha: senha123');
    console.log('👤 Role:', userData.role);
    console.log('🆔 ID:', user._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createUser();
