# 🏋️ Zen - Sistema para Personal Trainer

## 📋 Sobre o Projeto

Sistema completo de gerenciamento para Personal Trainers com interface mobile-first, desenvolvido com React e Tailwind CSS.

## ✨ Funcionalidades Implementadas

### 👨‍🏫 Área do Personal Trainer

1. **Dashboard**
   - Visão geral com estatísticas
   - Alunos ativos, treinos cadastrados, receita mensal
   - Últimos alunos cadastrados

2. **Cadastro de Alunos**
   - Cadastro completo com dados pessoais
   - Login e senha para acesso do aluno
   - Gerenciamento (editar/excluir)

3. **Controle de Treinos**
   - Criar treinos personalizados
   - Múltiplos exercícios por treino
   - Séries, repetições, descanso e observações

4. **Controle de Medidas**
   - Registro de medidas corporais
   - Histórico de evolução
   - Gráficos de progresso

5. **Fichas de Treinamento**
   - Agenda semanal de treinos
   - Programação por dia da semana
   - Período de validade

6. **Controle de Dieta**
   - Planos alimentares personalizados
   - Macronutrientes (calorias, proteínas, carboidratos, gorduras)
   - Refeições com horários

7. **Controle Financeiro**
   - Registro de mensalidades
   - Status de pagamento (pago/pendente/atrasado)
   - Relatórios financeiros

### 👤 Área do Aluno

1. **Dashboard do Aluno**
   - Treino do dia
   - Última medição
   - Status da ficha e pagamentos

2. **Meus Treinos**
   - Visualização de todos os treinos
   - Detalhes dos exercícios

3. **Minhas Medidas**
   - Histórico de medições
   - Gráfico de evolução do peso
   - Comparação com medição anterior

4. **Minha Ficha**
   - Programação semanal
   - Treino destacado para o dia atual
   - Detalhes de cada treino

5. **Minha Dieta**
   - Plano alimentar completo
   - Macronutrientes
   - Refeições detalhadas

6. **Meus Pagamentos**
   - Histórico de mensalidades
   - Status de pagamento

## 🚀 Como Executar

### Instalação

```bash
cd c:/Users/Wagner/Desktop/zen
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: http://localhost:3000

### Build para Produção

```bash
npm run build
```

## 🔐 Acessos de Demonstração

### Personal Trainer
- **Email:** trainer@zen.com
- **Senha:** trainer123

### Alunos de Exemplo
- **Email:** joao@exemplo.com
- **Senha:** aluno123

- **Email:** maria@exemplo.com
- **Senha:** aluno123

## 🎨 Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **date-fns** - Manipulação de datas
- **localStorage** - Armazenamento local

## 📱 Interface Mobile-First

O sistema foi desenvolvido com foco em dispositivos móveis, mas é totalmente responsivo e funciona perfeitamente em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando **localStorage**. Isso significa que:
- ✅ Funciona offline após o primeiro carregamento
- ✅ Não requer configuração de servidor
- ✅ Dados persistem entre sessões
- ⚠️ Dados são específicos do navegador
- ⚠️ Para produção, recomenda-se integrar com backend (Firebase, Node.js, etc.)

## 🔄 Próximos Passos (Opcional)

Para transformar em um sistema de produção completo:

1. **Backend**
   - Integrar com Node.js + Express
   - Banco de dados (PostgreSQL, MongoDB)
   - API REST

2. **Autenticação**
   - JWT tokens
   - Recuperação de senha
   - Autenticação de dois fatores

3. **Recursos Adicionais**
   - Upload de fotos de progresso
   - Notificações push
   - Chat entre trainer e aluno
   - Relatórios em PDF
   - Integração com wearables

4. **Deploy**
   - Vercel, Netlify ou AWS
   - Domínio personalizado
   - SSL/HTTPS

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (F12)
- Logs do terminal
- README.md

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstração.
