import { IPayment } from 'app/entities/payment/payment.model';
import { createDefaultLoadable, Loadable, onLoadableError, onLoadableLoad, onLoadableSuccess } from 'loadable-state';
import { Action, createReducer, on } from '@ngrx/store';
import {
  paymentDeletionCompleted,
  paymentDeletionCompletedSuccessfully,
  paymentDeletionCompletedWithError,
  paymentDeletionRequested,
  paymentListRequested,
  paymentListRequestedSuccessfully,
  paymentListRequestedWithError,
  paymentListSyncRequested,
  paymentListSyncRequestedSuccessfully,
} from 'app/core/state/actions/payment.actions';
import { HttpResponse } from '@angular/common/http';

export const paymentFeatureSelectorKey = 'payments';

export interface State extends Loadable {
  paymentResponse: HttpResponse<IPayment[]> | null;
  payments: IPayment[];
}

export const initialState: State = {
  ...createDefaultLoadable(),
  paymentResponse: null,
  payments: [],
};

const _baseReducer = createReducer(
  initialState,
  on(paymentListRequested, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentListRequestedSuccessfully, (state, { paymentResponse }) => ({
    ...onLoadableSuccess(state),
    paymentResponse,
  })),

  on(paymentListRequestedWithError, (state, { error }) => ({
    ...onLoadableError(state, error),
  })),

  on(paymentDeletionRequested, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentListSyncRequested, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentListSyncRequestedSuccessfully, (state, { payments }) => ({
    ...onLoadableSuccess(state),
    payments,
  })),

  on(paymentListRequestedWithError, (state, { error }) => ({
    ...onLoadableError(state, error),
  })),

  on(paymentDeletionCompleted, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentDeletionCompletedSuccessfully, (state, { payments }) => ({
    ...onLoadableSuccess(state),
    payments,
  })),

  on(paymentDeletionCompletedWithError, (state, { error }) => ({
    ...onLoadableError(state, { error }),
  })),

  on(paymentListSyncRequested, state => ({
    ...onLoadableLoad(state),
  })),

  on(paymentListSyncRequestedSuccessfully, (state, { payments }) => ({
    ...onLoadableSuccess(state),
    payments: [...payments],
  })),

  on(paymentListRequestedWithError, (state, { error }) => ({
    ...onLoadableError(state, { error }),
  }))
);

export function paymentsReducer(state: State, action: Action): State {
  return _baseReducer(state, action);
}
