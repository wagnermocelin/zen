# 📤 Como Fazer Deploy via FTP

## 🎯 Passo a Passo

### 1. **Configurar o Script**

Abra o arquivo `deploy-ftp.ps1` e edite as seguintes linhas com seus dados do InfinityFree:

```powershell
$ftpServer = "ftpupload.net"     # Servidor FTP (veja no painel do InfinityFree)
$ftpUsername = "epiz_XXXXXXXX"   # Seu usuário FTP
$ftpPassword = "sua_senha_aqui"  # Sua senha FTP
$ftpPath = "/htdocs/"            # Caminho (geralmente /htdocs/)
```

### 2. **Onde Encontrar os Dados FTP**

No painel do InfinityFree:
1. Acesse: https://app.infinityfree.com
2. Clique em "Control Panel"
3. Vá em "FTP Details" ou "FTP Accounts"
4. Copie:
   - **FTP Server**: Ex: `ftpupload.net` ou `ftp.seusite.com`
   - **FTP Username**: Ex: `epiz_12345678`
   - **FTP Password**: A senha que você criou

### 3. **Executar o Script**

Abra o PowerShell na pasta do projeto e execute:

```powershell
.\deploy-ftp.ps1
```

Ou clique com botão direito no arquivo `deploy-ftp.ps1` → **"Executar com PowerShell"**

### 4. **O que o Script Faz**

1. ✅ Faz build do projeto (`npm run build`)
2. ✅ Mostra resumo do que será enviado
3. ✅ Pede confirmação
4. ✅ Faz upload de todos os arquivos da pasta `dist/`
5. ✅ Mostra progresso em tempo real
6. ✅ Exibe resumo final

### 5. **Após o Upload**

1. Acesse seu site no InfinityFree
2. **Limpe o cache do navegador**: `Ctrl + Shift + R`
3. Faça login
4. Vá em Admin
5. A seção de configuração de email deve aparecer!

---

## 🔧 Alternativa: Upload Manual

Se preferir fazer upload manual:

### Via FileZilla:
1. Baixe: https://filezilla-project.org/
2. Conecte com os dados FTP
3. Vá para `/htdocs/`
4. Delete todos os arquivos antigos
5. Arraste TUDO da pasta `dist/` para `/htdocs/`

### Via File Manager (Painel):
1. Acesse o painel do InfinityFree
2. Vá em "File Manager"
3. Entre em `htdocs/`
4. Delete arquivos antigos
5. Clique em "Upload"
6. Selecione TODOS os arquivos da pasta `dist/`

---

## ⚠️ Problemas Comuns

### Erro: "Execution Policy"
Se aparecer erro de política de execução:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Depois execute o script novamente.

### Erro: "Connection refused"
- Verifique se o servidor FTP está correto
- Teste a conexão com FileZilla primeiro
- Verifique se a senha está correta

### Erro: "Permission denied"
- Verifique se o usuário FTP tem permissão de escrita
- Tente criar uma pasta manualmente no File Manager

### Site não atualiza
- Limpe o cache: `Ctrl + Shift + R`
- Tente em modo anônimo
- Aguarde 5 minutos (propagação)

---

## 📋 Checklist

Antes de fazer deploy:

- [ ] Código commitado no Git
- [ ] Backend no Render atualizado
- [ ] Build do frontend feito (`npm run build`)
- [ ] Dados FTP configurados no script
- [ ] Testado localmente

Após o deploy:

- [ ] Site acessível
- [ ] Cache limpo
- [ ] Login funcionando
- [ ] Seção de email aparecendo
- [ ] Teste de envio de email

---

## 🚀 Deploy Rápido (Resumo)

```powershell
# 1. Build
npm run build

# 2. Configurar deploy-ftp.ps1 (primeira vez)
# Edite: $ftpServer, $ftpUsername, $ftpPassword

# 3. Deploy
.\deploy-ftp.ps1

# 4. Limpar cache no navegador
# Ctrl + Shift + R
```

---

**Pronto! Seu site estará atualizado! 🎉**
