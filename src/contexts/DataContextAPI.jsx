import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  studentsService,
  workoutsService,
  measurementsService,
  schedulesService,
  dietsService,
  paymentsService
} from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [diets, setDiets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todos os dados ao iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando dados da API...');
      
      const [
        studentsData,
        workoutsData,
        measurementsData,
        schedulesData,
        dietsData,
        paymentsData
      ] = await Promise.all([
        studentsService.getAll().catch(err => { console.error('Erro students:', err); return []; }),
        workoutsService.getAll().catch(err => { console.error('Erro workouts:', err); return []; }),
        measurementsService.getAll().catch(err => { console.error('Erro measurements:', err); return []; }),
        schedulesService.getAll().catch(err => { console.error('Erro schedules:', err); return []; }),
        dietsService.getAll().catch(err => { console.error('Erro diets:', err); return []; }),
        paymentsService.getAll().catch(err => { console.error('Erro payments:', err); return []; })
      ]);

      setStudents(studentsData.data || studentsData || []);
      setWorkouts(workoutsData.data || workoutsData || []);
      setMeasurements(measurementsData.data || measurementsData || []);
      setSchedules(schedulesData.data || schedulesData || []);
      setDiets(dietsData.data || dietsData || []);
      setPayments(paymentsData.data || paymentsData || []);
      setError(null);
      console.log('✅ Dados carregados com sucesso');
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError(err.message);
      // Mesmo com erro, inicializar com arrays vazios
      setStudents([]);
      setWorkouts([]);
      setMeasurements([]);
      setSchedules([]);
      setDiets([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD para Alunos
  const addStudent = async (student) => {
    try {
      console.log('👤 DataContextAPI - Criando aluno:', student);
      const response = await studentsService.create(student);
      console.log('👤 Resposta da API:', response);
      const newStudent = response.data || response;
      setStudents([...students, newStudent]);
      return newStudent;
    } catch (err) {
      console.error('❌ DataContextAPI - Erro ao adicionar aluno:', err);
      console.error('❌ Resposta de erro:', err.response?.data);
      throw err;
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const response = await studentsService.update(id, updatedData);
      const updatedStudent = response.data || response;
      setStudents(students.map(s => s._id === id || s.id === id ? updatedStudent : s));
      return updatedStudent;
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentsService.delete(id);
      setStudents(students.filter(s => s._id !== id && s.id !== id));
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
      throw err;
    }
  };

  // CRUD para Treinos
  const addWorkout = async (workout) => {
    try {
      const response = await workoutsService.create(workout);
      const newWorkout = response.data || response;
      setWorkouts([...workouts, newWorkout]);
      return newWorkout;
    } catch (err) {
      console.error('Erro ao adicionar treino:', err);
      throw err;
    }
  };

  const updateWorkout = async (id, updatedData) => {
    try {
      const response = await workoutsService.update(id, updatedData);
      const updatedWorkout = response.data || response;
      setWorkouts(workouts.map(w => w._id === id || w.id === id ? updatedWorkout : w));
      return updatedWorkout;
    } catch (err) {
      console.error('Erro ao atualizar treino:', err);
      throw err;
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutsService.delete(id);
      setWorkouts(workouts.filter(w => w._id !== id && w.id !== id));
    } catch (err) {
      console.error('Erro ao deletar treino:', err);
      throw err;
    }
  };

  // CRUD para Medidas
  const addMeasurement = async (measurement) => {
    try {
      console.log('📊 DataContextAPI - Enviando medida:', measurement);
      const response = await measurementsService.create(measurement);
      console.log('📊 DataContextAPI - Resposta da API:', response);
      const newMeasurement = response.data || response;
      setMeasurements([...measurements, newMeasurement]);
      console.log('✅ DataContextAPI - Medida adicionada ao estado');
      return newMeasurement;
    } catch (err) {
      console.error('❌ DataContextAPI - Erro ao adicionar medida:', err);
      console.error('❌ Detalhes do erro:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateMeasurement = async (id, updatedData) => {
    try {
      console.log('📝 DataContextAPI - Atualizando medição:', id);
      console.log('📝 Dados:', updatedData);
      const response = await measurementsService.update(id, updatedData);
      console.log('📝 Resposta da API:', response);
      const updatedMeasurement = response.data || response;
      setMeasurements(measurements.map(m => m._id === id || m.id === id ? updatedMeasurement : m));
      console.log('✅ Medição atualizada no estado');
      return updatedMeasurement;
    } catch (err) {
      console.error('❌ DataContextAPI - Erro ao atualizar medida:', err);
      console.error('❌ Detalhes:', err.response?.data || err.message);
      throw err;
    }
  };

  const deleteMeasurement = async (id) => {
    try {
      await measurementsService.delete(id);
      setMeasurements(measurements.filter(m => m._id !== id && m.id !== id));
    } catch (err) {
      console.error('Erro ao deletar medida:', err);
      throw err;
    }
  };

  // CRUD para Agendamentos
  const addSchedule = async (schedule) => {
    try {
      console.log('📅 DataContextAPI - Criando ficha:', schedule);
      const response = await schedulesService.create(schedule);
      console.log('📅 Resposta da API:', response);
      const newSchedule = response.data || response;
      console.log('📅 Nova ficha:', newSchedule);
      console.log('📅 weekSchedule salvo:', newSchedule.weekSchedule);
      setSchedules([...schedules, newSchedule]);
      return newSchedule;
    } catch (err) {
      console.error('❌ Erro ao adicionar agendamento:', err);
      console.error('❌ Detalhes:', err.response?.data);
      throw err;
    }
  };

  const updateSchedule = async (id, updatedData) => {
    try {
      const response = await schedulesService.update(id, updatedData);
      const updatedSchedule = response.data || response;
      setSchedules(schedules.map(s => s._id === id || s.id === id ? updatedSchedule : s));
      return updatedSchedule;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      throw err;
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await schedulesService.delete(id);
      setSchedules(schedules.filter(s => s._id !== id && s.id !== id));
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      throw err;
    }
  };

  // CRUD para Dietas
  const addDiet = async (diet) => {
    try {
      const response = await dietsService.create(diet);
      const newDiet = response.data || response;
      setDiets([...diets, newDiet]);
      return newDiet;
    } catch (err) {
      console.error('Erro ao adicionar dieta:', err);
      throw err;
    }
  };

  const updateDiet = async (id, updatedData) => {
    try {
      const response = await dietsService.update(id, updatedData);
      const updatedDiet = response.data || response;
      setDiets(diets.map(d => d._id === id || d.id === id ? updatedDiet : d));
      return updatedDiet;
    } catch (err) {
      console.error('Erro ao atualizar dieta:', err);
      throw err;
    }
  };

  const deleteDiet = async (id) => {
    try {
      await dietsService.delete(id);
      setDiets(diets.filter(d => d._id !== id && d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar dieta:', err);
      throw err;
    }
  };

  // CRUD para Pagamentos
  const addPayment = async (payment) => {
    try {
      const response = await paymentsService.create(payment);
      const newPayment = response.data || response;
      // Usar callback para garantir que sempre pegue o estado mais recente
      setPayments(prevPayments => [...prevPayments, newPayment]);
      return newPayment;
    } catch (err) {
      console.error('Erro ao adicionar pagamento:', err);
      throw err;
    }
  };

  const updatePayment = async (id, updatedData) => {
    try {
      console.log('💰 DataContextAPI - Atualizando pagamento');
      console.log('- ID recebido:', id, 'tipo:', typeof id);
      console.log('- Dados:', updatedData);
      
      if (!id || id === 'undefined' || id === undefined) {
        throw new Error('ID do pagamento inválido');
      }
      
      const response = await paymentsService.update(id, updatedData);
      const updatedPayment = response.data || response;
      setPayments(payments.map(p => p._id === id || p.id === id ? updatedPayment : p));
      return updatedPayment;
    } catch (err) {
      console.error('❌ Erro ao atualizar pagamento:', err);
      console.error('❌ Detalhes:', err.response?.data);
      throw err;
    }
  };

  const deletePayment = async (id) => {
    try {
      await paymentsService.delete(id);
      setPayments(payments.filter(p => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Erro ao deletar pagamento:', err);
      throw err;
    }
  };

  const value = {
    students,
    workouts,
    measurements,
    schedules,
    diets,
    payments,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addDiet,
    updateDiet,
    deleteDiet,
    addPayment,
    updatePayment,
    deletePayment,
    refreshData: loadAllData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
