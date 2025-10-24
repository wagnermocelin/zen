import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, Dumbbell, Ruler, Calendar, 
  Salad, DollarSign, LogOut, Menu, X, Settings 
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout, isTrainer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const [gymName, setGymName] = useState('Zen');

  React.useEffect(() => {
    const storedLogo = localStorage.getItem('gymLogo');
    if (storedLogo) setLogo(storedLogo);
    
    const storedGymName = localStorage.getItem('gymName');
    if (storedGymName) setGymName(storedGymName);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const trainerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Alunos', path: '/students' },
    { icon: Dumbbell, label: 'Treinos', path: '/workouts' },
    { icon: Ruler, label: 'Medidas', path: '/measurements' },
    { icon: Calendar, label: 'Fichas', path: '/schedules' },
    { icon: Salad, label: 'Dietas', path: '/diets' },
    { icon: DollarSign, label: 'Financeiro', path: '/payments' },
    { icon: Settings, label: 'Administração', path: '/admin' },
  ];

  const studentMenuItems = [
    { icon: Home, label: 'Início', path: '/student/dashboard' },
    { icon: Dumbbell, label: 'Meus Treinos', path: '/student/workouts' },
    { icon: Ruler, label: 'Minhas Medidas', path: '/student/measurements' },
    { icon: Calendar, label: 'Minha Ficha', path: '/student/schedule' },
    { icon: Salad, label: 'Minha Dieta', path: '/student/diet' },
    { icon: DollarSign, label: 'Financeiro', path: '/student/payments' },
  ];

  const menuItems = isTrainer ? trainerMenuItems : studentMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {logo ? (
              <img src={logo} alt={gymName} className="h-10 object-contain" />
            ) : (
              <h1 className="text-xl font-bold text-primary-600">{gymName}</h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'trainer' ? 'Personal Trainer' : user?.role === 'professional' ? 'Profissional' : 'Aluno'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
            <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center">
            <p className="text-sm text-gray-600">
              Criado por <span className="font-semibold text-primary-600">Wagner Henrique Mocelin</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
