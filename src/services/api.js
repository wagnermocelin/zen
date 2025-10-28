import API_URL from '../config/api.js';

// Configuração base do Axios-like fetch
const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }
    
    return response.json();
  },

  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }
    
    return response.json();
  },

  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }
    
    return response.json();
  },

  delete: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }
    
    return response.json();
  }
};

// Serviços de Autenticação
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Serviços de Alunos
export const studentsService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  unblock: (id) => api.post(`/students/${id}/unblock`),
  block: (id) => api.post(`/students/${id}/block`),
  checkOverdue: () => api.post('/students/check-overdue')
};

// Serviços de Treinos
export const workoutsService = {
  getAll: () => api.get('/workouts'),
  getById: (id) => api.get(`/workouts/${id}`),
  getByStudent: (studentId) => api.get(`/workouts/student/${studentId}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`)
};

// Serviços de Medidas
export const measurementsService = {
  getAll: () => api.get('/measurements'),
  getById: (id) => api.get(`/measurements/${id}`),
  getByStudent: (studentId) => api.get(`/measurements/student/${studentId}`),
  create: (data) => api.post('/measurements', data),
  update: (id, data) => api.put(`/measurements/${id}`, data),
  delete: (id) => api.delete(`/measurements/${id}`)
};

// Serviços de Agendamentos
export const schedulesService = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  getByStudent: (studentId) => api.get(`/schedules/student/${studentId}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`)
};

// Serviços de Dietas
export const dietsService = {
  getAll: () => api.get('/diets'),
  getById: (id) => api.get(`/diets/${id}`),
  getByStudent: (studentId) => api.get(`/diets/student/${studentId}`),
  create: (data) => api.post('/diets', data),
  update: (id, data) => api.put(`/diets/${id}`, data),
  delete: (id) => api.delete(`/diets/${id}`)
};

// Serviços de Pagamentos
export const paymentsService = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`)
};

// Serviços de Usuários (Admin)
export const usersService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Serviços de Configuração
export const configService = {
  get: () => api.get('/config'),
  update: (data) => api.put('/config', data),
  testEmail: (testEmail) => api.post('/config/test-email', { testEmail })
};

// Serviços de Autenticação de Alunos
export const studentAuthService = {
  activate: (email, token, password) => api.post('/student-auth/activate', { email, token, password }),
  resendVerification: (email) => api.post('/student-auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/student-auth/forgot-password', { email }),
  resetPassword: (email, token, password) => api.post('/student-auth/reset-password', { email, token, password }),
  verifyToken: (email, token, type) => api.get(`/student-auth/verify-token?email=${email}&token=${token}&type=${type}`)
};

export default api;
