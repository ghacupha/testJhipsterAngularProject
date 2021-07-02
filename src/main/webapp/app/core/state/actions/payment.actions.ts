import { createAction, props } from '@ngrx/store';
import { IPayment } from 'app/entities/payment/payment.model';
import { HttpResponse } from '@angular/common/http';
import { ServiceRequest } from 'app/core/state/service-request.model';

export enum PaymentActionType {
  paymentsListRequested = '[Payments Page] payment list requested',
  paymentsListRequestedSuccessfully = '[Payments Page] payment list request successful',
  paymentsListRequestedWithError = '[Payments Page] payment list request failed',

  paymentDeletionRequested = '[Payments Deletion Modal] payment deletion requested',
  paymentDeletionRequestedSuccessfully = '[Payments Deletion Modal] payment deletion requested successfully',
  paymentDeletionRequestedWithError = '[Payments Deletion Modal] payment deletion requested with error',

  paymentDeletionCompleted = '[Payments Service] payment deletion completed',
  paymentDeletionCompletedSuccessfully = '[Payments Service] payment deletion completed successfully',
  paymentDeletionCompletedWithError = '[Payments Service] payment deletion completed with error',

  paymentListSyncRequested = '[System] payment list update requested',
  paymentListSyncRequestedSuccessfully = '[System] payment list update requested successfully',
  paymentListSyncRequestedWithError = '[System] payment list update requested with error',
}

/**
 * This will triggers effects to call the service to call the backend API to respond with a list of
 * payments in the HttpResponse.
 * But one must carefully note that the HttpResponse itself is not used to populate the payments
 * page. This is because the the payments list virtually updated to "match" the backend and never
 * directly. Should one require to ensure that the data is synced, one has to call the refresh
 * function all on the page or the paymentListSyncRequested action. This will in turn
 * sysnch the response with the virtue several list.
 */
export const paymentListRequested = createAction(PaymentActionType.paymentsListRequested, props<{ serviceRequest: ServiceRequest }>());

export const paymentListRequestedSuccessfully = createAction(
  PaymentActionType.paymentsListRequestedSuccessfully,
  props<{ paymentResponse: HttpResponse<IPayment[]> }>()
);

export const paymentListRequestedWithError = createAction(
  PaymentActionType.paymentsListRequestedWithError,
  props<{ error: string | any }>()
);

/**
 * This object carries the id of the entity to be deleted and is the first
 * act in the deletion sequence. If successful the id of the item to delete
 * will also be dispatched with the subsequent act inorder to remove the deleted
 * item from the store
 */
export const paymentDeletionRequested = createAction(PaymentActionType.paymentDeletionRequested, props<{ id: number }>());

/**
 * This action carried the id of the successfully deleted item (at least as far
 * as the backend is concerned). The particular deleted id will then subsequently
 * be remove from the store
 */
export const paymentDeletionRequestedSuccessfully = createAction(PaymentActionType.paymentDeletionRequestedSuccessfully);

export const paymentDeletionRequestedWithError = createAction(
  PaymentActionType.paymentDeletionRequestedWithError,
  props<{ error: string }>()
);

/**
 * Dispatched by the service after successful completion of the deletion
 * process in the backend API.
 * An entity of this id needs now to be removed from the store
 */
export const paymentDeletionCompleted = createAction(PaymentActionType.paymentDeletionCompleted, props<{ id: number }>());

/**
 * Dispatched to the reducer containing a new list of entities from which we
 * have already removed the deleted entity
 */
export const paymentDeletionCompletedSuccessfully = createAction(
  PaymentActionType.paymentDeletionCompletedSuccessfully,
  props<{ payments: IPayment[] }>()
);

export const paymentDeletionCompletedWithError = createAction(
  PaymentActionType.paymentDeletionCompletedWithError,
  props<{ error: string }>()
);

/**
 * Dispatched when we need to sync data between the payments list and the
 * http-response which contains the data from the API backend. This is because
 * the list we see on the payments list is not from the http response but from the
 * store and has to be synced manually.
 * This manual process later helps us not to have to call for data from the backend
 * after deleting or updating something. We simply mirror the delete transaction
 * by removing the deleted item from the list and subscribe to the new-list.
 * Should the page refresh it will first call the payment-list-requested action
 * and then call this action to sync the data with our list.
 * Every time we need a fresh list we need to be calling the payment-list-requested
 * action and then call this action to sync the virtual payments data.
 */
export const paymentListSyncRequested = createAction(PaymentActionType.paymentListSyncRequested);

/**
 * Dispatched by the sync service after data has been synced between the http-reposnse
 * and the payments list
 */
export const paymentListSyncRequestedSuccessfully = createAction(
  PaymentActionType.paymentListSyncRequestedSuccessfully,
  props<{ payments: IPayment[] }>()
);

export const paymentListSyncRequestedWithError = createAction(
  PaymentActionType.paymentListSyncRequestedWithError,
  props<{ error: string }>()
);
