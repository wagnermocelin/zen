import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise.js';

dotenv.config();

const exercises = [
  // PEITO
  { name: 'Supino reto com barra', category: 'peito', muscleGroup: 'peitoral', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Supino inclinado com barra', category: 'peito', muscleGroup: 'peitoral', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Supino declinado com barra', category: 'peito', muscleGroup: 'peitoral', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Supino reto com halteres', category: 'peito', muscleGroup: 'peitoral', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Supino inclinado com halteres', category: 'peito', muscleGroup: 'peitoral', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Crucifixo reto', category: 'peito', muscleGroup: 'peitoral', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Crucifixo inclinado', category: 'peito', muscleGroup: 'peitoral', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Crossover', category: 'peito', muscleGroup: 'peitoral', equipment: 'cabo', difficulty: 'intermediario', popular: true },
  { name: 'Peck deck (voador)', category: 'peito', muscleGroup: 'peitoral', equipment: 'maquina', difficulty: 'iniciante' },
  { name: 'Flexão de braço', category: 'peito', muscleGroup: 'peitoral', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Flexão declinada', category: 'peito', muscleGroup: 'peitoral', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Flexão com palmas', category: 'peito', muscleGroup: 'peitoral', equipment: 'peso-corporal', difficulty: 'avancado' },
  
  // COSTAS
  { name: 'Barra fixa', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Barra fixa pegada aberta', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Barra fixa pegada fechada', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Remada curvada com barra', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Remada unilateral com halter', category: 'costas', muscleGroup: 'dorsal', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Remada baixa', category: 'costas', muscleGroup: 'dorsal', equipment: 'cabo', difficulty: 'intermediario', popular: true },
  { name: 'Remada alta', category: 'costas', muscleGroup: 'dorsal', equipment: 'cabo', difficulty: 'intermediario' },
  { name: 'Pulldown', category: 'costas', muscleGroup: 'dorsal', equipment: 'cabo', difficulty: 'iniciante', popular: true },
  { name: 'Pulley', category: 'costas', muscleGroup: 'dorsal', equipment: 'cabo', difficulty: 'iniciante' },
  { name: 'Levantamento terra', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'avancado', popular: true },
  { name: 'Levantamento terra sumô', category: 'costas', muscleGroup: 'dorsal', equipment: 'barra', difficulty: 'avancado' },
  { name: 'Encolhimento com barra', category: 'costas', muscleGroup: 'trapezio', equipment: 'barra', difficulty: 'iniciante' },
  { name: 'Encolhimento com halteres', category: 'costas', muscleGroup: 'trapezio', equipment: 'halteres', difficulty: 'iniciante' },
  
  // PERNAS
  { name: 'Agachamento livre', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Agachamento frontal', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'barra', difficulty: 'avancado' },
  { name: 'Agachamento sumô', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Agachamento búlgaro', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Leg press 45°', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Leg press horizontal', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'maquina', difficulty: 'iniciante' },
  { name: 'Cadeira extensora', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Mesa flexora', category: 'pernas', muscleGroup: 'posterior', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Stiff', category: 'pernas', muscleGroup: 'posterior', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Stiff com halteres', category: 'pernas', muscleGroup: 'posterior', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Afundo', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Afundo caminhando', category: 'pernas', muscleGroup: 'quadriceps', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Cadeira abdutora', category: 'pernas', muscleGroup: 'gluteos', equipment: 'maquina', difficulty: 'iniciante' },
  { name: 'Cadeira adutora', category: 'pernas', muscleGroup: 'gluteos', equipment: 'maquina', difficulty: 'iniciante' },
  { name: 'Elevação pélvica', category: 'pernas', muscleGroup: 'gluteos', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Panturrilha em pé', category: 'pernas', muscleGroup: 'panturrilhas', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Panturrilha sentado', category: 'pernas', muscleGroup: 'panturrilhas', equipment: 'maquina', difficulty: 'iniciante' },
  
  // OMBROS
  { name: 'Desenvolvimento com barra', category: 'ombros', muscleGroup: 'deltoides', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Desenvolvimento com halteres', category: 'ombros', muscleGroup: 'deltoides', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Desenvolvimento militar', category: 'ombros', muscleGroup: 'deltoides', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Elevação lateral', category: 'ombros', muscleGroup: 'deltoides', equipment: 'halteres', difficulty: 'iniciante', popular: true },
  { name: 'Elevação frontal', category: 'ombros', muscleGroup: 'deltoides', equipment: 'halteres', difficulty: 'iniciante', popular: true },
  { name: 'Elevação lateral no cabo', category: 'ombros', muscleGroup: 'deltoides', equipment: 'cabo', difficulty: 'iniciante' },
  { name: 'Crucifixo invertido', category: 'ombros', muscleGroup: 'deltoides', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Remada alta com barra', category: 'ombros', muscleGroup: 'deltoides', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Remada alta com halteres', category: 'ombros', muscleGroup: 'deltoides', equipment: 'halteres', difficulty: 'intermediario' },
  
  // BÍCEPS
  { name: 'Rosca direta com barra', category: 'biceps', muscleGroup: 'biceps', equipment: 'barra', difficulty: 'iniciante', popular: true },
  { name: 'Rosca direta com halteres', category: 'biceps', muscleGroup: 'biceps', equipment: 'halteres', difficulty: 'iniciante', popular: true },
  { name: 'Rosca alternada', category: 'biceps', muscleGroup: 'biceps', equipment: 'halteres', difficulty: 'iniciante', popular: true },
  { name: 'Rosca martelo', category: 'biceps', muscleGroup: 'biceps', equipment: 'halteres', difficulty: 'iniciante', popular: true },
  { name: 'Rosca concentrada', category: 'biceps', muscleGroup: 'biceps', equipment: 'halteres', difficulty: 'iniciante' },
  { name: 'Rosca scott', category: 'biceps', muscleGroup: 'biceps', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Rosca scott com halteres', category: 'biceps', muscleGroup: 'biceps', equipment: 'halteres', difficulty: 'intermediario' },
  { name: 'Rosca 21', category: 'biceps', muscleGroup: 'biceps', equipment: 'barra', difficulty: 'intermediario' },
  { name: 'Rosca inversa', category: 'biceps', muscleGroup: 'antebracos', equipment: 'barra', difficulty: 'iniciante' },
  
  // TRÍCEPS
  { name: 'Tríceps testa', category: 'triceps', muscleGroup: 'triceps', equipment: 'barra', difficulty: 'intermediario', popular: true },
  { name: 'Tríceps francês', category: 'triceps', muscleGroup: 'triceps', equipment: 'halteres', difficulty: 'intermediario', popular: true },
  { name: 'Tríceps corda', category: 'triceps', muscleGroup: 'triceps', equipment: 'cabo', difficulty: 'iniciante', popular: true },
  { name: 'Tríceps barra', category: 'triceps', muscleGroup: 'triceps', equipment: 'cabo', difficulty: 'iniciante', popular: true },
  { name: 'Tríceps coice', category: 'triceps', muscleGroup: 'triceps', equipment: 'halteres', difficulty: 'iniciante' },
  { name: 'Mergulho em paralelas', category: 'triceps', muscleGroup: 'triceps', equipment: 'peso-corporal', difficulty: 'intermediario', popular: true },
  { name: 'Supino fechado', category: 'triceps', muscleGroup: 'triceps', equipment: 'barra', difficulty: 'intermediario' },
  
  // ABDÔMEN
  { name: 'Abdominal supra', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Abdominal infra', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Abdominal oblíquo', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Prancha', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Prancha lateral', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Abdominal canivete', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Abdominal bicicleta', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Elevação de pernas', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Abdominal na polia', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'cabo', difficulty: 'intermediario' },
  { name: 'Abdominal na máquina', category: 'abdomen', muscleGroup: 'abdominais', equipment: 'maquina', difficulty: 'iniciante' },
  
  // CARDIO
  { name: 'Esteira', category: 'cardio', muscleGroup: 'cardio', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Bicicleta ergométrica', category: 'cardio', muscleGroup: 'cardio', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Elíptico', category: 'cardio', muscleGroup: 'cardio', equipment: 'maquina', difficulty: 'iniciante', popular: true },
  { name: 'Transport', category: 'cardio', muscleGroup: 'cardio', equipment: 'maquina', difficulty: 'intermediario' },
  { name: 'Remo ergométrico', category: 'cardio', muscleGroup: 'cardio', equipment: 'maquina', difficulty: 'intermediario' },
  { name: 'Pular corda', category: 'cardio', muscleGroup: 'cardio', equipment: 'nenhum', difficulty: 'iniciante', popular: true },
  { name: 'Corrida', category: 'cardio', muscleGroup: 'cardio', equipment: 'nenhum', difficulty: 'iniciante', popular: true },
  { name: 'Caminhada', category: 'cardio', muscleGroup: 'cardio', equipment: 'nenhum', difficulty: 'iniciante', popular: true },
  
  // FUNCIONAL
  { name: 'Burpee', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'peso-corporal', difficulty: 'intermediario', popular: true },
  { name: 'Mountain climber', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'peso-corporal', difficulty: 'intermediario', popular: true },
  { name: 'Jumping jack', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'peso-corporal', difficulty: 'iniciante', popular: true },
  { name: 'Agachamento com salto', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'peso-corporal', difficulty: 'intermediario' },
  { name: 'Swing com kettlebell', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'kettlebell', difficulty: 'intermediario', popular: true },
  { name: 'Turkish get-up', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'kettlebell', difficulty: 'avancado' },
  { name: 'Wall ball', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'medicine-ball', difficulty: 'intermediario' },
  { name: 'Box jump', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'nenhum', difficulty: 'intermediario' },
  { name: 'Farmer walk', category: 'funcional', muscleGroup: 'corpo-inteiro', equipment: 'halteres', difficulty: 'intermediario' }
];

// Adicionar tags automaticamente
exercises.forEach(ex => {
  ex.tags = ex.name.toLowerCase().split(' ');
});

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
    console.log('📦 Database:', mongoose.connection.name);
    
    console.log('🌱 Iniciando seed de exercícios...');
    
    // Remover apenas exercícios padrão (não customizados)
    await Exercise.deleteMany({ isCustom: false });
    console.log('🗑️  Exercícios padrão anteriores removidos');
    
    // Inserir novos exercícios
    const inserted = await Exercise.insertMany(exercises);
    console.log(`✅ ${inserted.length} exercícios inseridos com sucesso!`);
    
    // Resumo por categoria
    const categories = {};
    exercises.forEach(ex => {
      categories[ex.category] = (categories[ex.category] || 0) + 1;
    });
    
    console.log('\n📊 Resumo por categoria:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count} exercícios`);
    });
    
    const popularCount = exercises.filter(ex => ex.popular).length;
    console.log(`\n⭐ ${popularCount} exercícios marcados como populares`);
    
    console.log('\n🎉 Seed de exercícios concluído com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
};

seedExercises();
