import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Modelos
const userSchema = new mongoose.Schema({}, { strict: false });
const studentSchema = new mongoose.Schema({}, { strict: false });
const workoutSchema = new mongoose.Schema({}, { strict: false });
const scheduleSchema = new mongoose.Schema({}, { strict: false });
const measurementSchema = new mongoose.Schema({}, { strict: false });
const dietSchema = new mongoose.Schema({}, { strict: false });
const paymentSchema = new mongoose.Schema({}, { strict: false });

async function migrate() {
  try {
    // Conexão LOCAL
    console.log('🔌 Conectando ao MongoDB LOCAL...');
    const localConn = await mongoose.createConnection('mongodb://localhost:27017/zen').asPromise();
    console.log('✅ Conectado ao MongoDB LOCAL');

    // Conexão PRODUÇÃO
    console.log('🔌 Conectando ao MongoDB PRODUÇÃO...');
    const prodUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!prodUri) {
      throw new Error('MONGODB_URI não encontrado no .env');
    }
    const prodConn = await mongoose.createConnection(prodUri).asPromise();
    console.log('✅ Conectado ao MongoDB PRODUÇÃO');

    // Modelos LOCAL
    const LocalUser = localConn.model('User', userSchema);
    const LocalStudent = localConn.model('Student', studentSchema);
    const LocalWorkout = localConn.model('Workout', workoutSchema);
    const LocalSchedule = localConn.model('Schedule', scheduleSchema);
    const LocalMeasurement = localConn.model('Measurement', measurementSchema);
    const LocalDiet = localConn.model('Diet', dietSchema);
    const LocalPayment = localConn.model('Payment', paymentSchema);

    // Modelos PRODUÇÃO
    const ProdUser = prodConn.model('User', userSchema);
    const ProdStudent = prodConn.model('Student', studentSchema);
    const ProdWorkout = prodConn.model('Workout', workoutSchema);
    const ProdSchedule = prodConn.model('Schedule', scheduleSchema);
    const ProdMeasurement = prodConn.model('Measurement', measurementSchema);
    const ProdDiet = prodConn.model('Diet', dietSchema);
    const ProdPayment = prodConn.model('Payment', paymentSchema);

    // Migrar dados
    const collections = [
      { name: 'Users', Local: LocalUser, Prod: ProdUser },
      { name: 'Students', Local: LocalStudent, Prod: ProdStudent },
      { name: 'Workouts', Local: LocalWorkout, Prod: ProdWorkout },
      { name: 'Schedules', Local: LocalSchedule, Prod: ProdSchedule },
      { name: 'Measurements', Local: LocalMeasurement, Prod: ProdMeasurement },
      { name: 'Diets', Local: LocalDiet, Prod: ProdDiet },
      { name: 'Payments', Local: LocalPayment, Prod: ProdPayment }
    ];

    for (const collection of collections) {
      console.log(`\n📦 Migrando ${collection.name}...`);
      
      const localData = await collection.Local.find({});
      console.log(`  - Encontrados ${localData.length} registros locais`);
      
      if (localData.length > 0) {
        // Limpar produção (CUIDADO!)
        await collection.Prod.deleteMany({});
        console.log(`  - Produção limpa`);
        
        // Inserir dados
        await collection.Prod.insertMany(localData);
        console.log(`  ✅ ${localData.length} registros migrados`);
      } else {
        console.log(`  ⚠️ Nenhum registro para migrar`);
      }
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  }
}

migrate();
