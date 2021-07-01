import * as dayjs from 'dayjs';

export interface IPayment {
  id?: number;
  paymentNumber?: string;
  paymentDate?: dayjs.Dayjs | null;
  dealerName?: string | null;
  paymentAmount?: number | null;
  paymentCategory?: string | null;
}

export class Payment implements IPayment {
  constructor(
    public id?: number,
    public paymentNumber?: string,
    public paymentDate?: dayjs.Dayjs | null,
    public dealerName?: string | null,
    public paymentAmount?: number | null,
    public paymentCategory?: string | null
  ) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
