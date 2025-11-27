import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Users, Search, TrendingUp, Calendar, User, Link as LinkIcon, CheckCircle } from 'lucide-react';
import wellhubService from '../services/wellhubService';
import { studentsService } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Modal from '../components/Modal';

const WellhubUsers = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar usuários Wellhub
      const usersResponse = await wellhubService.getUsers();
      setUsers(usersResponse.data || []);

      // Carregar estatísticas
      const statsResponse = await wellhubService.getStats();
      setStats(statsResponse.data);

      // Carregar alunos para vincular
      const studentsResponse = await studentsService.getAll();
      setStudents(studentsResponse.data || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkStudent = async () => {
    if (!selectedUser || !selectedStudent) return;

    try {
      await wellhubService.linkToStudent(selectedUser.gympassUserId, selectedStudent);
      alert('Usuário vinculado com sucesso!');
      setIsLinkModalOpen(false);
      setSelectedUser(null);
      setSelectedStudent('');
      loadData();
    } catch (error) {
      console.error('Erro ao vincular:', error);
      alert('Erro ao vincular usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.gympassUserId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completo';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários Wellhub</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários e check-ins do Wellhub</p>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Check-ins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCheckIns}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média/Usuário</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalUsers > 0 ? Math.round(stats.totalCheckIns / stats.totalUsers) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Busca */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, email ou ID..."
            className="input-field pl-10"
          />
        </div>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">Nenhum usuário encontrado</p>
            </div>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user._id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-primary-600" size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(user.registrationStatus)}`}>
                        {getStatusText(user.registrationStatus)}
                      </span>
                      {user.student && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                          <LinkIcon size={12} />
                          Vinculado
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CheckCircle size={16} />
                        <span>{user.totalCheckIns || 0} check-ins</span>
                      </div>
                      {user.lastCheckIn && (
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            Último: {format(new Date(user.lastCheckIn), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          ID: {user.gympassUserId.substring(0, 20)}...
                        </span>
                      </div>
                    </div>

                    {user.student && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <p className="text-blue-900">
                          <strong>Aluno:</strong> {user.student.name}
                        </p>
                        {user.student.phone && (
                          <p className="text-blue-700">{user.student.phone}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!user.student && user.registrationStatus === 'completed' && (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsLinkModalOpen(true);
                    }}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <LinkIcon size={16} />
                    Vincular Aluno
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Vincular Aluno */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setSelectedUser(null);
          setSelectedStudent('');
        }}
        title="Vincular a Aluno Existente"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Usuário Wellhub:</p>
            <p className="font-semibold">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </p>
            <p className="text-sm text-gray-600">{selectedUser?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Aluno
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="input-field"
            >
              <option value="">Selecione um aluno...</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsLinkModalOpen(false);
                setSelectedUser(null);
                setSelectedStudent('');
              }}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleLinkStudent}
              disabled={!selectedStudent}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vincular
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WellhubUsers;
