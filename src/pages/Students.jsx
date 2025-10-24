import React, { useState } from 'react';
import { useData } from '../contexts/DataContextAPI';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar, Lock, Unlock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { studentsService } from '../services/api';

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    gender: 'Masculino',
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        password: student.password,
        phone: student.phone,
        birthDate: student.birthDate,
        gender: student.gender,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        birthDate: '',
        gender: 'Masculino',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id || editingStudent.id, formData);
      } else {
        await addStudent(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      alert('Erro ao salvar aluno: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        alert('Erro ao deletar aluno');
      }
    }
  };

  const handleUnblock = async (id) => {
    try {
      await studentsService.unblock(id);
      await refreshData();
      alert('Aluno desbloqueado com sucesso!');
    } catch (error) {
      console.error('Erro ao desbloquear aluno:', error);
      alert('Erro ao desbloquear aluno');
    }
  };

  const handleBlock = async (id) => {
    if (window.confirm('Tem certeza que deseja bloquear este aluno?')) {
      try {
        await studentsService.block(id);
        await refreshData();
        alert('Aluno bloqueado com sucesso!');
      } catch (error) {
        console.error('Erro ao bloquear aluno:', error);
        alert('Erro ao bloquear aluno');
      }
    }
  };

  const handleCheckOverdue = async () => {
    try {
      const response = await studentsService.checkOverdue();
      await refreshData();
      alert(response.message || 'Verificação concluída!');
    } catch (error) {
      console.error('Erro ao verificar inadimplência:', error);
      alert('Erro ao verificar inadimplência');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus alunos cadastrados</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCheckOverdue}
            className="btn-secondary flex items-center gap-2 justify-center"
            title="Verificar inadimplência"
          >
            <AlertCircle size={20} />
            Verificar Inadimplência
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={20} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar aluno por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </Card>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado ainda'}
              </p>
            </Card>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Avatar e Nome */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-lg">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {student.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                        {student.blocked && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                            <Lock size={12} />
                            {student.blockReason === 'payment_overdue' ? 'Inadimplente' : 'Bloqueado'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Desde {format(new Date(student.joinDate), 'dd/MM/yyyy')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(student)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  {student.blocked ? (
                    <button
                      onClick={() => handleUnblock(student._id || student.id)}
                      className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Desbloquear"
                    >
                      <Unlock size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(student._id || student.id)}
                      className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Bloquear"
                    >
                      <Lock size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(student._id || student.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Editar Aluno' : 'Novo Aluno'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="(11) 98765-4321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gênero
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="input-field"
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {editingStudent ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
