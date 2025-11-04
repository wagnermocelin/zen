import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { exercisesService } from '../services/api';

const ExerciseSearch = ({ onSelectExercise, selectedExercises = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const categories = [
    { value: '', label: 'Todas', icon: '💪' },
    { value: 'peito', label: 'Peito', icon: '💪' },
    { value: 'costas', label: 'Costas', icon: '🏋️' },
    { value: 'pernas', label: 'Pernas', icon: '🦵' },
    { value: 'ombros', label: 'Ombros', icon: '💪' },
    { value: 'biceps', label: 'Bíceps', icon: '💪' },
    { value: 'triceps', label: 'Tríceps', icon: '💪' },
    { value: 'abdomen', label: 'Abdômen', icon: '🔥' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'funcional', label: 'Funcional', icon: '⚡' }
  ];

  const muscleGroups = [
    { value: '', label: 'Todos' },
    { value: 'peitoral', label: 'Peitoral' },
    { value: 'dorsal', label: 'Dorsal' },
    { value: 'quadriceps', label: 'Quadríceps' },
    { value: 'posterior', label: 'Posterior' },
    { value: 'gluteos', label: 'Glúteos' },
    { value: 'deltoides', label: 'Deltoides' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'triceps', label: 'Tríceps' },
    { value: 'abdominais', label: 'Abdominais' },
    { value: 'panturrilhas', label: 'Panturrilhas' }
  ];

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchTerm, selectedCategory, selectedMuscleGroup, exercises]);

  const loadExercises = async () => {
    try {
      console.log('💪 ExerciseSearch: Carregando exercícios...');
      setLoading(true);
      const response = await exercisesService.getAll();
      console.log('📦 ExerciseSearch: Resposta recebida:', response);
      
      const exercisesList = response.data || [];
      console.log('✅ ExerciseSearch: Exercícios carregados:', exercisesList.length);
      setExercises(exercisesList);
    } catch (error) {
      console.error('❌ ExerciseSearch: Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    // Filtrar por grupo muscular
    if (selectedMuscleGroup) {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscleGroup);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(term) ||
        ex.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Ordenar: customizados primeiro, populares depois, alfabético
    filtered.sort((a, b) => {
      if (a.isCustom && !b.isCustom) return -1;
      if (!a.isCustom && b.isCustom) return 1;
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredExercises(filtered);
  };

  const handleSelectExercise = (exercise) => {
    onSelectExercise(exercise);
    setSearchTerm('');
    setShowResults(false);
  };

  const isSelected = (exerciseId) => {
    return selectedExercises.some(e => e._id === exerciseId || e.exercise?._id === exerciseId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800';
      case 'avancado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentIcon = (equipment) => {
    switch (equipment) {
      case 'barra': return '🏋️';
      case 'halteres': return '💪';
      case 'maquina': return '⚙️';
      case 'cabo': return '🔗';
      case 'peso-corporal': return '🤸';
      case 'elastico': return '🎗️';
      case 'kettlebell': return '⚫';
      case 'medicine-ball': return '⚽';
      default: return '💪';
    }
  };

  return (
    <div className="relative">
      {/* Filtros de Categoria */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(cat.value);
            }}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filtro de Grupo Muscular */}
      <div className="mb-3">
        <select
          value={selectedMuscleGroup}
          onChange={(e) => setSelectedMuscleGroup(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {muscleGroups.map(group => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>
      </div>

      {/* Campo de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Buscar exercício... (ex: supino, agachamento, rosca)"
          className="input-field pl-10 pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm('');
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Resultados da Busca */}
      {showResults && (searchTerm || selectedCategory || selectedMuscleGroup) && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Carregando...
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum exercício encontrado
            </div>
          ) : (
            <div className="divide-y">
              {filteredExercises.map(exercise => (
                <button
                  key={exercise._id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectExercise(exercise);
                  }}
                  disabled={isSelected(exercise._id)}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected(exercise._id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{exercise.name}</span>
                        {exercise.isCustom && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Customizado
                          </span>
                        )}
                        {exercise.popular && !exercise.isCustom && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                        {isSelected(exercise._id) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            ✓ Adicionado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{getEquipmentIcon(exercise.equipment)} {exercise.equipment}</span>
                        <span>•</span>
                        <span>{exercise.muscleGroup}</span>
                      </div>
                    </div>
                    {!isSelected(exercise._id) && (
                      <Plus size={20} className="text-primary-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {showResults && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default ExerciseSearch;
