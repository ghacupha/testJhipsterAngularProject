import { IPayment } from 'app/entities/payment/payment.model';
import { createDefaultLoadable, Loadable, onLoadableError, onLoadableLoad, onLoadableSuccess } from 'loadable-state';
import { Action, createReducer, on } from '@ngrx/store';
import {
  paymentListRequested,
  paymentListRequestedSuccessfully,
  paymentListRequestedWithError,
} from 'app/core/state/actions/payment.actions';
import { HttpResponse } from '@angular/common/http';

export const paymentFeatureSelectorKey = 'payments';

export interface State extends Loadable {
  payments: HttpResponse<IPayment[]> | null;
}

export const initialState: State = {
  ...createDefaultLoadable(),
  payments: null,
};

const _baseReducer = createReducer(
  initialState,
  on(paymentListRequested, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentListRequestedSuccessfully, (state, { payments }) => ({
    ...onLoadableSuccess(state),
    payments,
  })),

  on(paymentListRequestedWithError, (state, { error }) => ({
    ...onLoadableError(state, error),
  }))
);

export function paymentsReducer(state: State, action: Action): State {
  return _baseReducer(state, action);
}
