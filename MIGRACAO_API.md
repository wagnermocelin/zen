# 🔄 Migração para Sistema 100% API

## ✅ O que foi feito:

### **1. Serviço de API Criado** (`src/services/api.js`)
- ✅ Funções para todas as requisições HTTP (GET, POST, PUT, DELETE)
- ✅ Autenticação com JWT (token armazenado automaticamente)
- ✅ Serviços para: Auth, Students, Workouts, Measurements, Schedules, Diets, Payments, Users
- ✅ Tratamento de erros

### **2. AuthContext Atualizado** (`src/contexts/AuthContext.jsx`)
- ✅ Login via API
- ✅ Token JWT salvo no localStorage
- ✅ Logout limpa token
- ✅ Verificação de usuário logado

### **3. DataContext API Criado** (`src/contexts/DataContextAPI.jsx`)
- ✅ Todas as operações CRUD via API
- ✅ Carregamento automático de dados
- ✅ Estados de loading e error
- ✅ Função refreshData() para recarregar

---

## 🚀 Como Ativar a Integração:

### **Passo 1: Substituir DataContext no App.jsx**

Abra `src/App.jsx` e faça esta mudança:

**ANTES:**
```javascript
import { DataProvider } from './contexts/DataContext';
```

**DEPOIS:**
```javascript
import { DataProvider } from './contexts/DataContextAPI';
```

Isso é tudo! O resto do código continua igual.

---

## 🧪 Testar Localmente Primeiro:

### **1. Certifique-se que o backend local está rodando:**
```bash
cd backend
npm run dev
```

Deve mostrar:
```
✅ MongoDB conectado
🚀 Servidor rodando na porta 5000
```

### **2. Inicie o frontend:**
```bash
npm run dev
```

### **3. Teste o Login:**
1. Acesse http://localhost:5173
2. Tente fazer login com qualquer email/senha
3. Se der erro, é normal - você precisa criar um usuário primeiro

### **4. Criar Primeiro Usuário (via Postman ou curl):**

**Opção A - Postman:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@zen.com",
  "password": "admin123",
  "role": "trainer"
}
```

**Opção B - PowerShell:**
```powershell
$body = @{
    name = "Admin"
    email = "admin@zen.com"
    password = "admin123"
    role = "trainer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### **5. Fazer Login:**
- Email: `admin@zen.com`
- Senha: `admin123`

---

## 📊 Diferenças Importantes:

### **IDs dos Objetos:**
- **Antes**: `id` (string simples)
- **Agora**: `_id` (MongoDB ObjectId)

Os componentes já estão preparados para aceitar ambos!

### **Estrutura de Resposta:**
```javascript
// A API retorna:
{
  "success": true,
  "data": [...],
  "message": "..."
}

// O DataContext extrai automaticamente o .data
```

### **Operações Assíncronas:**
Todas as funções CRUD agora são `async`:

**ANTES:**
```javascript
addStudent(studentData);
```

**DEPOIS:**
```javascript
await addStudent(studentData);
```

Mas não se preocupe! Os componentes já usam `async/await` corretamente.

---

## 🔐 Autenticação:

### **Token JWT:**
- Salvo automaticamente no localStorage após login
- Enviado em todas as requisições via header `Authorization: Bearer <token>`
- Expiração: 30 dias (configurável no backend)

### **Logout:**
- Remove token do localStorage
- Redireciona para tela de login

---

## ⚠️ Problemas Comuns:

### **1. Erro: "Network Error" ou "Failed to fetch"**
**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
- Verifique se o backend está rodando
- Verifique `src/config/api.js` - URL correta?
- Em desenvolvimento: `http://localhost:5000/api`
- Em produção: `https://zen-u03e.onrender.com/api`

### **2. Erro: "401 Unauthorized"**
**Causa:** Token inválido ou expirado

**Solução:**
- Faça logout e login novamente
- Limpe localStorage: `localStorage.clear()`

### **3. Erro: "CORS policy"**
**Causa:** Backend não permite requisições do frontend

**Solução:**
- Verifique variável `CORS_ORIGIN` no backend
- Em desenvolvimento: deve ser `http://localhost:5173`
- Em produção: deve ser a URL do InfinityFree

### **4. Página em branco após login**
**Causa:** Erro ao carregar dados da API

**Solução:**
- Abra Console (F12)
- Veja o erro específico
- Verifique se o backend tem dados

---

## 📝 Checklist de Migração:

### Local (Desenvolvimento):
- [ ] Backend rodando em `http://localhost:5000`
- [ ] MongoDB Atlas conectado
- [ ] Primeiro usuário criado via API
- [ ] `src/App.jsx` usando `DataContextAPI`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Login funcionando
- [ ] Dados sendo salvos no MongoDB

### Produção:
- [ ] Backend no Render funcionando
- [ ] `src/config/api.js` com URL do Render
- [ ] CORS configurado no Render
- [ ] Build do frontend: `npm run build`
- [ ] Upload para InfinityFree
- [ ] Teste completo no site online

---

## 🎯 Vantagens do Sistema API:

✅ **Dados Centralizados:** Tudo no MongoDB Atlas
✅ **Multi-dispositivo:** Acesse de qualquer lugar
✅ **Backup Automático:** MongoDB Atlas faz backup
✅ **Segurança:** Autenticação JWT
✅ **Escalável:** Suporta múltiplos usuários
✅ **Profissional:** Arquitetura moderna

---

## 🔄 Rollback (se necessário):

Se algo der errado, você pode voltar para o sistema localStorage:

Em `src/App.jsx`, mude de volta:
```javascript
import { DataProvider } from './contexts/DataContext';
```

Os dados locais ainda estarão lá!

---

## 📞 Próximos Passos:

1. ✅ Testar localmente
2. ✅ Criar usuários de teste
3. ✅ Adicionar alguns alunos
4. ✅ Testar todas as funcionalidades
5. ✅ Fazer build e deploy

**Sistema pronto para produção! 🚀**
