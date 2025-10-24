import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createWagner = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado ao MongoDB');

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: 'wagner@zen.com' });
    
    if (existingUser) {
      console.log('⚠️  Usuário wagner@zen.com já existe!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Nome:', existingUser.name);
      console.log('🎭 Role:', existingUser.role);
      console.log('📊 Status:', existingUser.status);
      process.exit(0);
    }

    // Criar o usuário Wagner
    const wagner = await User.create({
      name: 'Wagner Mocelin',
      email: 'wagner@zen.com',
      password: 'senha123',
      role: 'trainer',
      status: 'active'
    });

    console.log('🎉 Usuário Wagner criado com sucesso!');
    console.log('📧 Email:', wagner.email);
    console.log('👤 Nome:', wagner.name);
    console.log('🎭 Role:', wagner.role);
    console.log('🔑 Senha: senha123');
    console.log('\n✅ Agora você pode fazer login no sistema!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    process.exit(1);
  }
};

createWagner();
