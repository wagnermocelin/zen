import React, { useState } from 'react';
import Card from '../components/Card';
import { CheckCircle, Search, User, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import wellhubService from '../services/wellhubService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WellhubCheckIn = () => {
  const [gympassUserId, setGympassUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!gympassUserId.trim()) {
      setError('Digite o ID do Wellhub');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);
    setCheckInSuccess(false);

    try {
      const response = await wellhubService.searchByGympassId(gympassUserId);
      
      if (!response) {
        setError('Usuário não encontrado. Verifique o ID e tente novamente.');
        return;
      }

      setUserData(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      setError('Erro ao buscar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!userData) return;

    setLoading(true);
    setError('');

    try {
      await wellhubService.registerCheckIn(userData.gympassUserId, 'web', '');
      setCheckInSuccess(true);
      
      // Atualizar dados do usuário
      const response = await wellhubService.searchByGympassId(userData.gympassUserId);
      setUserData(response.data);

      // Limpar após 3 segundos
      setTimeout(() => {
        setCheckInSuccess(false);
        setGympassUserId('');
        setUserData(null);
      }, 3000);

    } catch (err) {
      console.error('Erro ao registrar check-in:', err);
      setError('Erro ao registrar check-in. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-in Wellhub</h1>
          <p className="text-gray-600 mt-1">Valide o acesso de usuários Wellhub</p>
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {checkInSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <p className="font-semibold text-green-900">Check-in registrado com sucesso!</p>
            <p className="text-sm text-green-700">Bem-vindo(a) à academia! 💪</p>
          </div>
        </div>
      )}

      {/* Formulário de Busca */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID do Wellhub (Gympass User ID)
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={gympassUserId}
                  onChange={(e) => setGympassUserId(e.target.value)}
                  placeholder="gpw-29caecdf-2d5e-40b8-82b4-d0a044fa4679"
                  className="input-field pl-10"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Digite o ID do usuário Wellhub para validar o acesso
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </form>
      </Card>

      {/* Dados do Usuário */}
      {userData && !checkInSuccess && (
        <Card>
          <div className="space-y-6">
            {/* Header do Card */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-600">{userData.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      userData.registrationStatus === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {userData.registrationStatus === 'completed' ? 'Cadastro Completo' : 'Cadastro Pendente'}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      Plano: {userData.userStatus === '1' ? 'Basic' : userData.userStatus === '2' ? 'Premium' : 'VIP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">Total de Check-ins</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.totalCheckIns || 0}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Último Check-in</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.lastCheckIn 
                    ? format(new Date(userData.lastCheckIn), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : 'Nunca'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <User size={16} />
                  <span className="text-sm font-medium">Origem</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {userData.origin || 'Web'}
                </p>
              </div>
            </div>

            {/* Aluno Vinculado */}
            {userData.student && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Aluno Vinculado:</p>
                <p className="text-lg font-semibold text-blue-900">{userData.student.name}</p>
                {userData.student.phone && (
                  <p className="text-sm text-blue-700">{userData.student.phone}</p>
                )}
              </div>
            )}

            {/* Botão de Check-in */}
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold"
            >
              {loading ? 'Registrando...' : '✓ Confirmar Check-in'}
            </button>

            {/* Histórico Recente */}
            {userData.checkIns && userData.checkIns.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Histórico Recente</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userData.checkIns.slice(-10).reverse().map((checkIn, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-sm text-gray-700">
                          {format(new Date(checkIn.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{checkIn.origin}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Instruções */}
      {!userData && !loading && (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Como fazer check-in
            </h3>
            <div className="text-sm text-gray-600 space-y-2 max-w-md mx-auto">
              <p>1. Solicite ao usuário o <strong>ID do Wellhub</strong></p>
              <p>2. Digite o ID no campo acima e clique em <strong>Buscar</strong></p>
              <p>3. Verifique os dados do usuário</p>
              <p>4. Clique em <strong>Confirmar Check-in</strong></p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WellhubCheckIn;
