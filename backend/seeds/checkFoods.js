import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';

dotenv.config();

const checkFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    console.log('📦 Database:', mongoose.connection.name);
    console.log('');

    const totalFoods = await Food.countDocuments();
    const tacoFoods = await Food.countDocuments({ isCustom: false });
    const customFoods = await Food.countDocuments({ isCustom: true });

    console.log('📊 ESTATÍSTICAS DE ALIMENTOS:\n');
    console.log(`   Total de alimentos: ${totalFoods}`);
    console.log(`   Alimentos TACO: ${tacoFoods}`);
    console.log(`   Alimentos customizados: ${customFoods}\n`);

    console.log('📋 Por categoria (TACO):');
    const categories = await Food.aggregate([
      { $match: { isCustom: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} alimentos`);
    });

    const popularCount = await Food.countDocuments({ isCustom: false, popular: true });
    console.log(`\n⭐ ${popularCount} alimentos marcados como populares`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

checkFoods();
