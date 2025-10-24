import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Upload, Settings, Users, Shield, Image } from 'lucide-react';
import { usersService, configService } from '../services/api';

const Admin = () => {
  const [professionals, setProfessionals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [logo, setLogo] = useState('');
  const [gymName, setGymName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'trainer',
    status: 'active',
  });

  // Carregar dados da API
  useEffect(() => {
    loadUsers();
    loadConfig();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersService.getAll();
      setProfessionals(response.data || response);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await configService.get();
      const config = response.data || response;
      if (config.gymName) setGymName(config.gymName);
      if (config.logo) setLogo(config.logo);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'trainer',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Editar usuário existente
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
        
        // Só incluir senha se foi preenchida
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await usersService.update(editingUser._id || editingUser.id, updateData);
      } else {
        // Criar novo usuário
        await usersService.create(formData);
      }
      
      // Recarregar lista de usuários
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await usersService.delete(userId);
        await loadUsers();
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setLogo(base64String);
        try {
          await configService.update({ logo: base64String, gymName });
          alert('Logo salvo com sucesso!');
        } catch (error) {
          console.error('Erro ao salvar logo:', error);
          alert('Erro ao salvar logo');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGymName = async () => {
    try {
      await configService.update({ gymName, logo });
      alert('Nome da academia salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      alert('Erro ao salvar nome da academia');
    }
  };

  const handleRemoveLogo = async () => {
    setLogo('');
    try {
      await configService.update({ logo: '', gymName });
      alert('Logo removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover logo:', error);
      alert('Erro ao remover logo');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários e configurações do sistema</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Configurações da Academia */}
      <Card title="⚙️ Configurações da Academia">
        <div className="space-y-6">
          {/* Nome da Academia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Academia
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="input-field flex-1"
                placeholder="Ex: Zen Personal Training"
              />
              <button onClick={handleSaveGymName} className="btn-primary">
                Salvar
              </button>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo da Academia
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {logo ? (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-32 h-32 object-contain border-2 border-gray-300 rounded-lg bg-white p-2"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <Image size={32} className="text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <Upload size={20} />
                  Escolher Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceitos: JPG, PNG, SVG (máx. 2MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Usuários */}
      <Card title="👥 Usuários do Sistema">
        <div className="space-y-3">
          {professionals.map((user) => (
            <div
              key={user._id || user.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  user.role === 'trainer' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'
                }`}>
                  {user.role === 'trainer' ? <Shield size={24} /> : <Users size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'trainer' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'trainer' ? 'Personal Trainer' : 'Profissional'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(user._id || user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {professionals.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Nenhum usuário cadastrado
          </p>
        )}
      </Card>

      {/* Modal de Usuário */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
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
              placeholder="Ex: João Silva"
            />
          </div>

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
              placeholder="Ex: joao@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha {editingUser && '(deixe em branco para manter a atual)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              required={!editingUser}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuário *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
              required
            >
              <option value="trainer">Personal Trainer</option>
              <option value="professional">Profissional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
              required
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {editingUser ? 'Atualizar' : 'Criar'} Usuário
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
