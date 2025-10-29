import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const AddFoodModal = ({ isOpen, onClose, onFoodAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'proteina',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sodium: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'proteina', label: 'Proteína', icon: '🥩' },
    { value: 'carboidrato', label: 'Carboidrato', icon: '🍞' },
    { value: 'vegetal', label: 'Vegetal', icon: '🥬' },
    { value: 'fruta', label: 'Fruta', icon: '🍎' },
    { value: 'gordura', label: 'Gordura', icon: '🥑' },
    { value: 'lacteo', label: 'Laticínio', icon: '🥛' },
    { value: 'bebida', label: 'Bebida', icon: '🥤' },
    { value: 'outro', label: 'Outro', icon: '🍽️' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🍽️ AddFoodModal: Iniciando submissão...');
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Converter valores para números
      const foodData = {
        name: formData.name,
        category: formData.category,
        calories: parseFloat(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
        fiber: parseFloat(formData.fiber) || 0,
        sodium: parseFloat(formData.sodium) || 0,
        tags: formData.name.toLowerCase().split(' ')
      };

      console.log('📤 AddFoodModal: Enviando dados:', foodData);
      const response = await api.post('/foods', foodData);
      console.log('✅ AddFoodModal: Resposta recebida:', response);
      console.log('✅ AddFoodModal: response.success:', response.success);
      console.log('✅ AddFoodModal: response.data:', response.data);
      
      if (response.success) {
        setSuccess(true);
        console.log('🎉 AddFoodModal: Alimento criado com sucesso!');
        
        // Resetar formulário
        setFormData({
          name: '',
          category: 'proteina',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
          sodium: ''
        });
        
        // Notificar componente pai
        console.log('📢 AddFoodModal: Notificando componente pai...');
        console.log('📢 AddFoodModal: Alimento a ser notificado:', response.data);
        if (onFoodAdded) {
          onFoodAdded(response.data);
        }
        
        // Fechar após 1 segundo para mostrar mensagem de sucesso
        setTimeout(() => {
          console.log('🚪 AddFoodModal: Fechando modal...');
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('❌ AddFoodModal: Erro ao adicionar:', err);
      setError(err.message || 'Erro ao adicionar alimento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setFormData({
      name: '',
      category: 'proteina',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sodium: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Adicionar Alimento Customizado</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              ✅ Alimento adicionado com sucesso!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Alimento *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Bolo de chocolate caseiro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              ℹ️ Valores Nutricionais (por 100g)
            </p>
            <p className="text-xs text-blue-600">
              Insira os valores nutricionais para cada 100g do alimento
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calorias (kcal) *
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proteínas (g) *
              </label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 8.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carboidratos (g) *
              </label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 45.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gorduras (g) *
              </label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 12.8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fibras (g)
              </label>
              <input
                type="number"
                name="fiber"
                value={formData.fiber}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sódio (mg)
              </label>
              <input
                type="number"
                name="sodium"
                value={formData.sodium}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 150"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar Alimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;
