# Integração Wellhub API - Power Training

## 📋 Visão Geral

Esta documentação descreve a integração com a API do Wellhub (Gympass) para registro de usuários e validação de check-ins.

## 🔑 Autenticação

### Obter Access Token

**Endpoint:** `GET /api/wellhub/auth`

**Headers:**
```
X-Api-Key: <partner_api_key>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciO...",
  "token_type": "Bearer",
  "expires_at": 1571536335
}
```

**Errors:**
- `403 Forbidden` - API Key inválida ou ausente
- `500 Internal Server Error`

---

## 👤 Registro de Usuário

### Registrar Usuário Wellhub

**Endpoint:** `POST /api/wellhub/register`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "gympass_user_id": "gpw-29caecdf-2d5e-40b8-82b4-d0a044fa4679",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "origin": "ios",
  "user_status": "1",
  "country_code": "br"
}
```

**Parâmetros:**
- `gympass_user_id` (required) - ID único do usuário no Wellhub
- `email` (optional) - Email do usuário
- `first_name` (optional) - Primeiro nome
- `last_name` (optional) - Sobrenome
- `origin` (optional) - Origem: web, android, ios
- `user_status` (optional) - Status do plano: 1 (basic), 2 (premium), etc
- `country_code` (optional) - Código do país (2 letras)

**Response (200 OK) - Novo Usuário:**
```json
{
  "redirect_link": "https://powertraining.com/wellhub/complete-registration?gpw_id=gpw-123&email=user@example.com",
  "existing_user": false
}
```

**Response (200 OK) - Usuário Existente:**
```json
{
  "redirect_link": "https://powertraining.com/login?wellhub_user=gpw-123",
  "existing_user": true
}
```

**Errors:**
- `400 Bad Request` - gympass_user_id ausente
- `401 Unauthorized` - Token inválido ou ausente
- `500 Internal Server Error`

---

## ✅ Check-in

### Registrar Check-in

**Endpoint:** `POST /api/wellhub/checkin`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "gympass_user_id": "gpw-29caecdf-2d5e-40b8-82b4-d0a044fa4679",
  "origin": "web",
  "notes": "Check-in via app"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "checkIn": {
    "date": "2025-11-26T23:56:00.000Z",
    "totalCheckIns": 15
  }
}
```

**Errors:**
- `400 Bad Request` - gympass_user_id ausente
- `401 Unauthorized` - Não autenticado
- `404 Not Found` - Usuário não encontrado
- `500 Internal Server Error`

---

## 📊 Gerenciamento de Usuários

### Listar Usuários Wellhub

**Endpoint:** `GET /api/wellhub/users`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "gympassUserId": "gpw-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "registrationStatus": "completed",
      "totalCheckIns": 15,
      "lastCheckIn": "2025-11-26T23:56:00.000Z",
      "student": {
        "_id": "...",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ]
}
```

---

### Obter Detalhes de Usuário

**Endpoint:** `GET /api/wellhub/users/:gympassUserId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "gympassUserId": "gpw-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "origin": "ios",
    "userStatus": "1",
    "countryCode": "br",
    "registrationStatus": "completed",
    "totalCheckIns": 15,
    "lastCheckIn": "2025-11-26T23:56:00.000Z",
    "checkIns": [
      {
        "date": "2025-11-26T23:56:00.000Z",
        "origin": "web",
        "notes": ""
      }
    ],
    "student": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+55 11 99999-9999"
    }
  }
}
```

---

### Vincular a Aluno Existente

**Endpoint:** `POST /api/wellhub/link-student`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "gympass_user_id": "gpw-123",
  "student_id": "507f1f77bcf86cd799439011"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "gympassUserId": "gpw-123",
    "student": "507f1f77bcf86cd799439011",
    "registrationStatus": "completed"
  }
}
```

---

### Obter Estatísticas

**Endpoint:** `GET /api/wellhub/stats?start_date=2025-11-01&end_date=2025-11-30`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `start_date` (optional) - Data início (YYYY-MM-DD)
- `end_date` (optional) - Data fim (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "totalCheckIns": 450,
    "activeUsers": 35,
    "checkInsByDay": {
      "2025-11-01": 15,
      "2025-11-02": 18,
      "2025-11-03": 12
    }
  }
}
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# Wellhub Integration
WELLHUB_API_KEY=sua_api_key_do_wellhub
WELLHUB_TEST_AUTH_URL=https://test-api-url/auth
WELLHUB_TEST_REGISTRATION_URL=https://test-api-url/register
WELLHUB_PRODUCTION_AUTH_URL=https://production-api-url/auth
WELLHUB_PRODUCTION_REGISTRATION_URL=https://production-api-url/register
WELLHUB_REDIRECT_URL=https://seu-dominio.com
DEFAULT_TRAINER_ID=seu_trainer_id_aqui
```

---

## 📝 Fluxo de Registro

1. **Wellhub solicita token:**
   - `GET /api/wellhub/auth` com `X-Api-Key`
   - Recebe `access_token`

2. **Wellhub registra usuário:**
   - `POST /api/wellhub/register` com `Bearer token`
   - Envia dados do usuário
   - Recebe `redirect_link`

3. **Usuário é redirecionado:**
   - Para página de completar cadastro (novo usuário)
   - Ou para página de login (usuário existente)

4. **Usuário completa cadastro:**
   - Preenche dados adicionais
   - É vinculado a um aluno no sistema

5. **Check-ins:**
   - Usuário faz check-in na academia
   - Sistema registra via `POST /api/wellhub/checkin`

---

## 🔒 Segurança

- **API Key:** Protege endpoints públicos do Wellhub
- **Bearer Token:** Valida requisições do Wellhub
- **JWT:** Protege endpoints internos do sistema
- **HTTPS:** Obrigatório em produção
- **Timeout:** Conexões TCP > 300 segundos

---

## 🧪 Testes

### Testar Autenticação

```bash
curl -X GET https://seu-dominio.com/api/wellhub/auth \
  -H "X-Api-Key: sua_api_key" \
  -H "Content-Type: application/json"
```

### Testar Registro

```bash
curl -X POST https://seu-dominio.com/api/wellhub/register \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "gympass_user_id": "gpw-test-123",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }'
```

---

## 📊 Modelos de Dados

### WellhubUser

```javascript
{
  gympassUserId: String (unique, required),
  student: ObjectId (ref: Student),
  email: String,
  firstName: String,
  lastName: String,
  origin: String (web|android|ios),
  userStatus: String,
  countryCode: String,
  registrationStatus: String (pending|completed|failed),
  checkIns: [{
    date: Date,
    origin: String,
    notes: String
  }],
  totalCheckIns: Number,
  lastCheckIn: Date,
  trainer: ObjectId (required)
}
```

### WellhubToken

```javascript
{
  accessToken: String (required),
  tokenType: String (default: Bearer),
  expiresAt: Number (timestamp),
  isActive: Boolean,
  trainer: ObjectId (required)
}
```

---

## 🎯 Próximos Passos

1. ✅ Configurar variáveis de ambiente
2. ✅ Obter API Key do Wellhub
3. ✅ Configurar URLs de teste/produção
4. ✅ Testar fluxo de autenticação
5. ✅ Testar fluxo de registro
6. ✅ Implementar página de completar cadastro no frontend
7. ✅ Implementar dashboard de check-ins
8. ✅ Monitorar logs e estatísticas

---

## 📞 Suporte

Para dúvidas sobre a integração, consulte:
- Documentação oficial do Wellhub
- Equipe de suporte do Wellhub
- Logs do sistema: `console.log` nos serviços
