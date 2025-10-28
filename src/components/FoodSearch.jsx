import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { foodsService } from '../services/api';

const FoodSearch = ({ onSelectFood, selectedFoods = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const categories = [
    { value: '', label: 'Todas', icon: '🍽️' },
    { value: 'proteina', label: 'Proteína', icon: '🥩' },
    { value: 'carboidrato', label: 'Carboidrato', icon: '🍞' },
    { value: 'vegetal', label: 'Vegetal', icon: '🥬' },
    { value: 'fruta', label: 'Fruta', icon: '🍎' },
    { value: 'gordura', label: 'Gordura', icon: '🥑' },
    { value: 'lacteo', label: 'Laticínio', icon: '🥛' }
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [searchTerm, selectedCategory, foods]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await foodsService.getAll();
      setFoods(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(term) ||
        food.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Ordenar: populares primeiro, depois alfabético
    filtered.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredFoods(filtered);
  };

  const handleSelectFood = (food) => {
    onSelectFood(food);
    setSearchTerm('');
    setShowResults(false);
  };

  const isSelected = (foodId) => {
    return selectedFoods.some(f => f._id === foodId || f.food?._id === foodId);
  };

  return (
    <div className="relative">
      {/* Filtros de Categoria */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
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
          placeholder="Buscar alimento... (ex: frango, arroz, banana)"
          className="input-field pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => {
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
      {showResults && (searchTerm || selectedCategory) && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Carregando...
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum alimento encontrado
            </div>
          ) : (
            <div className="divide-y">
              {filteredFoods.map(food => (
                <button
                  key={food._id}
                  onClick={() => handleSelectFood(food)}
                  disabled={isSelected(food._id)}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected(food._id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{food.name}</span>
                        {food.popular && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                        {isSelected(food._id) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            ✓ Adicionado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                        <span className="text-gray-400 ml-2">(por 100g)</span>
                      </div>
                    </div>
                    {!isSelected(food._id) && (
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

export default FoodSearch;
