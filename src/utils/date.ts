import { format, isValid, parse } from 'date-fns';

const USER_DATE_FORMAT = 'yyyy-MM-dd HH:mm';

export const formatTaskDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return isValid(date) ? format(date, 'dd MMM yyyy, HH:mm') : 'Invalid date';
};

export const parseUserDateInput = (value: string): Date | null => {
  const parsedDate = parse(value, USER_DATE_FORMAT, new Date());
  if (!isValid(parsedDate)) {
    return null;
  }
  return parsedDate;
};

export const getDateInputMask = (): string => USER_DATE_FORMAT;
