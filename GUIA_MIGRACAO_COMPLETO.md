# 🔄 Guia Completo: Migração de Dados

## 📊 Objetivo:

Migrar todos os dados do banco `test` para o banco `zen-personal-trainer` antes de atualizar a string de conexão.

---

## 🚀 Método 1: Script Automático (RECOMENDADO)

### **Passo 1: Executar Script de Migração**

```powershell
cd backend
node scripts/migrar-dados.js
```

### **O que o script faz:**

1. ✅ Conecta ao banco `test`
2. ✅ Conecta ao banco `zen-personal-trainer`
3. ✅ Lista todas as collections
4. ✅ Copia todos os documentos
5. ✅ Verifica se migrou corretamente
6. ✅ Mostra resumo

### **Saída esperada:**

```
🔄 Iniciando migração de dados...

📦 Origem: test
📦 Destino: zen-personal-trainer

🔌 Conectando ao banco TEST...
✅ Conectado ao banco: test

🔌 Conectando ao banco PRODUÇÃO...
✅ Conectado ao banco: zen-personal-trainer

📋 Collections encontradas: 8

📦 Migrando collection: users
   📄 Documentos encontrados: 2
   ✅ 2 documentos migrados com sucesso!

📦 Migrando collection: students
   📄 Documentos encontrados: 5
   ✅ 5 documentos migrados com sucesso!

... (continua para todas as collections)

✅ Migração concluída com sucesso!

📊 Resumo:
   Collections migradas: 8

🔍 Verificando dados no banco de produção:
   📦 users: 2 documentos
   📦 students: 5 documentos
   📦 workouts: 3 documentos
   📦 measurements: 10 documentos
   📦 schedules: 4 documentos
   📦 diets: 2 documentos
   📦 payments: 8 documentos
   📦 configs: 1 documentos

✅ Migração finalizada!
```

---

## 🔧 Método 2: Via MongoDB Compass (Interface Gráfica)

### **Passo 1: Baixar MongoDB Compass**

1. Acesse: https://www.mongodb.com/try/download/compass
2. Baixe e instale

### **Passo 2: Conectar ao MongoDB Atlas**

1. Abra MongoDB Compass
2. Cole sua string de conexão:
```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/
```
3. Clique em "Connect"

### **Passo 3: Migrar Dados**

Para cada collection no banco `test`:

1. Clique no banco `test`
2. Clique na collection (ex: `users`)
3. Clique em "Export Collection"
4. Escolha formato: JSON
5. Salve o arquivo

Depois:

1. Clique no banco `zen-personal-trainer` (ou crie se não existir)
2. Crie a collection com o mesmo nome
3. Clique em "Import Data"
4. Selecione o arquivo JSON salvo
5. Clique em "Import"

Repita para todas as collections:
- users
- students
- workouts
- measurements
- schedules
- diets
- payments
- configs

---

## 🌐 Método 3: Via MongoDB Atlas (Interface Web)

### **Passo 1: Acessar MongoDB Atlas**

1. Acesse: https://cloud.mongodb.com
2. Faça login
3. Clique em "Browse Collections"

### **Passo 2: Exportar Dados**

Para cada collection:

1. Selecione o banco `test`
2. Clique na collection
3. Clique em "..." (três pontos)
4. Clique em "Export Collection"
5. Baixe o arquivo JSON

### **Passo 3: Importar Dados**

1. Crie o banco `zen-personal-trainer` (se não existir)
2. Crie as collections
3. Para cada collection:
   - Clique em "Insert Document"
   - Clique em "Import from JSON"
   - Cole o conteúdo do arquivo exportado
   - Clique em "Insert"

---

## 📋 Checklist de Migração:

### **Collections para Migrar:**

- [ ] users
- [ ] students
- [ ] workouts
- [ ] measurements
- [ ] schedules
- [ ] diets
- [ ] payments
- [ ] configs

### **Verificação:**

- [ ] Todos os documentos foram copiados
- [ ] Contagem de documentos confere
- [ ] Dados estão íntegros no novo banco
- [ ] Banco `zen-personal-trainer` existe no Atlas

---

## 🧪 Verificar Migração:

### **Via MongoDB Atlas:**

1. Acesse: https://cloud.mongodb.com
2. Clique em "Browse Collections"
3. Selecione `zen-personal-trainer`
4. Verifique cada collection
5. Confirme que os dados estão lá

### **Via Script:**

```powershell
cd backend
node scripts/verificar-migracao.js
```

---

## ⚠️ IMPORTANTE:

### **Antes de Atualizar String no Render:**

1. ✅ Execute a migração
2. ✅ Verifique que os dados foram copiados
3. ✅ Confirme no MongoDB Atlas
4. ✅ Só depois atualize a string no Render

### **Após Atualizar String:**

1. ✅ Aguarde redeploy (5-10 minutos)
2. ✅ Verifique logs do Render
3. ✅ Confirme: "Database: zen-personal-trainer"
4. ✅ Teste login no site
5. ✅ Verifique se os dados aparecem

### **Backup de Segurança:**

- ❌ NÃO delete o banco `test` ainda
- ✅ Mantenha por alguns dias
- ✅ Só delete depois de confirmar que tudo funciona

---

## 🚀 Ordem de Execução:

### **1. Migrar Dados:**
```powershell
cd backend
node scripts/migrar-dados.js
```

### **2. Verificar no Atlas:**
- Acesse MongoDB Atlas
- Confirme que `zen-personal-trainer` tem os dados

### **3. Atualizar String no Render:**
- Copie de: `STRING_CONEXAO_CORRETA.txt`
- Cole no Render → Environment → MONGODB_URI

### **4. Aguardar Redeploy:**
- 5-10 minutos

### **5. Testar:**
- Acesse o site
- Faça login
- Verifique se os dados aparecem

---

## 🆘 Problemas Comuns:

### **Erro: "Duplicate key error"**
- O banco de produção já tem dados
- Solução: Delete o banco `zen-personal-trainer` e tente novamente

### **Erro: "Connection timeout"**
- Verifique sua internet
- Confirme que o IP está liberado no MongoDB Atlas

### **Dados não aparecem no site**
- Verifique se a string foi atualizada no Render
- Confirme nos logs: "Database: zen-personal-trainer"
- Aguarde mais tempo (pode demorar até 15 minutos)

---

## 📞 Próximos Passos:

1. ✅ Execute: `node scripts/migrar-dados.js`
2. ✅ Verifique no MongoDB Atlas
3. ✅ Me avise quando terminar
4. ✅ Aí atualizamos a string no Render

**Execute o script de migração e me avise o resultado!** 🚀
