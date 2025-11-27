# 🚀 Deploy do Frontend - Power Training

## ✅ Build Concluído!

O build foi realizado com sucesso:
- ✅ `dist/index.html` - 0.62 kB
- ✅ `dist/assets/index-BwCWMUCh.css` - 26.21 kB
- ✅ `dist/assets/index-BZxErh0v.js` - 796.21 kB
- ✅ API configurada para: `https://power-training-backend.onrender.com/api`

---

## 🌐 Opções de Deploy

### Opção 1: Netlify (Recomendado) ⭐

#### Via Git (Automático)

1. **Commit e Push**
   ```bash
   git add .
   git commit -m "frontend ready for deploy"
   git push origin main
   ```

2. **Acessar Netlify**
   - https://app.netlify.com
   - Login com GitHub

3. **Importar Projeto**
   - "Add new site" → "Import an existing project"
   - Escolha GitHub
   - Selecione repositório `wagnermocelin/zen`

4. **Configurações**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch:** `main`

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build (2-3 minutos)
   - Site estará disponível em: `https://seu-site.netlify.app`

#### Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

---

### Opção 2: Vercel

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configurar**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

### Opção 3: InfinityFree (FTP)

#### Via Script PowerShell

```bash
.\deploy-simple.ps1
```

Depois faça upload manual:
1. Acesse https://app.infinityfree.com
2. File Manager → `htdocs/`
3. DELETE arquivos antigos
4. Upload todos os arquivos de `dist/`

#### Via FileZilla

1. **Conectar**
   - Host: `ftpupload.net`
   - Username: `if0_40238999`
   - Password: `J25021989j`
   - Port: 21

2. **Upload**
   - Navegue até `/htdocs/`
   - Delete arquivos antigos
   - Upload pasta `dist/` completa

---

## 🔧 Configurações Importantes

### 1. URL da API

Já configurado em `src/config/api.js`:
```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://power-training-backend.onrender.com/api'
  : 'http://localhost:5000/api';
```

### 2. CORS no Backend

Certifique-se de que o backend aceita requisições do domínio do frontend.

No `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://seu-site.netlify.app',
    'https://seu-dominio.infinityfreeapp.com'
  ],
  credentials: true
}));
```

### 3. Variáveis de Ambiente

Não há variáveis de ambiente no frontend (tudo está no código).

---

## ✅ Checklist Pré-Deploy

- [x] Build executado sem erros
- [x] API URL configurada para produção
- [x] `netlify.toml` configurado
- [x] Código commitado no Git
- [ ] CORS configurado no backend
- [ ] Domínio personalizado (opcional)

---

## 🧪 Testar Após Deploy

1. **Acessar o site**
   - Abra a URL fornecida pelo Netlify/Vercel

2. **Testar Login**
   - Email: `wagner@gmail.com`
   - Senha: `123456`

3. **Verificar Funcionalidades**
   - [ ] Login funciona
   - [ ] Dashboard carrega
   - [ ] Alunos listam
   - [ ] Treinos funcionam
   - [ ] Wellhub check-in funciona
   - [ ] Imagens carregam

4. **Verificar Console**
   - F12 → Console
   - Não deve ter erros de CORS
   - API deve responder corretamente

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
**Causa:** Backend não está respondendo
**Solução:** 
1. Verifique se backend está online: https://power-training-backend.onrender.com/api
2. Aguarde o backend "acordar" (Render free tier)

### Erro: CORS
**Causa:** Backend não aceita requisições do domínio
**Solução:** Adicione o domínio no CORS do backend

### Página em branco
**Causa:** Erro de roteamento
**Solução:** Verifique se `netlify.toml` está configurado

### Imagens não carregam
**Causa:** URLs relativas
**Solução:** Imagens devem estar em `public/` ou usar URLs absolutas

---

## 📊 Monitoramento

### Netlify
- Dashboard: https://app.netlify.com
- Logs de build
- Analytics
- Deploy previews

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs em tempo real
- Analytics
- Edge functions

---

## 🎯 Próximos Passos

1. ✅ Deploy realizado
2. ✅ Testar todas as funcionalidades
3. ✅ Configurar domínio personalizado (opcional)
4. ✅ Configurar SSL (automático no Netlify/Vercel)
5. ✅ Monitorar erros e performance
6. ✅ Treinar equipe

---

## 🔗 URLs Importantes

- **Frontend (Netlify):** `https://seu-site.netlify.app`
- **Backend (Render):** `https://power-training-backend.onrender.com`
- **API:** `https://power-training-backend.onrender.com/api`
- **Repositório:** `https://github.com/wagnermocelin/zen`

---

## 📝 Comandos Úteis

```bash
# Build local
npm run build

# Preview do build
npm run preview

# Deploy Netlify
netlify deploy --prod --dir=dist

# Deploy Vercel
vercel --prod

# Ver logs
netlify logs

# Rollback (Netlify)
# Via dashboard: Deploys → escolha versão anterior → Publish deploy
```

---

## 🎉 Sucesso!

Seu frontend está pronto para deploy! 🚀

Escolha uma das opções acima e siga os passos.
