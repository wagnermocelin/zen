import React, { useState } from 'react';
import { useData } from '../contexts/DataContextAPI';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, Edit, Trash2, Salad } from 'lucide-react';

const Diets = () => {
  const { students, diets, addDiet, updateDiet, deleteDiet } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    goal: 'Emagrecimento',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meals: [{ name: 'Café da Manhã', time: '08:00', foods: '' }],
  });

  const filteredDiets = diets.filter(diet => {
    const student = students.find(s => (s._id || s.id) === (diet.student?._id || diet.student || diet.studentId));
    return (
      diet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenModal = (diet = null) => {
    if (diet) {
      setEditingDiet(diet);
      setFormData(diet);
    } else {
      setEditingDiet(null);
      setFormData({
        studentId: '',
        name: '',
        goal: 'Emagrecimento',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meals: [{ name: 'Café da Manhã', time: '08:00', foods: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDiet(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { studentId, ...rest } = formData;
      const dataToSave = {
        ...rest,
        student: studentId // Renomear studentId para student
      };
      
      if (editingDiet) {
        await updateDiet(editingDiet._id || editingDiet.id, dataToSave);
      } else {
        await addDiet(dataToSave);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar dieta:', error);
      alert('Erro ao salvar dieta: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta dieta?')) {
      try {
        await deleteDiet(id);
      } catch (error) {
        console.error('Erro ao deletar dieta:', error);
        alert('Erro ao deletar dieta');
      }
    }
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      meals: [...formData.meals, { name: '', time: '', foods: '' }],
    });
  };

  const removeMeal = (index) => {
    setFormData({
      ...formData,
      meals: formData.meals.filter((_, i) => i !== index),
    });
  };

  const updateMeal = (index, field, value) => {
    const newMeals = [...formData.meals];
    newMeals[index][field] = value;
    setFormData({ ...formData, meals: newMeals });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dietas</h1>
          <p className="text-gray-600 mt-1">Gerencie os planos alimentares</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Nova Dieta
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar dieta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </Card>

      {/* Diets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDiets.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'Nenhuma dieta encontrada' : 'Nenhuma dieta cadastrada ainda'}
              </p>
            </Card>
          </div>
        ) : (
          filteredDiets.map((diet) => {
            const student = students.find(s => (s._id || s.id) === (diet.student?._id || diet.student || diet.studentId));
            return (
              <Card key={diet._id || diet.id} className="hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Salad className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{diet.name}</h3>
                        <p className="text-sm text-gray-600">{student?.name || 'Aluno não encontrado'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {diet.goal}
                    </span>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Calorias</p>
                      <p className="text-sm font-semibold">{diet.calories}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Proteína</p>
                      <p className="text-sm font-semibold">{diet.protein}g</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Carbo</p>
                      <p className="text-sm font-semibold">{diet.carbs}g</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-600">Gordura</p>
                      <p className="text-sm font-semibold">{diet.fat}g</p>
                    </div>
                  </div>

                  {/* Meals */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Refeições ({diet.meals.length})
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {diet.meals.map((meal, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <p className="font-medium">{meal.name} - {meal.time}</p>
                          <p className="text-xs text-gray-600 truncate">{meal.foods}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleOpenModal(diet)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(diet._id || diet.id)}
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
        title={editingDiet ? 'Editar Dieta' : 'Nova Dieta'}
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
                  <option key={student._id || student.id} value={student._id || student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Dieta *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Dieta Emagrecimento"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="input-field"
            >
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Ganho de Massa">Ganho de Massa</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Definição">Definição</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calorias *
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="input-field"
                placeholder="2000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proteína (g) *
              </label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="input-field"
                placeholder="150"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carboidrato (g) *
              </label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="input-field"
                placeholder="200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gordura (g) *
              </label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                className="input-field"
                placeholder="60"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Refeições *
              </label>
              <button
                type="button"
                onClick={addMeal}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Adicionar Refeição
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.meals.map((meal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Refeição {index + 1}
                    </span>
                    {formData.meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={meal.name}
                      onChange={(e) => updateMeal(index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Nome da refeição"
                      required
                    />
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(e) => updateMeal(index, 'time', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <textarea
                    value={meal.foods}
                    onChange={(e) => updateMeal(index, 'foods', e.target.value)}
                    className="input-field"
                    placeholder="Alimentos e quantidades..."
                    rows="3"
                    required
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
              {editingDiet ? 'Salvar' : 'Criar Dieta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Diets;
