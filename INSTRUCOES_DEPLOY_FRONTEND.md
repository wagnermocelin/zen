# 🚀 Deploy do Frontend - Power Training

## 📋 Pré-requisitos

Antes de fazer o deploy do frontend, você precisa:

1. ✅ Backend deployado e funcionando
2. ✅ URL do backend (ex: `https://power-training-backend.onrender.com`)
3. ✅ Conta no Netlify ou Vercel (gratuita)

---

## 🎯 Opção 1: Deploy no Netlify (Recomendado)

### **Passo 1: Configurar URL do Backend**

Edite o arquivo `.env.production`:

```env
VITE_API_URL=https://power-training-backend.onrender.com/api
```

⚠️ **Substitua pela URL real do seu backend!**

### **Passo 2: Fazer Build do Projeto**

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

### **Passo 3: Deploy no Netlify**

#### Opção A: Via Interface Web (Mais Fácil)

1. Acesse: https://app.netlify.com
2. Faça login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Selecione **GitHub**
5. Escolha o repositório: `wagnermocelin/zen`
6. Configure:
   ```
   Branch to deploy: main
   Base directory: (deixe vazio)
   Build command: npm run build
   Publish directory: dist
   ```
7. Clique em **"Advanced"** → **"New variable"**
8. Adicione:
   ```
   Key: VITE_API_URL
   Value: https://power-training-backend.onrender.com/api
   ```
9. Clique em **"Deploy site"**

#### Opção B: Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Quando perguntar:
- **Publish directory:** `dist`
- Confirme o deploy

### **Passo 4: Obter URL do Frontend**

Após o deploy, você receberá uma URL como:
```
https://power-training-app.netlify.app
```

### **Passo 5: Configurar Domínio Customizado (Opcional)**

1. No Netlify, vá em **Domain settings**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `powertraining.com.br`)
4. Siga as instruções para configurar DNS

---

## 🎯 Opção 2: Deploy no Vercel

### **Passo 1: Configurar URL do Backend**

Mesmo processo do Netlify - edite `.env.production`

### **Passo 2: Deploy no Vercel**

#### Via Interface Web

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New"** → **"Project"**
4. Selecione o repositório: `wagnermocelin/zen`
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```
6. Em **Environment Variables**, adicione:
   ```
   VITE_API_URL = https://power-training-backend.onrender.com/api
   ```
7. Clique em **"Deploy"**

#### Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🎯 Opção 3: Deploy via FTP (InfinityFree)

### **Passo 1: Fazer Build**

```bash
npm run build
```

### **Passo 2: Upload via FTP**

Use o script PowerShell:

```powershell
.\deploy-ftp.ps1
```

Ou manualmente:
1. Acesse o File Manager do InfinityFree
2. Entre em `htdocs/`
3. Delete arquivos antigos
4. Faça upload de TODOS os arquivos da pasta `dist/`

⚠️ **Importante:** Certifique-se de que o arquivo `.env.production` tem a URL correta do backend!

---

## 🔧 Atualizar URL do Backend no Frontend Deployado

### Netlify

1. Acesse o Dashboard do Netlify
2. Vá em **Site settings** → **Environment variables**
3. Edite `VITE_API_URL`
4. Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**

### Vercel

1. Acesse o Dashboard do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Edite `VITE_API_URL`
4. Faça um novo deploy

---

## 🔄 Configurar CORS no Backend

Após obter a URL do frontend, você precisa configurar o CORS no backend!

### No Render (Backend)

1. Acesse o Dashboard do Render
2. Vá em **Environment**
3. Edite as variáveis:
   ```
   CORS_ORIGIN=https://power-training-app.netlify.app
   FRONTEND_URL=https://power-training-app.netlify.app
   ```
4. Salve (o backend reiniciará automaticamente)

⚠️ **Substitua pela URL real do seu frontend!**

---

## 🧪 Testar o Deploy

### 1. Acessar o Site

Abra a URL do frontend no navegador

### 2. Testar Login

1. Tente fazer login
2. Se der erro de CORS, verifique se configurou corretamente no backend

### 3. Testar Funcionalidades

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Criar aluno funciona
- [ ] Criar treino funciona
- [ ] Criar dieta funciona
- [ ] Upload de logo funciona
- [ ] Busca de alimentos funciona
- [ ] Busca de exercícios funciona

---

## ⚠️ Problemas Comuns

### Erro: "Failed to fetch" ou "Network Error"

**Causa:** Backend não está acessível ou CORS não configurado

**Solução:**
1. Verifique se o backend está rodando (acesse a URL do backend)
2. Verifique se `CORS_ORIGIN` no backend está correto
3. Verifique se `VITE_API_URL` no frontend está correto

### Erro: "Access-Control-Allow-Origin"

**Causa:** CORS não configurado corretamente

**Solução:**
1. No backend (Render), configure `CORS_ORIGIN` com a URL EXATA do frontend
2. Não coloque barra `/` no final da URL
3. Reinicie o backend

### Página em branco após deploy

**Causa:** Caminho dos assets incorreto

**Solução:**
1. Verifique o `vite.config.js`
2. Certifique-se de que `base` está correto
3. Refaça o build e deploy

### Imagens não carregam

**Causa:** Caminho relativo incorreto

**Solução:**
1. Use caminhos absolutos para assets
2. Verifique se as imagens estão na pasta `public/`

---

## 📊 Monitoramento

### Netlify Analytics

1. Acesse o Dashboard
2. Vá em **Analytics**
3. Veja:
   - Page views
   - Unique visitors
   - Top pages
   - Bandwidth usage

### Logs

1. Acesse **Deploys**
2. Clique no deploy
3. Veja os logs de build

---

## 🔄 Deploy Automático

### Configurar Deploy Automático

Tanto Netlify quanto Vercel fazem deploy automático quando você faz `git push`!

```bash
git add .
git commit -m "atualizar frontend"
git push origin main
```

O deploy acontece automaticamente! 🎉

---

## 🎯 Checklist Final

Antes de considerar o deploy completo:

- [ ] Build do frontend sem erros
- [ ] `.env.production` com URL correta do backend
- [ ] Deploy no Netlify/Vercel concluído
- [ ] URL do frontend copiada
- [ ] CORS configurado no backend com URL do frontend
- [ ] Teste de login funcionando
- [ ] Todas as funcionalidades testadas
- [ ] SSL/HTTPS funcionando (automático no Netlify/Vercel)

---

## 🚀 Comandos Rápidos

### Build Local
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

### Deploy Netlify
```bash
netlify deploy --prod
```

### Deploy Vercel
```bash
vercel --prod
```

---

## 📚 Recursos Úteis

- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 Pronto!

Seu frontend está no ar e conectado ao backend! 🚀

**URLs Finais:**
- Frontend: `https://power-training-app.netlify.app`
- Backend: `https://power-training-backend.onrender.com`
- API: `https://power-training-backend.onrender.com/api`
