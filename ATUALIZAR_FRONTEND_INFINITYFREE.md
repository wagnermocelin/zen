# 🔄 Atualizar Frontend no InfinityFree

## 📋 Pré-requisitos

- ✅ Backend deployado no Render
- ✅ URL do backend (ex: `https://power-training-backend.onrender.com`)
- ✅ Acesso ao InfinityFree

---

## 🚀 Passo a Passo

### **1. Configurar URL do Backend**

O arquivo `.env.production` já está configurado com:
```env
VITE_API_URL=https://power-training-backend.onrender.com/api
```

⚠️ **Se a URL do seu backend for diferente, edite este arquivo!**

---

### **2. Fazer Build do Projeto**

Abra o terminal na pasta do projeto e execute:

```bash
npm run build
```

Aguarde o build completar (1-2 minutos). Isso criará a pasta `dist/` com os arquivos otimizados.

---

### **3. Upload para InfinityFree**

#### Opção A: Via Script PowerShell (Automático)

```powershell
.\deploy-ftp.ps1
```

O script irá:
1. Fazer build automaticamente
2. Conectar ao FTP
3. Fazer upload de todos os arquivos

#### Opção B: Via File Manager (Manual)

1. Acesse: https://app.infinityfree.com
2. Clique em **"Control Panel"**
3. Vá em **"File Manager"**
4. Entre na pasta `htdocs/`
5. **DELETE todos os arquivos antigos**
6. Clique em **"Upload"**
7. Selecione **TODOS** os arquivos da pasta `dist/`
8. Aguarde o upload completar

#### Opção C: Via FileZilla (FTP Client)

1. Abra o FileZilla
2. Conecte com suas credenciais FTP
3. No lado direito, navegue até `htdocs/`
4. **DELETE todos os arquivos antigos**
5. No lado esquerdo, navegue até a pasta `dist/` do projeto
6. Selecione todos os arquivos
7. Arraste para o lado direito (upload)

---

### **4. Configurar CORS no Backend**

Após o upload, você precisa configurar o CORS no backend para aceitar requisições do seu domínio!

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço **power-training-backend**
3. Vá em **"Environment"**
4. Edite/Adicione as variáveis:

```env
CORS_ORIGIN=https://seu-dominio.infinityfree.app
FRONTEND_URL=https://seu-dominio.infinityfree.app
```

⚠️ **Substitua `seu-dominio.infinityfree.app` pela URL real do seu site!**

5. Clique em **"Save Changes"**
6. O backend reiniciará automaticamente

---

### **5. Testar o Site**

1. Acesse seu site no InfinityFree
2. Tente fazer login
3. Teste as funcionalidades:
   - [ ] Login funciona
   - [ ] Dashboard carrega
   - [ ] Criar aluno
   - [ ] Criar treino
   - [ ] Criar dieta
   - [ ] Buscar alimentos
   - [ ] Buscar exercícios

---

## 🔧 Atualizar o Site (Próximas Vezes)

Sempre que fizer mudanças no código:

### Passo 1: Commit e Push
```bash
git add .
git commit -m "descricao das mudancas"
git push origin main
```

### Passo 2: Build
```bash
npm run build
```

### Passo 3: Upload
```powershell
.\deploy-ftp.ps1
```

Ou faça upload manual dos arquivos da pasta `dist/`

---

## ⚠️ Problemas Comuns

### Erro: "Failed to fetch" ou "Network Error"

**Causa:** Backend não está acessível ou CORS não configurado

**Solução:**
1. Verifique se o backend está rodando
   - Acesse: `https://power-training-backend.onrender.com`
   - Deve retornar: `{"message":"API Power Training","version":"1.0.0","status":"online"}`
2. Verifique se `CORS_ORIGIN` no backend está correto
3. Limpe o cache do navegador: `Ctrl + Shift + R`

### Erro: "Access-Control-Allow-Origin"

**Causa:** CORS não configurado corretamente

**Solução:**
1. No Render (backend), vá em **Environment**
2. Configure `CORS_ORIGIN` com a URL EXATA do InfinityFree
3. **NÃO coloque barra `/` no final**
4. Exemplo correto: `https://powertraining.infinityfreeapp.com`
5. Exemplo errado: `https://powertraining.infinityfreeapp.com/`

### Site mostra página em branco

**Causa:** Arquivos não foram enviados corretamente

**Solução:**
1. Verifique se TODOS os arquivos da pasta `dist/` foram enviados
2. Verifique se o arquivo `index.html` está na raiz de `htdocs/`
3. Limpe o cache: `Ctrl + Shift + R`

### Imagens/Logo não aparecem

**Causa:** Caminho incorreto ou arquivo não enviado

**Solução:**
1. Verifique se a pasta `assets/` foi enviada
2. Limpe o cache do navegador
3. Verifique se o logo está salvo no banco de dados

### Backend "dormindo" (Render Free Tier)

**Causa:** Render free tier dorme após 15 min de inatividade

**Solução:**
1. A primeira requisição pode demorar 30-60 segundos
2. Aguarde o backend "acordar"
3. Opcional: Use um serviço de ping (ex: UptimeRobot) para manter ativo

---

## 📊 Verificar se o Deploy Funcionou

### 1. Testar Backend
```bash
curl https://power-training-backend.onrender.com
```

Deve retornar:
```json
{
  "message": "API Power Training",
  "version": "1.0.0",
  "status": "online"
}
```

### 2. Testar Frontend
Acesse seu site e abra o Console (F12):
- Não deve ter erros de CORS
- Não deve ter erros de "Failed to fetch"

---

## 🎯 Checklist de Deploy

- [ ] `.env.production` com URL correta do backend
- [ ] `npm run build` executado sem erros
- [ ] Todos os arquivos da pasta `dist/` enviados para `htdocs/`
- [ ] Arquivos antigos deletados do `htdocs/`
- [ ] CORS configurado no backend (Render)
- [ ] Site acessível no navegador
- [ ] Login funcionando
- [ ] Todas as funcionalidades testadas

---

## 🚀 URLs Importantes

### Frontend (InfinityFree)
```
https://seu-dominio.infinityfreeapp.com
```

### Backend (Render)
```
https://power-training-backend.onrender.com
```

### API (Render)
```
https://power-training-backend.onrender.com/api
```

---

## 📝 Notas Importantes

1. **Sempre faça build antes de enviar**
   - O build otimiza o código
   - Reduz o tamanho dos arquivos
   - Melhora a performance

2. **Delete arquivos antigos antes de enviar novos**
   - Evita conflitos
   - Garante que apenas arquivos atualizados estejam no servidor

3. **Configure CORS corretamente**
   - Use a URL EXATA do InfinityFree
   - Sem barra no final
   - Teste após configurar

4. **Aguarde o backend "acordar"**
   - Render free tier dorme após inatividade
   - Primeira requisição pode demorar
   - É normal!

---

## 🎉 Pronto!

Seu frontend está atualizado no InfinityFree e conectado ao backend no Render! 🚀

**Sempre que fizer mudanças:**
1. `npm run build`
2. Upload dos arquivos de `dist/`
3. Teste no navegador
