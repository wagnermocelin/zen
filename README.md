# Zen - Sistema para Personal Trainer

Sistema completo de gerenciamento para Personal Trainers com interface mobile-first.

## 🚀 Funcionalidades

- **Cadastro de Alunos**: Sistema completo com login e senha para acesso dos alunos
- **Controle de Treinos**: Gerenciamento de exercícios e rotinas
- **Controle de Medidas**: Histórico completo de evolução física
- **Fichas de Treinamento**: Agenda semanal de treinos personalizados
- **Controle de Dieta**: Planejamento nutricional
- **Controle Financeiro**: Gestão de mensalidades e pagamentos

## 📱 Tecnologias

- React 18
- Tailwind CSS
- React Router
- Lucide Icons
- Recharts (gráficos)
- Vite

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 👤 Acessos Padrão

**Personal Trainer:**
- Email: trainer@zen.com
- Senha: trainer123

**Aluno (exemplo):**
- Email: aluno@exemplo.com
- Senha: aluno123

## 📝 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth, Data)
├── pages/          # Páginas da aplicação
├── utils/          # Funções utilitárias
└── App.jsx         # Componente principal
```

## 💾 Armazenamento

Os dados são armazenados localmente no navegador usando localStorage.
Para produção, recomenda-se integrar com um backend (Node.js, Firebase, etc.).
