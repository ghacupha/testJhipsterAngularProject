import { createAction, props } from '@ngrx/store';
import { IPayment } from 'app/entities/payment/payment.model';
import { HttpResponse } from '@angular/common/http';

export enum PaymentActionType {
  paymentsListRequested = '[Payments Page] payment list requested',
  paymentsListRequestedSuccessfully = '[Payments Page] payment list request successful',
  paymentsListRequestedWithError = '[Payments Page] payment list request failed',
}

export const paymentListRequested = createAction(PaymentActionType.paymentsListRequested);

export const paymentListRequestedSuccessfully = createAction(
  PaymentActionType.paymentsListRequestedSuccessfully,
  props<{ payments: HttpResponse<IPayment[]> }>()
);

export const paymentListRequestedWithError = createAction(
  PaymentActionType.paymentsListRequestedWithError,
  props<{ error: string | any }>()
);