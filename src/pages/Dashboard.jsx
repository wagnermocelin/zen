import React from 'react';
import { useData } from '../contexts/DataContextAPI';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import { Users, Dumbbell, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const { students, workouts, payments, schedules } = useData();

  // Debug: verificar dados
  console.log('📊 Dashboard - Dados carregados:');
  console.log('- Alunos:', students.length);
  console.log('- Treinos:', workouts.length);
  console.log('- Pagamentos:', payments.length, payments);
  console.log('- Fichas:', schedules.length, schedules);

  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalWorkouts = workouts.length;
  
  // Calcular receita do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const currentMonthName = monthNames[currentMonth];
  
  console.log('📅 Mês atual:', currentMonthName, '(', currentMonth, ') Ano:', currentYear);
  console.log('📋 Todos os pagamentos:', payments);
  
  // Filtrar por mês/ano usando os campos month e year do modelo
  const paidThisMonth = payments.filter(p => {
    console.log('🔍 Verificando pagamento:', {
      month: p.month,
      year: p.year,
      status: p.status,
      amount: p.amount,
      dueDate: p.dueDate
    });
    
    // Usar os campos month e year que já existem no modelo
    return p.status === 'paid' && 
           p.month === currentMonthName && 
           p.year === currentYear;
  });
  
  console.log('💰 Pagamentos pagos este mês:', paidThisMonth.length, paidThisMonth);
  
  const monthlyRevenue = paidThisMonth.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  console.log('💵 Receita do mês:', monthlyRevenue);

  // Próximos treinos (fichas agendadas para hoje)
  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = dayNames[dayOfWeek];
  
  console.log('📅 Hoje é:', todayName, '(dia da semana:', dayOfWeek + ')');
  
  const todaySchedules = schedules.filter(s => {
    const hasSchedule = s.weekSchedule && s.weekSchedule[todayName] && s.weekSchedule[todayName].length > 0;
    if (hasSchedule) {
      console.log('✅ Ficha com treino hoje:', s);
    }
    return hasSchedule;
  });
  
  console.log('🏋️ Total de treinos hoje:', todaySchedules.length);

  // Últimos alunos cadastrados
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Alunos Ativos"
          value={activeStudents}
          color="primary"
        />
        <StatCard
          icon={Dumbbell}
          label="Treinos Cadastrados"
          value={totalWorkouts}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Receita do Mês"
          value={`R$ ${monthlyRevenue.toFixed(2)}`}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label="Treinos Hoje"
          value={todaySchedules.length}
          color="purple"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Alunos */}
        <Card title="Últimos Alunos Cadastrados">
          {recentStudents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum aluno cadastrado ainda</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div
                  key={student._id || student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(new Date(student.joinDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Atividades Recentes */}
        <Card title="Resumo Rápido">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Alunos</p>
                <p className="text-lg font-semibold text-gray-900">{students.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Dumbbell className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Treinos Criados</p>
                <p className="text-lg font-semibold text-gray-900">{workouts.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fichas Ativas</p>
                <p className="text-lg font-semibold text-gray-900">{schedules.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa de Atividade</p>
                <p className="text-lg font-semibold text-gray-900">
                  {students.length > 0 ? Math.round((activeStudents / students.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
