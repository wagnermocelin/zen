# 📋 Passo a Passo: Corrigir String no Render

## 🎯 String Correta:

```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

---

## 📝 Passo a Passo:

### **Passo 1: Acessar Render**
1. Abra o navegador
2. Vá para: https://dashboard.render.com
3. Faça login

### **Passo 2: Selecionar Serviço**
1. Na lista de serviços, clique no seu backend
2. (Deve ser algo como "zen-backend" ou "zen")

### **Passo 3: Ir para Environment**
1. No menu lateral esquerdo, clique em **"Environment"**
2. Você verá uma lista de variáveis

### **Passo 4: Editar MONGODB_URI**
1. Procure a variável chamada: `MONGODB_URI`
2. Clique no ícone de **lápis** (Edit) ao lado dela
3. Você verá um campo de texto com a string atual

### **Passo 5: Substituir String**
1. **DELETE** todo o conteúdo atual
2. **COLE** esta string:
```
mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
```

### **Passo 6: Salvar**
1. Clique no botão **"Save Changes"** (canto superior direito)
2. Aparecerá uma mensagem: "Redeploying..."

### **Passo 7: Aguardar Deploy**
1. Clique em **"Logs"** no menu lateral
2. Aguarde 5-10 minutos
3. Procure por estas mensagens:
```
✅ MongoDB conectado: ac-krlsmgn-shard-00-00.iujtjjc.mongodb.net
📦 Database: zen-personal-trainer
🚀 Servidor rodando na porta 10000
```

### **Passo 8: Verificar**
1. Se aparecer "Database: zen-personal-trainer" → **✅ SUCESSO!**
2. Se aparecer "Database: test" → ❌ Algo deu errado

---

## 🧪 Testar Após Deploy:

### **1. Testar API:**
Abra no navegador:
```
https://zen-u03e.onrender.com
```

Deve retornar:
```json
{
  "message": "API Power Training",
  "version": "1.0.0",
  "status": "online"
}
```

### **2. Criar Usuário:**
Abra o arquivo: `criar-usuario-producao.html`
Clique em "Criar Usuário Wagner"

### **3. Verificar no MongoDB Atlas:**
1. Acesse: https://cloud.mongodb.com
2. Clique em **"Browse Collections"**
3. Você deve ver o banco: `zen-personal-trainer`
4. Dentro dele, a collection: `users`
5. Com o usuário: wagner@zen.com

---

## ⚠️ Problemas Comuns:

### **Erro: "Invalid connection string"**
- Verifique se copiou a string completa
- Não pode ter espaços no início ou fim
- Deve começar com `mongodb+srv://`

### **Ainda aparece "Database: test"**
- Aguarde mais tempo (pode demorar até 15 minutos)
- Force um novo deploy: Manual Deploy → Deploy latest commit

### **Erro: "Authentication failed"**
- A senha está correta na string
- Verifique no MongoDB Atlas se o usuário existe

---

## 📞 Depois de Corrigir:

1. ✅ Aguarde deploy terminar
2. ✅ Verifique logs
3. ✅ Crie usuário
4. ✅ Teste login no site
5. ✅ Me avise se funcionou!

---

**Siga este guia e me avise quando terminar!** 🚀
