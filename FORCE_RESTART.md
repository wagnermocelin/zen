# 🔄 Forçar Restart do Backend no Render

## ❌ Problema:

O deploy está **Live** mas o backend **não reiniciou** com o novo código CORS.

```
Deploy: Live (58278b9)
Código: Atualizado
Servidor: NÃO reiniciou
CORS: Ainda bloqueando
```

---

## ✅ Solução: Restart Manual

### **1. Acessar Render Dashboard**

https://dashboard.render.com/

### **2. Encontrar o Serviço**

Clique em: **power-training-backend**

### **3. Forçar Restart**

No canto superior direito, clique em:

**Manual Deploy** → **Clear build cache & deploy**

Ou simplesmente:

**Suspend** → Aguarde 10 segundos → **Resume**

---

## 🎯 Alternativa Mais Rápida:

### **Restart via Settings**

1. Clique em **power-training-backend**
2. Vá em **Settings** (aba lateral)
3. Role até o final
4. Clique em **Restart Service**
5. Aguarde 30-60 segundos

---

## 🧪 Verificar se Reiniciou:

### **Teste 1: API Básica**

```bash
curl https://power-training-backend.onrender.com/api
```

Deve retornar:
```json
{
  "message": "API Power Training",
  "version": "1.0.0",
  "status": "online"
}
```

### **Teste 2: CORS**

```bash
curl -I -X OPTIONS \
  -H "Origin: https://zem.wuaze.com" \
  -H "Access-Control-Request-Method: GET" \
  https://power-training-backend.onrender.com/api/wellhub/users
```

**Deve retornar:**
```
HTTP/2 204
access-control-allow-origin: https://zem.wuaze.com
access-control-allow-credentials: true
```

**Se ainda retornar sem o header, o servidor NÃO reiniciou!**

---

## 📊 Logs para Verificar:

No Render, clique em **Logs** e procure por:

```
🚀 Servidor rodando na porta 10000
📊 Ambiente: production
🌐 CORS habilitado para: http://localhost:3000,http://localhost:5173,https://zem.wuaze.com,...
✅ MongoDB conectado
```

**Se não ver "zem.wuaze.com" nos logs, o código antigo ainda está rodando!**

---

## 🔧 Se Restart Não Funcionar:

### **Opção 1: Redeploy com Clear Cache**

1. **Manual Deploy**
2. Marque: **Clear build cache**
3. Clique em: **Deploy**

### **Opção 2: Verificar Variáveis de Ambiente**

1. Vá em **Environment**
2. Verifique se `NODE_ENV=production`
3. Adicione se faltar

### **Opção 3: Rollback e Redeploy**

1. Vá em **Deploys**
2. Encontre um deploy antigo
3. Clique em **Rollback**
4. Depois faça **Manual Deploy** novamente

---

## ⏰ Tempo Esperado:

- **Restart:** 30-60 segundos
- **Redeploy:** 2-3 minutos

---

## 🎯 Checklist:

- [ ] Acessei Render Dashboard
- [ ] Cliquei em power-training-backend
- [ ] Fiz Restart Service
- [ ] Aguardei 60 segundos
- [ ] Verifiquei os Logs
- [ ] Vi "zem.wuaze.com" nos logs de CORS
- [ ] Testei a API
- [ ] Limpei cache do navegador (Ctrl+Shift+R)
- [ ] Testei https://zem.wuaze.com

---

## 🚨 IMPORTANTE:

O Render às vezes **não reinicia automaticamente** após deploy.

**Você PRECISA fazer restart manual!**

---

**Faça o restart manual no Render e teste novamente!** 🔄
