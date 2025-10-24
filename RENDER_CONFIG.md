# 🔧 Configuração do Render - Passo a Passo

## ⚠️ Erro: "Exited with status 1"

Esse erro geralmente significa que faltam **variáveis de ambiente** ou há erro de conexão com o MongoDB.

## 📋 Configuração Completa no Render

### **1. Acessar Settings do Web Service**

1. Vá para https://dashboard.render.com
2. Clique no seu serviço **zen-backend**
3. Clique em **"Environment"** no menu lateral

### **2. Adicionar TODAS as Variáveis de Ambiente**

Clique em **"Add Environment Variable"** e adicione cada uma:

#### **Variável 1: NODE_ENV**
- **Key**: `NODE_ENV`
- **Value**: `production`

#### **Variável 2: MONGODB_URI**
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9RW@ac-krlsmgn.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority`

⚠️ **IMPORTANTE**: Use sua string COMPLETA do MongoDB Atlas!

#### **Variável 3: JWT_SECRET**
- **Key**: `JWT_SECRET`
- **Value**: `zen_personal_trainer_secret_key_2024_production_secure`

#### **Variável 4: JWT_EXPIRE**
- **Key**: `JWT_EXPIRE`
- **Value**: `30d`

#### **Variável 5: CORS_ORIGIN**
- **Key**: `CORS_ORIGIN`
- **Value**: `*` (por enquanto, depois você muda para a URL do InfinityFree)

#### **Variável 6: PORT**
- **Key**: `PORT`
- **Value**: `10000`

### **3. Salvar e Fazer Redeploy**

1. Clique em **"Save Changes"**
2. O Render fará redeploy automático
3. Aguarde 5-10 minutos

---

## 🔍 Verificar Logs

### **Como ver os logs:**

1. No Render Dashboard
2. Clique no seu serviço
3. Clique em **"Logs"** no menu lateral

### **Logs de Sucesso (o que você DEVE ver):**

```
==> Cloning from https://github.com/wagnermocelin/zen
==> Using Node version 18.x
==> Building...
==> Running 'npm install'
added 156 packages
==> Starting service...
==> Running 'npm start'
✅ MongoDB conectado: ac-krlsmgn-shard-00-00.iujtjjc.mongodb.net
📦 Database: zen-personal-trainer
🚀 Servidor rodando na porta 10000
📊 Ambiente: production
🌐 CORS habilitado para: *
```

### **Erros Comuns:**

#### **Erro 1: MongoDB connection failed**
```
❌ Erro ao conectar ao MongoDB
```
**Solução:**
- Verifique se a variável `MONGODB_URI` está correta
- Verifique se o IP do Render está liberado no MongoDB Atlas
- No MongoDB Atlas → Network Access → Add IP Address → **0.0.0.0/0** (Allow from anywhere)

#### **Erro 2: Cannot find module**
```
Error: Cannot find module 'express'
```
**Solução:**
- Verifique se o `package.json` está na pasta `backend/`
- Build Command deve ser: `npm install`

#### **Erro 3: Port already in use**
```
Error: listen EADDRINUSE: address already in use
```
**Solução:**
- Não deve acontecer no Render, mas se acontecer, verifique a variável `PORT`

---

## 🔐 MongoDB Atlas - Liberar IP do Render

### **Passo a Passo:**

1. Acesse https://cloud.mongodb.com
2. Clique no seu cluster
3. Clique em **"Network Access"** (menu lateral)
4. Clique em **"Add IP Address"**
5. Selecione **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Comment: `Render.com`
6. Clique em **"Confirm"**

⚠️ **Importante**: Aguarde 1-2 minutos para a configuração ser aplicada.

---

## 📝 Checklist de Configuração

### Render:
- [ ] Web Service criado
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Todas as 6 variáveis de ambiente adicionadas
- [ ] Deploy realizado

### MongoDB Atlas:
- [ ] Cluster ativo
- [ ] Usuário criado
- [ ] Senha correta
- [ ] Network Access liberado (0.0.0.0/0)
- [ ] String de conexão copiada

### GitHub:
- [ ] Repositório atualizado
- [ ] Pasta `backend/` existe
- [ ] Arquivos commitados

---

## 🧪 Testar a API

Após o deploy bem-sucedido, teste:

### **1. Verificar se está online:**
```
https://seu-servico.onrender.com
```

Deve retornar:
```json
{
  "message": "API Zen Personal Trainer",
  "version": "1.0.0",
  "status": "online"
}
```

### **2. Testar rota de registro:**
```
POST https://seu-servico.onrender.com/api/auth/register
Content-Type: application/json

{
  "name": "Teste",
  "email": "teste@teste.com",
  "password": "123456"
}
```

---

## 🔄 Se Ainda Não Funcionar

### **1. Verificar Logs Detalhados:**
- Vá em **Logs** no Render
- Procure por mensagens de erro em vermelho
- Copie a mensagem de erro completa

### **2. Verificar Build:**
- Vá em **Events** no Render
- Veja se o build foi bem-sucedido

### **3. Verificar Variáveis:**
- Vá em **Environment**
- Confirme que TODAS as 6 variáveis estão lá
- Verifique se não há espaços extras

### **4. Forçar Redeploy:**
- Vá em **Manual Deploy**
- Clique em **"Deploy latest commit"**

---

## 💡 Dicas

1. **Primeiro Deploy é Lento**: Pode levar até 15 minutos
2. **Plano Free "Dorme"**: Após 15min inativo, o serviço para. Primeira requisição demora ~30s
3. **Logs em Tempo Real**: Mantenha a aba de Logs aberta durante o deploy
4. **MongoDB Atlas**: Sempre libere o IP 0.0.0.0/0 para evitar problemas

---

## 📞 Próximos Passos

Após o backend estar funcionando:

1. ✅ Anote a URL do Render: `https://seu-servico.onrender.com`
2. ✅ Atualize `src/config/api.js` com essa URL
3. ✅ Faça build do frontend: `npm run build`
4. ✅ Faça upload para InfinityFree

---

**Siga este guia e o deploy vai funcionar! 🚀**
