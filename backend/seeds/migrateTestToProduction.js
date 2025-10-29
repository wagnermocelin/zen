import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Modelos
import User from '../models/User.js';
import Student from '../models/Student.js';
import Workout from '../models/Workout.js';
import Measurement from '../models/Measurement.js';
import Schedule from '../models/Schedule.js';
import Diet from '../models/Diet.js';
import Payment from '../models/Payment.js';
import Config from '../models/Config.js';
import Food from '../models/Food.js';
import Exercise from '../models/Exercise.js';

const migrateData = async () => {
  try {
    console.log('🔄 MIGRAÇÃO DE DADOS: test → produção\n');
    
    // Extrair a URI base e o nome do banco
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI não está definida no arquivo .env');
    }
    
    // Extrair o nome do banco da URI
    let currentDb = 'zen-personal-trainer'; // default
    const match = mongoUri.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) {
      currentDb = match[1];
    }
    
    console.log('📋 Informações:');
    console.log(`   URI Base: ${mongoUri.substring(0, 50)}...`);
    console.log(`   Database atual: ${currentDb}`);
    console.log(`   Database origem: test`);
    console.log(`   Database destino: ${currentDb}\n`);

    // Conectar à database TEST
    const testUri = mongoUri.replace(`/${currentDb}`, '/test');
    console.log('🔌 Conectando à database TEST...');
    await mongoose.connect(testUri);
    console.log('✅ Conectado à database TEST');
    console.log(`   Database: ${mongoose.connection.name}\n`);

    // Exportar dados da TEST
    console.log('📤 Exportando dados da database TEST...\n');
    
    const collections = {
      users: User,
      students: Student,
      workouts: Workout,
      measurements: Measurement,
      schedules: Schedule,
      diets: Diet,
      payments: Payment,
      configs: Config,
      foods: Food,
      exercises: Exercise
    };

    const exportedData = {};
    
    for (const [name, Model] of Object.entries(collections)) {
      // Incluir campos com select: false (como password)
      const data = await Model.find({}).select('+password +smtpPassword').lean();
      exportedData[name] = data;
      console.log(`   ✅ ${name}: ${data.length} documentos`);
    }

    console.log('\n📊 Total de documentos exportados:');
    const totalDocs = Object.values(exportedData).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`   ${totalDocs} documentos\n`);

    // Desconectar da TEST
    await mongoose.disconnect();
    console.log('🔌 Desconectado da database TEST\n');

    // Conectar à database de PRODUÇÃO
    console.log(`🔌 Conectando à database de PRODUÇÃO (${currentDb})...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado à database de PRODUÇÃO\n');

    // Perguntar confirmação
    console.log('⚠️  ATENÇÃO: Esta operação irá:');
    console.log('   1. APAGAR todos os dados da database de produção');
    console.log('   2. IMPORTAR os dados da database test');
    console.log('   3. Esta ação NÃO PODE SER DESFEITA!\n');

    // Importar dados para PRODUÇÃO
    console.log('📥 Importando dados para database de PRODUÇÃO...\n');

    let imported = 0;
    
    for (const [name, Model] of Object.entries(collections)) {
      const data = exportedData[name];
      
      if (data.length > 0) {
        // Limpar collection existente
        await Model.deleteMany({});
        console.log(`   🗑️  ${name}: collection limpa`);
        
        // Inserir novos dados
        await Model.insertMany(data);
        console.log(`   ✅ ${name}: ${data.length} documentos importados`);
        imported += data.length;
      } else {
        console.log(`   ⏭️  ${name}: nenhum documento para importar`);
      }
    }

    console.log('\n📊 Resumo da migração:');
    console.log(`   ✅ Documentos importados: ${imported}`);
    console.log(`   📦 Collections atualizadas: ${Object.keys(collections).length}`);

    console.log('\n🎉 Migração concluída com sucesso!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

// Executar migração
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   MIGRAÇÃO DE DADOS: TEST → PRODUÇÃO                  ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

migrateData();
