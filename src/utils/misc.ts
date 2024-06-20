import { v4 as uuidv4 } from 'uuid';

export function generatePaymentReference(courseId: string, userId: string, amount: number) {
  const uuid = uuidv4();
  return `${courseId}_${userId}_${amount}_${uuid}`;
}

export const convertAmountToPesewas = (amount: number) => amount * 100;
export const convertAmountToCedis = (amount: number) => amount / 100;
