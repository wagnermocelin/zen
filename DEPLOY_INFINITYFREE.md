# 🚀 Deploy no InfinityFree - Guia Completo

## ⚠️ IMPORTANTE: Limitações do InfinityFree

O **InfinityFree** é uma hospedagem gratuita com algumas limitações:
- ✅ **Suporta:** HTML, CSS, JavaScript, PHP, MySQL
- ❌ **NÃO suporta:** Node.js, Express, MongoDB

### 📋 Opções de Deploy:

#### **Opção 1: Frontend + Backend Separados (RECOMENDADO)**
- Frontend no InfinityFree (gratuito)
- Backend em outro serviço que suporte Node.js:
  - **Render.com** (gratuito)
  - **Railway.app** (gratuito com limites)
  - **Vercel** (gratuito, mas melhor para frontend)
  - **Heroku** (pago)

#### **Opção 2: Apenas Frontend (Modo Offline)**
- Deploy apenas do frontend no InfinityFree
- Usar localStorage (já está implementado)
- Sem backend, sem banco de dados na nuvem
- Dados salvos apenas no navegador

---

## 🎯 OPÇÃO 1: Frontend (InfinityFree) + Backend (Render)

Esta é a melhor opção gratuita completa!

### **PARTE A: Deploy do Backend no Render.com**

#### 1. Criar conta no Render
- Acesse: https://render.com
- Clique em **"Get Started"**
- Faça login com GitHub (recomendado)

#### 2. Preparar o Backend
Primeiro, vamos criar um arquivo `.gitignore` se não existir:

```bash
cd backend
```

Crie/edite `.gitignore`:
```
node_modules/
.env
*.log
```

#### 3. Criar repositório no GitHub
```bash
# No diretório backend
git init
git add .
git commit -m "Backend Zen Personal Trainer"
```

- Crie um repositório no GitHub
- Siga as instruções para fazer push

#### 4. Deploy no Render
1. No Render Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório do GitHub
3. Configure:
   - **Name**: `zen-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Variáveis de Ambiente** (Environment Variables):
   ```
   NODE_ENV=production
   MONGODB_URI=sua_string_mongodb_atlas
   JWT_SECRET=sua_chave_secreta_super_segura
   JWT_EXPIRE=30d
   CORS_ORIGIN=https://seu-site.infinityfreeapp.com
   PORT=10000
   ```

5. Clique em **"Create Web Service"**

6. Aguarde o deploy (5-10 minutos)

7. **Anote a URL do backend**: `https://zen-backend-xxxx.onrender.com`

### **PARTE B: Deploy do Frontend no InfinityFree**

#### 1. Criar conta no InfinityFree
- Acesse: https://infinityfree.net
- Clique em **"Sign Up"**
- Crie sua conta

#### 2. Criar um site
1. No painel, clique em **"Create Account"**
2. Escolha um subdomínio (ex: `zen-personal-trainer`)
3. Aguarde a criação (pode levar alguns minutos)

#### 3. Preparar o Frontend para Produção

**Criar arquivo de configuração da API:**

Crie `src/config/api.js`:
```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://zen-backend-xxxx.onrender.com/api'  // Sua URL do Render
  : 'http://localhost:5000/api';

export default API_URL;
```

#### 4. Build do Frontend
```bash
# No diretório raiz do projeto (zen)
npm run build
```

Isso criará uma pasta `dist/` com os arquivos otimizados.

#### 5. Upload para InfinityFree

**Opção A - Via File Manager (mais fácil):**
1. No painel do InfinityFree, clique em **"File Manager"**
2. Entre na pasta `htdocs`
3. **DELETE** todos os arquivos padrão
4. Faça upload de **TODOS** os arquivos da pasta `dist/`
5. Certifique-se de manter a estrutura de pastas

**Opção B - Via FTP:**
1. No painel, vá em **"FTP Details"**
2. Use um cliente FTP (FileZilla, WinSCP)
3. Conecte usando as credenciais fornecidas
4. Vá para `/htdocs`
5. Delete arquivos padrão
6. Faça upload da pasta `dist/`

#### 6. Configurar .htaccess para React Router

Crie um arquivo `.htaccess` dentro de `htdocs`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

#### 7. Testar
Acesse: `https://seu-site.infinityfreeapp.com`

---

## 🎯 OPÇÃO 2: Apenas Frontend (Modo Offline)

Se você quer apenas o frontend sem backend:

### 1. Build do Frontend
```bash
npm run build
```

### 2. Upload para InfinityFree
- Siga os passos 1-6 da Opção 1, Parte B
- O sistema funcionará usando apenas localStorage
- Dados salvos localmente no navegador

### 3. Limitações
- ❌ Sem sincronização entre dispositivos
- ❌ Dados perdidos ao limpar cache
- ✅ Funciona 100% offline
- ✅ Rápido e gratuito

---

## 📝 Checklist de Deploy

### Backend (Render):
- [ ] Conta criada no Render
- [ ] Repositório GitHub criado
- [ ] Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB Atlas conectado
- [ ] URL do backend anotada
- [ ] CORS configurado com URL do frontend

### Frontend (InfinityFree):
- [ ] Conta criada no InfinityFree
- [ ] Site criado
- [ ] Arquivo `api.js` configurado com URL do backend
- [ ] Build executado (`npm run build`)
- [ ] Arquivos enviados para `htdocs`
- [ ] `.htaccess` criado
- [ ] Site testado e funcionando

---

## 🐛 Problemas Comuns

### **Erro 404 ao navegar**
- Solução: Verifique se o `.htaccess` está correto

### **API não conecta**
- Verifique a URL da API em `api.js`
- Verifique CORS no backend
- Verifique se o backend está rodando no Render

### **Página em branco**
- Abra o Console (F12) e veja os erros
- Verifique se todos os arquivos foram enviados
- Verifique o caminho base no Vite

### **Upload lento no InfinityFree**
- Use FTP em vez do File Manager
- Compacte os arquivos em .zip e extraia no servidor

---

## 🎨 Melhorias Futuras

### **Domínio Próprio:**
- Compre um domínio (.com, .com.br)
- Configure no InfinityFree (gratuito)

### **HTTPS:**
- InfinityFree oferece SSL gratuito
- Ative nas configurações do site

### **CDN:**
- Use Cloudflare (gratuito)
- Melhora velocidade e segurança

---

## 💡 Dicas

1. **Teste local primeiro:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Mantenha backups:**
   - Sempre tenha cópia dos arquivos
   - Use Git para versionamento

3. **Monitore o Render:**
   - Plano gratuito "dorme" após 15min inativo
   - Primeira requisição pode demorar 30s

4. **Otimize imagens:**
   - Comprima antes do upload
   - Use formatos modernos (WebP)

---

## 📞 Suporte

- **InfinityFree Forum**: https://forum.infinityfree.net
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

**Pronto para fazer o deploy! Siga o guia passo a passo!** 🚀
