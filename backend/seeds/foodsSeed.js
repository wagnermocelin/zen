import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';
import connectDB from '../config/database.js';

dotenv.config();

// Alimentos baseados na Tabela TACO (valores por 100g)
// Fonte: Tabela Brasileira de Composição de Alimentos - UNICAMP
const foods = [
  // ========================================
  // PROTEÍNAS - CARNES BOVINAS
  // ========================================
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
  },

  // CARNES SUÍNAS
  {
    name: 'Carne Suína (Lombo, assado)',
    category: 'proteina',
    calories: 221,
    protein: 27.4,
    carbs: 0,
    fat: 11.8,
    fiber: 0,
    sodium: 49,
    popular: true,
    tags: ['carne', 'porco', 'lombo', 'assado']
  },
  {
    name: 'Carne Suína (Bisteca, crua)',
    category: 'proteina',
    calories: 240,
    protein: 18.5,
    carbs: 0,
    fat: 18.2,
    fiber: 0,
    sodium: 47,
    tags: ['carne', 'porco', 'bisteca']
  },
  {
    name: 'Carne Suína (Pernil, assado)',
    category: 'proteina',
    calories: 234,
    protein: 25.7,
    carbs: 0,
    fat: 14.2,
    fiber: 0,
    sodium: 58,
    tags: ['carne', 'porco', 'pernil', 'assado']
  },
  {
    name: 'Bacon (toucinho defumado)',
    category: 'proteina',
    calories: 533,
    protein: 14.6,
    carbs: 0.6,
    fat: 52.3,
    fiber: 0,
    sodium: 1021,
    tags: ['bacon', 'porco', 'defumado']
  },

  // MAIS QUEIJOS
  {
    name: 'Queijo Mussarela',
    category: 'lacteo',
    calories: 289,
    protein: 25.4,
    carbs: 3.6,
    fat: 19.5,
    fiber: 0,
    sodium: 682,
    popular: true,
    tags: ['queijo', 'mussarela']
  },
  {
    name: 'Queijo Prato',
    category: 'lacteo',
    calories: 360,
    protein: 25.8,
    carbs: 0.5,
    fat: 28.0,
    fiber: 0,
    sodium: 557,
    tags: ['queijo', 'prato']
  },
  {
    name: 'Queijo Parmesão',
    category: 'lacteo',
    calories: 453,
    protein: 36.0,
    carbs: 0,
    fat: 33.0,
    fiber: 0,
    sodium: 1109,
    popular: true,
    tags: ['queijo', 'parmesao']
  },
  {
    name: 'Queijo Ricota',
    category: 'lacteo',
    calories: 140,
    protein: 11.3,
    carbs: 3.4,
    fat: 9.5,
    fiber: 0,
    sodium: 300,
    popular: true,
    tags: ['queijo', 'ricota']
  },
  {
    name: 'Queijo Cottage',
    category: 'lacteo',
    calories: 98,
    protein: 12.4,
    carbs: 3.4,
    fat: 4.3,
    fiber: 0,
    sodium: 405,
    tags: ['queijo', 'cottage']
  },

  // MAIS VEGETAIS
  {
    name: 'Abobrinha (crua)',
    category: 'vegetal',
    calories: 19,
    protein: 1.2,
    carbs: 4.3,
    fat: 0.2,
    fiber: 1.0,
    sodium: 2,
    tags: ['abobrinha', 'vegetal']
  },
  {
    name: 'Abóbora (crua)',
    category: 'vegetal',
    calories: 12,
    protein: 1.0,
    carbs: 2.8,
    fat: 0.1,
    fiber: 1.7,
    sodium: 1,
    tags: ['abobora', 'vegetal']
  },
  {
    name: 'Berinjela (crua)',
    category: 'vegetal',
    calories: 20,
    protein: 1.0,
    carbs: 4.9,
    fat: 0.1,
    fiber: 2.5,
    sodium: 1,
    tags: ['berinjela', 'vegetal']
  },
  {
    name: 'Beterraba (crua)',
    category: 'vegetal',
    calories: 32,
    protein: 1.9,
    carbs: 7.2,
    fat: 0.1,
    fiber: 3.4,
    sodium: 10,
    tags: ['beterraba', 'vegetal']
  },
  {
    name: 'Cebola (crua)',
    category: 'vegetal',
    calories: 38,
    protein: 1.3,
    carbs: 8.9,
    fat: 0.2,
    fiber: 1.8,
    sodium: 2,
    popular: true,
    tags: ['cebola', 'vegetal']
  },
  {
    name: 'Chuchu (cru)',
    category: 'vegetal',
    calories: 19,
    protein: 0.9,
    carbs: 4.5,
    fat: 0.1,
    fiber: 1.0,
    sodium: 2,
    tags: ['chuchu', 'vegetal']
  },
  {
    name: 'Couve-flor (crua)',
    category: 'vegetal',
    calories: 23,
    protein: 2.0,
    carbs: 4.5,
    fat: 0.2,
    fiber: 2.1,
    sodium: 19,
    tags: ['couve', 'flor', 'vegetal']
  },
  {
    name: 'Espinafre (cru)',
    category: 'vegetal',
    calories: 17,
    protein: 2.0,
    carbs: 2.9,
    fat: 0.3,
    fiber: 2.4,
    sodium: 65,
    tags: ['espinafre', 'folha', 'vegetal']
  },
  {
    name: 'Pepino (cru)',
    category: 'vegetal',
    calories: 13,
    protein: 0.6,
    carbs: 3.2,
    fat: 0.2,
    fiber: 0.5,
    sodium: 2,
    tags: ['pepino', 'vegetal']
  },
  {
    name: 'Pimentão (cru)',
    category: 'vegetal',
    calories: 21,
    protein: 1.0,
    carbs: 5.3,
    fat: 0.2,
    fiber: 1.9,
    sodium: 1,
    tags: ['pimentao', 'vegetal']
  },
  {
    name: 'Repolho (cru)',
    category: 'vegetal',
    calories: 22,
    protein: 1.3,
    carbs: 5.1,
    fat: 0.2,
    fiber: 2.0,
    sodium: 14,
    tags: ['repolho', 'vegetal']
  },
  {
    name: 'Rúcula (crua)',
    category: 'vegetal',
    calories: 17,
    protein: 2.1,
    carbs: 2.7,
    fat: 0.3,
    fiber: 1.6,
    sodium: 25,
    tags: ['rucula', 'folha', 'vegetal']
  },

  // MAIS FRUTAS
  {
    name: 'Abacaxi (cru)',
    category: 'fruta',
    calories: 48,
    protein: 0.5,
    carbs: 12.3,
    fat: 0.1,
    fiber: 1.0,
    sodium: 1,
    popular: true,
    tags: ['abacaxi', 'fruta']
  },
  {
    name: 'Goiaba (vermelha)',
    category: 'fruta',
    calories: 54,
    protein: 1.1,
    carbs: 13.0,
    fat: 0.4,
    fiber: 6.2,
    sodium: 1,
    tags: ['goiaba', 'fruta']
  },
  {
    name: 'Kiwi',
    category: 'fruta',
    calories: 51,
    protein: 1.1,
    carbs: 12.2,
    fat: 0.6,
    fiber: 2.7,
    sodium: 2,
    tags: ['kiwi', 'fruta']
  },
  {
    name: 'Laranja (pera)',
    category: 'fruta',
    calories: 46,
    protein: 0.9,
    carbs: 11.7,
    fat: 0.1,
    fiber: 1.1,
    sodium: 1,
    popular: true,
    tags: ['laranja', 'fruta', 'citrica']
  },
  {
    name: 'Limão (taiti)',
    category: 'fruta',
    calories: 32,
    protein: 0.8,
    carbs: 11.0,
    fat: 0.3,
    fiber: 0.6,
    sodium: 1,
    tags: ['limao', 'fruta', 'citrica']
  },
  {
    name: 'Manga (palmer)',
    category: 'fruta',
    calories: 51,
    protein: 0.5,
    carbs: 13.5,
    fat: 0.3,
    fiber: 1.6,
    sodium: 1,
    popular: true,
    tags: ['manga', 'fruta']
  },
  {
    name: 'Melancia',
    category: 'fruta',
    calories: 33,
    protein: 0.9,
    carbs: 8.1,
    fat: 0.2,
    fiber: 0.3,
    sodium: 1,
    tags: ['melancia', 'fruta']
  },
  {
    name: 'Melão',
    category: 'fruta',
    calories: 29,
    protein: 0.7,
    carbs: 7.5,
    fat: 0.1,
    fiber: 0.3,
    sodium: 11,
    tags: ['melao', 'fruta']
  },
  {
    name: 'Pêra',
    category: 'fruta',
    calories: 53,
    protein: 0.3,
    carbs: 14.1,
    fat: 0.1,
    fiber: 3.0,
    sodium: 1,
    tags: ['pera', 'fruta']
  },
  {
    name: 'Tangerina (mexerica)',
    category: 'fruta',
    calories: 38,
    protein: 0.8,
    carbs: 9.7,
    fat: 0.2,
    fiber: 1.7,
    sodium: 1,
    tags: ['tangerina', 'mexerica', 'fruta', 'citrica']
  },
  {
    name: 'Uva (itália)',
    category: 'fruta',
    calories: 53,
    protein: 0.6,
    carbs: 14.0,
    fat: 0.1,
    fiber: 0.9,
    sodium: 1,
    tags: ['uva', 'fruta']
  },

  // MAIS OLEAGINOSAS
  {
    name: 'Castanha do Pará',
    category: 'gordura',
    calories: 643,
    protein: 14.5,
    carbs: 12.3,
    fat: 63.5,
    fiber: 7.9,
    sodium: 1,
    popular: true,
    tags: ['castanha', 'para', 'oleaginosa']
  },
  {
    name: 'Nozes',
    category: 'gordura',
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fat: 65.2,
    fiber: 6.7,
    sodium: 2,
    tags: ['nozes', 'oleaginosa']
  },

  // MAIS CARBOIDRATOS
  {
    name: 'Biscoito Cream Cracker',
    category: 'carboidrato',
    calories: 432,
    protein: 10.0,
    carbs: 71.3,
    fat: 11.9,
    fiber: 2.3,
    sodium: 730,
    tags: ['biscoito', 'cream', 'cracker']
  },
  {
    name: 'Biscoito Maisena',
    category: 'carboidrato',
    calories: 443,
    protein: 8.1,
    carbs: 75.3,
    fat: 12.0,
    fiber: 1.5,
    sodium: 338,
    tags: ['biscoito', 'maisena']
  },
  {
    name: 'Cuscuz Marroquino',
    category: 'carboidrato',
    calories: 112,
    protein: 3.8,
    carbs: 23.2,
    fat: 0.2,
    fiber: 1.4,
    sodium: 5,
    tags: ['cuscuz', 'marroquino']
  },
  {
    name: 'Farinha de Mandioca',
    category: 'carboidrato',
    calories: 365,
    protein: 1.4,
    carbs: 88.0,
    fat: 0.5,
    fiber: 6.5,
    sodium: 29,
    tags: ['farinha', 'mandioca']
  },
  {
    name: 'Farinha de Trigo',
    category: 'carboidrato',
    calories: 360,
    protein: 9.8,
    carbs: 75.1,
    fat: 1.4,
    fiber: 2.3,
    sodium: 2,
    popular: true,
    tags: ['farinha', 'trigo']
  },
  {
    name: 'Granola',
    category: 'carboidrato',
    calories: 471,
    protein: 13.5,
    carbs: 64.9,
    fat: 17.4,
    fiber: 9.1,
    sodium: 20,
    popular: true,
    tags: ['granola', 'cereal']
  },
  {
    name: 'Milho Verde (em conserva)',
    category: 'carboidrato',
    calories: 79,
    protein: 2.9,
    carbs: 17.1,
    fat: 0.8,
    fiber: 2.0,
    sodium: 265,
    tags: ['milho', 'verde', 'conserva']
  },
  {
    name: 'Polenta (cozida)',
    category: 'carboidrato',
    calories: 70,
    protein: 1.5,
    carbs: 15.7,
    fat: 0.2,
    fiber: 0.9,
    sodium: 1,
    tags: ['polenta', 'milho', 'cozida']
  },
  {
    name: 'Quinoa (cozida)',
    category: 'carboidrato',
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    fiber: 2.8,
    sodium: 5,
    popular: true,
    tags: ['quinoa', 'cozida', 'cereal']
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

  // BEBIDAS
  {
    name: 'Café (infusão, 10%)',
    category: 'bebida',
    calories: 4,
    protein: 0.2,
    carbs: 0.8,
    fat: 0,
    fiber: 0,
    sodium: 1,
    tags: ['cafe', 'bebida']
  },
  {
    name: 'Chá Preto (infusão, 2%)',
    category: 'bebida',
    calories: 1,
    protein: 0,
    carbs: 0.3,
    fat: 0,
    fiber: 0,
    sodium: 3,
    tags: ['cha', 'preto', 'bebida']
  },
  {
    name: 'Suco de Laranja (natural)',
    category: 'bebida',
    calories: 45,
    protein: 0.7,
    carbs: 10.5,
    fat: 0.2,
    fiber: 0.2,
    sodium: 1,
    tags: ['suco', 'laranja', 'natural', 'bebida']
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
