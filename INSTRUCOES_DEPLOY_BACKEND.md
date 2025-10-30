# 🚀 Deploy do Backend - Power Training

## Opções de Hospedagem Gratuita

### 1️⃣ **Render.com** (Recomendado)
- ✅ Gratuito
- ✅ Fácil de configurar
- ✅ Deploy automático via Git
- ✅ SSL grátis
- ⚠️ Pode dormir após 15 min de inatividade

### 2️⃣ **Railway.app**
- ✅ Gratuito (com limites)
- ✅ Deploy via Git
- ✅ Muito rápido

### 3️⃣ **Fly.io**
- ✅ Gratuito (tier básico)
- ✅ Boa performance

---

## 📋 Deploy no Render.com (Passo a Passo)

### **Passo 1: Preparar o Projeto**

#### 1.1. Verificar se o código está no GitHub
```bash
git status
git add .
git commit -m "Preparar para deploy"
git push origin main
```

#### 1.2. Criar arquivo `render.yaml` (Opcional)
Já está configurado no projeto!

---

### **Passo 2: Criar Conta no Render**

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Faça login com GitHub
4. Autorize o Render a acessar seus repositórios

---

### **Passo 3: Criar Web Service**

1. No Dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub: `wagnermocelin/zen`
4. Configure:

```
Name: power-training-backend
Region: Oregon (US West) ou Frankfurt (Europe)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

5. Selecione o plano **"Free"**

---

### **Passo 4: Configurar Variáveis de Ambiente**

No painel do Render, vá em **"Environment"** e adicione:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wagnermocelin_db_user:4y9r8MGYUucNF9Hk@cluster0.iujtjjc.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_isso
JWT_EXPIRE=30d
CORS_ORIGIN=https://seu-dominio-frontend.netlify.app
FRONTEND_URL=https://seu-dominio-frontend.netlify.app
```

⚠️ **IMPORTANTE:** 
- Substitua `CORS_ORIGIN` pela URL do seu frontend
- Substitua `FRONTEND_URL` pela URL do seu frontend
- Use uma `JWT_SECRET` forte e única

---

### **Passo 5: Deploy**

1. Clique em **"Create Web Service"**
2. Aguarde o build (3-5 minutos)
3. Quando aparecer **"Live"**, seu backend está no ar! 🎉

---

## 🔗 Obter URL do Backend

Após o deploy, você receberá uma URL como:
```
https://power-training-backend.onrender.com
```

Copie essa URL, você vai precisar dela para configurar o frontend!

---

## 🔧 Configurar Frontend para Usar o Backend

### Atualizar URL da API no Frontend

Edite o arquivo: `src/services/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://power-training-backend.onrender.com/api';
```

Ou crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=https://power-training-backend.onrender.com/api
```

---

## 🧪 Testar o Backend

### 1. Testar rota principal
```bash
curl https://power-training-backend.onrender.com/
```

Deve retornar:
```json
{
  "message": "API Power Training",
  "version": "1.0.0",
  "status": "online"
}
```

### 2. Testar login
Acesse o frontend e tente fazer login!

---

## 📊 Monitorar o Backend

### Ver Logs
1. Acesse o Dashboard do Render
2. Clique no seu serviço
3. Vá em **"Logs"**
4. Veja os logs em tempo real

### Métricas
- CPU usage
- Memory usage
- Request count
- Response time

---

## 🔄 Atualizar o Backend

### Deploy Automático
Sempre que você fizer `git push origin main`, o Render fará deploy automático!

### Deploy Manual
1. Acesse o Dashboard
2. Clique em **"Manual Deploy"**
3. Selecione **"Deploy latest commit"**

---

## ⚠️ Problemas Comuns

### Backend "dormindo"
**Problema:** Render free tier dorme após 15 min de inatividade
**Solução:** 
- Primeira requisição pode demorar 30-60 segundos
- Use um serviço de "ping" para manter ativo (ex: UptimeRobot)

### Erro de CORS
**Problema:** `Access-Control-Allow-Origin` error
**Solução:** 
- Verifique se `CORS_ORIGIN` está correto no Render
- Deve ser a URL EXATA do frontend (sem barra no final)

### Erro de Conexão MongoDB
**Problema:** `MongoServerError: Authentication failed`
**Solução:**
- Verifique se `MONGODB_URI` está correta
- Verifique se o IP do Render está liberado no MongoDB Atlas
- No MongoDB Atlas: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Build falhou
**Problema:** Build error no Render
**Solução:**
- Verifique os logs de build
- Certifique-se que `package.json` está correto
- Verifique se todas as dependências estão instaladas

---

## 🎯 Checklist Final

Antes de considerar o deploy completo:

- [ ] Backend deployado no Render
- [ ] URL do backend copiada
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB Atlas com IP liberado (0.0.0.0/0)
- [ ] Frontend atualizado com URL do backend
- [ ] Teste de login funcionando
- [ ] Teste de criação de aluno funcionando
- [ ] Teste de criação de treino funcionando
- [ ] Teste de criação de dieta funcionando

---

## 🚀 Alternativa: Railway.app

Se preferir usar Railway:

1. Acesse: https://railway.app
2. Login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione `wagnermocelin/zen`
5. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
6. Adicione as mesmas variáveis de ambiente
7. Deploy!

URL será algo como: `https://power-training-backend.railway.app`

---

## 📚 Recursos Úteis

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

## 🎉 Pronto!

Seu backend está no ar e pronto para receber requisições do frontend! 🚀

**Próximo passo:** Deploy do frontend no Netlify ou Vercel
