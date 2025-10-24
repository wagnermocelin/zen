import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetPassword = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado ao MongoDB');

    // Buscar o usuário Wagner
    const user = await User.findOne({ email: 'wagner@zen.com' });
    
    if (!user) {
      console.log('❌ Usuário wagner@zen.com não encontrado!');
      process.exit(1);
    }

    console.log('👤 Usuário encontrado:', user.name);
    console.log('📧 Email:', user.email);
    
    // Resetar a senha para "senha123"
    user.password = 'senha123';
    await user.save();

    console.log('✅ Senha resetada com sucesso!');
    console.log('🔑 Nova senha: senha123');
    console.log('\n✅ Agora você pode fazer login com:');
    console.log('   Email: wagner@zen.com');
    console.log('   Senha: senha123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

resetPassword();
