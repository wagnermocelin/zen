import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Food from '../models/Food.js';
import connectDB from '../config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedFoodsFromJson = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Iniciando seed de alimentos da Tabela TACO completa...');
    
    // Ler arquivo JSON
    const jsonPath = join(__dirname, 'tacoComplete.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const foods = JSON.parse(jsonData);
    
    console.log(`📊 ${foods.length} alimentos carregados do arquivo JSON`);
    
    // Limpar alimentos padrão existentes
    await Food.deleteMany({ isCustom: false });
    console.log('🗑️  Alimentos padrão anteriores removidos');
    
    // Inserir novos alimentos
    const createdFoods = await Food.insertMany(foods);
    console.log(`✅ ${createdFoods.length} alimentos inseridos com sucesso!`);
    
    console.log('\n📊 Resumo por categoria:');
    const categories = await Food.aggregate([
      { $match: { isCustom: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} alimentos`);
    });
    
    // Estatísticas adicionais
    const popularCount = await Food.countDocuments({ isCustom: false, popular: true });
    console.log(`\n⭐ ${popularCount} alimentos marcados como populares`);
    
    console.log('\n🎉 Seed da Tabela TACO completa concluído com sucesso!');
    console.log('📚 Fonte: Tabela Brasileira de Composição de Alimentos - UNICAMP (4ª edição)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seedFoodsFromJson();
