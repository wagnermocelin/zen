// Configuração da URL da API
// Em produção: usa backend do Render (MongoDB Atlas)
// Em desenvolvimento: usa localhost

const API_URL = import.meta.env.PROD 
  ? 'https://zen-u03e.onrender.com/api'  // Produção - Render
  : 'http://localhost:5000/api';          // Desenvolvimento - Local

export default API_URL;

// ✅ Configuração automática:
// - npm run dev → localhost:5000
// - npm run build → zen-u03e.onrender.com
