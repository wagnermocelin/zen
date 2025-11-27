import api from './api';

const wellhubService = {
  // Listar todos os usuários Wellhub
  getUsers: async () => {
    const response = await api.get('/wellhub/users');
    return response.data;
  },

  // Obter detalhes de um usuário específico
  getUser: async (gympassUserId) => {
    const response = await api.get(`/wellhub/users/${gympassUserId}`);
    return response.data;
  },

  // Registrar check-in
  registerCheckIn: async (gympassUserId, origin = 'web', notes = '') => {
    const response = await api.post('/wellhub/checkin', {
      gympass_user_id: gympassUserId,
      origin,
      notes
    });
    return response.data;
  },

  // Vincular usuário Wellhub a aluno existente
  linkToStudent: async (gympassUserId, studentId) => {
    const response = await api.post('/wellhub/link-student', {
      gympass_user_id: gympassUserId,
      student_id: studentId
    });
    return response.data;
  },

  // Obter estatísticas
  getStats: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/wellhub/stats', { params });
    return response.data;
  },

  // Buscar usuário por ID do Gympass (para check-in rápido)
  searchByGympassId: async (gympassUserId) => {
    try {
      const response = await api.get(`/wellhub/users/${gympassUserId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
};

export default wellhubService;
