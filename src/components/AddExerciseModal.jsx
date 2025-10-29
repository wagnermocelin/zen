import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const AddExerciseModal = ({ isOpen, onClose, onExerciseAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'peito',
    muscleGroup: 'peitoral',
    equipment: 'barra',
    difficulty: 'intermediario',
    description: '',
    instructions: '',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'peito', label: 'Peito', icon: '💪' },
    { value: 'costas', label: 'Costas', icon: '🏋️' },
    { value: 'pernas', label: 'Pernas', icon: '🦵' },
    { value: 'ombros', label: 'Ombros', icon: '💪' },
    { value: 'biceps', label: 'Bíceps', icon: '💪' },
    { value: 'triceps', label: 'Tríceps', icon: '💪' },
    { value: 'abdomen', label: 'Abdômen', icon: '🔥' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'funcional', label: 'Funcional', icon: '⚡' },
    { value: 'outro', label: 'Outro', icon: '💪' }
  ];

  const muscleGroups = [
    { value: 'peitoral', label: 'Peitoral' },
    { value: 'dorsal', label: 'Dorsal' },
    { value: 'quadriceps', label: 'Quadríceps' },
    { value: 'posterior', label: 'Posterior de Coxa' },
    { value: 'gluteos', label: 'Glúteos' },
    { value: 'deltoides', label: 'Deltoides' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'triceps', label: 'Tríceps' },
    { value: 'abdominais', label: 'Abdominais' },
    { value: 'panturrilhas', label: 'Panturrilhas' },
    { value: 'trapezio', label: 'Trapézio' },
    { value: 'antebracos', label: 'Antebraços' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'corpo-inteiro', label: 'Corpo Inteiro' }
  ];

  const equipments = [
    { value: 'barra', label: 'Barra' },
    { value: 'halteres', label: 'Halteres' },
    { value: 'maquina', label: 'Máquina' },
    { value: 'cabo', label: 'Cabo/Polia' },
    { value: 'peso-corporal', label: 'Peso Corporal' },
    { value: 'elastico', label: 'Elástico' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'medicine-ball', label: 'Medicine Ball' },
    { value: 'nenhum', label: 'Nenhum' }
  ];

  const difficulties = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' }
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
    console.log('💪 AddExerciseModal: Iniciando submissão...');
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const exerciseData = {
        ...formData,
        tags: formData.name.toLowerCase().split(' ')
      };

      console.log('📤 AddExerciseModal: Enviando dados:', exerciseData);
      const response = await api.post('/exercises', exerciseData);
      console.log('✅ AddExerciseModal: Resposta recebida:', response);
      
      if (response.success) {
        setSuccess(true);
        console.log('🎉 AddExerciseModal: Exercício criado com sucesso!');
        
        // Resetar formulário
        setFormData({
          name: '',
          category: 'peito',
          muscleGroup: 'peitoral',
          equipment: 'barra',
          difficulty: 'intermediario',
          description: '',
          instructions: '',
          videoUrl: ''
        });
        
        // Notificar componente pai
        console.log('📢 AddExerciseModal: Notificando componente pai...');
        if (onExerciseAdded) {
          onExerciseAdded(response.data);
        }
        
        // Fechar após 1.5 segundos
        setTimeout(() => {
          console.log('🚪 AddExerciseModal: Fechando modal...');
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('❌ AddExerciseModal: Erro ao adicionar:', err);
      setError(err.message || 'Erro ao adicionar exercício');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setFormData({
      name: '',
      category: 'peito',
      muscleGroup: 'peitoral',
      equipment: 'barra',
      difficulty: 'intermediario',
      description: '',
      instructions: '',
      videoUrl: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Adicionar Exercício Customizado</h2>
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
              ✅ Exercício adicionado com sucesso!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Exercício *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Supino inclinado com pegada fechada"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupo Muscular *
              </label>
              <select
                name="muscleGroup"
                value={formData.muscleGroup}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {muscleGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamento *
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {equipments.map(eq => (
                  <option key={eq.value} value={eq.value}>
                    {eq.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dificuldade *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição do exercício..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruções de Execução
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Como executar o exercício corretamente..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL do Vídeo (YouTube, etc)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/..."
            />
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
              {loading ? 'Adicionando...' : 'Adicionar Exercício'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;
