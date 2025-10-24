import React, { useState } from 'react';
import { useData } from '../contexts/DataContextAPI';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Plus, Search, DollarSign, Check, X, Clock, Repeat, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Payments = () => {
  const { students, payments, addPayment, updatePayment, deletePayment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    method: 'Dinheiro',
    notes: '',
  });
  const [recurringData, setRecurringData] = useState({
    studentId: '',
    amount: '',
    startDate: '',
    endDate: '',
    frequency: 'monthly',
    dayOfMonth: '5',
    method: 'Dinheiro',
    notes: '',
  });

  // Função para verificar e atualizar status de pagamentos atrasados
  const checkOverduePayments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    payments.forEach(payment => {
      if (payment.status === 'pending') {
        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          const paymentId = payment._id || payment.id;
          if (paymentId) {
            updatePayment(paymentId, { status: 'overdue' });
          }
        }
      }
    });
  };

  // Verificar pagamentos atrasados ao carregar
  React.useEffect(() => {
    checkOverduePayments();
  }, [payments.length]);

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => (s._id || s.id) === (payment.student?._id || payment.student || payment.studentId));
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (payment = null) => {
    if (payment && (payment._id || payment.id)) {
      // Editar pagamento existente
      console.log('✏️ Editando pagamento:', payment._id || payment.id);
      setEditingPayment(payment);
      setFormData({
        studentId: payment.student?._id || payment.student || payment.studentId || '',
        amount: payment.amount || '',
        dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '', // Converter para formato yyyy-MM-dd
        status: payment.status || 'pending',
        method: payment.paymentMethod || payment.method || 'Dinheiro',
        notes: payment.notes || '',
      });
    } else {
      // Novo pagamento
      console.log('➕ Criando novo pagamento');
      setEditingPayment(null);
      setFormData({
        studentId: '',
        amount: '',
        dueDate: '',
        status: 'pending',
        method: 'Dinheiro',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Verificar se a data de vencimento já passou
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      const { studentId, ...rest } = formData;
      
      // Obter mês e ano da data de vencimento
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const month = monthNames[dueDate.getMonth()];
      const year = dueDate.getFullYear();
      
      const paymentData = {
        ...rest,
        student: studentId, // Renomear studentId para student
        month: month,
        year: year,
        status: dueDate < today && formData.status === 'pending' ? 'overdue' : formData.status,
        paymentMethod: rest.method // Renomear method para paymentMethod
      };
      
      if (editingPayment && (editingPayment._id || editingPayment.id)) {
        // Atualizar pagamento existente
        const paymentId = editingPayment._id || editingPayment.id;
        console.log('📝 Atualizando pagamento:', paymentId);
        console.log('📝 editingPayment completo:', editingPayment);
        console.log('📝 Dados a enviar:', paymentData);
        
        if (!paymentId || paymentId === 'undefined') {
          throw new Error('ID do pagamento inválido para atualização');
        }
        
        await updatePayment(paymentId, paymentData);
      } else {
        // Criar novo pagamento
        console.log('📝 Criando novo pagamento');
        console.log('📝 Dados a enviar:', paymentData);
        await addPayment(paymentData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      alert('Erro ao salvar pagamento: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleRecurringSubmit = async (e) => {
    e.preventDefault();
    
    const startDate = new Date(recurringData.startDate);
    const endDate = new Date(recurringData.endDate);
    const dayOfMonth = parseInt(recurringData.dayOfMonth);
    
    const paymentsToCreate = [];
    
    // Começar do mês/ano da data inicial
    let currentYear = startDate.getFullYear();
    let currentMonth = startDate.getMonth();
    
    // Criar uma data para o primeiro pagamento
    let currentDate = new Date(currentYear, currentMonth, dayOfMonth);
    
    // Se o dia já passou no mês inicial, começar no próximo mês
    if (currentDate < startDate) {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      currentDate = new Date(currentYear, currentMonth, dayOfMonth);
    }
    
    // Gerar pagamentos até a data final
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    while (currentDate <= endDate) {
      // Verificar se a data já passou para marcar como atrasado
      const paymentDate = new Date(currentDate);
      paymentDate.setHours(0, 0, 0, 0);
      const status = paymentDate < today ? 'overdue' : 'pending';
      
      // Obter mês e ano da data atual
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      paymentsToCreate.push({
        student: recurringData.studentId, // Renomear studentId para student
        amount: recurringData.amount,
        dueDate: currentDate.toISOString().split('T')[0],
        month: monthNames[currentMonth],
        year: currentYear,
        status: status,
        paymentMethod: recurringData.method,
        notes: (recurringData.notes ? recurringData.notes + ' ' : '') + '(Recorrente)',
      });
      
      // Avançar para o próximo mês
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      currentDate = new Date(currentYear, currentMonth, dayOfMonth);
    }
    
    // Adicionar todos os pagamentos
    console.log('Criando pagamentos:', paymentsToCreate);
    
    if (paymentsToCreate.length === 0) {
      alert('⚠️ Nenhum pagamento foi gerado. Verifique as datas.');
      return;
    }
    
    try {
      // Adicionar todos os pagamentos sequencialmente
      const createdPayments = [];
      for (const payment of paymentsToCreate) {
        const created = await addPayment(payment);
        createdPayments.push(created);
        console.log(`✅ Pagamento ${createdPayments.length}/${paymentsToCreate.length} criado`);
      }
      alert(`✅ ${createdPayments.length} pagamentos recorrentes criados com sucesso!`);
      setIsRecurringModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar pagamentos recorrentes:', error);
      alert('Erro ao criar pagamentos recorrentes: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleOpenRecurringModal = () => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    setRecurringData({
      studentId: '',
      amount: '',
      startDate: today.toISOString().split('T')[0],
      endDate: nextYear.toISOString().split('T')[0],
      frequency: 'monthly',
      dayOfMonth: '5',
      method: 'Dinheiro',
      notes: '',
    });
    setIsRecurringModalOpen(true);
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      console.log('🔄 Alterando status do pagamento:', paymentId, 'para:', newStatus);
      
      if (!paymentId || paymentId === 'undefined') {
        throw new Error('ID do pagamento inválido');
      }
      
      // Se está marcando como pago, adicionar a data de recebimento
      const updateData = { status: newStatus };
      if (newStatus === 'paid') {
        updateData.paymentDate = new Date().toISOString();
        console.log('💰 Adicionando data de recebimento:', updateData.paymentDate);
      }
      
      await updatePayment(paymentId, updateData);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pagamento: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      return;
    }

    try {
      console.log('🗑️ Excluindo pagamento:', paymentId);
      
      if (!paymentId || paymentId === 'undefined') {
        throw new Error('ID do pagamento inválido');
      }
      
      await deletePayment(paymentId);
      console.log('✅ Pagamento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      alert('Erro ao excluir pagamento: ' + (error.message || 'Erro desconhecido'));
    }
  };

  // Calcular estatísticas
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">Controle de mensalidades e pagamentos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleOpenModal}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={20} />
            Novo Pagamento
          </button>
          <button
            onClick={handleOpenRecurringModal}
            className="btn-secondary flex items-center gap-2 justify-center"
          >
            <Repeat size={20} />
            Lançamentos Recorrentes
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recebido</p>
              <p className="text-xl font-bold text-gray-900">R$ {totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendente</p>
              <p className="text-xl font-bold text-gray-900">R$ {totalPending.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Atrasado</p>
              <p className="text-xl font-bold text-gray-900">R$ {totalOverdue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="overdue">Atrasado</option>
          </select>
        </div>
      </Card>

      {/* Payments List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aluno</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vencimento</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Recebimento</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Método</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Nenhum pagamento encontrado' 
                      : 'Nenhum pagamento cadastrado ainda'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const student = students.find(s => (s._id || s.id) === (payment.student?._id || payment.student || payment.studentId));
                  const statusConfig = {
                    paid: { label: 'Pago', color: 'bg-green-100 text-green-700' },
                    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
                    overdue: { label: 'Atrasado', color: 'bg-red-100 text-red-700' },
                  };
                  const status = statusConfig[payment.status];

                  return (
                    <tr key={payment._id || payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{student?.name || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">R$ {parseFloat(payment.amount).toFixed(2)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600">{format(new Date(payment.dueDate), 'dd/MM/yyyy')}</p>
                      </td>
                      <td className="py-3 px-4">
                        {payment.paymentDate ? (
                          <p className="text-green-600 font-medium">{format(new Date(payment.paymentDate), 'dd/MM/yyyy')}</p>
                        ) : (
                          <p className="text-gray-400 text-sm">-</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600">{payment.paymentMethod || payment.method || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => handleOpenModal(payment)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Editar
                          </button>
                          {payment.status !== 'paid' && (
                            <button
                              onClick={() => handleStatusChange(payment._id || payment.id, 'paid')}
                              className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              Marcar Pago
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(payment._id || payment.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Excluir pagamento"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                placeholder="150.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="input-field"
              >
                <option value="Dinheiro">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Transferência">Transferência</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Atrasado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Cadastrar Pagamento
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Lançamentos Recorrentes */}
      <Modal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        title="Criar Lançamentos Recorrentes"
        size="lg"
      >
        <form onSubmit={handleRecurringSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Repeat className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-900">Lançamentos Recorrentes</p>
                <p className="text-xs text-blue-700 mt-1">
                  Crie múltiplos pagamentos automaticamente para um período. Ideal para mensalidades.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aluno *
            </label>
            <select
              value={recurringData.studentId}
              onChange={(e) => setRecurringData({ ...recurringData, studentId: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Mensal (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={recurringData.amount}
                onChange={(e) => setRecurringData({ ...recurringData, amount: e.target.value })}
                className="input-field"
                placeholder="150.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia do Vencimento *
              </label>
              <select
                value={recurringData.dayOfMonth}
                onChange={(e) => setRecurringData({ ...recurringData, dayOfMonth: e.target.value })}
                className="input-field"
                required
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Dia {day}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Escolha até o dia 28 para evitar problemas em fevereiro</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial *
              </label>
              <input
                type="date"
                value={recurringData.startDate}
                onChange={(e) => setRecurringData({ ...recurringData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final *
              </label>
              <input
                type="date"
                value={recurringData.endDate}
                onChange={(e) => setRecurringData({ ...recurringData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              value={recurringData.method}
              onChange={(e) => setRecurringData({ ...recurringData, method: e.target.value })}
              className="input-field"
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Transferência">Transferência</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={recurringData.notes}
              onChange={(e) => setRecurringData({ ...recurringData, notes: e.target.value })}
              className="input-field"
              rows="2"
              placeholder="Ex: Mensalidade 2024"
            />
          </div>

          {recurringData.startDate && recurringData.endDate && recurringData.dayOfMonth && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Preview:</strong> Serão criados aproximadamente{' '}
                <strong>
                  {Math.ceil(
                    (new Date(recurringData.endDate) - new Date(recurringData.startDate)) / 
                    (1000 * 60 * 60 * 24 * 30)
                  )}
                </strong>{' '}
                pagamentos mensais, todo dia <strong>{recurringData.dayOfMonth}</strong> de cada mês.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsRecurringModalOpen(false)} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Criar Lançamentos
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
