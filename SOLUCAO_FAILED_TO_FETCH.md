# 🔧 Solução: Failed to Fetch

## ✅ Correção Aplicada:

Atualizei o CORS no backend para aceitar múltiplas portas:
- ✅ `http://localhost:3000`
- ✅ `http://localhost:3001` (Vite)
- ✅ `http://localhost:5173` (Vite padrão)

## 🚀 Como Resolver:

### **Opção 1: Reiniciar Backend (RECOMENDADO)**

1. **Pare o backend** (Ctrl+C no terminal do backend)

2. **Inicie novamente:**
```bash
cd backend
npm run dev
```

3. **Recarregue o frontend** (F5 no navegador)

### **Opção 2: Testar com Arquivo HTML**

1. Abra o arquivo `TESTE_CORS.html` no navegador
2. Clique em "Testar Conexão"
3. Deve mostrar resposta do backend

### **Opção 3: Verificar Console do Navegador**

1. Abra o site: http://localhost:3001
2. Pressione **F12**
3. Vá na aba **Console**
4. Veja os erros específicos

## 🔍 Verificações:

### **1. Backend está rodando?**
```bash
curl http://localhost:5000
```

Deve retornar:
```json
{
  "message": "API Zen Personal Trainer",
  "version": "1.0.0",
  "status": "online"
}
```

### **2. Frontend está na porta correta?**
Verifique no terminal do frontend qual porta está usando:
```
➜  Local:   http://localhost:3001/
```

### **3. Teste de Login Manual:**

Abra o Console do navegador (F12) e execute:

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'wagner@zen.com',
    password: 'senha123'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Login OK:', data))
.catch(err => console.error('❌ Erro:', err));
```

## ⚠️ Erros Comuns:

### **Erro: "CORS policy"**
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 
'http://localhost:3001' has been blocked by CORS policy
```

**Solução:**
- Backend precisa ser reiniciado
- Verifique se as mudanças no `server.js` foram salvas

### **Erro: "Failed to fetch"**
```
TypeError: Failed to fetch
```

**Causas possíveis:**
1. Backend não está rodando
2. Porta incorreta
3. CORS bloqueando

**Solução:**
- Verifique se backend está rodando
- Reinicie backend e frontend

### **Erro: "Network Error"**
```
Network Error
```

**Solução:**
- Verifique firewall
- Verifique antivírus
- Tente desabilitar temporariamente

## 📝 Checklist:

- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3001
- [ ] Arquivo `backend/server.js` atualizado com novo CORS
- [ ] Backend reiniciado após mudanças
- [ ] Navegador recarregado (F5)
- [ ] Console do navegador sem erros CORS

## 🎯 Teste Final:

1. Acesse: http://localhost:3001
2. Tente fazer login:
   - Email: `wagner@zen.com`
   - Senha: `senha123`
3. Deve redirecionar para dashboard

## 💡 Dica:

Se ainda não funcionar, tente:

1. **Limpar cache do navegador:**
   - Ctrl+Shift+Delete
   - Limpar cache e cookies

2. **Usar modo anônimo:**
   - Ctrl+Shift+N (Chrome)
   - Ctrl+Shift+P (Firefox)

3. **Verificar logs:**
   - Terminal do backend
   - Console do navegador (F12)

## 🔄 Última Opção:

Se nada funcionar, reinicie tudo:

```bash
# Terminal 1 - Parar backend (Ctrl+C)
cd backend
npm run dev

# Terminal 2 - Parar frontend (Ctrl+C)
npm run dev
```

Aguarde ambos iniciarem e teste novamente.

**Deve funcionar agora! 🚀**
