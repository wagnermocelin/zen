// Configuração da URL da API
// Em desenvolvimento: usa localhost
// Em produção: usa a URL do backend hospedado no Render

const API_URL = import.meta.env.PROD 
  ? 'https://zen-u03e.onrender.com/api'  // Backend no Render
  : 'http://localhost:5000/api';

export default API_URL;

// ✅ Backend configurado: https://zen-u03e.onrender.com
// Para gerar build de produção: npm run build
