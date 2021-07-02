import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PaymentService } from 'app/entities/payment/service/payment.service';
import {
  paymentDeletionCompleted,
  paymentDeletionCompletedSuccessfully,
  paymentDeletionCompletedWithError,
  paymentDeletionRequested,
  paymentDeletionRequestedSuccessfully,
  paymentDeletionRequestedWithError,
  paymentListRequested,
  paymentListRequestedSuccessfully,
  paymentListRequestedWithError,
  paymentListSyncRequested,
  paymentListSyncRequestedSuccessfully,
  paymentListSyncRequestedWithError,
} from 'app/core/state/actions/payment.actions';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentUpdateService } from 'app/core/state/payment-update.service';

@Injectable()
export class PaymentEffects {
  requestListEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentListRequested),
      switchMap(action =>
        this.paymentService.query(action.serviceRequest).pipe(
          map(paymentResponse => paymentListRequestedSuccessfully({ paymentResponse })),
          catchError(error => of(paymentListRequestedWithError({ error })))
        )
      )
    )
  );

  deletionRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentDeletionRequested),
      switchMap(action =>
        this.paymentService.delete(action.id).pipe(
          /* @typescript-eslint/no-unsafe-return */
          map(() => paymentDeletionRequestedSuccessfully()),
          catchError(error => of(paymentDeletionRequestedWithError({ error })))
        )
      )
    )
  );

  deletionCompletedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentDeletionCompleted),
      switchMap(
        /* @typescript-eslint/no-unsafe-return */
        action =>
          this.updateService.remove(action.id).pipe(
            map(payments => paymentDeletionCompletedSuccessfully({ payments })),
            catchError(error => of(paymentDeletionCompletedWithError({ error })))
          )
      )
    )
  );

  syncPaymentListEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentListSyncRequested),
      exhaustMap(() =>
        this.updateService.updateList().pipe(
          map(payments => paymentListSyncRequestedSuccessfully({ payments })),
          catchError(error => of(paymentListSyncRequestedWithError({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private paymentService: PaymentService, private updateService: PaymentUpdateService) {}
}
