# Configuração de Email - Área Administrativa

## Visão Geral

O sistema permite que cada trainer configure suas próprias preferências de email através da área administrativa. As configurações são armazenadas no banco de dados e aplicadas automaticamente ao enviar emails para alunos.

## Campos de Configuração

### Configurações Gerais

#### `emailConfig.enabled` (Boolean)
- **Padrão:** `true`
- **Descrição:** Habilita ou desabilita o envio de emails
- Se desabilitado, nenhum email será enviado (útil para testes)

#### `emailConfig.provider` (String)
- **Padrão:** `ethereal`
- **Opções:** `ethereal`, `gmail`, `smtp`, `sendgrid`
- **Descrição:** Provedor de email a ser usado

### Configurações de Remetente

#### `emailConfig.fromName` (String)
- **Padrão:** `Zen Personal Trainer`
- **Descrição:** Nome que aparece como remetente nos emails
- **Exemplo:** `Academia Fit`, `Personal Trainer João`

#### `emailConfig.fromEmail` (String)
- **Padrão:** `noreply@zen.com`
- **Descrição:** Email do remetente
- **Exemplo:** `contato@suaacademia.com`

### Configurações SMTP (para provider: 'smtp')

#### `emailConfig.smtpHost` (String)
- **Descrição:** Servidor SMTP
- **Exemplo:** `smtp.gmail.com`, `smtp.office365.com`

#### `emailConfig.smtpPort` (Number)
- **Padrão:** `587`
- **Descrição:** Porta do servidor SMTP
- **Comum:** `587` (TLS), `465` (SSL), `25` (não criptografado)

#### `emailConfig.smtpSecure` (Boolean)
- **Padrão:** `false`
- **Descrição:** Usar SSL/TLS
- `true` para porta 465, `false` para porta 587

#### `emailConfig.smtpUser` (String)
- **Descrição:** Usuário/email para autenticação SMTP
- **Segurança:** Não retornado por padrão nas queries

#### `emailConfig.smtpPassword` (String)
- **Descrição:** Senha ou App Password para autenticação
- **Segurança:** Não retornado por padrão nas queries

### Templates de Email

#### `emailConfig.emailTemplates.welcomeSubject` (String)
- **Padrão:** `Bem-vindo ao Zen - Ative sua conta`
- **Descrição:** Assunto do email de boas-vindas

#### `emailConfig.emailTemplates.welcomeEnabled` (Boolean)
- **Padrão:** `true`
- **Descrição:** Habilitar email de boas-vindas

#### `emailConfig.emailTemplates.resetPasswordSubject` (String)
- **Padrão:** `Redefinir Senha - Zen Personal Trainer`
- **Descrição:** Assunto do email de reset de senha

#### `emailConfig.emailTemplates.resetPasswordEnabled` (Boolean)
- **Padrão:** `true`
- **Descrição:** Habilitar email de reset de senha

## Provedores de Email

### 1. Ethereal (Desenvolvimento)
Email fake para testes. Não envia emails reais.

```json
{
  "emailConfig": {
    "provider": "ethereal",
    "enabled": true
  }
}
```

**Vantagens:**
- Não requer configuração
- Gera preview URL para visualizar emails
- Ideal para desenvolvimento

**Desvantagens:**
- Emails não são enviados de verdade
- Não funciona em produção

### 2. Gmail
Usar conta Gmail para enviar emails.

```json
{
  "emailConfig": {
    "provider": "gmail",
    "enabled": true,
    "smtpUser": "seu.email@gmail.com",
    "smtpPassword": "sua_senha_de_app",
    "fromName": "Seu Nome",
    "fromEmail": "seu.email@gmail.com"
  }
}
```

**Configuração:**
1. Ative a verificação em 2 etapas na conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma "Senha de App" para "Email"
4. Use a senha de 16 dígitos no campo `smtpPassword`

**Vantagens:**
- Fácil de configurar
- Confiável
- Gratuito até 500 emails/dia

**Desvantagens:**
- Limite de 500 emails/dia
- Pode ser bloqueado se enviar muitos emails

### 3. SendGrid
Serviço profissional de email.

```json
{
  "emailConfig": {
    "provider": "sendgrid",
    "enabled": true,
    "smtpPassword": "SG.sua_api_key_aqui",
    "fromName": "Seu Nome",
    "fromEmail": "noreply@seudominio.com"
  }
}
```

**Configuração:**
1. Crie conta em https://sendgrid.com
2. Gere uma API Key
3. Verifique seu domínio (para produção)
4. Use a API Key no campo `smtpPassword`

**Vantagens:**
- 100 emails/dia grátis
- Muito confiável
- Analytics e relatórios
- Suporte profissional

**Desvantagens:**
- Requer verificação de domínio para produção
- Configuração mais complexa

### 4. SMTP Customizado
Qualquer servidor SMTP.

```json
{
  "emailConfig": {
    "provider": "smtp",
    "enabled": true,
    "smtpHost": "smtp.seuservidor.com",
    "smtpPort": 587,
    "smtpSecure": false,
    "smtpUser": "usuario@seudominio.com",
    "smtpPassword": "sua_senha",
    "fromName": "Seu Nome",
    "fromEmail": "noreply@seudominio.com"
  }
}
```

**Vantagens:**
- Flexibilidade total
- Pode usar servidor próprio
- Funciona com qualquer provedor SMTP

**Desvantagens:**
- Requer conhecimento técnico
- Configuração manual necessária

## Endpoints da API

### GET /api/config
Buscar configurações do trainer.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "gymName": "Zen",
    "trainer": "...",
    "emailConfig": {
      "enabled": true,
      "provider": "ethereal",
      "fromName": "Zen Personal Trainer",
      "fromEmail": "noreply@zen.com",
      "emailTemplates": {
        "welcomeSubject": "Bem-vindo ao Zen - Ative sua conta",
        "welcomeEnabled": true,
        "resetPasswordSubject": "Redefinir Senha - Zen Personal Trainer",
        "resetPasswordEnabled": true
      }
    }
  }
}
```

**Nota:** Campos sensíveis (`smtpUser`, `smtpPassword`) não são retornados por padrão.

### PUT /api/config
Atualizar configurações.

**Body:**
```json
{
  "emailConfig": {
    "enabled": true,
    "provider": "gmail",
    "smtpUser": "seu.email@gmail.com",
    "smtpPassword": "sua_senha_de_app",
    "fromName": "Academia Fit",
    "fromEmail": "contato@academiafit.com",
    "emailTemplates": {
      "welcomeSubject": "Bem-vindo à Academia Fit!"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* configuração atualizada */ }
}
```

### POST /api/config/test-email
Testar configuração de email.

**Body:**
```json
{
  "testEmail": "seu.email@teste.com"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Email de teste enviado com sucesso!",
  "data": {
    "messageId": "...",
    "provider": "gmail",
    "previewUrl": null
  }
}
```

**Response (Erro):**
```json
{
  "success": false,
  "message": "Erro ao enviar email de teste",
  "error": "Invalid login: 535-5.7.8 Username and Password not accepted",
  "details": "..."
}
```

## Fluxo de Uso na Interface

### 1. Página de Configurações
```
┌─────────────────────────────────────┐
│  ⚙️ Configurações de Email          │
├─────────────────────────────────────┤
│                                     │
│  ☑ Habilitar envio de emails       │
│                                     │
│  Provedor: [Gmail ▼]               │
│                                     │
│  Nome do Remetente:                │
│  [Academia Fit                   ] │
│                                     │
│  Email do Remetente:               │
│  [contato@academiafit.com        ] │
│                                     │
│  ─── Configurações SMTP ───        │
│                                     │
│  Usuário/Email:                    │
│  [seu.email@gmail.com            ] │
│                                     │
│  Senha/App Password:               │
│  [••••••••••••••                 ] │
│                                     │
│  ─── Templates ───                 │
│                                     │
│  Assunto - Email de Boas-vindas:   │
│  [Bem-vindo à Academia Fit!      ] │
│                                     │
│  [Testar Email]  [Salvar]          │
│                                     │
└─────────────────────────────────────┘
```

### 2. Testar Email
Ao clicar em "Testar Email":
1. Modal solicita email de teste
2. Sistema envia email usando configurações
3. Mostra sucesso ou erro
4. Se Ethereal, mostra link de preview

### 3. Salvar Configurações
Ao clicar em "Salvar":
1. Valida campos obrigatórios
2. Envia PUT para `/api/config`
3. Mostra mensagem de sucesso
4. Sugere testar email

## Exemplos de Implementação Frontend

### React - Formulário de Configuração

```jsx
import { useState, useEffect } from 'react';

function EmailConfigForm() {
  const [config, setConfig] = useState({
    emailConfig: {
      enabled: true,
      provider: 'ethereal',
      fromName: '',
      fromEmail: '',
      smtpUser: '',
      smtpPassword: '',
      smtpHost: '',
      smtpPort: 587,
      smtpSecure: false
    }
  });

  useEffect(() => {
    // Carregar configurações
    fetch('/api/config', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setConfig(data.data));
  }, []);

  const handleSave = async () => {
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    
    if (response.ok) {
      alert('Configurações salvas com sucesso!');
    }
  };

  const handleTest = async () => {
    const testEmail = prompt('Digite um email para teste:');
    
    const response = await fetch('/api/config/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ testEmail })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Email enviado! Verifique sua caixa de entrada.');
      if (result.data.previewUrl) {
        window.open(result.data.previewUrl, '_blank');
      }
    } else {
      alert(`Erro: ${result.error}`);
    }
  };

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={config.emailConfig.enabled}
          onChange={(e) => setConfig({
            ...config,
            emailConfig: {
              ...config.emailConfig,
              enabled: e.target.checked
            }
          })}
        />
        Habilitar envio de emails
      </label>

      <select
        value={config.emailConfig.provider}
        onChange={(e) => setConfig({
          ...config,
          emailConfig: {
            ...config.emailConfig,
            provider: e.target.value
          }
        })}
      >
        <option value="ethereal">Ethereal (Teste)</option>
        <option value="gmail">Gmail</option>
        <option value="sendgrid">SendGrid</option>
        <option value="smtp">SMTP Customizado</option>
      </select>

      {/* Mais campos... */}

      <button type="button" onClick={handleTest}>
        Testar Email
      </button>
      <button type="button" onClick={handleSave}>
        Salvar
      </button>
    </form>
  );
}
```

## Segurança

### Campos Sensíveis
- `smtpUser` e `smtpPassword` têm `select: false`
- Não são retornados em GET por padrão
- Apenas o trainer pode ver/editar suas próprias configurações

### Boas Práticas
1. **Nunca** exponha senhas no frontend
2. Use HTTPS em produção
3. Valide emails antes de enviar
4. Implemente rate limiting
5. Log de emails enviados
6. Monitore falhas de envio

## Troubleshooting

### Erro: "Invalid login"
- Verifique usuário e senha
- Para Gmail, use Senha de App
- Confirme que 2FA está ativo (Gmail)

### Erro: "Connection timeout"
- Verifique host e porta
- Confirme que firewall permite conexão
- Teste com telnet: `telnet smtp.gmail.com 587`

### Emails não chegam
- Verifique pasta de spam
- Confirme que domínio está verificado (SendGrid)
- Verifique limites diários
- Teste com email diferente

### Preview URL não funciona (Ethereal)
- Normal em produção
- Apenas funciona com provider 'ethereal'
- Link expira após 24h

## Próximos Passos

### Melhorias Futuras
- [ ] Upload de logo para emails
- [ ] Editor visual de templates
- [ ] Variáveis personalizadas nos templates
- [ ] Agendamento de emails
- [ ] Estatísticas de abertura/cliques
- [ ] Múltiplos templates por tipo
- [ ] Suporte a anexos
- [ ] Emails em lote
- [ ] Fila de emails
- [ ] Retry automático em falhas
