import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayment } from '../payment.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { PaymentDeleteDialogComponent } from '../delete/payment-delete-dialog.component';
import { select, Store } from '@ngrx/store';
import { State } from 'app/core/state/reducers/payment.reducer';
import { paymentListRequested, paymentListSyncRequested } from 'app/core/state/actions/payment.actions';
import { selectPayments, selectPaymentsResponse } from 'app/core/state/selectors/payment.selectors';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  payments?: IPayment[] | null | undefined;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private store: Store<State>
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.store.dispatch(
      paymentListRequested({
        serviceRequest: { page: pageToLoad - 1, size: this.itemsPerPage, sort: this.sort() },
      })
    );

    this.store.pipe(select(selectPaymentsResponse)).subscribe(res => {
      if (res !== null) {
        // to sync response with payments list
        this.store.dispatch(paymentListSyncRequested());

        // now we can select the synchronized payments
        this.store.pipe(select(selectPayments)).subscribe(payments => {
          // I know I know don't judge
          this.onSuccess(payments, res.headers, pageToLoad, !dontNavigate);
        });
      }
    });

    this.isLoading = false;
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IPayment): number {
    return item.id!;
  }

  delete(payment: IPayment): void {
    const modalRef = this.modalService.open(PaymentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.payment = payment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IPayment[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/payment'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.payments = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
