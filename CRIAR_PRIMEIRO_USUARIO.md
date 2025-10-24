# 👤 Criar Primeiro Usuário no Sistema

Após integrar com a API, você precisa criar o primeiro usuário no banco de dados.

## 🚀 Método 1: Via PowerShell (Mais Fácil)

### **Para Backend Local (http://localhost:5000):**

```powershell
$body = @{
    name = "Wagner Mocelin"
    email = "wagner@zen.com"
    password = "senha123"
    role = "trainer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### **Para Backend em Produção (Render):**

```powershell
$body = @{
    name = "Wagner Mocelin"
    email = "wagner@zen.com"
    password = "senha123"
    role = "trainer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zen-u03e.onrender.com/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

---

## 🌐 Método 2: Via Navegador (Console)

1. Abra o navegador
2. Pressione **F12** para abrir o Console
3. Cole e execute este código:

### **Para Backend Local:**

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Wagner Mocelin',
    email: 'wagner@zen.com',
    password: 'senha123',
    role: 'trainer'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Usuário criado:', data))
.catch(err => console.error('❌ Erro:', err));
```

### **Para Backend em Produção:**

```javascript
fetch('https://zen-u03e.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Wagner Mocelin',
    email: 'wagner@zen.com',
    password: 'senha123',
    role: 'trainer'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Usuário criado:', data))
.catch(err => console.error('❌ Erro:', err));
```

---

## 📱 Método 3: Via Postman/Insomnia

### **Configuração:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register` (ou URL do Render)
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "name": "Wagner Mocelin",
  "email": "wagner@zen.com",
  "password": "senha123",
  "role": "trainer"
}
```

---

## ✅ Resposta Esperada:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Wagner Mocelin",
    "email": "wagner@zen.com",
    "role": "trainer"
  }
}
```

---

## 🔐 Fazer Login no Sistema:

Após criar o usuário, acesse o sistema:

1. **Local:** http://localhost:5173
2. **Produção:** https://seu-site.infinityfreeapp.com

**Credenciais:**
- **Email:** `wagner@zen.com`
- **Senha:** `senha123`

---

## 👥 Criar Mais Usuários:

### **Profissional:**
```json
{
  "name": "João Silva",
  "email": "joao@zen.com",
  "password": "123456",
  "role": "professional"
}
```

### **Aluno (via interface depois de fazer login):**
- Use a tela de "Alunos" para cadastrar
- Ou crie via API com `role: "student"`

---

## ⚠️ Importante:

### **Roles Disponíveis:**
- `trainer` - Personal Trainer (acesso completo)
- `professional` - Profissional (acesso completo)
- `student` - Aluno (acesso limitado)

### **Primeiro Usuário:**
- **SEMPRE** crie com role `trainer` ou `professional`
- Isso garante acesso completo ao sistema

### **Senha:**
- Mínimo 6 caracteres
- Armazenada com hash bcrypt (segura)
- Pode ser alterada depois

---

## 🧪 Testar se Funcionou:

### **1. Verificar no MongoDB Atlas:**
1. Acesse https://cloud.mongodb.com
2. Vá em **"Browse Collections"**
3. Database: `zen-personal-trainer`
4. Collection: `users`
5. Você deve ver o usuário criado

### **2. Testar Login:**
1. Acesse o sistema
2. Faça login com as credenciais
3. Deve redirecionar para o Dashboard

### **3. Verificar Token:**
Abra o Console (F12) e execute:
```javascript
console.log(localStorage.getItem('token'));
```

Deve mostrar um token JWT longo.

---

## 🔄 Se Algo Der Errado:

### **Erro: "Email already exists"**
- O usuário já foi criado
- Tente fazer login
- Ou use outro email

### **Erro: "Network Error"**
- Backend não está rodando
- Verifique a URL
- Verifique os logs do Render

### **Erro: "CORS"**
- Configure `CORS_ORIGIN` no Render
- Deve incluir a URL do frontend

---

## 📊 Resumo:

1. ✅ Execute um dos métodos acima
2. ✅ Verifique a resposta (deve ter `success: true`)
3. ✅ Faça login no sistema
4. ✅ Comece a usar!

**Pronto! Primeiro usuário criado! 🎉**
