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

console.log('🗑️  Limpando tabela de pagamentos...\n');

async function limparPayments() {
  try {
    // Conectar ao banco PRODUÇÃO
    console.log('🔌 Conectando ao banco de produção...');
    const conn = await mongoose.createConnection(DB_PRODUCAO).asPromise();
    console.log('✅ Conectado ao banco:', conn.name);

    // Contar pagamentos antes
    const countBefore = await conn.db.collection('payments').countDocuments();
    console.log(`\n📊 Pagamentos encontrados: ${countBefore}`);

    if (countBefore === 0) {
      console.log('⚠️  Tabela já está vazia!');
      await conn.close();
      process.exit(0);
    }

    // Perguntar confirmação
    console.log('\n⚠️  ATENÇÃO: Isso vai DELETAR TODOS os pagamentos!');
    console.log('⚠️  Esta ação NÃO pode ser desfeita!\n');

    // Deletar todos os pagamentos
    console.log('🗑️  Deletando pagamentos...');
    const result = await conn.db.collection('payments').deleteMany({});
    console.log(`✅ ${result.deletedCount} pagamentos deletados!`);

    // Verificar
    const countAfter = await conn.db.collection('payments').countDocuments();
    console.log(`\n📊 Pagamentos restantes: ${countAfter}`);

    if (countAfter === 0) {
      console.log('\n✅ Tabela de pagamentos limpa com sucesso!');
    } else {
      console.log('\n⚠️  Ainda há pagamentos na tabela!');
    }

    // Fechar conexão
    await conn.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro ao limpar pagamentos:', error.message);
    process.exit(1);
  }
}

// Executar
limparPayments();
