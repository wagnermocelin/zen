import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContextAPI';
import Card from '../../components/Card';
import { Ruler, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentMeasurements = () => {
  const { user } = useAuth();
  const { measurements } = useData();

  const myMeasurements = measurements
    .filter(m => {
      const studentId = m.student?._id || m.student || m.studentId;
      return studentId === (user._id || user.id);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestMeasurement = myMeasurements[0];

  const getEvolution = (field) => {
    if (myMeasurements.length < 2) return null;
    const latest = parseFloat(myMeasurements[0][field]) || 0;
    const previous = parseFloat(myMeasurements[1][field]) || 0;
    const diff = latest - previous;
    return { value: diff, positive: diff < 0 };
  };

  const weightChartData = myMeasurements
    .slice()
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      peso: parseFloat(m.weight) || 0,
    }));

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Minhas Medidas</h1>
        <p className="text-gray-600 mt-1">Acompanhe sua evolução física</p>
      </div>

      {myMeasurements.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Ruler className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nenhuma medição registrada ainda</p>
            <p className="text-gray-400 text-sm mt-2">
              Aguarde seu personal trainer registrar suas medidas
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Latest Measurements */}
          <Card title="Última Medição">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Registrado em {format(new Date(latestMeasurement.date), 'dd/MM/yyyy')}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Peso', value: latestMeasurement.weight, unit: 'kg', field: 'weight' },
                { label: 'Altura', value: latestMeasurement.height, unit: 'cm', field: 'height' },
                { label: 'Peito', value: latestMeasurement.chest, unit: 'cm', field: 'chest' },
                { label: 'Cintura', value: latestMeasurement.waist, unit: 'cm', field: 'waist' },
                { label: 'Quadril', value: latestMeasurement.hip, unit: 'cm', field: 'hip' },
                { label: 'Braço Esq.', value: latestMeasurement.armLeft, unit: 'cm', field: 'armLeft' },
                { label: 'Braço Dir.', value: latestMeasurement.armRight, unit: 'cm', field: 'armRight' },
                { label: 'Coxa Esq.', value: latestMeasurement.thighLeft, unit: 'cm', field: 'thighLeft' },
                { label: 'Coxa Dir.', value: latestMeasurement.thighRight, unit: 'cm', field: 'thighRight' },
                { label: 'Panturrilha Esq.', value: latestMeasurement.calfLeft, unit: 'cm', field: 'calfLeft' },
                { label: 'Panturrilha Dir.', value: latestMeasurement.calfRight, unit: 'cm', field: 'calfRight' },
                { label: '% Gordura', value: latestMeasurement.bodyFat, unit: '%', field: 'bodyFat' },
              ].map((item) => {
                const evolution = getEvolution(item.field);
                return (
                  <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {item.value} <span className="text-sm font-normal">{item.unit}</span>
                    </p>
                    {evolution && evolution.value !== 0 && (
                      <div className={`flex items-center gap-1 mt-1 ${evolution.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {evolution.positive ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                        <span className="text-xs">
                          {Math.abs(evolution.value).toFixed(1)} {item.unit}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Charts */}
          {weightChartData.length > 1 && (
            <>
              <Card title="Evolução do Peso">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="peso" stroke="#0ea5e9" strokeWidth={2} name="Peso (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Braços */}
                <Card title="Evolução dos Braços">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={myMeasurements.slice().reverse().map(m => ({
                      date: format(new Date(m.date), 'dd/MM'),
                      esquerdo: parseFloat(m.armLeft) || 0,
                      direito: parseFloat(m.armRight) || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="esquerdo" stroke="#10b981" strokeWidth={2} name="Braço Esq. (cm)" />
                      <Line type="monotone" dataKey="direito" stroke="#3b82f6" strokeWidth={2} name="Braço Dir. (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfico de Coxas */}
                <Card title="Evolução das Coxas">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={myMeasurements.slice().reverse().map(m => ({
                      date: format(new Date(m.date), 'dd/MM'),
                      esquerda: parseFloat(m.thighLeft) || 0,
                      direita: parseFloat(m.thighRight) || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="esquerda" stroke="#f59e0b" strokeWidth={2} name="Coxa Esq. (cm)" />
                      <Line type="monotone" dataKey="direita" stroke="#ef4444" strokeWidth={2} name="Coxa Dir. (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfico de Panturrilhas */}
                <Card title="Evolução das Panturrilhas">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={myMeasurements.slice().reverse().map(m => ({
                      date: format(new Date(m.date), 'dd/MM'),
                      esquerda: parseFloat(m.calfLeft) || 0,
                      direita: parseFloat(m.calfRight) || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="esquerda" stroke="#8b5cf6" strokeWidth={2} name="Panturrilha Esq. (cm)" />
                      <Line type="monotone" dataKey="direita" stroke="#ec4899" strokeWidth={2} name="Panturrilha Dir. (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfico de % Gordura */}
                <Card title="Evolução do % de Gordura">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={myMeasurements.slice().reverse().map(m => ({
                      date: format(new Date(m.date), 'dd/MM'),
                      gordura: parseFloat(m.bodyFat) || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gordura" stroke="#f97316" strokeWidth={2} name="% Gordura" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}

          {/* History */}
          <Card title="Histórico Completo de Medições">
            <div className="space-y-4">
              {myMeasurements.map((measurement) => (
                <div key={measurement._id || measurement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                    <p className="font-semibold text-gray-900 text-lg">
                      📅 {format(new Date(measurement.date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Peso</p>
                      <p className="font-semibold text-gray-900">{measurement.weight} kg</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Altura</p>
                      <p className="font-semibold text-gray-900">{measurement.height} cm</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Peito</p>
                      <p className="font-semibold text-gray-900">{measurement.chest} cm</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Cintura</p>
                      <p className="font-semibold text-gray-900">{measurement.waist} cm</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Quadril</p>
                      <p className="font-semibold text-gray-900">{measurement.hip} cm</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">% Gordura</p>
                      <p className="font-semibold text-gray-900">{measurement.bodyFat}%</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-medium text-gray-700 mb-2">Membros Unilaterais</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Braço Esq.</p>
                        <p className="font-semibold text-green-700">{measurement.armLeft} cm</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Braço Dir.</p>
                        <p className="font-semibold text-blue-700">{measurement.armRight} cm</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">🦵 Coxa Esq.</p>
                        <p className="font-semibold text-orange-700">{measurement.thighLeft} cm</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">🦵 Coxa Dir.</p>
                        <p className="font-semibold text-red-700">{measurement.thighRight} cm</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">🦿 Panturrilha Esq.</p>
                        <p className="font-semibold text-purple-700">{measurement.calfLeft} cm</p>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">🦿 Panturrilha Dir.</p>
                        <p className="font-semibold text-pink-700">{measurement.calfRight} cm</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentMeasurements;
