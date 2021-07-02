import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PaymentService } from 'app/entities/payment/service/payment.service';
import {
  paymentListRequested,
  paymentListRequestedSuccessfully,
  paymentListRequestedWithError,
} from 'app/core/state/actions/payment.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PaymentEffects {
  requestListEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paymentListRequested),
      switchMap(
        // todo design an object for the request parameters
        () =>
          this.paymentService.query().pipe(
            map(payments => paymentListRequestedSuccessfully({ payments })),
            catchError(error => of(paymentListRequestedWithError({ error })))
          )
      )
    )
  );

  constructor(private actions$: Actions, private paymentService: PaymentService) {}
}
