import React, { useState } from 'react';
import { useData } from '../contexts/DataContextAPI';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, Edit, Trash2, Dumbbell } from 'lucide-react';

const Workouts = () => {
  const { students, workouts, addWorkout, updateWorkout, deleteWorkout } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }],
  });

  const filteredWorkouts = workouts.filter(workout => {
    return (
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenModal = (workout = null) => {
    if (workout) {
      setEditingWorkout(workout);
      setFormData(workout);
    } else {
      setEditingWorkout(null);
      setFormData({
        name: '',
        description: '',
        exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout._id || editingWorkout.id, formData);
      } else {
        await addWorkout(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao salvar treino: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      try {
        await deleteWorkout(id);
      } catch (error) {
        console.error('Erro ao deletar treino:', error);
        alert('Erro ao deletar treino');
      }
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', rest: '', notes: '' }],
    });
  };

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Treinos</h1>
          <p className="text-gray-600 mt-1">Gerencie os treinos dos seus alunos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Novo Treino
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar treino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </Card>

      {/* Workouts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWorkouts.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'Nenhum treino encontrado' : 'Nenhum treino cadastrado ainda'}
              </p>
            </Card>
          </div>
        ) : (
          filteredWorkouts.map((workout) => {
            return (
              <Card key={workout._id || workout.id} className="hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                        <p className="text-sm text-gray-600">{workout.description || 'Sem descrição'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Exercícios ({workout.exercises.length})
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-xs">
                            {exercise.sets} séries × {exercise.reps} reps
                            {exercise.rest && ` • ${exercise.rest}s descanso`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleOpenModal(workout)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(workout._id || workout.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
        title={editingWorkout ? 'Editar Treino' : 'Novo Treino'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Treino *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Ex: Treino A - Peito e Tríceps"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="Descreva o objetivo deste treino..."
              rows="2"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Exercícios *
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Adicionar Exercício
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Exercício {index + 1}
                    </span>
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Nome do exercício"
                    required
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                      className="input-field"
                      placeholder="Séries"
                      required
                    />
                    <input
                      type="text"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                      className="input-field"
                      placeholder="Reps"
                      required
                    />
                    <input
                      type="text"
                      value={exercise.rest}
                      onChange={(e) => updateExercise(index, 'rest', e.target.value)}
                      className="input-field"
                      placeholder="Descanso (s)"
                    />
                  </div>

                  <input
                    type="text"
                    value={exercise.notes}
                    onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                    className="input-field"
                    placeholder="Observações (opcional)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {editingWorkout ? 'Salvar' : 'Criar Treino'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Workouts;
