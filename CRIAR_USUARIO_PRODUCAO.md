# 🚀 Criar Usuário no Ambiente de Produção (Render)

## 📋 Pré-requisitos

1. Aplicação já deve estar no ar no Render
2. MongoDB Atlas configurado e conectado
3. Ter a URL de conexão do MongoDB

---

## 🔧 Método 1: Via Script (Recomendado)

### 1. Configure a variável de ambiente

Crie um arquivo `.env.production` na pasta `backend`:

```env
MONGODB_URI=sua_url_do_mongodb_atlas_aqui
```

### 2. Execute o script

```powershell
cd backend
node scripts/createUserProduction.js
```

### 3. Credenciais padrão criadas:

- **Email:** juliana@zem.com
- **Senha:** senha123
- **Role:** professional

---

## 🔧 Método 2: Via MongoDB Atlas (Interface Web)

### 1. Acesse o MongoDB Atlas

1. Vá para https://cloud.mongodb.com
2. Faça login na sua conta
3. Selecione seu cluster
4. Clique em "Browse Collections"

### 2. Crie o usuário manualmente

1. Selecione o banco de dados (ex: `zen`)
2. Clique na collection `users`
3. Clique em "INSERT DOCUMENT"
4. Cole este JSON:

```json
{
  "name": "Juliana Dolinski",
  "email": "juliana@zem.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "professional",
  "createdAt": {"$date": "2025-10-24T00:00:00.000Z"}
}
```

⚠️ **IMPORTANTE:** A senha precisa estar criptografada com bcrypt!

---

## 🔧 Método 3: Via API do Render (Mais Fácil)

### 1. Crie uma rota temporária no backend

Adicione em `backend/routes/auth.js`:

```javascript
// ROTA TEMPORÁRIA - REMOVER DEPOIS!
router.post('/create-first-user', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: 'juliana@zem.com' });
    if (existingUser) {
      return res.json({ message: 'Usuário já existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('senha123', salt);

    const user = await User.create({
      name: 'Juliana Dolinski',
      email: 'juliana@zem.com',
      password: hashedPassword,
      role: 'professional'
    });

    res.json({ 
      success: true, 
      message: 'Usuário criado',
      email: 'juliana@zem.com',
      password: 'senha123'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Faça o deploy

```powershell
git add .
git commit -m "Add create first user route"
git push
```

### 3. Acesse a rota

Abra no navegador:
```
https://zen-u03e.onrender.com/api/auth/create-first-user
```

Ou use Postman/Insomnia com POST para:
```
https://zen-u03e.onrender.com/api/auth/create-first-user
```

### 4. IMPORTANTE: Remova a rota depois!

Depois de criar o usuário, **DELETE** essa rota do código e faça novo deploy!

---

## ✅ Verificar se funcionou

1. Acesse: https://zen-u03e.onrender.com
2. Tente fazer login com:
   - **Email:** juliana@zem.com
   - **Senha:** senha123

---

## 🔐 Criar mais usuários

### Trainer/Professional:
```javascript
{
  name: "Seu Nome",
  email: "seu@email.com",
  password: "senha_criptografada",
  role: "professional" // ou "trainer"
}
```

### Aluno:
```javascript
{
  name: "Nome do Aluno",
  email: "aluno@email.com",
  password: "senha_criptografada",
  role: "student"
}
```

---

## 🆘 Problemas Comuns

### Erro: "Credenciais inválidas"
- Verifique se o usuário existe no banco
- Confirme que a senha está correta
- Verifique se o MongoDB está conectado

### Erro: "Cannot connect to MongoDB"
- Verifique a variável `MONGODB_URI` no Render
- Confirme que o IP do Render está liberado no MongoDB Atlas
- Teste a conexão no MongoDB Atlas

### Senha não funciona
- A senha DEVE estar criptografada com bcrypt
- Use o script ou a rota temporária para criar usuários
- Não insira senhas em texto plano no banco

---

## 📝 Notas

- **Sempre use senhas fortes em produção!**
- **Remova rotas temporárias após uso**
- **Mantenha credenciais seguras**
- **Use variáveis de ambiente para senhas**
