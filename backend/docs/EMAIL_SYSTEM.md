# Sistema de Email para Alunos

## Visão Geral

O sistema de email foi implementado para gerenciar o primeiro acesso dos alunos, validação de email e recuperação de senha.

## Fluxo de Cadastro de Aluno

### 1. Cadastro pelo Trainer
Quando um trainer cadastra um novo aluno:
- O aluno é criado **sem senha**
- Um token de verificação é gerado (válido por 24 horas)
- Um email é enviado automaticamente para o aluno

### 2. Email de Ativação
O aluno recebe um email com:
- Link para ativar a conta
- Instruções para criar a senha
- Prazo de validade (24 horas)

### 3. Ativação da Conta
O aluno clica no link e:
- Valida o email
- Cria sua senha (mínimo 6 caracteres)
- Ativa a conta

### 4. Acesso ao Sistema
Após ativar, o aluno pode:
- Fazer login com email e senha
- Acessar treinos, dietas e acompanhamento

## Endpoints da API

### POST /api/student-auth/activate
Ativa a conta do aluno e cria a senha.

**Body:**
```json
{
  "email": "aluno@email.com",
  "token": "token_recebido_por_email",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conta ativada com sucesso! Você já pode fazer login.",
  "data": {
    "email": "aluno@email.com",
    "name": "Nome do Aluno"
  }
}
```

### POST /api/student-auth/resend-verification
Reenvia o email de verificação.

**Body:**
```json
{
  "email": "aluno@email.com"
}
```

### POST /api/student-auth/forgot-password
Solicita redefinição de senha.

**Body:**
```json
{
  "email": "aluno@email.com"
}
```

### POST /api/student-auth/reset-password
Redefine a senha com o token recebido por email.

**Body:**
```json
{
  "email": "aluno@email.com",
  "token": "token_recebido_por_email",
  "password": "nova_senha123"
}
```

### GET /api/student-auth/verify-token
Verifica se um token é válido antes de usar.

**Query Params:**
- `email`: Email do aluno
- `token`: Token a ser verificado
- `type`: Tipo do token (`activation` ou `reset`)

## Configuração de Email

### Desenvolvimento
Por padrão, o sistema usa **Ethereal Email** (email fake) em desenvolvimento:
- Não requer configuração
- Emails não são enviados de verdade
- Um link de preview é gerado no console
- Ideal para testes

### Produção
Configure as variáveis de ambiente no `.env`:

```env
NODE_ENV=production
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_ou_app_password
EMAIL_FROM="Zen Personal Trainer <noreply@zen.com>"
FRONTEND_URL=https://seu-dominio.com
```

#### Usando Gmail
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de App"
3. Use a senha de app no `EMAIL_PASSWORD`

#### Usando SendGrid, Mailgun, etc.
Ajuste o transporter em `utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## Modelo de Dados

### Student Schema - Novos Campos

```javascript
{
  // ... campos existentes
  
  password: {
    type: String,
    required: false,  // Não obrigatório no cadastro
    minlength: 6,
    select: false
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  }
}
```

## Templates de Email

Os emails são enviados em HTML responsivo com:
- Design moderno e profissional
- Gradiente roxo/azul (identidade visual)
- Botões de ação destacados
- Informações importantes em caixas
- Footer com informações legais

### Email de Ativação
- Boas-vindas ao sistema
- Botão para ativar conta
- Instruções claras
- Prazo de validade

### Email de Redefinição de Senha
- Botão para redefinir senha
- Avisos de segurança
- Prazo de validade (1 hora)

## Segurança

### Tokens
- Gerados com `crypto.randomBytes(32)`
- 64 caracteres hexadecimais
- Únicos e não previsíveis
- Expiram automaticamente

### Senhas
- Criptografadas com bcrypt
- Salt de 10 rounds
- Nunca retornadas nas queries (select: false)
- Mínimo de 6 caracteres

### Validações
- Email único no banco
- Token válido e não expirado
- Conta não pode ser ativada duas vezes
- Senha não pode ser redefinida sem token válido

## Testando o Sistema

### 1. Criar um Aluno
```bash
POST http://localhost:5000/api/students
Authorization: Bearer {token_do_trainer}

{
  "name": "Teste Aluno",
  "email": "teste@email.com",
  "phone": "11999999999"
}
```

### 2. Verificar Console
O sistema mostrará:
```
✅ Aluno criado com sucesso: {id}
📧 Email de verificação enviado (DEV)
Preview URL: https://ethereal.email/message/...
Verification URL: http://localhost:3000/activate-account?token=...
```

### 3. Abrir Preview do Email
- Copie a Preview URL do console
- Abra no navegador
- Visualize o email como o aluno receberia

### 4. Ativar Conta
```bash
POST http://localhost:5000/api/student-auth/activate

{
  "email": "teste@email.com",
  "token": "token_do_email",
  "password": "senha123"
}
```

### 5. Fazer Login
Use o endpoint de login de alunos com o email e senha criados.

## Troubleshooting

### Email não é enviado em produção
- Verifique as credenciais no `.env`
- Confirme que `NODE_ENV=production`
- Verifique logs de erro no console
- Teste credenciais SMTP manualmente

### Token inválido ou expirado
- Tokens expiram em 24h (ativação) ou 1h (reset)
- Solicite um novo token via `/resend-verification`
- Verifique se o email está correto

### Aluno não consegue criar senha
- Verifique se a senha tem mínimo 6 caracteres
- Confirme que o token não expirou
- Verifique se a conta já foi ativada

## Próximos Passos

### Melhorias Futuras
- [ ] Notificações por SMS
- [ ] Email de boas-vindas após ativação
- [ ] Lembretes de treino por email
- [ ] Relatórios mensais por email
- [ ] Templates personalizáveis por trainer
- [ ] Suporte a múltiplos idiomas
- [ ] Logs de emails enviados
- [ ] Dashboard de métricas de email

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte esta documentação
3. Teste com Ethereal em desenvolvimento
4. Valide configurações de produção
