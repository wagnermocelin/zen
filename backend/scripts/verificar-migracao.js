import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do diretório backend
dotenv.config({ path: join(__dirname, '..', '.env') });

// String de conexão atual (banco test)
const DB_TEST = process.env.MONGODB_URI;

// String de conexão para o banco de produção
const DB_PRODUCAO = DB_TEST.replace(/\/\?/, '/zen-personal-trainer?');

console.log('🔍 Verificando migração de dados...\n');

async function verificarMigracao() {
  try {
    // Conectar aos dois bancos
    console.log('🔌 Conectando aos bancos...');
    const connTest = await mongoose.createConnection(DB_TEST).asPromise();
    const connProd = await mongoose.createConnection(DB_PRODUCAO).asPromise();
    
    console.log('✅ Conectado ao banco TEST:', connTest.name);
    console.log('✅ Conectado ao banco PRODUÇÃO:', connProd.name);

    // Listar collections do banco test
    const collectionsTest = await connTest.db.listCollections().toArray();
    const collectionsProd = await connProd.db.listCollections().toArray();

    console.log('\n📊 Comparação de Dados:\n');
    console.log('┌─────────────────────┬──────────┬──────────────┬────────┐');
    console.log('│ Collection          │ Test     │ Produção     │ Status │');
    console.log('├─────────────────────┼──────────┼──────────────┼────────┤');

    let todasOk = true;

    for (const collInfo of collectionsTest) {
      const collName = collInfo.name;
      
      // Contar documentos em cada banco
      const countTest = await connTest.db.collection(collName).countDocuments();
      const countProd = await connProd.db.collection(collName).countDocuments();
      
      const status = countTest === countProd ? '✅ OK' : '❌ DIFERENTE';
      if (countTest !== countProd) todasOk = false;

      // Formatar linha da tabela
      const collPadded = collName.padEnd(19);
      const testPadded = countTest.toString().padStart(8);
      const prodPadded = countProd.toString().padStart(12);
      
      console.log(`│ ${collPadded} │ ${testPadded} │ ${prodPadded} │ ${status.padEnd(6)} │`);
    }

    console.log('└─────────────────────┴──────────┴──────────────┴────────┘');

    // Verificar se há collections no prod que não estão no test
    const collNamesTest = collectionsTest.map(c => c.name);
    const collNamesProd = collectionsProd.map(c => c.name);
    const extraProd = collNamesProd.filter(c => !collNamesTest.includes(c));

    if (extraProd.length > 0) {
      console.log('\n⚠️  Collections extras no banco de produção:');
      extraProd.forEach(c => console.log(`   - ${c}`));
    }

    // Resultado final
    console.log('\n📋 Resultado:');
    if (todasOk) {
      console.log('✅ Todos os dados foram migrados corretamente!');
      console.log('✅ Você pode atualizar a string de conexão no Render.');
    } else {
      console.log('❌ Há diferenças entre os bancos!');
      console.log('⚠️  Execute o script de migração novamente.');
    }

    // Fechar conexões
    await connTest.close();
    await connProd.close();
    
    process.exit(todasOk ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Erro ao verificar:', error.message);
    process.exit(1);
  }
}

// Executar verificação
verificarMigracao();
