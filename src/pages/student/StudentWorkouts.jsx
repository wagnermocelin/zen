import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContextAPI';
import Card from '../../components/Card';
import { Dumbbell } from 'lucide-react';

const StudentWorkouts = () => {
  const { user } = useAuth();
  const { workouts, schedules } = useData();

  // Buscar a ficha ativa do aluno
  const mySchedule = schedules.find(s => 
    (s.student?._id || s.student || s.studentId) === (user._id || user.id)
  );

  // Buscar treinos da ficha do aluno
  const myWorkoutIds = mySchedule?.weekSchedule ? 
    Object.values(mySchedule.weekSchedule).filter(id => id) : [];
  
  const myWorkouts = workouts.filter(w => 
    myWorkoutIds.includes(w._id || w.id)
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Meus Treinos</h1>
        <p className="text-gray-600 mt-1">Visualize todos os seus treinos cadastrados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myWorkouts.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <Dumbbell className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-500 text-lg">Nenhum treino cadastrado ainda</p>
                <p className="text-gray-400 text-sm mt-2">
                  Aguarde seu personal trainer criar seus treinos
                </p>
              </div>
            </Card>
          </div>
        ) : (
          myWorkouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Dumbbell className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{workout.name}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {workout.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Exercícios ({workout.exercises.length})
                  </p>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{exercise.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {exercise.sets} séries × {exercise.reps} repetições
                          {exercise.rest && ` • ${exercise.rest}s descanso`}
                        </p>
                        {exercise.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">{exercise.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentWorkouts;
