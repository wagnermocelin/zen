import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Diet from '../models/Diet.js';
import Food from '../models/Food.js';
import connectDB from '../config/database.js';

dotenv.config();

const recalculateDiets = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Recalculando totais de todas as dietas...');
    
    const diets = await Diet.find({});
    console.log(`📊 ${diets.length} dietas encontradas`);
    
    let updated = 0;
    
    for (const diet of diets) {
      // Migrar campos antigos para nova estrutura se necessário
      if (!diet.goals && (diet.calories || diet.protein || diet.carbs || diet.fat)) {
        diet.goals = {
          calories: diet.calories || 0,
          protein: diet.protein || 0,
          carbs: diet.carbs || 0,
          fat: diet.fat || 0
        };
      }
      
      // Calcular totais de cada refeição
      if (diet.meals && diet.meals.length > 0) {
        diet.meals.forEach(meal => {
          if (meal.foodItems && meal.foodItems.length > 0) {
            const totals = {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0
            };
            
            meal.foodItems.forEach(item => {
              if (item.calculatedMacros) {
                totals.calories += item.calculatedMacros.calories || 0;
                totals.protein += item.calculatedMacros.protein || 0;
                totals.carbs += item.calculatedMacros.carbs || 0;
                totals.fat += item.calculatedMacros.fat || 0;
              }
            });
            
            meal.totals = totals;
          }
        });
      }
      
      // Calcular totais da dieta
      diet.calculateTotals();
      await diet.save();
      updated++;
      
      console.log(`✅ Dieta "${diet.name}" atualizada`);
      console.log(`   Totais: ${Math.round(diet.totals.calories)} kcal, ${Math.round(diet.totals.protein)}g P, ${Math.round(diet.totals.carbs)}g C, ${Math.round(diet.totals.fat)}g G`);
    }
    
    console.log(`\n🎉 ${updated} dietas recalculadas com sucesso!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao recalcular dietas:', error);
    process.exit(1);
  }
};

recalculateDiets();
