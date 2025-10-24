import React, { useState } from 'react';
import { useData } from '../contexts/DataContextAPI';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, TrendingUp, TrendingDown, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Measurements = () => {
  const { students, measurements, addMeasurement, updateMeasurement, deleteMeasurement } = useData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    // Dados Básicos
    weight: '',
    height: '',
    // Calculados
    imc: '',
    bodyFat: '',
    fatMass: '',
    leanMass: '',
    waistHipRatio: '',
    bodyDensity: '',
    skinFoldSum: '',
    armMuscleArea: '',
    armFatArea: '',
    // Circunferências
    shoulders: '',
    chest: '',
    waist: '',
    abdomen: '',
    hip: '',
    calfLeft: '',
    calfRight: '',
    thighLeft: '',
    thighRight: '',
    proximalThighLeft: '',
    proximalThighRight: '',
    relaxedArmLeft: '',
    relaxedArmRight: '',
    contractedArmLeft: '',
    contractedArmRight: '',
    // Pregas Cutâneas
    bicepsFold: '',
    tricepsFold: '',
    midAxillaryFold: '',
    chestFold: '',
    abdominalFold: '',
    subscapularFold: '',
    thighFold: '',
  });

  const studentMeasurements = selectedStudent
    ? measurements.filter(m => {
        const studentId = m.student?._id || m.student || m.studentId;
        return studentId === selectedStudent;
      }).sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  // Calcular IMC
  const calculateIMC = (weight, height) => {
    if (weight && height) {
      const h = parseFloat(height) / 100;
      return (parseFloat(weight) / (h * h)).toFixed(2);
    }
    return '';
  };

  // Calcular soma de dobras
  const calculateSkinFoldSum = () => {
    const folds = [
      formData.bicepsFold, 
      formData.tricepsFold, 
      formData.midAxillaryFold, 
      formData.chestFold, 
      formData.abdominalFold, 
      formData.subscapularFold, 
      formData.thighFold
    ];
    
    const sum = folds.reduce((acc, val) => {
      const numVal = parseFloat(val);
      return acc + (isNaN(numVal) ? 0 : numVal);
    }, 0);
    
    console.log('🔢 Dobras:', folds);
    console.log('🔢 Soma:', sum);
    
    return sum > 0 ? sum : 0;
  };

  // Calcular % de Gordura (Protocolo Jackson & Pollock - 7 dobras)
  const calculateBodyFat = (skinFoldSum, age, gender = 'male') => {
    const sum = parseFloat(skinFoldSum);
    const ageNum = parseFloat(age);
    
    if (isNaN(sum) || sum <= 0 || isNaN(ageNum)) {
      console.log('⚠️ Não foi possível calcular % gordura - Soma:', sum, 'Idade:', ageNum);
      return '';
    }
    
    // Fórmula de Jackson & Pollock
    let bodyDensity;
    if (gender === 'male') {
      bodyDensity = 1.112 - (0.00043499 * sum) + (0.00000055 * sum * sum) - (0.00028826 * ageNum);
    } else {
      bodyDensity = 1.097 - (0.00046971 * sum) + (0.00000056 * sum * sum) - (0.00012828 * ageNum);
    }
    
    // Fórmula de Siri para converter densidade em % gordura
    const bodyFat = ((4.95 / bodyDensity) - 4.5) * 100;
    
    return bodyFat > 0 ? bodyFat.toFixed(2) : '';
  };

  // Calcular Massa Gorda e Massa Magra
  const calculateMasses = (weight, bodyFat) => {
    if (!weight || !bodyFat) return { fatMass: '', leanMass: '' };
    
    const w = parseFloat(weight);
    const bf = parseFloat(bodyFat);
    
    const fatMass = (w * bf / 100).toFixed(2);
    const leanMass = (w - fatMass).toFixed(2);
    
    return { fatMass, leanMass };
  };

  const handleOpenModal = (measurement = null) => {
    if (measurement) {
      // Editar medição existente
      setEditingMeasurement(measurement);
      setFormData({
        studentId: measurement.student?._id || measurement.student || measurement.studentId || '',
        date: measurement.date ? measurement.date.split('T')[0] : '',
        weight: measurement.weight || '',
        height: measurement.height || '',
        imc: measurement.imc || '',
        fatMass: measurement.fatMass || '',
        leanMass: measurement.leanMass || '',
        bodyFat: measurement.bodyFat || '',
        waistHipRatio: measurement.waistHipRatio || '',
        bodyDensity: measurement.bodyDensity || '',
        skinFoldSum: measurement.skinFoldSum || '',
        armMuscleArea: measurement.armMuscleArea || '',
        armFatArea: measurement.armFatArea || '',
        shoulders: measurement.shoulders || '',
        chest: measurement.chest || '',
        waist: measurement.waist || '',
        abdomen: measurement.abdomen || '',
        hip: measurement.hip || '',
        calfLeft: measurement.calfLeft || '',
        calfRight: measurement.calfRight || '',
        thighLeft: measurement.thighLeft || '',
        thighRight: measurement.thighRight || '',
        proximalThighLeft: measurement.proximalThighLeft || '',
        proximalThighRight: measurement.proximalThighRight || '',
        relaxedArmLeft: measurement.relaxedArmLeft || '',
        relaxedArmRight: measurement.relaxedArmRight || '',
        contractedArmLeft: measurement.contractedArmLeft || '',
        contractedArmRight: measurement.contractedArmRight || '',
        bicepsFold: measurement.bicepsFold || '',
        tricepsFold: measurement.tricepsFold || '',
        midAxillaryFold: measurement.midAxillaryFold || '',
        chestFold: measurement.chestFold || '',
        abdominalFold: measurement.abdominalFold || '',
        subscapularFold: measurement.subscapularFold || '',
        thighFold: measurement.thighFold || '',
      });
    } else {
      // Nova medição
      setEditingMeasurement(null);
      setFormData({
        studentId: selectedStudent || '',
        date: new Date().toISOString().split('T')[0],
        weight: '', height: '', imc: '', fatMass: '', leanMass: '', bodyFat: '', waistHipRatio: '', bodyDensity: '', skinFoldSum: '', armMuscleArea: '', armFatArea: '',
        shoulders: '', chest: '', waist: '', abdomen: '', hip: '', calfLeft: '', calfRight: '', thighLeft: '', thighRight: '', proximalThighLeft: '', proximalThighRight: '',
        relaxedArmLeft: '', relaxedArmRight: '', contractedArmLeft: '', contractedArmRight: '',
        bicepsFold: '', tricepsFold: '', midAxillaryFold: '', chestFold: '', abdominalFold: '', subscapularFold: '', thighFold: '',
      });
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeasurement(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { studentId, ...rest } = formData;
      
      // Buscar dados do aluno para cálculos
      const student = students.find(s => (s._id || s.id) === studentId);
      
      // Calcular idade a partir da data de nascimento
      let age = 25; // Idade padrão
      if (student?.birthDate) {
        const birthDate = new Date(student.birthDate);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }
      
      // Converter gênero para formato da fórmula
      const gender = student?.gender === 'Feminino' ? 'female' : 'male';
      
      // Calcular valores
      const imc = calculateIMC(formData.weight, formData.height);
      const skinFoldSum = calculateSkinFoldSum();
      const waistHipRatio = formData.waist && formData.hip ? (parseFloat(formData.waist) / parseFloat(formData.hip)).toFixed(2) : '';
      
      // Calcular % de gordura e massas
      console.log('📊 Cálculo de % Gordura:');
      console.log('- Soma dobras:', skinFoldSum);
      console.log('- Idade:', age);
      console.log('- Gênero:', gender);
      
      const bodyFat = calculateBodyFat(skinFoldSum, age, gender);
      console.log('- % Gordura calculado:', bodyFat);
      
      const { fatMass, leanMass } = calculateMasses(formData.weight, bodyFat);
      console.log('- Massa Gorda:', fatMass, 'kg');
      console.log('- Massa Magra:', leanMass, 'kg');
      
      // Limpar campos vazios e converter strings para números
      const cleanData = {};
      Object.keys(rest).forEach(key => {
        const value = rest[key];
        if (value !== '' && value !== null && value !== undefined) {
          // Converter para número se for um campo numérico
          const numValue = parseFloat(value);
          cleanData[key] = !isNaN(numValue) ? numValue : value;
        }
      });
      
      console.log('🔍 Verificando valores antes de salvar:');
      console.log('- bodyFat:', bodyFat, 'tipo:', typeof bodyFat, 'isNaN:', isNaN(bodyFat));
      console.log('- fatMass:', fatMass, 'tipo:', typeof fatMass);
      console.log('- leanMass:', leanMass, 'tipo:', typeof leanMass);
      
      const dataToSave = {
        ...cleanData,
        student: studentId, // Renomear studentId para student
        date: formData.date, // Incluir data
        // Só incluir se não for vazio ou NaN
        ...(imc && !isNaN(imc) && { imc: parseFloat(imc) }),
        ...(skinFoldSum && skinFoldSum > 0 && !isNaN(skinFoldSum) && { skinFoldSum: parseFloat(skinFoldSum) }),
        ...(waistHipRatio && !isNaN(waistHipRatio) && { waistHipRatio: parseFloat(waistHipRatio) }),
        ...(bodyFat && bodyFat !== '' && !isNaN(parseFloat(bodyFat)) && { bodyFat: parseFloat(bodyFat) }),
        ...(fatMass && fatMass !== '' && !isNaN(parseFloat(fatMass)) && { fatMass: parseFloat(fatMass) }),
        ...(leanMass && leanMass !== '' && !isNaN(parseFloat(leanMass)) && { leanMass: parseFloat(leanMass) }),
      };
      
      console.log('📋 Resumo dos cálculos:');
      console.log('- IMC:', imc);
      console.log('- Soma dobras:', skinFoldSum);
      console.log('- % Gordura:', bodyFat);
      console.log('- Massa Gorda:', fatMass);
      console.log('- Massa Magra:', leanMass);
      console.log('📦 Dados a serem salvos:', dataToSave);
      console.log('🔍 editingMeasurement:', editingMeasurement);
      console.log('🔍 É edição?', !!editingMeasurement);
      
      if (editingMeasurement && (editingMeasurement._id || editingMeasurement.id)) {
        // Atualizar medição existente
        const id = editingMeasurement._id || editingMeasurement.id;
        console.log('✏️ Atualizando medição com ID:', id);
        await updateMeasurement(id, dataToSave);
      } else {
        // Criar nova medição
        console.log('➕ Criando nova medição');
        await addMeasurement(dataToSave);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar medida:', error);
      alert('Erro ao salvar medida: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta medição?')) {
      try {
        await deleteMeasurement(id);
      } catch (error) {
        console.error('Erro ao deletar medição:', error);
        alert('Erro ao deletar medição');
      }
    }
  };

  const getEvolution = (field) => {
    if (studentMeasurements.length < 2) return null;
    const latest = parseFloat(studentMeasurements[0][field]) || 0;
    const previous = parseFloat(studentMeasurements[1][field]) || 0;
    const diff = latest - previous;
    return { value: diff, positive: diff < 0 }; // Negativo é positivo para peso/medidas
  };

  // Preparar dados para o gráfico de peso
  const weightChartData = studentMeasurements
    .slice()
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      peso: parseFloat(m.weight) || 0,
    }));

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Avaliação Antropométrica</h1>
          <p className="text-gray-600 mt-1">Sistema completo de medidas e composição corporal</p>
        </div>
        <button
          onClick={handleOpenModal}
          disabled={!selectedStudent}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Nova Avaliação
        </button>
      </div>

      {/* Student Selection */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">Selecione um aluno</option>
            {students.map((student) => (
              <option key={student._id || student.id} value={student._id || student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedStudent && studentMeasurements.length > 0 && (
        <>
          {/* Latest Measurements - Dados Básicos */}
          <Card title="📊 Dados Básicos e Composição Corporal">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Peso', value: studentMeasurements[0].weight, unit: 'kg', field: 'weight' },
                { label: 'Altura', value: studentMeasurements[0].height, unit: 'cm', field: 'height' },
                { label: 'IMC', value: studentMeasurements[0].imc, unit: '', field: 'imc' },
                { label: 'Massa Gorda', value: studentMeasurements[0].fatMass, unit: 'kg', field: 'fatMass' },
                { label: 'Massa Magra', value: studentMeasurements[0].leanMass, unit: 'kg', field: 'leanMass' },
                { label: 'Cintura/Quadril', value: studentMeasurements[0].waistHipRatio, unit: '', field: 'waistHipRatio' },
                { label: 'Densidade Corporal', value: studentMeasurements[0].bodyDensity, unit: '', field: 'bodyDensity' },
                { label: 'Soma de Dobras', value: studentMeasurements[0].skinFoldSum, unit: 'mm', field: 'skinFoldSum' },
                { label: 'Área Muscular Braço', value: studentMeasurements[0].armMuscleArea, unit: 'cm²', field: 'armMuscleArea' },
                { label: 'Área Gordura Braço', value: studentMeasurements[0].armFatArea, unit: 'cm²', field: 'armFatArea' },
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

          {/* Circunferências */}
          <Card title="📏 Circunferências (cm)">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Ombros', value: studentMeasurements[0].shoulders },
                { label: 'Peitoral', value: studentMeasurements[0].chest },
                { label: 'Cintura', value: studentMeasurements[0].waist },
                { label: 'Abdômen', value: studentMeasurements[0].abdomen },
                { label: 'Quadril', value: studentMeasurements[0].hip },
                { label: 'Panturrilha Esq.', value: studentMeasurements[0].calfLeft },
                { label: 'Panturrilha Dir.', value: studentMeasurements[0].calfRight },
                { label: 'Coxa Esq.', value: studentMeasurements[0].thighLeft },
                { label: 'Coxa Dir.', value: studentMeasurements[0].thighRight },
                { label: 'Coxa Proximal Esq.', value: studentMeasurements[0].proximalThighLeft },
                { label: 'Coxa Proximal Dir.', value: studentMeasurements[0].proximalThighRight },
                { label: 'Braço Relaxado Esq.', value: studentMeasurements[0].relaxedArmLeft },
                { label: 'Braço Relaxado Dir.', value: studentMeasurements[0].relaxedArmRight },
                { label: 'Braço Contraído Esq.', value: studentMeasurements[0].contractedArmLeft },
                { label: 'Braço Contraído Dir.', value: studentMeasurements[0].contractedArmRight },
              ].map((item) => (
                <div key={item.label} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-700 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value || '-'} <span className="text-sm font-normal">cm</span></p>
                </div>
              ))}
            </div>
          </Card>

          {/* Pregas Cutâneas */}
          <Card title="📐 Pregas Cutâneas (mm)">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: 'Bíceps', value: studentMeasurements[0].bicepsFold },
                { label: 'Tríceps', value: studentMeasurements[0].tricepsFold },
                { label: 'Axilar Média', value: studentMeasurements[0].midAxillaryFold },
                { label: 'Tórax', value: studentMeasurements[0].chestFold },
                { label: 'Abdominal', value: studentMeasurements[0].abdominalFold },
                { label: 'Subescapular', value: studentMeasurements[0].subscapularFold },
                { label: 'Coxa', value: studentMeasurements[0].thighFold },
              ].map((item) => (
                <div key={item.label} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-xs text-gray-700 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value || '-'} <span className="text-sm font-normal">mm</span></p>
                </div>
              ))}
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
                    <LineChart data={studentMeasurements.slice().reverse().map(m => ({
                      date: format(new Date(m.date), 'dd/MM'),
                      relaxadoEsq: parseFloat(m.relaxedArmLeft) || 0,
                      relaxadoDir: parseFloat(m.relaxedArmRight) || 0,
                      contraidoEsq: parseFloat(m.contractedArmLeft) || 0,
                      contraidoDir: parseFloat(m.contractedArmRight) || 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="relaxadoEsq" stroke="#10b981" strokeWidth={2} name="Relaxado Esq. (cm)" />
                      <Line type="monotone" dataKey="relaxadoDir" stroke="#3b82f6" strokeWidth={2} name="Relaxado Dir. (cm)" />
                      <Line type="monotone" dataKey="contraidoEsq" stroke="#8b5cf6" strokeWidth={2} name="Contraído Esq. (cm)" />
                      <Line type="monotone" dataKey="contraidoDir" stroke="#ec4899" strokeWidth={2} name="Contraído Dir. (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfico de Coxas */}
                <Card title="Evolução das Coxas">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={studentMeasurements.slice().reverse().map(m => ({
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
                    <LineChart data={studentMeasurements.slice().reverse().map(m => ({
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
                    <LineChart data={studentMeasurements.slice().reverse().map(m => ({
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
              {studentMeasurements.map((measurement) => (
                <div key={measurement._id || measurement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        📅 {format(new Date(measurement.date), 'dd/MM/yyyy')}
                      </p>
                      {measurement.trainer && (
                        <p className="text-sm text-gray-600 mt-1">
                          👤 Profissional: <span className="font-medium">{measurement.trainer.name || measurement.trainer}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(measurement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar medição"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(measurement._id || measurement.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir medição"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
                      <p className="font-semibold text-gray-900">{measurement.bodyFat ? `${measurement.bodyFat}%` : '-'}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-medium text-gray-700 mb-2">Braços</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Relaxado Esq.</p>
                        <p className="font-semibold text-green-700">{measurement.relaxedArmLeft || '-'} cm</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Relaxado Dir.</p>
                        <p className="font-semibold text-blue-700">{measurement.relaxedArmRight || '-'} cm</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Contraído Esq.</p>
                        <p className="font-semibold text-purple-700">{measurement.contractedArmLeft || '-'} cm</p>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">💪 Contraído Dir.</p>
                        <p className="font-semibold text-pink-700">{measurement.contractedArmRight || '-'} cm</p>
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

      {selectedStudent && studentMeasurements.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 py-8">
            Nenhuma medição registrada para este aluno
          </p>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMeasurement ? 'Editar Avaliação Antropométrica' : 'Nova Avaliação Antropométrica'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aluno *
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Selecione um aluno</option>
              {students.map((student) => (
                <option key={student._id || student.id} value={student._id || student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Avaliação *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peito (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.chest}
                onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cintura (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quadril (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hip}
              onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abdômen (cm)
            </label>
            <input type="number" step="0.1" value={formData.abdomen} onChange={(e) => setFormData({ ...formData, abdomen: e.target.value })} className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ombros (cm)</label>
              <input type="number" step="0.1" value={formData.shoulders} onChange={(e) => setFormData({ ...formData, shoulders: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Massa Gorda (kg)</label>
              <input type="number" step="0.1" value={formData.fatMass} onChange={(e) => setFormData({ ...formData, fatMass: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Massa Magra (kg)</label>
              <input type="number" step="0.1" value={formData.leanMass} onChange={(e) => setFormData({ ...formData, leanMass: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Densidade Corporal</label>
              <input type="number" step="0.001" value={formData.bodyDensity} onChange={(e) => setFormData({ ...formData, bodyDensity: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área Muscular Braço (cm²)</label>
              <input type="number" step="0.1" value={formData.armMuscleArea} onChange={(e) => setFormData({ ...formData, armMuscleArea: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área Gordura Braço (cm²)</label>
              <input type="number" step="0.1" value={formData.armFatArea} onChange={(e) => setFormData({ ...formData, armFatArea: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">📏 Circunferências</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.1" value={formData.calfLeft} onChange={(e) => setFormData({ ...formData, calfLeft: e.target.value })} className="input-field" placeholder="Panturrilha Esq. (cm)" />
              <input type="number" step="0.1" value={formData.calfRight} onChange={(e) => setFormData({ ...formData, calfRight: e.target.value })} className="input-field" placeholder="Panturrilha Dir. (cm)" />
              <input type="number" step="0.1" value={formData.thighLeft} onChange={(e) => setFormData({ ...formData, thighLeft: e.target.value })} className="input-field" placeholder="Coxa Esq. (cm)" />
              <input type="number" step="0.1" value={formData.thighRight} onChange={(e) => setFormData({ ...formData, thighRight: e.target.value })} className="input-field" placeholder="Coxa Dir. (cm)" />
              <input type="number" step="0.1" value={formData.proximalThighLeft} onChange={(e) => setFormData({ ...formData, proximalThighLeft: e.target.value })} className="input-field" placeholder="Coxa Proximal Esq. (cm)" />
              <input type="number" step="0.1" value={formData.proximalThighRight} onChange={(e) => setFormData({ ...formData, proximalThighRight: e.target.value })} className="input-field" placeholder="Coxa Proximal Dir. (cm)" />
              <input type="number" step="0.1" value={formData.relaxedArmLeft} onChange={(e) => setFormData({ ...formData, relaxedArmLeft: e.target.value })} className="input-field" placeholder="Braço Relaxado Esq. (cm)" />
              <input type="number" step="0.1" value={formData.relaxedArmRight} onChange={(e) => setFormData({ ...formData, relaxedArmRight: e.target.value })} className="input-field" placeholder="Braço Relaxado Dir. (cm)" />
              <input type="number" step="0.1" value={formData.contractedArmLeft} onChange={(e) => setFormData({ ...formData, contractedArmLeft: e.target.value })} className="input-field" placeholder="Braço Contraído Esq. (cm)" />
              <input type="number" step="0.1" value={formData.contractedArmRight} onChange={(e) => setFormData({ ...formData, contractedArmRight: e.target.value })} className="input-field" placeholder="Braço Contraído Dir. (cm)" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">📐 Pregas Cutâneas (mm)</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.1" value={formData.bicepsFold} onChange={(e) => setFormData({ ...formData, bicepsFold: e.target.value })} className="input-field" placeholder="Bíceps" />
              <input type="number" step="0.1" value={formData.tricepsFold} onChange={(e) => setFormData({ ...formData, tricepsFold: e.target.value })} className="input-field" placeholder="Tríceps" />
              <input type="number" step="0.1" value={formData.midAxillaryFold} onChange={(e) => setFormData({ ...formData, midAxillaryFold: e.target.value })} className="input-field" placeholder="Axilar Média" />
              <input type="number" step="0.1" value={formData.chestFold} onChange={(e) => setFormData({ ...formData, chestFold: e.target.value })} className="input-field" placeholder="Tórax" />
              <input type="number" step="0.1" value={formData.abdominalFold} onChange={(e) => setFormData({ ...formData, abdominalFold: e.target.value })} className="input-field" placeholder="Abdominal" />
              <input type="number" step="0.1" value={formData.subscapularFold} onChange={(e) => setFormData({ ...formData, subscapularFold: e.target.value })} className="input-field" placeholder="Subescapular" />
              <input type="number" step="0.1" value={formData.thighFold} onChange={(e) => setFormData({ ...formData, thighFold: e.target.value })} className="input-field" placeholder="Coxa" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Soma automática: {calculateSkinFoldSum()} mm</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Salvar Avaliação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Measurements;
