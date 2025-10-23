import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

// Dados iniciais de exemplo
const initialStudents = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'aluno123',
    phone: '(11) 98765-4321',
    birthDate: '1995-05-15',
    gender: 'Masculino',
    joinDate: '2024-01-10',
    status: 'active',
    photo: null,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    password: 'aluno123',
    phone: '(11) 98765-1234',
    birthDate: '1998-08-22',
    gender: 'Feminino',
    joinDate: '2024-02-01',
    status: 'active',
    photo: null,
  },
];

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [diets, setDiets] = useState([]);
  const [payments, setPayments] = useState([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const loadedStudents = localStorage.getItem('students');
    const loadedWorkouts = localStorage.getItem('workouts');
    const loadedMeasurements = localStorage.getItem('measurements');
    const loadedSchedules = localStorage.getItem('schedules');
    const loadedDiets = localStorage.getItem('diets');
    const loadedPayments = localStorage.getItem('payments');

    if (loadedStudents) {
      setStudents(JSON.parse(loadedStudents));
    } else {
      setStudents(initialStudents);
      localStorage.setItem('students', JSON.stringify(initialStudents));
    }

    setWorkouts(loadedWorkouts ? JSON.parse(loadedWorkouts) : []);
    setMeasurements(loadedMeasurements ? JSON.parse(loadedMeasurements) : []);
    setSchedules(loadedSchedules ? JSON.parse(loadedSchedules) : []);
    setDiets(loadedDiets ? JSON.parse(loadedDiets) : []);
    setPayments(loadedPayments ? JSON.parse(loadedPayments) : []);
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('diets', JSON.stringify(diets));
  }, [diets]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  // Funções CRUD para Alunos
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // Funções CRUD para Treinos
  const addWorkout = (workout) => {
    const newWorkout = { ...workout, id: Date.now().toString() };
    setWorkouts([...workouts, newWorkout]);
    return newWorkout;
  };

  const updateWorkout = (id, updatedData) => {
    setWorkouts(workouts.map(w => w.id === id ? { ...w, ...updatedData } : w));
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  // Funções CRUD para Medidas
  const addMeasurement = (measurement) => {
    const newMeasurement = {
      ...measurement,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setMeasurements([...measurements, newMeasurement]);
    return newMeasurement;
  };

  const updateMeasurement = (id, updatedData) => {
    setMeasurements(measurements.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMeasurement = (id) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  // Funções CRUD para Fichas de Treino
  const addSchedule = (schedule) => {
    const newSchedule = { ...schedule, id: Date.now().toString() };
    setSchedules([...schedules, newSchedule]);
    return newSchedule;
  };

  const updateSchedule = (id, updatedData) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Funções CRUD para Dietas
  const addDiet = (diet) => {
    const newDiet = { ...diet, id: Date.now().toString() };
    setDiets([...diets, newDiet]);
    return newDiet;
  };

  const updateDiet = (id, updatedData) => {
    setDiets(diets.map(d => d.id === id ? { ...d, ...updatedData } : d));
  };

  const deleteDiet = (id) => {
    setDiets(diets.filter(d => d.id !== id));
  };

  // Funções CRUD para Pagamentos
  const addPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  };

  const updatePayment = (id, updatedData) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const value = {
    students,
    workouts,
    measurements,
    schedules,
    diets,
    payments,
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
