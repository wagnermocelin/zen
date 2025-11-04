import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do diretório backend
dotenv.config({ path: join(__dirname, '..', '.env') });

// String de conexão para o banco de produção
const DB_PRODUCAO = process.env.MONGODB_URI.replace(/\/\?/, '/zen-personal-trainer?');

console.log('💰 Criando pagamentos de teste...\n');

async function criarPayments() {
  try {
    // Conectar ao banco PRODUÇÃO
    console.log('🔌 Conectando ao banco de produção...');
    const conn = await mongoose.createConnection(DB_PRODUCAO).asPromise();
    console.log('✅ Conectado ao banco:', conn.name);

    // Buscar um aluno para associar os pagamentos
    const students = await conn.db.collection('students').find({}).limit(1).toArray();
    
    if (students.length === 0) {
      console.log('⚠️  Nenhum aluno encontrado! Crie um aluno primeiro.');
      await conn.close();
      process.exit(1);
    }

    const studentId = students[0]._id;
    console.log(`\n👤 Usando aluno: ${students[0].name} (${studentId})`);

    // Criar pagamentos de teste para os últimos 3 meses
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const payments = [];
    const today = new Date();
    
    // Pagamento do mês atual - PAGO
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDueDate = new Date(currentYear, currentMonth, 5);
    
    payments.push({
      student: studentId,
      amount: 150.00,
      dueDate: currentDueDate,
      month: monthNames[currentMonth],
      year: currentYear,
      status: 'paid',
      paymentMethod: 'Pix',
      paymentDate: new Date(),
      notes: 'Pagamento de teste - mês atual',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Pagamento do mês passado - PAGO
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthDueDate = new Date(lastMonthYear, lastMonth, 5);
    
    payments.push({
      student: studentId,
      amount: 150.00,
      dueDate: lastMonthDueDate,
      month: monthNames[lastMonth],
      year: lastMonthYear,
      status: 'paid',
      paymentMethod: 'Dinheiro',
      paymentDate: new Date(lastMonthYear, lastMonth, 10),
      notes: 'Pagamento de teste - mês passado',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Pagamento do próximo mês - PENDENTE
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonthDueDate = new Date(nextMonthYear, nextMonth, 5);
    
    payments.push({
      student: studentId,
      amount: 150.00,
      dueDate: nextMonthDueDate,
      month: monthNames[nextMonth],
      year: nextMonthYear,
      status: 'pending',
      paymentMethod: 'Pix',
      notes: 'Pagamento de teste - próximo mês',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Inserir pagamentos
    console.log('\n💰 Criando pagamentos...');
    const result = await conn.db.collection('payments').insertMany(payments);
    console.log(`✅ ${result.insertedCount} pagamentos criados!`);

    // Mostrar resumo
    console.log('\n📋 Pagamentos criados:');
    payments.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.month}/${p.year}`);
      console.log(`   Valor: R$ ${p.amount.toFixed(2)}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Vencimento: ${p.dueDate.toLocaleDateString('pt-BR')}`);
      if (p.paymentDate) {
        console.log(`   Pago em: ${p.paymentDate.toLocaleDateString('pt-BR')}`);
      }
    });

    console.log('\n✅ Pagamentos de teste criados com sucesso!');
    console.log('\n📊 Agora você pode:');
    console.log('1. Acessar o Dashboard');
    console.log('2. Ver a receita do mês atual');
    console.log('3. Ver os pagamentos na página Financeiro');

    // Fechar conexão
    await conn.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro ao criar pagamentos:', error.message);
    process.exit(1);
  }
}

// Executar
criarPayments();
