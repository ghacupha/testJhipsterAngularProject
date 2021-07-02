import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayment } from '../payment.model';
import { Store } from '@ngrx/store';
import { State } from 'app/core/state/reducers/payment.reducer';
import { paymentDeletionRequested } from 'app/core/state/actions/payment.actions';

@Component({
  templateUrl: './payment-delete-dialog.component.html',
})
export class PaymentDeleteDialogComponent {
  payment?: IPayment;

  constructor(private store: Store<State>, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.store.dispatch(paymentDeletionRequested({ id }));

    this.activeModal.close('deleted');
  }
}
