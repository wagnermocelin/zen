# ⚙️ Configurar Wellhub para Testes

## 📋 Passo a Passo

### 1. Editar arquivo .env

Abra o arquivo `backend/.env` e adicione as seguintes linhas:

```env
# Wellhub Integration
WELLHUB_API_KEY=test_api_key_123
WELLHUB_TEST_AUTH_URL=https://test-api-url/auth
WELLHUB_TEST_REGISTRATION_URL=https://test-api-url/register
WELLHUB_PRODUCTION_AUTH_URL=https://production-api-url/auth
WELLHUB_PRODUCTION_REGISTRATION_URL=https://production-api-url/register
WELLHUB_REDIRECT_URL=http://localhost:3000
DEFAULT_TRAINER_ID=674616e5e1e7d0f2b4a8f8a1

# Para testes
TEST_TRAINER_EMAIL=wagner@gmail.com
TEST_TRAINER_PASSWORD=123456
BASE_URL=http://localhost:5000/api
```

### 2. Obter seu Trainer ID

Execute no MongoDB ou use o Compass:

```javascript
// No MongoDB Compass ou mongosh
db.users.findOne({ email: "wagner@gmail.com" })
```

Copie o `_id` e cole em `DEFAULT_TRAINER_ID`.

**Ou via código:**

```bash
# Na pasta backend
node -e "
import('mongoose').then(async mongoose => {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = (await import('./models/User.js')).default;
  const user = await User.findOne({ email: 'wagner@gmail.com' });
  console.log('Trainer ID:', user._id);
  process.exit(0);
});
"
```

### 3. Reiniciar o Backend

```bash
# Ctrl+C para parar
# Depois:
npm run dev
```

### 4. Executar Testes Novamente

```bash
node tests/test-wellhub-api.js
```

---

## ✅ Resultado Esperado

```
╔════════════════════════════════════════╗
║  TESTES DA API WELLHUB - POWER TRAINING ║
╚════════════════════════════════════════╝

📝 Teste 1: Obter Access Token
✓ Token obtido: eyJhbGciO...

📝 Teste 2: Registrar Usuário
✓ Usuário registrado com sucesso

📝 Teste 3: Fazer Login (obter JWT)
✓ Login realizado com sucesso

📝 Teste 4: Listar Usuários Wellhub
✓ 1 usuários encontrados

📝 Teste 5: Obter Detalhes do Usuário
✓ Detalhes do usuário obtidos

📝 Teste 6: Registrar Check-in
✓ Check-in registrado com sucesso

📝 Teste 7: Obter Estatísticas
✓ Estatísticas obtidas

📝 Teste 8: Testes de Erro
✓ Todos os erros testados

╔════════════════════════════════════════╗
║           RESUMO DOS TESTES            ║
╚════════════════════════════════════════╝

✓ Testes aprovados: 8

Total: 8 testes
```

---

## 🔧 Troubleshooting

### Teste 1 falha (API Key)
**Problema:** `Missing or invalid API key`
**Solução:** Adicione `WELLHUB_API_KEY` no `.env`

### Teste 3 falha (Login)
**Problema:** `Credenciais inválidas`
**Solução:** 
1. Verifique se o email está correto
2. Verifique se a senha está correta
3. Certifique-se de que o usuário existe no banco

### Teste 4-7 falham (Token não fornecido)
**Problema:** Teste 3 (Login) falhou, então não há JWT
**Solução:** Corrija o Teste 3 primeiro

### DEFAULT_TRAINER_ID inválido
**Problema:** Trainer não encontrado
**Solução:** Use o ID correto do MongoDB

---

## 📝 Verificar Configuração

Execute este comando para verificar se as variáveis estão carregadas:

```bash
node -e "
import('dotenv').then(dotenv => {
  dotenv.config();
  console.log('WELLHUB_API_KEY:', process.env.WELLHUB_API_KEY ? '✓ Configurado' : '✗ Faltando');
  console.log('TEST_TRAINER_EMAIL:', process.env.TEST_TRAINER_EMAIL ? '✓ Configurado' : '✗ Faltando');
  console.log('DEFAULT_TRAINER_ID:', process.env.DEFAULT_TRAINER_ID ? '✓ Configurado' : '✗ Faltando');
});
"
```

---

## 🎯 Próximos Passos

Após configurar e os testes passarem:

1. ✅ Testar no frontend
2. ✅ Criar usuários de teste
3. ✅ Testar check-ins
4. ✅ Verificar estatísticas
5. ✅ Preparar para produção

---

## 📚 Arquivos de Referência

- `.env.wellhub.example` - Exemplo de configuração
- `TESTAR_WELLHUB.md` - Guia completo de testes
- `backend/tests/README_TESTS.md` - Documentação dos testes
