import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

const Schedules = () => {
  const { students, workouts, schedules, addSchedule, updateSchedule, deleteSchedule } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    startDate: '',
    endDate: '',
    schedule: DAYS_OF_WEEK.map(() => ({ workoutId: '', notes: '' })),
  });

  const filteredSchedules = schedules.filter(schedule => {
    const student = students.find(s => s.id === schedule.studentId);
    return (
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData(schedule);
    } else {
      setEditingSchedule(null);
      setFormData({
        studentId: '',
        name: '',
        startDate: '',
        endDate: '',
        schedule: DAYS_OF_WEEK.map(() => ({ workoutId: '', notes: '' })),
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, formData);
    } else {
      addSchedule(formData);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta ficha?')) {
      deleteSchedule(id);
    }
  };

  const updateDaySchedule = (dayIndex, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex][field] = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const studentWorkouts = formData.studentId
    ? workouts.filter(w => w.studentId === formData.studentId)
    : [];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Fichas de Treino</h1>
          <p className="text-gray-600 mt-1">Organize a agenda semanal de treinos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Nova Ficha
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar ficha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </Card>

      {/* Schedules List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSchedules.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? 'Nenhuma ficha encontrada' : 'Nenhuma ficha cadastrada ainda'}
            </p>
          </Card>
        ) : (
          filteredSchedules.map((schedule) => {
            const student = students.find(s => s.id === schedule.studentId);
            return (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{schedule.name}</h3>
                        <p className="text-sm text-gray-600">{student?.name || 'Aluno não encontrado'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(schedule)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                    {DAYS_OF_WEEK.map((day, index) => {
                      const daySchedule = schedule.schedule[index];
                      const workout = workouts.find(w => w.id === daySchedule?.workoutId);
                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-lg border ${
                            workout ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className="text-xs font-medium text-gray-700 mb-1">{day}</p>
                          {workout ? (
                            <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                          ) : (
                            <p className="text-xs text-gray-500">Descanso</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {schedule.startDate && schedule.endDate && (
                    <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                      Período: {new Date(schedule.startDate).toLocaleDateString()} até {new Date(schedule.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSchedule ? 'Editar Ficha' : 'Nova Ficha'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aluno *
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Ficha *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Ficha ABC - Janeiro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Programação Semanal
            </label>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={day} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">{day}</p>
                  <div className="space-y-2">
                    <select
                      value={formData.schedule[index]?.workoutId || ''}
                      onChange={(e) => updateDaySchedule(index, 'workoutId', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Descanso</option>
                      {studentWorkouts.map((workout) => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={formData.schedule[index]?.notes || ''}
                      onChange={(e) => updateDaySchedule(index, 'notes', e.target.value)}
                      className="input-field"
                      placeholder="Observações (opcional)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {editingSchedule ? 'Salvar' : 'Criar Ficha'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Schedules;
