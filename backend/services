import axios from 'axios';
import WellhubToken from '../models/WellhubToken.js';
import WellhubUser from '../models/WellhubUser.js';

class WellhubService {
  constructor() {
    // Configurações da API (devem estar no .env)
    this.testAuthUrl = process.env.WELLHUB_TEST_AUTH_URL;
    this.testRegistrationUrl = process.env.WELLHUB_TEST_REGISTRATION_URL;
    this.productionAuthUrl = process.env.WELLHUB_PRODUCTION_AUTH_URL;
    this.productionRegistrationUrl = process.env.WELLHUB_PRODUCTION_REGISTRATION_URL;
    this.apiKey = process.env.WELLHUB_API_KEY;
    this.isProduction = process.env.NODE_ENV === 'production';
    this.redirectBaseUrl = process.env.WELLHUB_REDIRECT_URL || process.env.FRONTEND_URL;
  }

  /**
   * Obtém um access token do Wellhub
   */
  async getAccessToken(trainerId) {
    try {
      // Verificar se já existe um token válido
      const existingToken = await WellhubToken.getValidToken(trainerId);
      if (existingToken) {
        console.log('✅ Token válido encontrado no banco');
        return {
          access_token: existingToken.accessToken,
          token_type: existingToken.tokenType,
          expires_at: existingToken.expiresAt
        };
      }

      // Buscar novo token
      const authUrl = this.isProduction ? this.productionAuthUrl : this.testAuthUrl;
      
      console.log('🔑 Solicitando novo access token do Wellhub...');
      const response = await axios.get(authUrl, {
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      const { access_token, token_type, expires_at } = response.data;

      // Salvar token no banco
      await WellhubToken.create({
        accessToken: access_token,
        tokenType: token_type,
        expiresAt: expires_at,
        trainer: trainerId
      });

      console.log('✅ Novo token obtido e salvo');
      return response.data;

    } catch (error) {
      console.error('❌ Erro ao obter access token:', error.response?.data || error.message);
      throw new Error('Falha ao obter token de autenticação do Wellhub');
    }
  }

  /**
   * Registra um usuário do Wellhub
   */
  async registerUser(userData, trainerId) {
    try {
      // Obter access token
      const tokenData = await this.getAccessToken(trainerId);

      // Validar dados obrigatórios
      if (!userData.gympass_user_id) {
        throw new Error('gympass_user_id é obrigatório');
      }

      // Verificar se usuário já existe
      let wellhubUser = await WellhubUser.findOne({
        gympassUserId: userData.gympass_user_id
      });

      if (wellhubUser) {
        console.log('👤 Usuário Wellhub já existe, retornando link de login');
        return {
          redirect_link: `${this.redirectBaseUrl}/login?wellhub_user=${userData.gympass_user_id}`,
          existing_user: true
        };
      }

      // Criar registro no banco
      wellhubUser = await WellhubUser.create({
        gympassUserId: userData.gympass_user_id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        origin: userData.origin || 'web',
        userStatus: userData.user_status || '1',
        countryCode: userData.country_code,
        registrationStatus: 'pending',
        trainer: trainerId
      });

      console.log('✅ Usuário Wellhub registrado no banco');

      // Retornar link de redirecionamento para completar cadastro
      const redirectLink = `${this.redirectBaseUrl}/wellhub/complete-registration?gpw_id=${userData.gympass_user_id}&email=${encodeURIComponent(userData.email || '')}&first_name=${encodeURIComponent(userData.first_name || '')}&last_name=${encodeURIComponent(userData.last_name || '')}`;

      return {
        redirect_link: redirectLink,
        existing_user: false
      };

    } catch (error) {
      console.error('❌ Erro ao registrar usuário:', error.message);
      throw error;
    }
  }

  /**
   * Registra um check-in
   */
  async registerCheckIn(gympassUserId, origin = 'web', notes = '') {
    try {
      const wellhubUser = await WellhubUser.findOne({ gympassUserId });

      if (!wellhubUser) {
        throw new Error('Usuário Wellhub não encontrado');
      }

      await wellhubUser.addCheckIn(origin, notes);

      console.log(`✅ Check-in registrado para ${gympassUserId}`);
      return {
        success: true,
        checkIn: {
          date: new Date(),
          totalCheckIns: wellhubUser.totalCheckIns
        }
      };

    } catch (error) {
      console.error('❌ Erro ao registrar check-in:', error.message);
      throw error;
    }
  }

  /**
   * Vincula usuário Wellhub a um aluno existente
   */
  async linkToStudent(gympassUserId, studentId) {
    try {
      const wellhubUser = await WellhubUser.findOne({ gympassUserId });

      if (!wellhubUser) {
        throw new Error('Usuário Wellhub não encontrado');
      }

      wellhubUser.student = studentId;
      wellhubUser.registrationStatus = 'completed';
      await wellhubUser.save();

      console.log(`✅ Usuário Wellhub vinculado ao aluno ${studentId}`);
      return wellhubUser;

    } catch (error) {
      console.error('❌ Erro ao vincular usuário:', error.message);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de check-ins
   */
  async getCheckInStats(trainerId, startDate, endDate) {
    try {
      const query = { trainer: trainerId };

      if (startDate && endDate) {
        query['checkIns.date'] = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const users = await WellhubUser.find(query).populate('student');

      const stats = {
        totalUsers: users.length,
        totalCheckIns: users.reduce((sum, user) => sum + user.totalCheckIns, 0),
        activeUsers: users.filter(u => u.lastCheckIn && 
          (Date.now() - new Date(u.lastCheckIn).getTime()) < 30 * 24 * 60 * 60 * 1000
        ).length,
        checkInsByDay: {}
      };

      // Agrupar check-ins por dia
      users.forEach(user => {
        user.checkIns.forEach(checkIn => {
          if (!startDate || !endDate || 
              (checkIn.date >= new Date(startDate) && checkIn.date <= new Date(endDate))) {
            const day = checkIn.date.toISOString().split('T')[0];
            stats.checkInsByDay[day] = (stats.checkInsByDay[day] || 0) + 1;
          }
        });
      });

      return stats;

    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error.message);
      throw error;
    }
  }
}

export default new WellhubService();
