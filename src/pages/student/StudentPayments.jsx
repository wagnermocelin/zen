import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/Card';
import { DollarSign, Check, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

const StudentPayments = () => {
  const { user } = useAuth();
  const { payments } = useData();

  const myPayments = payments.filter(p => p.studentId === user.id).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPending = myPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Meus Pagamentos</h1>
        <p className="text-gray-600 mt-1">Acompanhe suas mensalidades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pago</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pendente</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalPending.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Histórico de Pagamentos">
        {myPayments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nenhum pagamento registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPayments.map((payment) => {
              const statusConfig = {
                paid: { label: 'Pago', color: 'bg-green-100 text-green-700', icon: Check },
                pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
                overdue: { label: 'Atrasado', color: 'bg-red-100 text-red-700', icon: X },
              };
              const status = statusConfig[payment.status];
              const StatusIcon = status.icon;

              return (
                <div key={payment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                        <StatusIcon size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Mensalidade - {format(new Date(payment.dueDate), 'MMMM/yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vencimento: {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">R$ {parseFloat(payment.amount).toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  {payment.method && payment.status === 'paid' && (
                    <p className="text-sm text-gray-500 mt-2">Método: {payment.method}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentPayments;
