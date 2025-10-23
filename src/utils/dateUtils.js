import { format as dateFnsFormat } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const format = (date, formatStr) => {
  try {
    return dateFnsFormat(date, formatStr, { locale: ptBR });
  } catch (error) {
    return dateFnsFormat(date, formatStr);
  }
};

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};
