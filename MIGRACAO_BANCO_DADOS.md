# 🔄 Migração de Dados - test → zen-personal-trainer

## 📊 Situação Atual:

- ❌ Dados salvos no banco: `test`
- ✅ Banco correto deveria ser: `zen-personal-trainer`

## 🎯 Solução:

### **Opção 1: Corrigir String de Conexão (RECOMENDADO)**

A string de conexão do MongoDB deve especificar o nome do banco.

#### **1. Verificar String Atual:**

Sua string deve estar assim:
```
mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
```

#### **2. Corrigir para:**

```
mongodb+srv://usuario:senha@cluster.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

**Diferença:** Adicionar `/zen-personal-trainer` antes do `?`

#### **3. Atualizar no Render:**

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço backend
3. Vá em **"Environment"**
4. Edite a variável `MONGODB_URI`
5. Adicione `/zen-personal-trainer` na string
6. Clique em **"Save Changes"**
7. O Render fará redeploy automático

#### **4. Exemplo Completo:**

**ANTES:**
```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/?retryWrites=true&w=majority
```

**DEPOIS:**
```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

---

### **Opção 2: Migrar Dados Existentes**

Se você já tem dados importantes no banco `test` e quer movê-los:

#### **Via MongoDB Atlas (Interface Web):**

1. Acesse: https://cloud.mongodb.com
2. Vá em **"Browse Collections"**
3. Selecione o banco `test`
4. Para cada collection:
   - Clique em **"..."** → **"Export Collection"**
   - Baixe o JSON
5. Vá para o banco `zen-personal-trainer`
6. Crie as collections
7. Importe os dados

#### **Via MongoDB Compass (Mais Fácil):**

1. Baixe MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Conecte usando sua string do MongoDB Atlas
3. Arraste as collections de `test` para `zen-personal-trainer`

---

### **Opção 3: Renomear Banco no Atlas**

1. Acesse MongoDB Atlas
2. Vá em **"Browse Collections"**
3. Não é possível renomear diretamente
4. Você precisa criar novo banco e migrar dados

---

## 🚀 Passo a Passo Recomendado:

### **1. Corrigir String de Conexão no Render:**

```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

### **2. Aguardar Redeploy:**

O Render fará deploy automático (5-10 minutos)

### **3. Criar Novo Usuário:**

Depois do redeploy, crie o usuário novamente:

```powershell
.\criar-usuario-render.ps1
```

Ou use o arquivo HTML: `criar-usuario-producao.html`

### **4. Verificar:**

1. Acesse MongoDB Atlas
2. Vá em **"Browse Collections"**
3. Verifique se o banco `zen-personal-trainer` foi criado
4. Veja se o usuário está lá

---

## 📝 Verificar String de Conexão Atual:

### **No Render:**

1. Dashboard → Seu serviço
2. Environment → `MONGODB_URI`
3. Veja se tem `/zen-personal-trainer` antes do `?`

### **Localmente (.env):**

Abra `backend/.env` e verifique:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

---

## 🧪 Testar Conexão:

Depois de corrigir, teste:

```powershell
cd backend
npm run dev
```

Deve mostrar:
```
✅ MongoDB conectado: ac-krlsmgn-shard-00-00.iujtjjc.mongodb.net
📦 Database: zen-personal-trainer  ← Deve ser este nome!
```

---

## ⚠️ Importante:

### **Se você tem dados importantes no banco `test`:**

1. **NÃO** delete o banco `test` ainda
2. Primeiro corrija a string de conexão
3. Crie novos dados no banco correto
4. Depois migre os dados antigos se necessário
5. Por último, delete o banco `test`

### **Se os dados no `test` são apenas testes:**

1. Corrija a string de conexão
2. Crie novo usuário
3. Ignore o banco `test` (pode deletar depois)

---

## 🔧 String de Conexão Correta:

### **Formato:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### **Partes:**
- `<username>`: wagnermocelin_db_user
- `<password>`: 4y9r8MGYUucNF9RW
- `<cluster>`: ac-krlsmgn.iujtjjc
- `<database>`: **zen-personal-trainer** ← Este é o importante!

---

## 📞 Próximos Passos:

1. ✅ Atualizar `MONGODB_URI` no Render
2. ✅ Aguardar redeploy
3. ✅ Criar usuário novamente
4. ✅ Testar login
5. ✅ Verificar dados no banco correto

**Corrija a string de conexão no Render e me avise!** 🚀
