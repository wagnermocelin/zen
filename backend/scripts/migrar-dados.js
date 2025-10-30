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

console.log('🔄 Iniciando migração de dados...\n');
console.log('📦 Origem:', 'test');
console.log('📦 Destino:', 'zen-personal-trainer\n');

async function migrarDados() {
  try {
    // Conectar ao banco TEST
    console.log('🔌 Conectando ao banco TEST...');
    const connTest = await mongoose.createConnection(DB_TEST).asPromise();
    console.log('✅ Conectado ao banco:', connTest.name);

    // Conectar ao banco PRODUÇÃO
    console.log('🔌 Conectando ao banco PRODUÇÃO...');
    const connProd = await mongoose.createConnection(DB_PRODUCAO).asPromise();
    console.log('✅ Conectado ao banco:', connProd.name);

    // Listar todas as collections do banco test
    const collections = await connTest.db.listCollections().toArray();
    console.log(`\n📋 Collections encontradas: ${collections.length}\n`);

    // Migrar cada collection
    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`📦 Migrando collection: ${collName}`);

      // Buscar todos os documentos da collection
      const docs = await connTest.db.collection(collName).find({}).toArray();
      console.log(`   📄 Documentos encontrados: ${docs.length}`);

      if (docs.length > 0) {
        // Verificar se a collection já existe no banco de produção
        const existingCount = await connProd.db.collection(collName).countDocuments();
        
        if (existingCount > 0) {
          console.log(`   ⚠️  Collection já existe com ${existingCount} documentos`);
          console.log(`   🔄 Limpando collection antes de migrar...`);
          await connProd.db.collection(collName).deleteMany({});
        }
        
        // Inserir no banco de produção
        await connProd.db.collection(collName).insertMany(docs);
        console.log(`   ✅ ${docs.length} documentos migrados com sucesso!`);
      } else {
        console.log(`   ⚠️  Collection vazia, pulando...`);
      }
    }

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   Collections migradas: ${collections.length}`);
    
    // Verificar dados no banco de produção
    console.log('\n🔍 Verificando dados no banco de produção:');
    const collectionsProd = await connProd.db.listCollections().toArray();
    for (const collInfo of collectionsProd) {
      const count = await connProd.db.collection(collInfo.name).countDocuments();
      console.log(`   📦 ${collInfo.name}: ${count} documentos`);
    }

    // Fechar conexões
    await connTest.close();
    await connProd.close();
    
    console.log('\n✅ Migração finalizada! Agora você pode atualizar a string de conexão no Render.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro na migração:', error.message);
    process.exit(1);
  }
}

// Executar migração
migrarDados();
