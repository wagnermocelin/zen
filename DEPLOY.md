# 🚀 Guia de Deploy - Zen Personal Trainer

## 📋 Visão Geral

Este projeto consiste em:
- **Frontend:** React + Vite
- **Backend:** Node.js + Express + MongoDB

## 🎯 Opções de Deploy Recomendadas

### Opção 1: Render (Recomendado - Gratuito)

#### Backend no Render:
1. Acesse https://render.com e crie uma conta
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** zen-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Adicione as variáveis de ambiente:
   - `MONGODB_URI` = sua string de conexão do MongoDB Atlas
   - `JWT_SECRET` = uma string secreta aleatória
   - `NODE_ENV` = production
   - `PORT` = 5000

#### Frontend no Render:
1. Clique em "New +" → "Static Site"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** zen-frontend
   - **Root Directory:** (deixe vazio)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** dist
4. Adicione variável de ambiente:
   - `VITE_API_URL` = URL do seu backend (ex: https://zen-backend.onrender.com)

---

### Opção 2: Vercel (Frontend) + Render (Backend)

#### Backend no Render (mesmo processo acima)

#### Frontend no Vercel:
1. Acesse https://vercel.com
2. Importe seu repositório
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
4. Adicione variável de ambiente:
   - `VITE_API_URL` = URL do seu backend

---

### Opção 3: Railway (Tudo em um)

1. Acesse https://railway.app
2. Crie um novo projeto
3. Adicione o MongoDB (ou use MongoDB Atlas)
4. Adicione o Backend:
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione o Frontend:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

---

## 🔧 Preparação para Deploy

### 1. Atualizar variáveis de ambiente

#### Backend (.env):
```env
MONGODB_URI=sua_string_mongodb_atlas
JWT_SECRET=sua_chave_secreta_muito_segura
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://seu-frontend.vercel.app
```

#### Frontend (.env.production):
```env
VITE_API_URL=https://seu-backend.onrender.com
```

### 2. Atualizar CORS no backend

Edite `backend/server.js`:
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};
```

### 3. Atualizar API URL no frontend

Edite `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 📦 Scripts de Build

### Backend (package.json):
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Frontend (package.json):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🔄 Processo de Deploy Rápido

### Se você já tem tudo configurado:

#### 1. Commit suas mudanças:
```bash
git add .
git commit -m "Atualizar sistema - Todas funcionalidades implementadas"
git push origin main
```

#### 2. Deploy automático:
- Render, Vercel e Railway fazem deploy automático ao detectar push no GitHub

#### 3. Verificar logs:
- Acesse o dashboard do serviço
- Verifique os logs de build e runtime
- Teste a aplicação

---

## ✅ Checklist Pré-Deploy

- [ ] MongoDB Atlas configurado e acessível
- [ ] Variáveis de ambiente configuradas
- [ ] CORS atualizado com URL do frontend
- [ ] API URL atualizada no frontend
- [ ] Código commitado no GitHub
- [ ] Primeiro usuário criado no banco
- [ ] Testado localmente

---

## 🆘 Troubleshooting

### Backend não inicia:
- Verifique as variáveis de ambiente
- Confirme que MONGODB_URI está correto
- Verifique os logs do serviço

### Frontend não conecta ao backend:
- Verifique VITE_API_URL
- Confirme que CORS está configurado corretamente
- Teste a URL do backend diretamente

### Erro 401/403:
- Verifique JWT_SECRET
- Confirme que o token está sendo enviado
- Verifique se o usuário existe no banco

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do serviço
2. Teste as rotas da API com Postman
3. Verifique o console do navegador

---

## 🎉 Após o Deploy

Seu sistema estará disponível em:
- **Frontend:** https://zen-frontend.vercel.app (ou similar)
- **Backend:** https://zen-backend.onrender.com/api (ou similar)

**Criado por Wagner Henrique Mocelin**
