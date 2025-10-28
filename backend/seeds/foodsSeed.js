import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';
import connectDB from '../config/database.js';

dotenv.config();

// Alimentos baseados na Tabela TACO (valores por 100g)
const foods = [
  // PROTEÍNAS
  {
    name: 'Peito de Frango (grelhado)',
    category: 'proteina',
    calories: 165,
    protein: 31.0,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sodium: 63,
    popular: true,
    tags: ['frango', 'peito', 'grelhado', 'proteina']
  },
  {
    name: 'Filé de Tilápia (grelhado)',
    category: 'proteina',
    calories: 96,
    protein: 20.1,
    carbs: 0,
    fat: 1.5,
    fiber: 0,
    sodium: 50,
    popular: true,
    tags: ['peixe', 'tilapia', 'grelhado']
  },
  {
    name: 'Ovo de Galinha (cozido)',
    category: 'proteina',
    calories: 155,
    protein: 13.3,
    carbs: 1.1,
    fat: 10.8,
    fiber: 0,
    sodium: 140,
    popular: true,
    tags: ['ovo', 'cozido']
  },
  {
    name: 'Carne Bovina (patinho, grelhado)',
    category: 'proteina',
    calories: 163,
    protein: 28.0,
    carbs: 0,
    fat: 5.3,
    fiber: 0,
    sodium: 53,
    popular: true,
    tags: ['carne', 'boi', 'patinho', 'grelhado']
  },
  {
    name: 'Atum (em água, enlatado)',
    category: 'proteina',
    calories: 108,
    protein: 25.5,
    carbs: 0,
    fat: 0.8,
    fiber: 0,
    sodium: 247,
    popular: true,
    tags: ['atum', 'peixe', 'enlatado']
  },
  {
    name: 'Salmão (grelhado)',
    category: 'proteina',
    calories: 211,
    protein: 25.4,
    carbs: 0,
    fat: 11.7,
    fiber: 0,
    sodium: 59,
    popular: true,
    tags: ['salmao', 'peixe', 'grelhado']
  },

  // CARBOIDRATOS
  {
    name: 'Arroz Branco (cozido)',
    category: 'carboidrato',
    calories: 128,
    protein: 2.5,
    carbs: 28.1,
    fat: 0.2,
    fiber: 0.2,
    sodium: 1,
    popular: true,
    tags: ['arroz', 'branco', 'cozido']
  },
  {
    name: 'Arroz Integral (cozido)',
    category: 'carboidrato',
    calories: 124,
    protein: 2.6,
    carbs: 25.8,
    fat: 1.0,
    fiber: 2.7,
    sodium: 1,
    popular: true,
    tags: ['arroz', 'integral', 'cozido']
  },
  {
    name: 'Batata Doce (cozida)',
    category: 'carboidrato',
    calories: 77,
    protein: 0.6,
    carbs: 18.4,
    fat: 0.1,
    fiber: 2.2,
    sodium: 9,
    popular: true,
    tags: ['batata', 'doce', 'cozida']
  },
  {
    name: 'Batata Inglesa (cozida)',
    category: 'carboidrato',
    calories: 52,
    protein: 1.2,
    carbs: 11.9,
    fat: 0.1,
    fiber: 1.3,
    sodium: 1,
    popular: true,
    tags: ['batata', 'inglesa', 'cozida']
  },
  {
    name: 'Macarrão (cozido)',
    category: 'carboidrato',
    calories: 127,
    protein: 4.2,
    carbs: 26.4,
    fat: 0.5,
    fiber: 1.1,
    sodium: 1,
    popular: true,
    tags: ['macarrao', 'massa', 'cozido']
  },
  {
    name: 'Pão Francês',
    category: 'carboidrato',
    calories: 300,
    protein: 8.0,
    carbs: 58.6,
    fat: 3.1,
    fiber: 2.3,
    sodium: 648,
    popular: true,
    tags: ['pao', 'frances']
  },
  {
    name: 'Pão Integral',
    category: 'carboidrato',
    calories: 253,
    protein: 9.4,
    carbs: 49.0,
    fat: 3.0,
    fiber: 6.9,
    sodium: 489,
    popular: true,
    tags: ['pao', 'integral']
  },
  {
    name: 'Aveia (flocos)',
    category: 'carboidrato',
    calories: 394,
    protein: 13.9,
    carbs: 66.6,
    fat: 8.5,
    fiber: 9.1,
    sodium: 5,
    popular: true,
    tags: ['aveia', 'flocos', 'cereal']
  },
  {
    name: 'Tapioca (goma)',
    category: 'carboidrato',
    calories: 357,
    protein: 0.3,
    carbs: 88.7,
    fat: 0.0,
    fiber: 0.3,
    sodium: 1,
    popular: true,
    tags: ['tapioca', 'goma', 'mandioca']
  },

  // VEGETAIS
  {
    name: 'Brócolis (cozido)',
    category: 'vegetal',
    calories: 25,
    protein: 2.4,
    carbs: 4.0,
    fat: 0.3,
    fiber: 2.9,
    sodium: 8,
    popular: true,
    tags: ['brocolis', 'vegetal', 'cozido']
  },
  {
    name: 'Alface (crua)',
    category: 'vegetal',
    calories: 15,
    protein: 1.4,
    carbs: 2.2,
    fat: 0.2,
    fiber: 2.0,
    sodium: 9,
    popular: true,
    tags: ['alface', 'salada', 'folha']
  },
  {
    name: 'Tomate (cru)',
    category: 'vegetal',
    calories: 15,
    protein: 1.1,
    carbs: 3.1,
    fat: 0.2,
    fiber: 1.2,
    sodium: 4,
    popular: true,
    tags: ['tomate', 'salada']
  },
  {
    name: 'Cenoura (crua)',
    category: 'vegetal',
    calories: 34,
    protein: 1.3,
    carbs: 7.7,
    fat: 0.2,
    fiber: 3.2,
    sodium: 51,
    popular: true,
    tags: ['cenoura', 'vegetal']
  },
  {
    name: 'Couve (crua)',
    category: 'vegetal',
    calories: 27,
    protein: 2.9,
    carbs: 4.3,
    fat: 0.5,
    fiber: 3.1,
    sodium: 9,
    popular: true,
    tags: ['couve', 'folha', 'vegetal']
  },

  // FRUTAS
  {
    name: 'Banana (prata)',
    category: 'fruta',
    calories: 98,
    protein: 1.3,
    carbs: 26.0,
    fat: 0.1,
    fiber: 2.0,
    sodium: 1,
    popular: true,
    tags: ['banana', 'prata', 'fruta']
  },
  {
    name: 'Maçã (com casca)',
    category: 'fruta',
    calories: 56,
    protein: 0.3,
    carbs: 15.2,
    fat: 0.1,
    fiber: 1.3,
    sodium: 1,
    popular: true,
    tags: ['maca', 'fruta']
  },
  {
    name: 'Mamão Papaia',
    category: 'fruta',
    calories: 40,
    protein: 0.5,
    carbs: 10.4,
    fat: 0.1,
    fiber: 1.8,
    sodium: 3,
    popular: true,
    tags: ['mamao', 'papaia', 'fruta']
  },
  {
    name: 'Morango',
    category: 'fruta',
    calories: 30,
    protein: 0.9,
    carbs: 6.8,
    fat: 0.3,
    fiber: 1.7,
    sodium: 1,
    popular: true,
    tags: ['morango', 'fruta', 'berry']
  },
  {
    name: 'Abacate',
    category: 'fruta',
    calories: 96,
    protein: 1.2,
    carbs: 6.0,
    fat: 8.4,
    fiber: 3.0,
    sodium: 2,
    popular: true,
    tags: ['abacate', 'fruta']
  },

  // GORDURAS
  {
    name: 'Azeite de Oliva',
    category: 'gordura',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100.0,
    fiber: 0,
    sodium: 0,
    popular: true,
    tags: ['azeite', 'oliva', 'oleo']
  },
  {
    name: 'Amendoim (torrado)',
    category: 'gordura',
    calories: 544,
    protein: 27.2,
    carbs: 20.3,
    fat: 43.9,
    fiber: 8.0,
    sodium: 1,
    popular: true,
    tags: ['amendoim', 'oleaginosa']
  },
  {
    name: 'Castanha de Caju',
    category: 'gordura',
    calories: 570,
    protein: 18.5,
    carbs: 29.1,
    fat: 46.3,
    fiber: 3.7,
    sodium: 16,
    popular: true,
    tags: ['castanha', 'caju', 'oleaginosa']
  },
  {
    name: 'Amêndoa',
    category: 'gordura',
    calories: 640,
    protein: 21.2,
    carbs: 20.8,
    fat: 53.4,
    fiber: 11.6,
    sodium: 1,
    popular: true,
    tags: ['amendoa', 'oleaginosa']
  },

  // LATICÍNIOS
  {
    name: 'Leite Desnatado',
    category: 'lacteo',
    calories: 35,
    protein: 3.4,
    carbs: 4.9,
    fat: 0.1,
    fiber: 0,
    sodium: 44,
    popular: true,
    tags: ['leite', 'desnatado']
  },
  {
    name: 'Leite Integral',
    category: 'lacteo',
    calories: 61,
    protein: 3.2,
    carbs: 4.6,
    fat: 3.5,
    fiber: 0,
    sodium: 41,
    popular: true,
    tags: ['leite', 'integral']
  },
  {
    name: 'Iogurte Natural (desnatado)',
    category: 'lacteo',
    calories: 51,
    protein: 4.7,
    carbs: 7.0,
    fat: 0.2,
    fiber: 0,
    sodium: 58,
    popular: true,
    tags: ['iogurte', 'natural', 'desnatado']
  },
  {
    name: 'Queijo Minas (frescal)',
    category: 'lacteo',
    calories: 264,
    protein: 17.4,
    carbs: 3.0,
    fat: 20.8,
    fiber: 0,
    sodium: 215,
    popular: true,
    tags: ['queijo', 'minas', 'frescal']
  },
  {
    name: 'Requeijão (cremoso)',
    category: 'lacteo',
    calories: 235,
    protein: 9.4,
    carbs: 3.0,
    fat: 21.5,
    fiber: 0,
    sodium: 690,
    popular: true,
    tags: ['requeijao', 'cremoso']
  },

  // LEGUMINOSAS
  {
    name: 'Feijão Preto (cozido)',
    category: 'proteina',
    calories: 77,
    protein: 4.5,
    carbs: 14.0,
    fat: 0.5,
    fiber: 8.4,
    sodium: 2,
    popular: true,
    tags: ['feijao', 'preto', 'cozido', 'leguminosa']
  },
  {
    name: 'Feijão Carioca (cozido)',
    category: 'proteina',
    calories: 76,
    protein: 4.8,
    carbs: 13.6,
    fat: 0.5,
    fiber: 8.5,
    sodium: 2,
    popular: true,
    tags: ['feijao', 'carioca', 'cozido', 'leguminosa']
  },
  {
    name: 'Lentilha (cozida)',
    category: 'proteina',
    calories: 93,
    protein: 6.3,
    carbs: 16.3,
    fat: 0.5,
    fiber: 7.9,
    sodium: 2,
    popular: true,
    tags: ['lentilha', 'cozida', 'leguminosa']
  },
  {
    name: 'Grão de Bico (cozido)',
    category: 'proteina',
    calories: 121,
    protein: 6.8,
    carbs: 19.3,
    fat: 2.0,
    fiber: 5.4,
    sodium: 5,
    popular: true,
    tags: ['grao', 'bico', 'cozido', 'leguminosa']
  }
];

const seedFoods = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Iniciando seed de alimentos...');
    
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
    
    console.log('\n🎉 Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedFoods();
