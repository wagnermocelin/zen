# 🧪 Testes da API Wellhub

## 📋 Visão Geral

Este diretório contém testes para a integração com a API do Wellhub.

## 🚀 Como Executar os Testes

### Pré-requisitos

1. Backend rodando: `npm run dev`
2. MongoDB conectado
3. Variáveis de ambiente configuradas no `.env`

### Opção 1: Script Node.js (Automático)

```bash
# Na pasta backend
node tests/test-wellhub-api.js
```

**Configuração:**

Adicione ao `.env`:
```env
BASE_URL=http://localhost:5000/api
WELLHUB_API_KEY=sua_api_key
TEST_TRAINER_EMAIL=seu_email@example.com
TEST_TRAINER_PASSWORD=sua_senha
```

**Saída esperada:**
```
╔════════════════════════════════════════╗
║  TESTES DA API WELLHUB - POWER TRAINING ║
╚════════════════════════════════════════╝

ℹ Base URL: http://localhost:5000/api
ℹ Test Gympass ID: gpw-test-1732662000000

📝 Teste 1: Obter Access Token
✓ Token obtido: eyJhbGciO...
ℹ Tipo: Bearer
ℹ Expira em: 26/11/2025 21:00:00

📝 Teste 2: Registrar Usuário
✓ Usuário registrado com sucesso
ℹ Redirect Link: http://localhost:3000/wellhub/complete-registration...

📝 Teste 3: Fazer Login (obter JWT)
✓ Login realizado com sucesso
ℹ JWT Token: eyJhbGciO...

📝 Teste 4: Listar Usuários Wellhub
✓ 5 usuários encontrados
ℹ Primeiro usuário: João Teste

📝 Teste 5: Obter Detalhes do Usuário
✓ Detalhes do usuário obtidos
ℹ Nome: João Teste
ℹ Email: teste@wellhub.com
ℹ Check-ins: 0

📝 Teste 6: Registrar Check-in
✓ Check-in registrado com sucesso
ℹ Total de check-ins: 1
ℹ Data: 26/11/2025 21:05:00

📝 Teste 7: Obter Estatísticas
✓ Estatísticas obtidas
ℹ Total de usuários: 5
ℹ Total de check-ins: 25
ℹ Usuários ativos: 3

📝 Teste 8: Testes de Erro
ℹ Testando API Key inválida...
✓ Erro 403 retornado corretamente
ℹ Testando token ausente...
✓ Erro 401 retornado corretamente
ℹ Testando gympass_user_id ausente...
✓ Erro 400 retornado corretamente

╔════════════════════════════════════════╗
║           RESUMO DOS TESTES            ║
╚════════════════════════════════════════╝

✓ Testes aprovados: 8

Total: 8 testes
```

---

### Opção 2: Arquivo HTTP (Manual)

Use a extensão **REST Client** no VS Code ou **Postman/Insomnia**.

**Arquivo:** `wellhub-api-test.http`

**Passos:**

1. Abra `wellhub-api-test.http` no VS Code
2. Instale a extensão "REST Client"
3. Atualize as variáveis no topo do arquivo:
   ```
   @baseUrl = http://localhost:5000/api
   @wellhubApiKey = sua_api_key
   @jwtToken = seu_jwt_token
   @gympassUserId = gpw-test-123
   ```
4. Clique em "Send Request" acima de cada teste

---

## 📝 Testes Disponíveis

### 1. Obter Access Token
- **Endpoint:** `GET /api/wellhub/auth`
- **Headers:** `X-Api-Key`
- **Testa:** Autenticação do Wellhub

### 2. Registrar Usuário
- **Endpoint:** `POST /api/wellhub/register`
- **Headers:** `Authorization: Bearer`
- **Testa:** Registro de novo usuário Wellhub

### 3. Listar Usuários
- **Endpoint:** `GET /api/wellhub/users`
- **Headers:** `Authorization: Bearer (JWT)`
- **Testa:** Listagem de usuários

### 4. Obter Detalhes
- **Endpoint:** `GET /api/wellhub/users/:id`
- **Headers:** `Authorization: Bearer (JWT)`
- **Testa:** Detalhes de um usuário específico

### 5. Registrar Check-in
- **Endpoint:** `POST /api/wellhub/checkin`
- **Headers:** `Authorization: Bearer (JWT)`
- **Testa:** Registro de check-in

### 6. Vincular Aluno
- **Endpoint:** `POST /api/wellhub/link-student`
- **Headers:** `Authorization: Bearer (JWT)`
- **Testa:** Vinculação de usuário a aluno

### 7. Obter Estatísticas
- **Endpoint:** `GET /api/wellhub/stats`
- **Headers:** `Authorization: Bearer (JWT)`
- **Testa:** Estatísticas de check-ins

### 8. Testes de Erro
- Testa validações e tratamento de erros

---

## 🔧 Troubleshooting

### Erro: "ECONNREFUSED"
**Causa:** Backend não está rodando
**Solução:** Execute `npm run dev` na pasta backend

### Erro: "403 Forbidden"
**Causa:** API Key inválida
**Solução:** Verifique `WELLHUB_API_KEY` no `.env`

### Erro: "401 Unauthorized"
**Causa:** JWT inválido ou expirado
**Solução:** Faça login novamente para obter novo token

### Erro: "MongoServerError"
**Causa:** MongoDB não está conectado
**Solução:** Verifique `MONGODB_URI` e conexão com o banco

### Erro: "Login failed"
**Causa:** Credenciais incorretas
**Solução:** Verifique `TEST_TRAINER_EMAIL` e `TEST_TRAINER_PASSWORD`

---

## 📊 Cobertura de Testes

- ✅ Autenticação Wellhub
- ✅ Registro de usuários
- ✅ Listagem de usuários
- ✅ Detalhes de usuário
- ✅ Check-ins
- ✅ Vinculação de alunos
- ✅ Estatísticas
- ✅ Tratamento de erros
- ✅ Validações

---

## 🎯 Próximos Passos

1. ✅ Executar testes localmente
2. ✅ Corrigir erros encontrados
3. ✅ Configurar CI/CD para testes automáticos
4. ✅ Adicionar testes de integração
5. ✅ Adicionar testes de carga

---

## 📚 Recursos

- [Documentação Wellhub](../docs/WELLHUB_API.md)
- [Axios Docs](https://axios-http.com/docs/intro)
- [REST Client Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

---

## 🤝 Contribuindo

Para adicionar novos testes:

1. Adicione a função de teste em `test-wellhub-api.js`
2. Adicione o endpoint em `wellhub-api-test.http`
3. Documente o teste neste README
4. Execute e valide

---

## 📞 Suporte

Para dúvidas sobre os testes:
- Consulte a documentação da API
- Verifique os logs do backend
- Execute testes individuais para isolar problemas
