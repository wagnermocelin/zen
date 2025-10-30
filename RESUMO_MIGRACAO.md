# 📋 RESUMO: Migração de Dados

## 🎯 Objetivo:
Migrar dados do banco `test` para `zen-personal-trainer` antes de atualizar a string de conexão no Render.

---

## 🚀 EXECUTE ESTE COMANDO:

```powershell
.\migrar-dados.ps1
```

**OU** (se preferir manualmente):

```powershell
cd backend
node scripts/migrar-dados.js
```

---

## 📦 O que será migrado:

- ✅ users (usuários)
- ✅ students (alunos)
- ✅ workouts (treinos)
- ✅ measurements (medidas)
- ✅ schedules (agendamentos)
- ✅ diets (dietas)
- ✅ payments (pagamentos)
- ✅ configs (configurações)

---

## ⏱️ Tempo estimado:
- 1-2 minutos (depende da quantidade de dados)

---

## ✅ Após a migração:

1. Verificar no MongoDB Atlas
2. Atualizar string no Render
3. Aguardar redeploy
4. Testar sistema

---

## 📞 Arquivos Criados:

| Arquivo | Descrição |
|---------|-----------|
| `migrar-dados.ps1` | Script PowerShell (execute este!) |
| `backend/scripts/migrar-dados.js` | Script Node.js de migração |
| `backend/scripts/verificar-migracao.js` | Script de verificação |
| `GUIA_MIGRACAO_COMPLETO.md` | Guia detalhado |
| `STRING_CONEXAO_CORRETA.txt` | String para usar depois |

---

## 🎯 EXECUTE AGORA:

```powershell
.\migrar-dados.ps1
```

**Depois me avise o resultado!** 🚀
