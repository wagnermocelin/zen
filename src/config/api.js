// Configuração da URL da API
// Em desenvolvimento: usa localhost
// Em produção: usa a URL do backend hospedado

const API_URL = import.meta.env.PROD 
  ? 'https://seu-backend.onrender.com/api'  // ⚠️ ALTERE para a URL real do seu backend no Render
  : 'http://localhost:5000/api';

export default API_URL;

// Instruções:
// 1. Faça deploy do backend no Render.com
// 2. Copie a URL fornecida (ex: https://zen-backend-xxxx.onrender.com)
// 3. Substitua 'seu-backend.onrender.com' pela URL real
// 4. Execute 'npm run build' para gerar a versão de produção
