import { createFeatureSelector, createSelector } from '@ngrx/store';
import { paymentFatureSelectorKey, State } from 'app/core/state/reducers/payment.reducer';

export const paymentFeatureSelector = createFeatureSelector<State>(paymentFatureSelectorKey);

export const selectPayments = createSelector(paymentFeatureSelector, (state: State) => state.payments);
