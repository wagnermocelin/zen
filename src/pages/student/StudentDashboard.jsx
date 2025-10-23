import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import { Dumbbell, Ruler, Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { workouts, measurements, schedules, diets, payments } = useData();

  // Filtrar dados do aluno
  const myWorkouts = workouts.filter(w => w.studentId === user.id);
  const myMeasurements = measurements.filter(m => m.studentId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const mySchedule = schedules.find(s => s.studentId === user.id);
  const myDiet = diets.find(d => d.studentId === user.id);
  const myPayments = payments.filter(p => p.studentId === user.id);

  const latestMeasurement = myMeasurements[0];
  const paidPayments = myPayments.filter(p => p.status === 'paid').length;
  const pendingPayments = myPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length;

  // Treino de hoje
  const today = new Date().getDay();
  const todayWorkout = mySchedule?.schedule[today]?.workoutId 
    ? workouts.find(w => w.id === mySchedule.schedule[today].workoutId)
    : null;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Acompanhe seu progresso e treinos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Dumbbell}
          label="Meus Treinos"
          value={myWorkouts.length}
          color="green"
        />
        <StatCard
          icon={Ruler}
          label="Última Medição"
          value={latestMeasurement ? `${latestMeasurement.weight} kg` : 'N/A'}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label="Ficha Ativa"
          value={mySchedule ? 'Sim' : 'Não'}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          label="Pagamentos OK"
          value={paidPayments}
          color="primary"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treino de Hoje */}
        <Card title="Treino de Hoje">
          {todayWorkout ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Dumbbell className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{todayWorkout.name}</h3>
                  <p className="text-sm text-gray-600">{todayWorkout.type}</p>
                </div>
              </div>

              <div className="space-y-2">
                {todayWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} séries × {exercise.reps} repetições
                      {exercise.rest && ` • ${exercise.rest}s descanso`}
                    </p>
                    {exercise.notes && (
                      <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">Sem treino programado para hoje</p>
              <p className="text-sm text-gray-400 mt-1">Aproveite para descansar!</p>
            </div>
          )}
        </Card>

        {/* Última Medição */}
        <Card title="Última Medição">
          {latestMeasurement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(latestMeasurement.date), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ruler className="text-blue-600" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Peso</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.weight} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Altura</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.height} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Peito</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.chest} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Cintura</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.waist} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">% Gordura</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.bodyFat}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Quadril</p>
                  <p className="text-lg font-bold text-gray-900">{latestMeasurement.hip} cm</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Ruler className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">Nenhuma medição registrada ainda</p>
            </div>
          )}
        </Card>

        {/* Dieta Atual */}
        <Card title="Minha Dieta">
          {myDiet ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{myDiet.name}</h3>
                  <p className="text-sm text-gray-600">{myDiet.goal}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-xs text-gray-600">Calorias</p>
                  <p className="text-sm font-semibold">{myDiet.calories}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <p className="text-xs text-gray-600">Proteína</p>
                  <p className="text-sm font-semibold">{myDiet.protein}g</p>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center">
                  <p className="text-xs text-gray-600">Carbo</p>
                  <p className="text-sm font-semibold">{myDiet.carbs}g</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-center">
                  <p className="text-xs text-gray-600">Gordura</p>
                  <p className="text-sm font-semibold">{myDiet.fat}g</p>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {myDiet.meals.map((meal, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                    <p className="text-sm text-gray-600">{meal.foods}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma dieta cadastrada ainda</p>
            </div>
          )}
        </Card>

        {/* Status Financeiro */}
        <Card title="Status Financeiro">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pagamentos em Dia</p>
                <p className="text-2xl font-bold text-green-700">{paidPayments}</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>

            {pendingPayments > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-700">{pendingPayments}</p>
                </div>
                <DollarSign className="text-yellow-600" size={32} />
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Últimos Pagamentos</p>
              <div className="space-y-2">
                {myPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">R$ {parseFloat(payment.amount).toFixed(2)}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
