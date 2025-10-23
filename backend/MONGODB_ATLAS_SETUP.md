# 🌐 Configuração do MongoDB Atlas - Passo a Passo

Guia completo para configurar o MongoDB Atlas (nuvem gratuita) para o sistema Zen.

## 📋 Passo 1: Criar Conta no MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita (pode usar Google/GitHub)
3. Faça login

## 🚀 Passo 2: Criar um Cluster Gratuito

1. Após o login, clique em **"Build a Database"** ou **"Create"**
2. Escolha a opção **FREE** (M0 Sandbox - 512MB)
3. Selecione o provedor e região:
   - **Provider**: AWS, Google Cloud ou Azure (qualquer um)
   - **Region**: Escolha a mais próxima do Brasil:
     - `São Paulo (sa-east-1)` - AWS
     - `South America (southamerica-east1)` - Google Cloud
4. **Cluster Name**: Deixe o padrão ou nomeie como `zen-cluster`
5. Clique em **"Create Cluster"**
6. Aguarde 3-5 minutos para o cluster ser criado

## 🔐 Passo 3: Configurar Acesso ao Banco

### 3.1 - Criar Usuário do Banco de Dados

1. No menu lateral, clique em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Preencha:
   - **Authentication Method**: Password
   - **Username**: `zenuser` (ou qualquer nome)
   - **Password**: Clique em "Autogenerate Secure Password" e **COPIE A SENHA**
     - Ou crie uma senha forte manualmente
   - **Database User Privileges**: Selecione `Read and write to any database`
4. Clique em **"Add User"**

**⚠️ IMPORTANTE: Guarde a senha em local seguro!**

### 3.2 - Configurar Acesso de Rede (IP Whitelist)

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Escolha uma opção:
   
   **Opção A - Permitir de qualquer lugar (Desenvolvimento):**
   - Clique em **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Clique em **"Confirm"**
   
   **Opção B - Apenas seu IP atual (Mais seguro):**
   - Clique em **"Add Current IP Address"**
   - Clique em **"Confirm"**

## 🔗 Passo 4: Obter String de Conexão

1. Volte para **"Database"** no menu lateral
2. No seu cluster, clique em **"Connect"**
3. Escolha **"Connect your application"**
4. Selecione:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. **Copie a string de conexão** que aparece:

```
mongodb+srv://zenuser:<password>@zen-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **IMPORTANTE**: Substitua `<password>` pela senha que você criou no Passo 3.1

Exemplo final:
```
mongodb+srv://zenuser:SuaSenhaAqui123@zen-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## ⚙️ Passo 5: Configurar no Backend

1. Abra o arquivo `backend/.env`

2. Cole a string de conexão na variável `MONGODB_URI`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://zenuser:SuaSenhaAqui123@zen-cluster.xxxxx.mongodb.net/zen-personal-trainer?retryWrites=true&w=majority
JWT_SECRET=zen_personal_trainer_secret_key_2024_change_in_production
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

**⚠️ ATENÇÃO:**
- Substitua `<password>` pela sua senha real
- Adicione `/zen-personal-trainer` antes do `?` para especificar o nome do banco
- Não compartilhe este arquivo! Ele contém credenciais sensíveis

## ✅ Passo 6: Testar a Conexão

1. Abra o terminal na pasta `backend`:
```bash
cd backend
```

2. Instale as dependências (se ainda não instalou):
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

4. Você deve ver no terminal:
```
✅ MongoDB conectado: zen-cluster-shard-00-00.xxxxx.mongodb.net
📦 Database: zen-personal-trainer
🚀 Servidor rodando na porta 5000
```

## 🎉 Pronto! Banco Configurado!

Agora você pode:
- Criar o primeiro usuário via `/api/auth/register`
- Usar todas as funcionalidades do sistema
- Ver os dados no MongoDB Atlas Dashboard

## 📊 Visualizar Dados no Atlas

1. Vá para **"Database"** no menu lateral
2. Clique em **"Browse Collections"** no seu cluster
3. Você verá todas as collections criadas automaticamente:
   - users
   - students
   - workouts
   - measurements
   - schedules
   - diets
   - payments
   - configs

## 🔒 Dicas de Segurança

1. **Nunca compartilhe** o arquivo `.env`
2. **Não commite** o `.env` no Git (já está no `.gitignore`)
3. Para produção, use variáveis de ambiente do servidor
4. Troque o `JWT_SECRET` para algo mais seguro em produção
5. Configure IP whitelist específico em produção

## 🆘 Problemas Comuns

**Erro: "MongoServerError: bad auth"**
- Verifique se a senha está correta
- Certifique-se de que substituiu `<password>` pela senha real
- Verifique se o usuário foi criado corretamente

**Erro: "MongooseServerSelectionError"**
- Verifique se adicionou seu IP no Network Access
- Tente usar "Allow Access from Anywhere" (0.0.0.0/0)
- Aguarde alguns minutos após criar o cluster

**Erro: "connect ETIMEDOUT"**
- Problema de firewall/rede
- Verifique sua conexão com internet
- Tente outro provedor/região no cluster

## 📞 Suporte

- Documentação MongoDB Atlas: https://docs.atlas.mongodb.com/
- MongoDB University (Cursos Gratuitos): https://university.mongodb.com/

---

**Feito! Seu banco de dados na nuvem está pronto! 🚀**
