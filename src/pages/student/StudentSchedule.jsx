import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContextAPI';
import Card from '../../components/Card';
import { Calendar, Dumbbell } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

const StudentSchedule = () => {
  const { user } = useAuth();
  const { schedules, workouts } = useData();

  const mySchedule = schedules.find(s => {
    const studentId = s.student?._id || s.student || s.studentId;
    return studentId === (user._id || user.id);
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Minha Ficha de Treino</h1>
        <p className="text-gray-600 mt-1">Sua programação semanal de treinos</p>
      </div>

      {!mySchedule ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nenhuma ficha cadastrada ainda</p>
            <p className="text-gray-400 text-sm mt-2">
              Aguarde seu personal trainer criar sua ficha de treinos
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Ficha Ativa</h3>
                {mySchedule.startDate && mySchedule.endDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    Período: {new Date(mySchedule.startDate).toLocaleDateString()} até {new Date(mySchedule.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {(() => {
                const scheduleArray = mySchedule?.weekSchedule ? [
                  mySchedule.weekSchedule.sunday,
                  mySchedule.weekSchedule.monday,
                  mySchedule.weekSchedule.tuesday,
                  mySchedule.weekSchedule.wednesday,
                  mySchedule.weekSchedule.thursday,
                  mySchedule.weekSchedule.friday,
                  mySchedule.weekSchedule.saturday,
                ] : [];
                
                return DAYS_OF_WEEK.map((day, index) => {
                  const workoutId = scheduleArray[index];
                  const workout = workouts.find(w => (w._id || w.id) === workoutId);
                  const isToday = new Date().getDay() === index;

                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-lg border-2 ${
                        isToday
                          ? 'bg-primary-50 border-primary-500'
                          : workout
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className={`text-xs font-medium mb-2 ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                        {day}
                        {isToday && ' (Hoje)'}
                      </p>
                      {workout ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Dumbbell size={16} className="text-green-600" />
                            <p className="text-sm font-semibold text-gray-900">{workout.name}</p>
                          </div>
                          <p className="text-xs text-gray-600">{workout.description || 'Sem descrição'}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Descanso</p>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentSchedule;
