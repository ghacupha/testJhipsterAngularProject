import { Injectable } from '@angular/core';
import { State } from 'app/core/state/reducers/payment.reducer';
import { select, Store } from '@ngrx/store';
import { IPayment } from 'app/entities/payment/payment.model';
import { selectPaymentsResponse } from 'app/core/state/selectors/payment.selectors';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentUpdateService {
  constructor(private store: Store<State>) {}

  remove(id: number): Observable<IPayment[]> {
    let paymentsList: IPayment[] | null | undefined = [];
    this.store.pipe(select(selectPaymentsResponse)).subscribe(res => {
      paymentsList = [...this.removePayment(res?.body, id)];
    });

    return of(paymentsList);
  }

  updateList(): Observable<IPayment[]> {
    const response: IPayment[] = [];
    this.store.pipe(select(selectPaymentsResponse)).subscribe(res => {
      if (res?.body !== null) {
        if (res?.body !== undefined) {
          response.push(...res.body);
        }
      }
    });

    return of(response);
  }

  /**
   * Remove payment of the deletedId from the array
   *
   * @param payments
   * @param deletedId
   */
  private removePayment(payments: IPayment[] | null | undefined, deletedId: number): IPayment[] {
    const updatedPayments: IPayment[] = [];
    if (payments !== null) {
      if (payments !== undefined) {
        payments.forEach((item, index) => {
          if (item.id !== deletedId) {
            updatedPayments.push(item);
          }
        });
      }
    }
    return updatedPayments;
  }
}
