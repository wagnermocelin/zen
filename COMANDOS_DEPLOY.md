# 📋 Comandos para Deploy - Guia Rápido

## 🏗️ Build do Frontend

### 1. Instalar dependências (se necessário)
```bash
npm install
```

### 2. Gerar build de produção
```bash
npm run build
```

Isso criará a pasta `dist/` com todos os arquivos otimizados.

### 3. Testar build localmente (opcional)
```bash
npm run preview
```

Acesse: http://localhost:4173

---

## 📤 Upload para InfinityFree

### Arquivos que devem ser enviados:
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
└── .htaccess (criar manualmente)
```

### Passos:
1. Acesse o File Manager do InfinityFree
2. Vá para a pasta `htdocs`
3. **DELETE** todos os arquivos padrão
4. Faça upload de **TODOS** os arquivos da pasta `dist/`
5. Crie o arquivo `.htaccess` (copie o conteúdo de `public/.htaccess`)

---

## 🔧 Backend no Render.com

### 1. Preparar backend
```bash
cd backend
npm install
```

### 2. Testar localmente
```bash
npm run dev
```

### 3. Criar repositório Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 4. Push para GitHub
```bash
# Crie um repositório no GitHub primeiro
git remote add origin https://github.com/seu-usuario/zen-backend.git
git branch -M main
git push -u origin main
```

### 5. Deploy no Render
1. Acesse https://render.com
2. New + → Web Service
3. Conecte o repositório
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables (ver lista abaixo)

### Variáveis de Ambiente no Render:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zen-personal-trainer
JWT_SECRET=sua_chave_secreta_aqui_mude_isso
JWT_EXPIRE=30d
CORS_ORIGIN=https://seu-site.infinityfreeapp.com
PORT=10000
```

---

## ✅ Checklist Pré-Deploy

### Frontend:
- [ ] `npm install` executado
- [ ] `npm run build` executado sem erros
- [ ] Pasta `dist/` criada
- [ ] Arquivo `src/config/api.js` configurado com URL do backend
- [ ] Testado localmente com `npm run preview`

### Backend:
- [ ] MongoDB Atlas configurado e funcionando
- [ ] Variáveis de ambiente no `.env` corretas
- [ ] Testado localmente com `npm run dev`
- [ ] Repositório Git criado
- [ ] Push para GitHub feito
- [ ] Deploy no Render configurado
- [ ] URL do backend anotada

### InfinityFree:
- [ ] Conta criada
- [ ] Site criado
- [ ] FTP ou File Manager acessível
- [ ] Pasta `htdocs` limpa
- [ ] Arquivos do `dist/` enviados
- [ ] `.htaccess` criado
- [ ] Site acessível

---

## 🔄 Atualizar o Site (após mudanças)

### Frontend:
```bash
# 1. Fazer as alterações no código
# 2. Gerar novo build
npm run build

# 3. Fazer upload dos arquivos da pasta dist/ para o InfinityFree
# (sobrescrever os arquivos antigos)
```

### Backend:
```bash
# 1. Fazer as alterações no código
# 2. Commit e push
git add .
git commit -m "Descrição das mudanças"
git push

# 3. Render fará deploy automático
```

---

## 🐛 Resolver Problemas

### Site não carrega:
```bash
# Verificar se o build foi feito
npm run build

# Verificar se há erros
npm run preview
```

### API não conecta:
1. Verifique a URL em `src/config/api.js`
2. Verifique se o backend está rodando no Render
3. Verifique o CORS no backend
4. Abra o Console do navegador (F12) para ver erros

### Erro 404 ao navegar:
- Verifique se o `.htaccess` está na raiz do `htdocs`
- Verifique se o conteúdo do `.htaccess` está correto

---

## 📞 Links Úteis

- **InfinityFree Dashboard**: https://dash.infinityfree.net
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub**: https://github.com

---

## 💡 Dicas Finais

1. **Sempre teste localmente antes de fazer deploy**
2. **Mantenha backups dos arquivos**
3. **Use Git para versionamento**
4. **Documente as mudanças**
5. **Monitore os logs do Render para erros**

**Boa sorte com o deploy! 🚀**
