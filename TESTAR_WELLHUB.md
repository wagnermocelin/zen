# 🧪 Como Testar a API Wellhub

## 📋 Pré-requisitos

Antes de testar, certifique-se de que:

1. ✅ Backend está rodando
2. ✅ MongoDB está conectado
3. ✅ Variáveis de ambiente configuradas

---

## 🚀 Passo a Passo

### 1. Iniciar o Backend

```bash
cd backend
npm run dev
```

**Saída esperada:**
```
🚀 Servidor rodando na porta 5000
📊 Ambiente: development
✅ MongoDB conectado
📦 Database: test
```

---

### 2. Configurar Variáveis de Ambiente

Edite `backend/.env` e adicione:

```env
# Wellhub Integration
WELLHUB_API_KEY=test_api_key_123
WELLHUB_TEST_AUTH_URL=https://test-api-url/auth
WELLHUB_TEST_REGISTRATION_URL=https://test-api-url/register
WELLHUB_REDIRECT_URL=http://localhost:3000
DEFAULT_TRAINER_ID=seu_trainer_id_aqui

# Para testes
TEST_TRAINER_EMAIL=wagner@gmail.com
TEST_TRAINER_PASSWORD=123456
```

---

### 3. Executar Testes Automáticos

```bash
cd backend
node tests/test-wellhub-api.js
```

---

### 4. Testar Manualmente (Postman/Insomnia)

#### 4.1. Obter Access Token

```http
GET http://localhost:5000/api/wellhub/auth
X-Api-Key: test_api_key_123
Content-Type: application/json
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciO...",
  "token_type": "Bearer",
  "expires_at": 1732662000
}
```

#### 4.2. Fazer Login (obter JWT)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "wagner@gmail.com",
  "password": "123456"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGciO...",
  "user": {
    "id": "...",
    "name": "Wagner",
    "email": "wagner@gmail.com",
    "role": "trainer"
  }
}
```

**Copie o token JWT para usar nos próximos testes!**

#### 4.3. Registrar Usuário Wellhub

```http
POST http://localhost:5000/api/wellhub/register
Authorization: Bearer <access_token_do_passo_4.1>
Content-Type: application/json

{
  "gympass_user_id": "gpw-test-123456",
  "email": "teste@wellhub.com",
  "first_name": "João",
  "last_name": "Silva",
  "origin": "web",
  "user_status": "1",
  "country_code": "br"
}
```

**Resposta esperada:**
```json
{
  "redirect_link": "http://localhost:3000/wellhub/complete-registration?gpw_id=gpw-test-123456&email=teste@wellhub.com",
  "existing_user": false
}
```

#### 4.4. Listar Usuários Wellhub

```http
GET http://localhost:5000/api/wellhub/users
Authorization: Bearer <jwt_token_do_passo_4.2>
```

**Resposta esperada:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "gympassUserId": "gpw-test-123456",
      "email": "teste@wellhub.com",
      "firstName": "João",
      "lastName": "Silva",
      "totalCheckIns": 0,
      "registrationStatus": "pending"
    }
  ]
}
```

#### 4.5. Registrar Check-in

```http
POST http://localhost:5000/api/wellhub/checkin
Authorization: Bearer <jwt_token_do_passo_4.2>
Content-Type: application/json

{
  "gympass_user_id": "gpw-test-123456",
  "origin": "web",
  "notes": "Check-in de teste"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "checkIn": {
    "date": "2025-11-26T23:00:00.000Z",
    "totalCheckIns": 1
  }
}
```

#### 4.6. Obter Estatísticas

```http
GET http://localhost:5000/api/wellhub/stats
Authorization: Bearer <jwt_token_do_passo_4.2>
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1,
    "totalCheckIns": 1,
    "activeUsers": 1,
    "checkInsByDay": {
      "2025-11-26": 1
    }
  }
}
```

---

## 🎯 Testar no Frontend

### 1. Iniciar Frontend

```bash
npm run dev
```

### 2. Acessar Check-in

1. Faça login como trainer
2. No menu lateral, clique em **"Wellhub Check-in"**
3. Digite o ID: `gpw-test-123456`
4. Clique em **"Buscar"**
5. Verifique os dados do usuário
6. Clique em **"Confirmar Check-in"**

### 3. Acessar Usuários

1. No menu lateral, clique em **"Usuários Wellhub"**
2. Veja a lista de usuários
3. Veja as estatísticas
4. Teste a busca
5. Teste vincular a um aluno

---

## ✅ Checklist de Testes

### Backend
- [ ] Servidor rodando na porta 5000
- [ ] MongoDB conectado
- [ ] Rota `/api/wellhub/auth` funcionando
- [ ] Rota `/api/wellhub/register` funcionando
- [ ] Rota `/api/wellhub/users` funcionando
- [ ] Rota `/api/wellhub/checkin` funcionando
- [ ] Rota `/api/wellhub/stats` funcionando

### Frontend
- [ ] Página de Check-in carrega
- [ ] Busca por ID funciona
- [ ] Exibe dados do usuário
- [ ] Registra check-in
- [ ] Mostra feedback de sucesso
- [ ] Página de Usuários carrega
- [ ] Lista usuários corretamente
- [ ] Estatísticas aparecem
- [ ] Busca funciona
- [ ] Modal de vincular abre

### Integração
- [ ] Frontend se comunica com backend
- [ ] Dados são salvos no MongoDB
- [ ] Check-ins são registrados
- [ ] Estatísticas são calculadas
- [ ] Erros são tratados corretamente

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verifique se a porta 5000 está livre
netstat -ano | findstr :5000

# Se estiver ocupada, mate o processo
taskkill /PID <PID> /F
```

### MongoDB não conecta
```bash
# Verifique a string de conexão no .env
MONGODB_URI=mongodb+srv://...

# Teste a conexão
mongosh "mongodb+srv://..."
```

### Erro 403 no /auth
- Verifique se `WELLHUB_API_KEY` está configurado
- Verifique se está enviando o header `X-Api-Key`

### Erro 401 no /register
- Verifique se está enviando o header `Authorization: Bearer`
- Verifique se o token não expirou

### Erro 404 no frontend
- Verifique se o backend está rodando
- Verifique a URL da API no frontend

---

## 📊 Resultados Esperados

Após todos os testes, você deve ter:

- ✅ 1 usuário Wellhub cadastrado
- ✅ 1 ou mais check-ins registrados
- ✅ Estatísticas atualizadas
- ✅ Dados visíveis no frontend
- ✅ Todos os endpoints funcionando

---

## 🎉 Sucesso!

Se todos os testes passaram, a integração Wellhub está funcionando corretamente! 🚀

**Próximos passos:**
1. Configurar variáveis de produção
2. Obter API Key real do Wellhub
3. Fazer deploy
4. Treinar equipe
