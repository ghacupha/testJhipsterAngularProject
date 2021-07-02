import { createFeatureSelector, createSelector } from '@ngrx/store';
import { paymentFeatureSelectorKey, State } from 'app/core/state/reducers/payment.reducer';

export const paymentFeatureSelector = createFeatureSelector<State>(paymentFeatureSelectorKey);

export const selectPayments = createSelector(paymentFeatureSelector, (state: State) => state.payments);
