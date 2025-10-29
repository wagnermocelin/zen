import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';
import Exercise from '../models/Exercise.js';

dotenv.config();

const migrateFoodsAndExercises = async () => {
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   MIGRAÇÃO: Foods & Exercises (TEST → PRODUÇÃO)       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI não está definida no arquivo .env');
    }
    
    // Extrair o nome do banco da URI
    let currentDb = 'zen-personal-trainer';
    const match = mongoUri.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) {
      currentDb = match[1];
    }
    
    console.log('📋 Informações:');
    console.log(`   Database origem: test`);
    console.log(`   Database destino: ${currentDb}\n`);

    // ========== FASE 1: EXPORTAR DA TEST ==========
    const testUri = mongoUri.replace(`/${currentDb}`, '/test');
    console.log('🔌 Conectando à database TEST...');
    await mongoose.connect(testUri);
    console.log('✅ Conectado à database TEST');
    console.log(`   Database: ${mongoose.connection.name}\n`);

    console.log('📤 Exportando dados da database TEST...\n');
    
    // Exportar Foods
    const foods = await Food.find({}).lean();
    console.log(`   ✅ Foods: ${foods.length} documentos exportados`);
    
    const tacoFoods = foods.filter(f => !f.isCustom).length;
    const customFoods = foods.filter(f => f.isCustom).length;
    console.log(`      - TACO: ${tacoFoods} alimentos`);
    console.log(`      - Customizados: ${customFoods} alimentos`);
    
    // Exportar Exercises
    const exercises = await Exercise.find({}).lean();
    console.log(`\n   ✅ Exercises: ${exercises.length} documentos exportados`);
    
    const defaultExercises = exercises.filter(e => !e.isCustom).length;
    const customExercises = exercises.filter(e => e.isCustom).length;
    console.log(`      - Padrão: ${defaultExercises} exercícios`);
    console.log(`      - Customizados: ${customExercises} exercícios`);

    console.log(`\n📊 Total exportado: ${foods.length + exercises.length} documentos\n`);

    // Desconectar da TEST
    await mongoose.disconnect();
    console.log('🔌 Desconectado da database TEST\n');

    // ========== FASE 2: IMPORTAR PARA PRODUÇÃO ==========
    console.log(`🔌 Conectando à database de PRODUÇÃO (${currentDb})...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado à database de PRODUÇÃO\n');

    console.log('⚠️  ATENÇÃO: Esta operação irá:');
    console.log('   1. APAGAR todos os alimentos da database de produção');
    console.log('   2. APAGAR todos os exercícios da database de produção');
    console.log('   3. IMPORTAR os dados da database test');
    console.log('   4. Esta ação NÃO PODE SER DESFEITA!\n');

    console.log('📥 Importando dados para database de PRODUÇÃO...\n');

    // Importar Foods
    console.log('   🗑️  Limpando collection Foods...');
    await Food.deleteMany({});
    console.log('   ✅ Collection Foods limpa');
    
    console.log('   📥 Inserindo alimentos...');
    await Food.insertMany(foods);
    console.log(`   ✅ ${foods.length} alimentos importados`);
    console.log(`      - TACO: ${tacoFoods} alimentos`);
    console.log(`      - Customizados: ${customFoods} alimentos`);

    // Importar Exercises
    console.log('\n   🗑️  Limpando collection Exercises...');
    await Exercise.deleteMany({});
    console.log('   ✅ Collection Exercises limpa');
    
    console.log('   📥 Inserindo exercícios...');
    await Exercise.insertMany(exercises);
    console.log(`   ✅ ${exercises.length} exercícios importados`);
    console.log(`      - Padrão: ${defaultExercises} exercícios`);
    console.log(`      - Customizados: ${customExercises} exercícios`);

    console.log('\n📊 Resumo da migração:');
    console.log(`   ✅ Alimentos importados: ${foods.length}`);
    console.log(`   ✅ Exercícios importados: ${exercises.length}`);
    console.log(`   ✅ Total: ${foods.length + exercises.length} documentos`);

    // Verificar dados importados
    console.log('\n🔍 Verificando dados importados...');
    const verifyFoods = await Food.countDocuments();
    const verifyExercises = await Exercise.countDocuments();
    console.log(`   ✅ Foods na produção: ${verifyFoods}`);
    console.log(`   ✅ Exercises na produção: ${verifyExercises}`);

    console.log('\n🎉 Migração concluída com sucesso!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateFoodsAndExercises();
