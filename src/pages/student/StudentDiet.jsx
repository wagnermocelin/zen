import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContextAPI';
import Card from '../../components/Card';
import { Salad } from 'lucide-react';

const StudentDiet = () => {
  const { user } = useAuth();
  const { diets } = useData();

  const myDiet = diets.find(d => {
    const studentId = d.student?._id || d.student || d.studentId;
    return studentId === (user._id || user.id);
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Minha Dieta</h1>
        <p className="text-gray-600 mt-1">Seu plano alimentar personalizado</p>
      </div>

      {!myDiet ? (
        <Card>
          <div className="text-center py-12">
            <Salad className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nenhuma dieta cadastrada ainda</p>
            <p className="text-gray-400 text-sm mt-2">
              Aguarde seu personal trainer criar seu plano alimentar
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card title={myDiet.name}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {myDiet.goal}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Calorias</p>
                  <p className="text-2xl font-bold text-gray-900">{myDiet.calories}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Proteína</p>
                  <p className="text-2xl font-bold text-blue-700">{myDiet.protein}g</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Carboidrato</p>
                  <p className="text-2xl font-bold text-orange-700">{myDiet.carbs}g</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Gordura</p>
                  <p className="text-2xl font-bold text-yellow-700">{myDiet.fat}g</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Refeições">
            <div className="space-y-4">
              {myDiet.meals.map((meal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
                    <span className="text-sm font-medium text-primary-600">{meal.time}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{meal.foods}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentDiet;
